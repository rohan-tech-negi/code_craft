import { CodeEditorState } from "./../types/index";
import { LANGUAGE_CONFIG } from "../app/(root)/_constants/index";
import { create } from "zustand";
import { Monaco } from "@monaco-editor/react";

const getInitialState = () => {
  // if we're on the server, return default values
  if (typeof window === "undefined") {
    return {
      language: "javascript",
      fontSize: 16,
      theme: "vs-dark",
    };
  }

  // if we're on the client, return values from local storage bc localStorage is a browser API.
  const savedLanguage = localStorage.getItem("editor-language") || "javascript";
  const savedTheme = localStorage.getItem("editor-theme") || "vs-dark";
  const savedFontSize = localStorage.getItem("editor-font-size") || 16;

  return {
    language: savedLanguage,
    theme: savedTheme,
    fontSize: Number(savedFontSize),
  };
};

export const useCodeEditorStore = create<CodeEditorState>((set, get) => {
  const initialState = getInitialState();

  return {
    ...initialState,
    output: "",
    isRunning: false,
    error: null,
    editor: null,
    executionResult: null,

    getCode: () => get().editor?.getValue() || "",

    setEditor: (editor: Monaco) => {
      const savedCode = localStorage.getItem(`editor-code-${get().language}`);
      if (savedCode) editor.setValue(savedCode);

      set({ editor });
    },

    setTheme: (theme: string) => {
      localStorage.setItem("editor-theme", theme);
      set({ theme });
    },

    setFontSize: (fontSize: number) => {
      localStorage.setItem("editor-font-size", fontSize.toString());
      set({ fontSize });
    },

    setLanguage: (language: string) => {
      // Save current language code before switching
      const currentCode = get().editor?.getValue();
      if (currentCode) {
        localStorage.setItem(`editor-code-${get().language}`, currentCode);
      }

      localStorage.setItem("editor-language", language);

      set({
        language,
        output: "",
        error: null,
      });
    },

    runCode: async () => {
      const { language, getCode } = get();
      const code = getCode();

      if (!code) {
        set({ error: "Please enter some code" });
        return;
      }

      set({ isRunning: true, error: null, output: "" });

      try {
        const judge0Id = LANGUAGE_CONFIG[language].judge0Id;
        const apiKey = process.env.NEXT_PUBLIC_JUDGE0_API_KEY || "";

        // Step 1: Submit the code
        const submitRes = await fetch(
          "https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=false&wait=false&fields=*",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
              "x-rapidapi-key": apiKey,
            },
            body: JSON.stringify({
              language_id: judge0Id,
              source_code: code,
            }),
          }
        );

        const { token } = await submitRes.json();
        if (!token) {
          set({ error: "Failed to submit code. Check your Judge0 API key." });
          return;
        }

        // Step 2: Poll until execution is complete
        let data: Record<string, unknown> = {};
        for (let i = 0; i < 20; i++) {
          await new Promise((r) => setTimeout(r, 1000));
          const pollRes = await fetch(
            `https://judge0-ce.p.rapidapi.com/submissions/${token}?base64_encoded=false&fields=*`,
            {
              headers: {
                "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
                "x-rapidapi-key": apiKey,
              },
            }
          );
          data = await pollRes.json();
          // status id 1 = In Queue, 2 = Processing
          const statusId = (data.status as { id: number } | undefined)?.id ?? 0;
          if (statusId !== 1 && statusId !== 2) break;
        }

        console.log("data back from judge0:", data);

        // handle API-level errors (e.g. rate limit, bad key)
        if (data.message) {
          const errMsg = data.message as string;
          set({ error: errMsg, executionResult: { code, output: "", error: errMsg } });
          return;
        }

        // handle compilation errors
        const compileError = data.compile_output as string | null;
        if (compileError) {
          set({
            error: compileError,
            executionResult: { code, output: "", error: compileError },
          });
          return;
        }

        // handle runtime errors
        const stderr = data.stderr as string | null;
        if (stderr) {
          set({
            error: stderr,
            executionResult: { code, output: "", error: stderr },
          });
          return;
        }

        // successful execution
        const output = (data.stdout as string) || "";
        set({
          output: output.trim(),
          error: null,
          executionResult: { code, output: output.trim(), error: null },
        });
      } catch (error) {
        console.log("Error running code:", error);
        set({
          error: "Error running code",
          executionResult: { code, output: "", error: "Error running code" },
        });
      } finally {
        set({ isRunning: false });
      }
    },
  };
});
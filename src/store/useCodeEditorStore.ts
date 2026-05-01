import { CodeEditorState } from "./../types/index";
import { LANGUAGE_CONFIG, GLOT_LANGUAGE_MAP } from "../app/(root)/_constants/index";
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
        const glotLang = GLOT_LANGUAGE_MAP[language];
        const apiToken = process.env.NEXT_PUBLIC_GLOT_API_TOKEN || "";

        // Glot.io run API — single request, synchronous response
        const response = await fetch(
          `https://run.glot.io/languages/${glotLang.language}/versions/${glotLang.version}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Token ${apiToken}`,
            },
            body: JSON.stringify({
              files: [{ name: glotLang.filename, content: code }],
            }),
          }
        );

        const data = await response.json();
        console.log("data back from glot.io:", data);

        // handle API-level errors (e.g. bad token)
        if (!response.ok) {
          const errMsg = data?.message || `API error: ${response.status}`;
          set({ error: errMsg, executionResult: { code, output: "", error: errMsg } });
          return;
        }

        // handle compilation / runtime errors
        const stderr = (data.stderr as string) || "";
        const runtimeError = (data.error as string) || "";
        if (stderr || runtimeError) {
          const errMsg = stderr || runtimeError;
          set({
            error: errMsg,
            executionResult: { code, output: "", error: errMsg },
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
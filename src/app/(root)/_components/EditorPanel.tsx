'use client'

import useMounted from '@/src/hooks/useMounted';
import { useCodeEditorStore } from '@/src/store/useCodeEditorStore';
import { useClerk } from '@clerk/nextjs';
import React, { useEffect, useState } from 'react'
import { LANGUAGE_CONFIG } from '../_constants';

const EditorPanel = () => {
    const clerk = useClerk();
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const { language, theme, fontSize, editor, setFontSize, setEditor } = useCodeEditorStore();

    const mounted = useMounted();

     useEffect(() => {
    const savedCode = localStorage.getItem(`editor-code-${language}`);
    const newCode = savedCode || LANGUAGE_CONFIG[language].defaultCode;
    if (editor) editor.setValue(newCode);
  }, [language, editor]);

   useEffect(() => {
    const savedFontSize = localStorage.getItem("editor-font-size");
    if (savedFontSize) setFontSize(parseInt(savedFontSize));
  }, [setFontSize]);

    const handleRefresh = () => {
    const defaultCode = LANGUAGE_CONFIG[language].defaultCode;
    if (editor) editor.setValue(defaultCode);
    localStorage.removeItem(`editor-code-${language}`);
  };
  return (
    <div>EditorPanel</div>
  )
}

export default EditorPanel
'use client'
import { useCodeEditorStore } from '@/src/store/useCodeEditorStore';
import React, { useState } from 'react'

const OutputPanel = () => {
    const { output, error, isRunning } = useCodeEditorStore();
  const [isCopied, setIsCopied] = useState(false);

  
  const hasContent = error || output;

  
  const handleCopy = async () => {
    if (!hasContent) return;
    await navigator.clipboard.writeText(error || output);
    setIsCopied(true);

    setTimeout(() => setIsCopied(false), 2000);
  };
  return (
    <div>OutputPanel</div>
  )
}

export default OutputPanel
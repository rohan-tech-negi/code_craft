'use client'
import { useCodeEditorStore } from '@/src/store/useCodeEditorStore';
import React, { useState } from 'react'

const OutputPanel = () => {
    const { output, error, isRunning } = useCodeEditorStore();
  const [isCopied, setIsCopied] = useState(false);
  return (
    <div>OutputPanel</div>
  )
}

export default OutputPanel
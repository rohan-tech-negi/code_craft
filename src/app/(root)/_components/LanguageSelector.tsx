'use client'
import { useCodeEditorStore } from '@/src/store/useCodeEditorStore';
import React, { useEffect, useRef, useState } from 'react'
import { LANGUAGE_CONFIG } from '../_constants';

const LanguageSelector = ({ hasAccess }: { hasAccess: boolean }) => {
    const [isOpen, setIsOpen] = useState(false);
  // const mounted = useMounted();

  const { language, setLanguage } = useCodeEditorStore();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const currentLanguageObj = LANGUAGE_CONFIG[language];

   useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);


    const handleLanguageSelect = (langId: string) => {
    if (!hasAccess && langId !== "javascript") return;

    setLanguage(langId);
    setIsOpen(false);
  };
  return (
    <div>

    </div>
  )
}

export default LanguageSelector
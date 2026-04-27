import React, { useEffect, useRef, useState } from 'react'
import { THEMES } from '../_constants';
import { useCodeEditorStore } from '@/src/store/useCodeEditorStore';

const ThemeSelector = () => {
  const [isOpen, setIsOpen] = useState(false);
  // const mounted = useMounted();
  const { theme, setTheme } = useCodeEditorStore();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const currentTheme = THEMES.find((t) => t.id === theme);

    useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);


  return (
    <div>ThemeSelector</div>
  )
}

export default ThemeSelector
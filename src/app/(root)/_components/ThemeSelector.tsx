import React from 'react'

const ThemeSelector = () => {
  const [isOpen, setIsOpen] = useState(false);
  const mounted = useMounted();
  const { theme, setTheme } = useCodeEditorStore();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const currentTheme = THEMES.find((t) => t.id === theme);
  return (
    <div>ThemeSelector</div>
  )
}

export default ThemeSelector
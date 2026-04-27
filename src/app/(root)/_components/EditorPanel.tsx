import React from 'react'

const EditorPanel = () => {
    const clerk = useClerk();
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const { language, theme, fontSize, editor, setFontSize, setEditor } = useCodeEditorStore();
  return (
    <div>EditorPanel</div>
  )
}

export default EditorPanel

import '../styles/Editor.css';

interface EditorProps {
  content: string;
  onChange: (content: string) => void;
  readonly?: boolean;
}

export function Editor({ content, onChange, readonly = false }: EditorProps) {
  return (
    <textarea
      className="editor-textarea"
      value={content}
      onChange={(e) => onChange(e.target.value)}
      readOnly={readonly}
      spellCheck="false"
      autoCapitalize="off"
      autoCorrect="off"
    />
  );
}

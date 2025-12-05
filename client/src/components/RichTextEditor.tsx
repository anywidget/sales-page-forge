import { useMemo, memo, useRef, useEffect } from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minimal?: boolean;
}

function RichTextEditorComponent({ value, onChange, placeholder, minimal = false }: RichTextEditorProps) {
  const isInitialMount = useRef(true);
  const lastValue = useRef(value);

  const handleChange = (newValue: string) => {
    lastValue.current = newValue;
    onChange(newValue);
  };

  useEffect(() => {
    isInitialMount.current = false;
  }, []);

  const modules = useMemo(() => ({
    toolbar: minimal 
      ? [
          ['bold', 'italic', 'underline'],
          [{ 'color': [] }],
          ['clean']
        ]
      : [
          [{ 'header': [1, 2, 3, false] }],
          ['bold', 'italic', 'underline', 'strike'],
          [{ 'color': [] }, { 'background': [] }],
          [{ 'list': 'ordered'}, { 'list': 'bullet' }],
          [{ 'align': [] }],
          ['link'],
          ['clean']
        ]
  }), [minimal]);

  const formats = minimal
    ? ['bold', 'italic', 'underline', 'color']
    : ['header', 'bold', 'italic', 'underline', 'strike', 'color', 'background', 'list', 'bullet', 'align', 'link'];

  return (
    <div className="rich-text-editor">
      <ReactQuill
        theme="snow"
        value={value || ''}
        onChange={handleChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
      />
      <style>{`
        .rich-text-editor .ql-container {
          min-height: 100px;
          font-size: 14px;
          border-bottom-left-radius: 6px;
          border-bottom-right-radius: 6px;
        }
        .rich-text-editor .ql-toolbar {
          border-top-left-radius: 6px;
          border-top-right-radius: 6px;
          background: hsl(var(--muted));
        }
        .rich-text-editor .ql-editor {
          min-height: 80px;
        }
        .rich-text-editor .ql-editor.ql-blank::before {
          font-style: normal;
          color: hsl(var(--muted-foreground));
        }
        .dark .rich-text-editor .ql-toolbar {
          background: hsl(var(--muted));
          border-color: hsl(var(--border));
        }
        .dark .rich-text-editor .ql-container {
          border-color: hsl(var(--border));
          background: hsl(var(--background));
        }
        .dark .rich-text-editor .ql-editor {
          color: hsl(var(--foreground));
        }
        .dark .rich-text-editor .ql-stroke {
          stroke: hsl(var(--foreground));
        }
        .dark .rich-text-editor .ql-fill {
          fill: hsl(var(--foreground));
        }
        .dark .rich-text-editor .ql-picker-label {
          color: hsl(var(--foreground));
        }
        .dark .rich-text-editor .ql-picker-options {
          background: hsl(var(--popover));
          border-color: hsl(var(--border));
        }
      `}</style>
    </div>
  );
}

export const RichTextEditor = memo(RichTextEditorComponent);

"use client";

import { useEffect, useRef } from "react";

type RichTextDescriptionEditorProps = {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  maxLength?: number;
};

const TOOLBAR_ACTIONS: Array<{ command: string; label: string }> = [
  { command: "bold", label: "Bold" },
  { command: "italic", label: "Italic" },
  { command: "insertUnorderedList", label: "List" },
  { command: "justifyLeft", label: "Left" },
  { command: "justifyCenter", label: "Center" },
  { command: "justifyRight", label: "Right" },
];

function stripHtml(input: string): string {
  return input.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
}

export default function RichTextDescriptionEditor({
  value,
  onChange,
  label = "Description",
  maxLength = 2000,
}: RichTextDescriptionEditorProps) {
  const editorRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const editor = editorRef.current;

    if (!editor) {
      return;
    }

    if (editor.innerHTML !== value) {
      editor.innerHTML = value || "";
    }
  }, [value]);

  const handleToolbarAction = (command: string) => {
    const editor = editorRef.current;

    if (!editor) {
      return;
    }

    editor.focus();
    document.execCommand(command, false);
    onChange(editor.innerHTML);
  };

  const handleInput = () => {
    const editor = editorRef.current;

    if (!editor) {
      return;
    }

    const html = editor.innerHTML;
    const textLength = stripHtml(html).length;

    if (textLength > maxLength) {
      const trimmedText = stripHtml(html).slice(0, maxLength);
      editor.innerText = trimmedText;
      onChange(editor.innerHTML);
      return;
    }

    onChange(html);
  };

  const textLength = stripHtml(value).length;

  return (
    <div>
      <label className="text-[11px] font-semibold text-slate-700">{label}</label>

      <div className="mt-2 rounded-md border border-slate-200 bg-white">
        <div className="flex flex-wrap gap-2 border-b border-slate-200 p-2">
          {TOOLBAR_ACTIONS.map((action) => (
            <button
              key={action.command}
              type="button"
              onClick={() => handleToolbarAction(action.command)}
              className="rounded-md border border-slate-200 px-2.5 py-1 text-[11px] font-semibold text-slate-600 hover:bg-slate-50"
            >
              {action.label}
            </button>
          ))}
        </div>

        <div
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          onInput={handleInput}
          className="min-h-44 w-full px-3 py-2 text-[12px] leading-relaxed outline-none"
        />
      </div>

      <p className="mt-2 text-[10px] text-slate-400">
        You can add spacing, alignment, and simple formatting. {textLength} / {maxLength} characters
      </p>
    </div>
  );
}

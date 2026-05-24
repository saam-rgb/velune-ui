import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Placeholder from '@tiptap/extension-placeholder';
import { useRef, useEffect } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';

// ── Toolbar button ────────────────────────────────────────────────────────────
function ToolBtn({ onClick, active, title, children, disabled }) {
  return (
    <button
      type="button"
      onMouseDown={e => { e.preventDefault(); onClick(); }}
      disabled={disabled}
      title={title}
      style={{
        padding: '5px 8px',
        background: active ? 'var(--velune-accent)' : 'transparent',
        color: active ? '#0b0b0f' : 'var(--velune-text)',
        border: '1px solid',
        borderColor: active ? 'var(--velune-accent)' : 'var(--velune-border)',
        cursor: disabled ? 'not-allowed' : 'pointer',
        fontSize: 12,
        fontFamily: 'Inter, sans-serif',
        fontWeight: 500,
        lineHeight: 1,
        borderRadius: 2,
        opacity: disabled ? 0.4 : 1,
        transition: 'background 0.15s, color 0.15s',
      }}
    >
      {children}
    </button>
  );
}

function Divider() {
  return (
    <span style={{ width: 1, background: 'var(--velune-border)', alignSelf: 'stretch', margin: '0 2px' }} />
  );
}

// ── Main Editor ───────────────────────────────────────────────────────────────
export default function RichTextEditor({ value, onChange, placeholder = 'Write your article…' }) {
  const fileInputRef = useRef(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
      }),
      Underline,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          style: 'color: var(--velune-accent); text-decoration: underline;',
          rel: 'noopener noreferrer',
        },
      }),
      Image.configure({
        HTMLAttributes: {
          style: 'max-width: 100%; height: auto; margin: 16px 0; display: block;',
        },
      }),
      Placeholder.configure({ placeholder }),
    ],
    content: value || '',
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
  });

  // Sync external value into editor (e.g. when editing an existing article)
  useEffect(() => {
    if (!editor) return;
    const current = editor.getHTML();
    if (value !== undefined && value !== current) {
      editor.commands.setContent(value || '', false);
    }
  }, [editor, value]);

  if (!editor) return null;

  // ── Link insertion ──────────────────────────────────────────────────────────
  function insertLink() {
    const prev = editor.getAttributes('link').href || '';
    const url = window.prompt('Enter URL (paste affiliate link here):', prev);
    if (url === null) return;
    if (url === '') { editor.chain().focus().unsetLink().run(); return; }
    editor.chain().focus().setLink({ href: url, target: '_blank' }).run();
  }

  // ── Image upload ────────────────────────────────────────────────────────────
  async function handleImageFile(file) {
    if (!file) return;
    const toastId = toast.loading('Uploading image…');
    try {
      const fd = new FormData();
      fd.append('image', file);
      const { data } = await api.post('/upload/image', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      editor.chain().focus().setImage({ src: data.url, alt: file.name }).run();
      toast.success('Image inserted', { id: toastId });
    } catch {
      toast.error('Image upload failed', { id: toastId });
    }
  }

  function insertImageUrl() {
    const url = window.prompt('Enter image URL:');
    if (url) editor.chain().focus().setImage({ src: url }).run();
  }

  return (
    <div
      style={{
        border: '1px solid var(--velune-border)',
        background: 'var(--velune-card)',
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        minHeight: 0,
      }}
    >
      {/* ── Toolbar ── */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 4,
          padding: '8px 10px',
          borderBottom: '1px solid var(--velune-border)',
          background: 'var(--velune-surface)',
          alignItems: 'center',
        }}
      >
        {/* Headings */}
        <ToolBtn onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive('heading', { level: 2 })} title="Heading 2">H2</ToolBtn>
        <ToolBtn onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive('heading', { level: 3 })} title="Heading 3">H3</ToolBtn>

        <Divider />

        {/* Inline */}
        <ToolBtn onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive('bold')} title="Bold"><b>B</b></ToolBtn>
        <ToolBtn onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive('italic')} title="Italic"><i>I</i></ToolBtn>
        <ToolBtn onClick={() => editor.chain().focus().toggleUnderline().run()} active={editor.isActive('underline')} title="Underline"><u>U</u></ToolBtn>
        <ToolBtn onClick={() => editor.chain().focus().toggleStrike().run()} active={editor.isActive('strike')} title="Strikethrough"><s>S</s></ToolBtn>

        <Divider />

        {/* Lists */}
        <ToolBtn onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive('bulletList')} title="Bullet list">• List</ToolBtn>
        <ToolBtn onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive('orderedList')} title="Numbered list">1. List</ToolBtn>

        <Divider />

        {/* Quote / code */}
        <ToolBtn onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive('blockquote')} title="Blockquote">" "</ToolBtn>
        <ToolBtn onClick={() => editor.chain().focus().toggleCode().run()} active={editor.isActive('code')} title="Inline code">{`<>`}</ToolBtn>

        <Divider />

        {/* Alignment */}
        <ToolBtn onClick={() => editor.chain().focus().setTextAlign('left').run()} active={editor.isActive({ textAlign: 'left' })} title="Align left">⬅</ToolBtn>
        <ToolBtn onClick={() => editor.chain().focus().setTextAlign('center').run()} active={editor.isActive({ textAlign: 'center' })} title="Align center">⬛</ToolBtn>
        <ToolBtn onClick={() => editor.chain().focus().setTextAlign('right').run()} active={editor.isActive({ textAlign: 'right' })} title="Align right">➡</ToolBtn>

        <Divider />

        {/* Link */}
        <ToolBtn onClick={insertLink} active={editor.isActive('link')} title="Insert / edit link">🔗 Link</ToolBtn>

        <Divider />

        {/* Image */}
        <ToolBtn onClick={() => fileInputRef.current?.click()} title="Upload image from device">📷 Upload</ToolBtn>
        <ToolBtn onClick={insertImageUrl} title="Insert image by URL">🖼 URL</ToolBtn>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={e => { handleImageFile(e.target.files[0]); e.target.value = ''; }}
        />

        <Divider />

        {/* History */}
        <ToolBtn onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} title="Undo">↩</ToolBtn>
        <ToolBtn onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} title="Redo">↪</ToolBtn>
      </div>

      {/* ── Editor area ── */}
      <EditorContent
        editor={editor}
        style={{ flex: 1, overflow: 'auto', padding: '20px 24px' }}
      />

      {/* ── Editor styles injected inline ── */}
      <style>{`
        .ProseMirror {
          min-height: 320px;
          outline: none;
          font-family: Inter, sans-serif;
          font-size: 15px;
          line-height: 1.85;
          color: var(--velune-text);
        }
        .ProseMirror p { margin: 0 0 14px; }
        .ProseMirror h2 { font-family: 'Playfair Display', Georgia, serif; font-size: 26px; font-weight: 700; color: var(--velune-text); margin: 28px 0 12px; line-height: 1.2; }
        .ProseMirror h3 { font-family: 'Playfair Display', Georgia, serif; font-size: 20px; font-weight: 600; color: var(--velune-text); margin: 22px 0 10px; }
        .ProseMirror strong { font-weight: 700; }
        .ProseMirror em { font-style: italic; }
        .ProseMirror u  { text-decoration: underline; }
        .ProseMirror s  { text-decoration: line-through; }
        .ProseMirror a  { color: var(--velune-accent); text-decoration: underline; cursor: pointer; }
        .ProseMirror a:hover { color: var(--velune-accent-hover); }
        .ProseMirror ul { padding-left: 24px; margin: 0 0 14px; list-style: disc; }
        .ProseMirror ol { padding-left: 24px; margin: 0 0 14px; list-style: decimal; }
        .ProseMirror li { margin-bottom: 4px; }
        .ProseMirror blockquote {
          border-left: 2px solid var(--velune-accent);
          padding-left: 20px;
          margin: 20px 0;
          font-family: 'Playfair Display', Georgia, serif;
          font-size: 18px;
          font-style: italic;
          color: var(--velune-muted);
        }
        .ProseMirror code {
          background: var(--velune-surface);
          border: 1px solid var(--velune-border);
          padding: 1px 5px;
          font-size: 13px;
          border-radius: 2px;
          font-family: monospace;
        }
        .ProseMirror img {
          max-width: 100%;
          height: auto;
          margin: 16px 0;
          display: block;
          border: 1px solid var(--velune-border);
        }
        .ProseMirror img.ProseMirror-selectednode {
          outline: 2px solid var(--velune-accent);
        }
        .ProseMirror p.is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          color: var(--velune-muted);
          pointer-events: none;
          float: left;
          height: 0;
        }
        .ProseMirror hr { border: none; border-top: 1px solid var(--velune-border); margin: 24px 0; }
      `}</style>
    </div>
  );
}

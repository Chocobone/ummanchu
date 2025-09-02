'use client';
import React, { useEffect, useImperativeHandle, useRef } from 'react';

export type RichEditorHandle = {
  getHTML: () => string;
  setHTML: (html: string) => void;
  focus: () => void;
  clear: () => void;
};

type Props = {
  value?: string;
  defaultValue?: string;
  onChange?: (html: string) => void;
  readOnly?: boolean;
  minHeight?: number;
  placeholder?: string;
  uploadEndpoint?: string;
  uploadExtra?: Record<string, string>;
};

export const RichEditor = React.forwardRef<RichEditorHandle, Props>(function RichEditor(
  {
    value,
    defaultValue = '',
    onChange,
    readOnly = false,
    minHeight = 300,
    placeholder = 'Start writing...',
    uploadEndpoint = '/api/upload',
    uploadExtra,
  },
  ref
) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const quillRef = useRef<any>(null);
  const didInit = useRef(false);
  const latestValueRef = useRef<string>('');
  latestValueRef.current = typeof value === 'string' ? value : (defaultValue ?? '');

  useEffect(() => {
    if (didInit.current) return;
    didInit.current = true;

    (async () => {
      const Quill = (await import('quill')).default;
      //await import('quill/dist/quill.snow.css');

      const toolbar = [
        [{ header: [1, 2, 3, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ list: 'ordered' }, { list: 'bullet' }],
        ['link', 'image', 'video'],
        ['clean'],
      ] as any;

      if (!containerRef.current) return;
      containerRef.current.innerHTML = '';

      quillRef.current = new Quill(containerRef.current, {
        theme: 'snow',
        readOnly,
        placeholder,
        modules: {
          toolbar: readOnly ? false : { container: toolbar },
          clipboard: { matchVisual: false },
        },
      });

      // 이미지 업로드 핸들러 (그대로 유지)
      if (!readOnly) {
        const toolbarModule = quillRef.current.getModule('toolbar');
        toolbarModule?.addHandler('image', async () => {
          const input = document.createElement('input');
          input.type = 'file';
          input.accept = 'image/*';
          input.onchange = async () => {
            const file = input.files?.[0];
            if (!file) return;
            try {
              const fd = new FormData();
              fd.append('file', file);
              if (uploadExtra) Object.entries(uploadExtra).forEach(([k, v]) => fd.append(k, v));
              const res = await fetch(uploadEndpoint, { method: 'POST', body: fd });
              const data = await res.json();
              if (!res.ok) throw new Error(data?.error || 'Upload failed');
              const range = quillRef.current.getSelection(true);
              const index = range ? range.index : quillRef.current.getLength();
              quillRef.current.insertEmbed(index, 'image', data.url, 'user');
              quillRef.current.setSelection(index + 1, 0, 'silent');
            } catch (e) {
              console.error(e);
              alert('이미지 업로드에 실패했습니다.');
            }
          };
          input.click();
        });
      }

      // onChange: 사용자 입력만 반영
      quillRef.current.on('text-change', (_d: any, _o: any, source: 'user' | 'api') => {
        if (source === 'user' && onChange) {
          onChange(quillRef.current.root.innerHTML);
        }
      });

      // ✅ 생성 직후 최신 value 주입 — delta 변환 대신 "그대로" 붙여넣기
      const initial = latestValueRef.current || '';
      if (initial) {
        quillRef.current.clipboard.dangerouslyPasteHTML(0, initial, 'silent');
      }
    })();

    return () => {
      if (quillRef.current) {
        quillRef.current.off('text-change');
        quillRef.current = null;
      }
    };
  }, [readOnly, placeholder, uploadEndpoint, uploadExtra]);

  // ✅ value 변경 시에도 항상 반영 (빈값 비교만)
  useEffect(() => {
    if (!quillRef.current) return;
    const incoming = typeof value === 'string' ? value : '';
    const current = quillRef.current.root.innerHTML;

    const isEmpty = (s: string) =>
      !s || /^\s*(<p><br><\/p>|<p>\s*<\/p>)\s*$/i.test(s);

    if (isEmpty(current) && !isEmpty(incoming)) {
      quillRef.current.clipboard.dangerouslyPasteHTML(0, incoming, 'silent');
    } else if (current !== incoming) {
      quillRef.current.clipboard.dangerouslyPasteHTML(0, incoming, 'silent');
    }
  }, [value, defaultValue]);

  useImperativeHandle(ref, () => ({
    getHTML: () => quillRef.current?.root?.innerHTML ?? '',
    setHTML: (html: string) => {
      if (!quillRef.current) return;
      quillRef.current.clipboard.dangerouslyPasteHTML(0, html || '', 'api');
    },
    focus: () => quillRef.current?.focus?.(),
    clear: () => quillRef.current?.setText?.('', 'api'),
  }));

  return (
    <div className="rich-editor-wrapper bg-white rounded-lg border border-gray-300">
      <div ref={containerRef} style={{ minHeight }} />
    </div>
  );
});

export type RichEditorProps = Props;
export default RichEditor;
'use client';

import React, { useEffect, useRef } from 'react';

interface Props {
  initialValue?: string;
  onChange?: (html: string) => void;
}

export default function RichEditor({ initialValue = "", onChange }: Props) {
  const quillRef = useRef<HTMLDivElement | null>(null);
  const quillInstance = useRef<any>(null);
  const initialContentSet = useRef(false);

  // 1) Quill 초기화 (한 번만)
  useEffect(() => {
    if (quillInstance.current) return;

    (async () => {
      const Quill = (await import('quill')).default;

      const toolbarOptions = [
        [{ header: [1, 2, 3, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ list: 'ordered' }, { list: 'bullet' }],
        ['link', 'image', 'video'],
        ['clean'],
      ];

      if (quillRef.current) {
        quillInstance.current = new Quill(quillRef.current, {
          modules: { toolbar: toolbarOptions },
          theme: 'snow',
          placeholder: 'Start writing...',
        });

        quillInstance.current.on('text-change', (_delta: any, _old: any, source: string) => {
          if (source === 'user') {
            onChange?.(quillInstance.current.root.innerHTML);
          }
        });
      }
    })();
  }, [onChange]);

  // 2) 초기값 1회 세팅
  useEffect(() => {
    if (!quillInstance.current || !initialValue || initialContentSet.current) return;
    const quill = quillInstance.current;
    const delta = quill.clipboard.convert(initialValue);
    quill.setContents(delta, 'silent');
    initialContentSet.current = true;
  }, [initialValue]);

  return (
    <div className="rich-editor-wrapper bg-white rounded-lg border border-gray-300">
      {/* ❌ border: 'none' 삭제 */}
      <div ref={quillRef} style={{ minHeight: 300 }} />
    </div>
  );
}
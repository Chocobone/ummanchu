'use client';

import React, { useEffect, useRef } from 'react';

// Quill and its modules will be imported dynamically inside useEffect

interface Props {
  initialValue?: string;
  onChange?: (html: string) => void;
}

export default function RichEditor({ initialValue = "", onChange }: Props) {
  const quillRef = useRef(null);
  const quillInstance = useRef(null);
  const isQuillInitialized = useRef(false); // Ref to prevent re-initialization

  useEffect(() => {
    const initializeQuill = async () => {
      if (typeof window !== 'undefined' && !isQuillInitialized.current) {
        isQuillInitialized.current = true; // Mark as initialized

        const Quill = (await import('quill')).default;
        const ImageUploader = (await import('quill-image-uploader')).default;
        await import('quill/dist/quill.snow.css');

        Quill.register('modules/imageUploader', ImageUploader);

        const toolbarOptions = [
          [{ 'header': [1, 2, 3, false] }],
          ['bold', 'italic', 'underline', 'strike'],
          [{ 'color': [] }, { 'background': [] }],
          [{ 'list': 'ordered'}, { 'list': 'bullet' }],
          ['link', 'image', 'video'],
          ['blockquote', 'code-block'],
          ['clean'],
        ];

        quillInstance.current = new Quill(quillRef.current, {
          modules: {
            toolbar: toolbarOptions,
            imageUploader: {
              upload: file => {
                return new Promise((resolve, reject) => {
                  const formData = new FormData();
                  formData.append("file", file);

                  fetch("/api/upload", {
                    method: "POST",
                    body: formData
                  })
                  .then(res => res.json())
                  .then(data => {
                    if (data.error) {
                      reject(data.error);
                    } else {
                      resolve(data.url);
                    }
                  })
                  .catch(err => {
                    reject("Upload failed");
                    console.error("Error:", err);
                  });
                });
              }
            }
          },
          theme: "snow",
          placeholder: 'Start writing...',
        });
      }
    };

    initializeQuill();
  }, []); // Run only once

  // Effect for handling initialValue and onChange
  useEffect(() => {
    const quill = quillInstance.current;
    if (!quill) return;

    // Set initial value
    if (initialValue && quill.root.innerHTML.trim() === '<p><br></p>') {
        const newContent = quill.clipboard.convert(initialValue);
        quill.setContents(newContent, 'silent');
    }

    // Set up change handler
    const handler = (delta, oldDelta, source) => {
      if (source === 'user') {
        onChange?.(quill.root.innerHTML);
      }
    };
    quill.on('text-change', handler);

    return () => {
      quill.off('text-change', handler);
    };
  }, [initialValue, onChange]);

  return (
    <div className="rich-editor-wrapper bg-white rounded-lg border border-gray-300">
      <div ref={quillRef} style={{ minHeight: 300, border: 'none' }} />
    </div>
  );
}
// src/components/RichEditor.tsx
"use client";

import React, { useEffect } from "react";
import { useQuill } from "react-quilljs";


interface Props {
  initialValue?: string;
  onChange?: (html: string) => void;
}

export default function RichEditor({ initialValue = "", onChange }: Props) {
  // theme: 'snow' 을 Quill 옵션에 넘깁니다
  const { quill, quillRef } = useQuill({ theme: "snow" });

  // quill 인스턴스가 준비되면 초기값을 세팅하고, 변경 이벤트를 구독
  useEffect(() => {
    // 초기값 설정하고 그 후에 안바꾸기 
      if (!quill) return;
    quill.clipboard.dangerouslyPasteHTML(initialValue);
  }, [quill]);
  
  useEffect(() => {
    if (!quill) return;
    const handler = () => {
      onChange?.(quill.root.innerHTML);
    };
    quill.on("text-change", handler);
    return () => {
      quill.off("text-change", handler);
    };
  }, [quill, onChange]);

  return (
    <div className="rich-editor">
      {/* 이 div가 Quill 에디터 영역이 됩니다 */}
      <div ref={quillRef} style={{ minHeight: 200 }} />
    </div>
  );
}

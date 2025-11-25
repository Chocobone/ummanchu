"use client";

import { useState, useRef } from "react";
import Image from "next/image";

export default function GeneratorPage() {
  const [dragActive, setDragActive] = useState(false);
  const [fileName, setFileName] = useState<string>("");
  const [progress, setProgress] = useState<number>(0);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const uploadFile = async (file: File) => {
    setFileName(file.name);
    setProgress(0);

    // 🔵 업로드 진행되는 것처럼 펌프업 (실제 API로 교체할 수 있음)
    let fakeProgress = 0;
    const interval = setInterval(() => {
      fakeProgress += 5;
      setProgress(fakeProgress);
      if (fakeProgress >= 100) clearInterval(interval);
    }, 100);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      uploadFile(file);
      e.dataTransfer.clearData();
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    uploadFile(e.target.files[0]);
  };

  return (
    <div className="max-w-4xl mx-auto py-16 text-center">
      <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
       영상에 맞는 완벽한 음악을 만들어드립니다!!
      </h1>
      <p className="mt-3 text-lg text-gray-500">
     비디오를 업로드하시면, AI가 독특하고 저작권이 없으며 영상의 분위기에 맞는 음악을 만들어드립니다. 
      </p>

      {/* Upload Box */}
      <div
        className={`mt-12 p-10 border-2 border-dashed rounded-xl transition ${
          dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <div>
          <Image
            src="/icons/cloud-upload.svg"
            alt="Upload"
            width={48}
            height={48}
            className="mx-auto mb-4 opacity-60"
          />

          <p className="text-lg font-semibold">Drag & Drop Your Video Here</p>
          <p className="text-sm mt-1 text-gray-500">
            Supports MP4, MOV. Max 500MB.
          </p>

          <button
            onClick={() => inputRef.current?.click()}
            className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Upload from Computer
          </button>

          <input
            ref={inputRef}
            type="file"
            accept="video/mp4,video/quicktime"
            className="hidden"
            onChange={handleFileSelect}
          />
        </div>
      </div>

      {/* Progress Area */}
      {fileName && (
        <div className="mt-10 text-left w-full">
          <p className="text-sm font-medium text-gray-700">
            Uploading your video...
            <span className="float-right">{progress}%</span>
          </p>

          <div className="w-full bg-gray-200 h-2 rounded-full mt-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            ></div>
          </div>

          <p className="text-xs mt-2 text-gray-600">{fileName}</p>
        </div>
      )}
    </div>
  );
}

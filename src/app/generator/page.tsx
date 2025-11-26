"use client";
import { useRouter } from "next/navigation";
import { useState, useRef } from "react";
import Image from "next/image";

export default function GeneratorPage() {
  const [activeTab, setActiveTab] = useState<"youtube" | "upload">("youtube");
const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  // Upload state
  const [dragActive, setDragActive] = useState(false);
  const [fileName, setFileName] = useState("");
  const [progress, setProgress] = useState(0);
  const inputRef = useRef<HTMLInputElement | null>(null);
const router = useRouter();

const sendToN8N = async ({
  file,
  youtubeUrl,
  instrumenttarget,
 
}: {
  file?: File;
  youtubeUrl?: string;
  instrumenttarget?: boolean;
  
}) => {
  const formData = new FormData();

  if (file) formData.append("file", file);
  if (youtubeUrl) formData.append("youtube_url", youtubeUrl);
  formData.append("instrumenttarget", instrumenttarget ? "0" : "1");

  const res = await fetch("http://49.50.139.233:8000/api/analyze-video", {
    method: "POST",
    body: formData,
  });

  const data = await res.json();
  console.log("n8n 응답:", data);
};


const uploadFile = (file: File) => {
  setUploadedFile(file); // 추가됨
  setFileName(file.name);
  setProgress(0);

  let p = 0;
  const timer = setInterval(() => {
    p += 5;
    setProgress(p);
    if (p >= 100) clearInterval(timer);
  }, 100);
};


  return (
    <div className="max-w-6xl mx-auto py-16 px-4 font-bold" >
      <h1 className="text-4xl font-bold text-center mb-10">
        영상에 맞는 완벽한 음악을 만들어드립니다!
      </h1>

      {/* 전체 카드 박스 */}
      <div className="bg-white dark:bg-neutral-900 border rounded-xl shadow-lg p-8">

        {/* 탭 버튼 */}
        <div className="flex border-b mb-6">
          <button
            className={`flex-1 py-3 font-semibold ${
              activeTab === "youtube"
                ? "text-purple-600 border-b-2 border-purple-600"
                : "text-gray-400"
            }`}
            onClick={() => setActiveTab("youtube")}
          >
            유튜브 링크 업로드
          </button>

          <button
            className={`flex-1 py-3 font-semibold ${
              activeTab === "upload"
                ? "text-purple-600 border-b-2 border-purple-600"
                : "text-gray-400"
            }`}
            onClick={() => setActiveTab("upload")}
          >
            파일 업로드
          </button>
        </div>

        {/* -------------------------- */}
        {/*         YouTube 탭         */}
        {/* -------------------------- */}
        {activeTab === "youtube" && (
          <div className="text-center">
            <p className="text-gray-500 font-bold mb-3">
              유튜브 링크를 입력하면 AI가 음악을 생성합니다.
            </p>

            <input
              type="text font-bold"
              placeholder="https://youtu.be/xxxx 또는 https://youtube.com/watch?v=xxx"
              className="w-full border rounded-md px-4 py-3 mb-4 bg-gray-100 dark:bg-neutral-800"
            />

<button
  onClick={async () => {
    const url = (document.querySelector("#yt-input") as HTMLInputElement)?.value;
    

    await sendToN8N({
      youtubeUrl: url,
      instrumenttarget: false,
    
    });

    router.push("/generator/generating");
  }}
  className="px-6 py-3 bg-purple-600 text-white rounded-md hover:bg-purple-700"
>
              음악 생성하기
            </button>
          </div>
        )}

        {/* -------------------------- */}
        {/*         Upload 탭          */}
        {/* -------------------------- */}
        {activeTab === "upload" && (
          <div className="text-center">

            {/* Upload Box */}
            <div
              className={`mt-6 p-10  min-h-[300px] border-2 border-dashed rounded-xl transition ${
                dragActive ? "border-purple-500 bg-purple-50" : "border-gray-300"
              }`}
              onDragEnter={(e) => {
                e.preventDefault();
                setDragActive(true);
              }}
              onDragLeave={(e) => {
                e.preventDefault();
                setDragActive(false);
              }}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                setDragActive(false);
                const file = e.dataTransfer.files?.[0];
                if (file) uploadFile(file);
              }}
            >
              <Image
                src="/images/icon.png"
                alt="upload icon"
                width={20}
                height={20}
                className="mx-auto mb-4 opacity-60"
              />

              <p className="text-lg font-bold">비디오를 끌어다 놓아 주세요</p>
              <p className="text-sm font-bold">MP4, MOV. 형식의 파일 가능합니다. </p>

              <button
                className="mt-6 px-6 py-3 bg-purple-600 text-white rounded-md hover:bg-purple-700"
                onClick={() => inputRef.current?.click()}
              >
                Upload from Computer
              </button>

              <input
                ref={inputRef}
                type="file"
                accept="video/mp4,video/quicktime"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files) uploadFile(e.target.files[0]);
                }}
              />
            </div>

            {/* Progress Bar */}
            {fileName && progress < 100 && (
              <div className="mt-8 text-left">
                <p className="text-sm text-gray-700">
                  Uploading: <span className="float-right">{progress}%</span>
                </p>

                <div className="w-full bg-gray-200 h-2 rounded-full mt-2">
                  <div
                    className="bg-purple-600 h-2 rounded-full transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>

                <p className="text-xs mt-2 text-gray-600">{fileName}</p>
              </div>
            )}

            {/* 업로드 완료 UI */}
            {progress >= 100 && (
              <div className="mt-10">
                <h2 className="text-2xl font-bold text-center mb-6">
                  업로드 완료 
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
<button
  onClick={async () => {
    if (!uploadedFile) return alert("파일이 없습니다.");

    await sendToN8N({
      file: uploadedFile,
      instrumenttarget: false,
    
    });

    router.push("/generator/generating");
  }}
  className="w-full py-4 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition"
>
  가사 없이 생성하기
</button>

     <button
  onClick={async () => {
    if (!uploadedFile) return alert("파일이 없습니다.");

    await sendToN8N({
      file: uploadedFile,
      instrumenttarget: true,
    
    });

    router.push("/generator/generating");
  }}
  className="w-full py-4 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition"
>
  가사 넣고 생성하기
</button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

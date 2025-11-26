"use client";

import Script from "next/script";
import WaveSurfer from "wavesurfer.js";
import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";

declare global {
  interface Window {
    Kakao: any;
  }
}

export default function ResultPage() {
   // ⬇⬇⬇ 여기 바로 아래 추가해라
  const formatTime = (sec: number) => {
    if (!sec || isNaN(sec)) return "00:00";
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };
  const searchParams = useSearchParams();
  const taskId = searchParams.get("task_id");
// ⬇⬇⬇ forceDownload 함수 추가
const forceDownload = async (url: string, filename: string) => {
  try {
    const res = await fetch(url);
    const blob = await res.blob();

    const blobUrl = window.URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = blobUrl;
    link.download = filename;
    document.body.appendChild(link);

    link.click();
    link.remove();
    window.URL.revokeObjectURL(blobUrl);
  } catch (err) {
    console.error("다운로드 오류:", err);
    alert("파일 다운로드에 실패했습니다.");
  }
};

  /* ---------------------- STATE ---------------------- */
  const [musicTitle, setMusicTitle] = useState<string | null>(null);
  const [musicImage, setMusicImage] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<"music" | "video">("music");
  const [selected, setSelected] = useState<number | null>(null);
 
  const [musicList, setMusicList] = useState<any[]>([]);
  const [videoObjectName, setVideoObjectName] = useState<string | null>(null);
  const [finalVideoUrl, setFinalVideoUrl] = useState<string | null>(null);
  const [isMixing, setIsMixing] = useState(false);

  const waveRefs = useRef<(WaveSurfer | null)[]>([]);
  const containerRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [, forceRender] = useState({});
  const currentTimes = useRef<number[]>([]);
  const durations = useRef<number[]>([]);

  /* ---------------------- KAKAO INIT ---------------------- */
  useEffect(() => {
    const timer = setInterval(() => {
      if (window.Kakao && !window.Kakao.isInitialized()) {
        window.Kakao.init(process.env.NEXT_PUBLIC_KAKAO_JAVASCRIPT_KEY!);
        clearInterval(timer);
      }
    }, 200);
    return () => clearInterval(timer);
  }, []);

  const shareToKakao = (url: string) => {
    if (!window.Kakao || !window.Kakao.isInitialized()) return;

    window.Kakao.Share.sendDefault({
      objectType: "text",
      text: `🎵 나만의 AI 음악/영상 결과!\n${url}`,
      link: {
        mobileWebUrl: url,
        webUrl: url,
      },
    });
  };

  /* ---------------------- LOAD INITIAL DATA ---------------------- */
  useEffect(() => {
    if (!taskId) return;

    const load = async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/status/${taskId}`);
      const data = await res.json();

      if (data.music_list) {
        setMusicList(data.music_list);
        currentTimes.current = data.music_list.map(() => 0);
        durations.current = data.music_list.map(() => 0);
      }

      if (data.video_object_name) setVideoObjectName(data.video_object_name);
      if (data.music_title) setMusicTitle(data.music_title);
      if (data.music_image) setMusicImage(data.music_image);

      if (data.final_video_url) {
        setFinalVideoUrl(`${data.final_video_url}`);
      }
    };

    load();
  }, [taskId]);

  /* ---------------------- WAVESURFER SETUP ---------------------- */
  useEffect(() => {
    if (musicList.length === 0) return;

    waveRefs.current.forEach((ws) => ws?.destroy());
    const waves: WaveSurfer[] = [];

    musicList.forEach((m, index) => {
      if (!containerRefs.current[index]) return;

      const ws = WaveSurfer.create({
        container: containerRefs.current[index]!,
        waveColor: "rgba(147, 51, 234, 0.35)",
        progressColor: "rgba(147, 51, 234, 1)",
        cursorColor: "#dad7d7ff",
        height: 120,
        barWidth: 1,
        barGap: 1,
        barRadius: 2,
        minPxPerSec: 200,
        dragToSeek: true,
        normalize: false,
        url: m.url,
      });

      waveRefs.current[index] = ws;
      waves.push(ws);

      ws.on("ready", () => {
        durations.current[index] = ws.getDuration();
        forceRender({});
      });

      ws.on("audioprocess", () => {
        currentTimes.current[index] = ws.getCurrentTime();
        forceRender({});
      });

      ws.on("interaction", () => {
        currentTimes.current[index] = ws.getCurrentTime();
        forceRender({});
      });
    });

    return () => waves.forEach((ws) => ws.destroy());
  }, [musicList]);

  /* ---------------------- PLAY HANDLER ---------------------- */
  const handlePlay = (index: number) => {
    const ws = waveRefs.current[index];
    if (!ws) return;

    waveRefs.current.forEach((w, i) => {
      if (i !== index) w?.pause();
    });

    ws.playPause();
  };

  /* ---------------------- FINALIZATION POLLING ---------------------- */
  const pollFinalization = async (tid: string) => {
    const interval = setInterval(async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/status/${tid}`);
      const data = await res.json();

      if (data.status === "completed") {
        clearInterval(interval);
        setIsMixing(false);
        setFinalVideoUrl(`${data.final_video_url}`);
      }

      if (data.status === "failed") {
        clearInterval(interval);
        setIsMixing(false);
        alert("영상 합성 실패!");
      }
    }, 2000);
  };

  /* ---------------------- FINALIZE VIDEO ---------------------- */
  const finalizeVideo = async (music: any) => {
    if (!videoObjectName) return alert("원본 영상 정보가 없습니다.");

    setMusicTitle(music.title);
    setMusicImage(music.image);
    setIsMixing(true);

    const payload = {
      video_object_name: videoObjectName,
      music_url: music.url,
      music_title: music.title,
      music_image: music.image,
      start_time: 0.0,
      audio_volume: 0.3,
    };

    const res = await fetch("${process.env.NEXT_PUBLIC_API_URL}/api/finalize-video", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    pollFinalization(data.task_id);
  };

  /* ---------------------- RENDER ---------------------- */
  /* ---------------------- RENDER ---------------------- */
return (
  <>
    <Script
      src="https://t1.kakaocdn.net/kakao_js_sdk/2.7.7/kakao.min.js"
      integrity="sha384-tJkjbtDbvoxO+diRuDtwRO9JXR7pjWnfjfRn5ePUpl7e7RJCxKCwwnfqUAdXh53p"
      crossOrigin="anonymous"
    />

    <div className="px-4 max-w-5xl mx-auto py-16">
      
      {/* 탭 */}
      <div className="flex gap-6 border-b mb-8 pb-2">
        <button
          onClick={() => setActiveView("music")}
          className={`text-lg ${
            activeView === "music" ? "text-purple-600 font-semibold" : "text-gray-500"
          }`}
        >
          🎵 음악만 보기
        </button>

        <button
          onClick={() => setActiveView("video")}
          className={`text-lg ${
            activeView === "video" ? "text-purple-600 font-semibold" : "text-gray-500"
          }`}
        >
          🎬 음악 + 영상 보기
        </button>
      </div>

      {/* 음악 보기 */}
      {activeView === "music" && (
        <div className="space-y-6">
          {musicList.map((m, index) => (
            <div
              key={index}
              className={`rounded-2xl p-6 transition bg-white border 
                ${selected === index ? "ring-2 ring-purple-500 shadow-purple-500/30" : "border-neutral-300"}`}
            >

              {/* 제목 */}
              <h3 className="text-lg font-semibold text-black">
                음악 옵션 {index + 1}
              </h3>
              <p className="text-sm text-gray-500">{m.title}</p>

              {/* 타임라인 */}
              <div className="flex justify-between text-sm text-gray-600 mt-2 px-1">
                <span>{formatTime(currentTimes.current[index])}</span>
                <span>{formatTime(durations.current[index])}</span>
              </div>

              {/* WaveSurfer 파형 */}
              <div
               ref={(el) => {
    containerRefs.current[index] = el;
  }}
                className="mt-3 w-full h-[120px] rounded-xl bg-neutral-100 border border-neutral-300"
              />

              {/* 버튼들 */}
              <div className="mt-6 flex items-center justify-between gap-3">

                <button
                  className="px-4 py-2 text-gray-700 hover:text-black transition"
                  onClick={() => handlePlay(index)}
                >
                  ▶ 재생
                </button>

                <button
                  className="px-4 py-2 text-gray-700 hover:text-black transition"
                  onClick={() => forceDownload(m.url, `music_option_${index + 1}.mp3`)}
                >
                  ⬇ 다운로드
                </button>

                <button
                  className={`flex-1 py-2 rounded-lg font-semibold transition
                    ${selected === index ? "bg-purple-600 text-white shadow-md" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelected(index);
                    finalizeVideo(m);
                  }}
                >
                  {selected === index ? "✔ 선택됨" : "선택하기"}
                </button>
              </div>

              <button
                className="mt-4 w-full py-2 bg-yellow-400 text-black rounded-lg"
                onClick={() => shareToKakao(m.url)}
              >
                🔗 공유하기
              </button>

            </div>
          ))}
        </div>
      )}

      {/* 영상 보기 */}
      {activeView === "video" && (
        <div className="mt-10">
          {isMixing && (
            <p>영상 합성 중...</p>
          )}

          {!isMixing && finalVideoUrl && (
            <>
              <video src={finalVideoUrl} controls className="w-full rounded-xl" />
              <button
                className="mt-4 px-4 py-2 bg-yellow-400 text-black rounded-lg"
                onClick={() => shareToKakao(finalVideoUrl!)}
              >
                🔗 영상 공유하기
              </button>
            </>
          )}

          {!isMixing && !finalVideoUrl && <p>아직 음악 선택 안됨.</p>}
        </div>
      )}

    </div>
  </>
);
}
// /src/lib/ffmpeg.js
"use client";

import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";

let ffmpeg;

export async function getFFmpeg() {
  if (ffmpeg) return ffmpeg;

  ffmpeg = createFFmpeg({
    log: true,
    corePath: "/ffmpeg/ffmpeg-core.js",        // core js
    wasmPath: "/ffmpeg/ffmpeg-core.wasm",      // wasm
    workerPath: "/ffmpeg/ffmpeg-core.worker.js" // worker
  });

  await ffmpeg.load();
  return ffmpeg;
}

export { fetchFile };

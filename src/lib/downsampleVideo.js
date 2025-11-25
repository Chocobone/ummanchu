import { getFFmpeg, fetchFile } from "@/lib/ffmpeg";

export async function downsampleVideo(file) {
  const ffmpeg = await getFFmpeg();

  ffmpeg.FS("writeFile", "input.mp4", await fetchFile(file));

  await ffmpeg.run(
    "-i", "input.mp4",
    "-vf", "scale=640:360",
    "-r", "15",
    "-b:v", "250k",
    "-b:a", "64k",
    "output.mp4"
  );

  const data = ffmpeg.FS("readFile", "output.mp4");
  return new Blob([data.buffer], { type: "video/mp4" });
}

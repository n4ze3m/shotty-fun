import { createFFmpeg } from "@ffmpeg.wasm/main";
export const ffmpeg = createFFmpeg({ log: true,
logger: (log) => console.log(log)
});

const _init = async () => {
  if (!ffmpeg.isLoaded()) {
    await ffmpeg.load();
  }
  console.log("ffmpeg loaded");
};

export const convertMp3ToWaveFromBuffer = async (audio: Buffer) => {
  await _init();
  ffmpeg.FS("writeFile", "./audio.mp3", audio);
  await ffmpeg.run(
    "-i",
    "./audio.mp3",
    "-acodec",
    "pcm_s16le",
    "-ac",
    "1",
    "-ar",
    "16000",
    "./audio.wav"
  );
  const data = ffmpeg.FS("readFile", "./audio.wav");
  ffmpeg.exit();
  return data;
};
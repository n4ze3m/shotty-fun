import { createFFmpeg } from "@ffmpeg.wasm/main";
export const ffmpeg = createFFmpeg({
  log: true,
  logger: (log) => console.log(log),
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

export const convertWaveToMp3FromBuffer = async (audio: Buffer) => {
  await _init();
  ffmpeg.FS("writeFile", "./audio.wav", audio);
  await ffmpeg.run(
    "-i",
    "./audio.wav",
    "-acodec",
    "libmp3lame",
    "-ac",
    "1",
    "-ar",
    "16000",
    "./audio.mp3"
  );
  const data = ffmpeg.FS("readFile", "./audio.mp3");
  ffmpeg.exit();
  return data;
};

export const convertWaveToMp3VolumeBoostFromBuffer = async (audio: Buffer) => {
  await _init();
  ffmpeg.FS("writeFile", "./audio.wav", audio);
  await ffmpeg.run(
    "-i",
    "./audio.wav",
    "-acodec",
    "libmp3lame",
    "-ac",
    "1",
    "-ar",
    "16000",
    "-af",
    "volume=10dB",
    "./audio.mp3"
  );
  const data = ffmpeg.FS("readFile", "./audio.mp3");
  ffmpeg.exit();
  return data;
};

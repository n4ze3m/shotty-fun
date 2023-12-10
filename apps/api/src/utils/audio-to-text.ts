import { pipeline } from "@xenova/transformers";
import pkg from "wavefile";
const { WaveFile } = pkg;
function _convert(audio: Buffer) {
  const wav = new WaveFile(audio);
  wav.toBitDepth("32f");
  wav.toSampleRate(16000);
  let audioData = wav.getSamples();
  if (Array.isArray(audioData)) {
    console.log(
      "Multiple channels detected. Selecting the first channel only."
    );
    audioData = audioData[0];
  }
  return audioData;
}

export const audioToTranscript = async (audioData: Buffer) => {
  const transcriber = await pipeline(
    "automatic-speech-recognition",
    process.env.WHISPER_MODEL || "distil-whisper/distil-medium.en"
  );

  const audio = _convert(Buffer.from(audioData));
  let output = (await transcriber(audio, {
    // chunk_length_s: 30,
    return_timestamps: true,
    quantized: true,
  })) as {
    text: string;
    chunks: {
      timestamp: number[];
      text: string;
    }[];
  };

  return output;
};

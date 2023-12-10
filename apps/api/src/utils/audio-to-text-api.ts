import axios from "axios";
import tmp from "tmp";
import * as fs from "fs";
import { promisify } from "util";
import formData from "form-data";

const writeFileAsync = promisify(fs.writeFile);

export const audioToTranscriptAPI = async (buffer: Buffer) => {
  const tmpobj = tmp.fileSync({ postfix: ".mp3" });

  await writeFileAsync(tmpobj.name, buffer);


  const form = new formData();

  form.append("file", buffer, {
    filename: tmpobj.name,
    contentType: "audio/mp3",
    knownLength: buffer.length,
  });

  const response = await axios.post(process.env.WHISPER_URL!, form, {
    headers: form.getHeaders(),
  });

  return response.data as {
    text: string;
    chunks: {
      timestamp: number[];
      text: string;
    }[];
  };
};

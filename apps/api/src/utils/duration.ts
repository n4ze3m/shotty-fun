import { execa, ExecaChildProcess } from "execa";
import * as fs from "fs";
import ffprobe from "@ffprobe-installer/ffprobe";
import  tmp from 'tmp';
import { promisify } from 'util';

const writeFileAsync = promisify(fs.writeFile);

const getFFprobeWrappedExecution = (
  input: string,
  ffprobePath: string
): ExecaChildProcess =>
  execa(ffprobePath, [
    "-v",
    "error",
    "-select_streams",
    "a:0",
    "-show_format",
    "-show_streams",
    input,
  ]);

export const getAudioDurationInSeconds = async (
  buffer: Buffer
): Promise<number> => {
  const path = ffprobe.path;
  const tmpobj = tmp.fileSync({ postfix: '.mp3' });
  await writeFileAsync(tmpobj.name, buffer);

  const { stdout } = await getFFprobeWrappedExecution(tmpobj.name, path);
  const matched = stdout.match(/duration="?(\d*\.\d*)"?/);
  if (matched && matched[1]) return parseFloat(matched[1]);
  throw new Error("No duration found!");
};

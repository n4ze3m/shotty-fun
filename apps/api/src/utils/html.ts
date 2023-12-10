import { htmlToText } from "html-to-text";
import axios from "axios";

export const urlToText = async (url: string) => {
  const response = await axios.get(url, {});
  const text = htmlToText(response.data, {
    wordwrap: 130,
  });
  return text;
};

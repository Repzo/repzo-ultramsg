import axios from "axios";
import { ultraMsgSendData, ultraMsgSendDoc } from "./types";
import qs from "qs";
import { Service } from "repzo/src/types";
import Repzo from "repzo";
const MAX_RETRIES = 25;

type AxiosRequestConfig = {
  method: string;
  url: string;
  headers: { [key: string]: string };
  data: string;
};
export const _sendUltraMessage = async (data: ultraMsgSendData) => {
  try {
    var _data = qs.stringify({
      token: data.token,
      to: data.to,
      body: data.body || "",
    });
    var config: AxiosRequestConfig = {
      method: "post",
      url: `https://api.ultramsg.com/${data.instanceId}/messages/chat`,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      data: _data,
    };

    try {
      const res = await axios(config);
      return res.data;
    } catch (e) {
      throw e;
    }
  } catch (e) {
    throw e;
  }
};

export const _sendUltraMsgDoc = async (data: ultraMsgSendDoc) => {
  try {
    var _data = qs.stringify({
      token: data.token,
      to: data.to,
      caption: data.body,
      document: data.document,
      filename: data.fileName,
    });
    var config: AxiosRequestConfig = {
      method: "post",
      url: `https://api.ultramsg.com/${data.instanceId}/messages/document`,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      data: _data,
    };

    try {
      const res = await axios(config);
      return res.data;
    } catch (e) {
      throw e;
    }
  } catch (e) {
    throw e;
  }
};

export const sleep = (s: number) => {
  return new Promise((resolve) => setTimeout(resolve, 1000 * s));
};

export const _getPrintMedia = async (
  pdfId: string,
  repzo: Repzo,
): Promise<Service.QuickConvertToPdf.QuickConvertToPdfSchema> => {
  for (let i = 0; i <= MAX_RETRIES; i = i + 5) {
    let pdf = await repzo.quickConvertToPdf.get(pdfId, {
      populatedKeys: ["print_media"],
    });
    if (pdf.state === "completed") {
      return pdf;
    }
    await sleep(i);
  }
  throw new Error("Failed to fetch media after retries.");
};

export const replaceVariables = (
  str: string,
  replacements: Array<{ key: string; value: string | number }>,
): string => {
  let modifiedStr = str;

  for (let item of replacements) {
    // Create a regular expression for global replacement
    const regex = new RegExp(`{${item.key}}`, "g");
    modifiedStr = modifiedStr.replace(regex, String(item.value)); // Convert value to string in case it's a number
  }

  return modifiedStr;
};

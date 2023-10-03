import axios, { AxiosRequestConfig } from "axios";
import { ultraMsgSendData, ultraMsgSendDoc } from "./types";
import qs from "qs";
import { Service } from "repzo/src/types";
import Repzo from "repzo";
const MAX_RETRIES = 20;
const RETRY_DELAY_SECONDS = 0.1;
export const _sendUltraMessage = async (data: ultraMsgSendData) => {
  try {
    var _data = qs.stringify({
      token: data.token,
      to: data.to,
      body: data.body,
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
  workorderPdfId: string,
  repzo: Repzo
): Promise<Service.QuickConvertToPdf.QuickConvertToPdfSchema> => {
  for (let i = 0; i < MAX_RETRIES; i = i + 5) {
    let workorderPdf = await repzo.quickConvertToPdf.get(workorderPdfId, {
      populatedKeys: ["print_media"],
    });
    if (workorderPdf.state === "completed") {
      return workorderPdf;
    } else if (i === MAX_RETRIES - 1) {
      throw new Error("Invalid media generated after max retries.");
    }
    await sleep(RETRY_DELAY_SECONDS + i);
  }
  throw new Error("Failed to fetch media after retries.");
};

import axios from "axios";
import qs from "qs";
const MAX_RETRIES = 25;
export const _sendUltraMessage = async (data) => {
  try {
    var _data = qs.stringify({
      token: data.token,
      to: data.to,
      body: data.body,
    });
    var config = {
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
export const _sendUltraMsgDoc = async (data) => {
  try {
    var _data = qs.stringify({
      token: data.token,
      to: data.to,
      caption: data.body,
      document: data.document,
      filename: data.fileName,
    });
    var config = {
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
export const sleep = (s) => {
  return new Promise((resolve) => setTimeout(resolve, 1000 * s));
};
export const _getPrintMedia = async (workorderPdfId, repzo) => {
  for (let i = 0; i <= MAX_RETRIES; i = i + 5) {
    let workorderPdf = await repzo.quickConvertToPdf.get(workorderPdfId, {
      populatedKeys: ["print_media"],
    });
    if (workorderPdf.state === "completed") {
      return workorderPdf;
    }
    await sleep(i);
  }
  throw new Error("Failed to fetch media after retries.");
};

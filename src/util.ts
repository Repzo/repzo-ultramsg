import axios, { AxiosRequestConfig } from "axios";
import { ultraMsgSendData } from "./types";
import qs from "qs";

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

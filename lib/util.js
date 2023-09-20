import axios from "axios";
import qs from "qs";
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
    await axios(config);
  } catch (e) {
    throw e;
  }
};

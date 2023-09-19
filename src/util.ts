import axios from "axios";
import Repzo from "repzo";
interface Params {
  [key: string]: any;
}
interface Data {
  [key: string]: any;
}

interface Headers {
  "API-KEY": string;
  [key: string]: string;
}

export const _send = async (body: Data) => {
  const msgBody = `Dear ${body.clientName}, your total invoice is ${
    parseInt(body.total) / 1000
  } ${body.currency}`;
  try {
    axios
      .post(
        `https://api.ultramsg.com/${body.instanceId}/messages/chat?token=${body.token}&to=${body.to}&body=${msgBody}`,

        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      )
      .then(function (response) {
        console.log(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  } catch (e) {
    throw e;
  }
};

export const update_bench_time = async (
  repzo: Repzo,
  app_id: string,
  key: string,
  value: string
): Promise<void> => {
  try {
    const res = await repzo.integrationApp.update(app_id, {
      // options_formData: { [key]: value },
      [`options_formData.${key}`]: value,
    });
    // console.log(res);
  } catch (e) {
    throw e;
  }
};

export const updateAt_query = (
  QUERY: string,
  options_formData: any,
  bench_time_key: string
): string => {
  try {
    QUERY = QUERY || "";
    if (options_formData && options_formData[bench_time_key]) {
      QUERY += `${QUERY ? "&" : "?"}q[updated_at_gteq]=${
        options_formData[bench_time_key]
      }`;
    }
    return QUERY;
  } catch (e) {
    throw e;
  }
};

export const set_error = (error_res: any): any => {
  try {
    if (error_res) {
      if (typeof error_res == "string") {
        return { message: error_res };
      } else if (error_res.message || error_res.response?.data) {
        return {
          code: error_res.response?.data?.code,
          message: error_res.response?.data.message || error_res.message,
          // responseData: error_res.response?.data,
        };
      } else {
        return error_res;
      }
    }
    return error_res;
  } catch (e) {
    throw e;
  }
};

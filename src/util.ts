import axios from "axios";

interface Data {
  [key: string]: any;
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

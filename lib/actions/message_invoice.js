import Repzo from "repzo";
import { _send } from "../util.js";
import { v4 as uuid } from "uuid";
export const message_invoice = async (event, options) => {
  var _a, _b, _c;
  const repzo = new Repzo(
    (_a = options.data) === null || _a === void 0 ? void 0 : _a.repzoApiKey,
    { env: options.env }
  );
  const action_sync_id =
    ((_b = event === null || event === void 0 ? void 0 : event.headers) ===
      null || _b === void 0
      ? void 0
      : _b.action_sync_id) || uuid();
  const actionLog = new Repzo.ActionLogs(repzo, action_sync_id);
  let body;
  try {
    await actionLog.load(action_sync_id);
    body = event.body;
    try {
      if (body) body = JSON.parse(body);
    } catch (e) {}
    let client = await repzo.client.get(body.client_id);
    await actionLog
      .addDetail(
        `Repzo Ultramsg: Started Sending a Message - ${
          (_c =
            body === null || body === void 0 ? void 0 : body.serial_number) ===
            null || _c === void 0
            ? void 0
            : _c.formatted
        }`
      )
      .commit();
    const ultramsg_client_body = {
      to: client.cell_phone,
      clientName: body.client_name,
      total: body.total,
      currency: body.currency,
      token: options.data.token,
      instanceId: options.data.instanceId,
    };
    await actionLog
      .addDetail(
        `Repzo Ultramsg: Message Body - Dear ${
          ultramsg_client_body.clientName
        }, your total invoice is ${
          parseInt(ultramsg_client_body.total) / 1000
        } ${ultramsg_client_body.currency}`,
        ultramsg_client_body
      )
      .commit();
    const result = await _send(ultramsg_client_body);
    await actionLog
      .addDetail(`Message Sent Successfully `, result)
      .setStatus("success")
      .setBody(body)
      .commit();
    return result;
  } catch (e) {
    //@ts-ignore
    console.error((e === null || e === void 0 ? void 0 : e.response) || e);
    await actionLog.setStatus("fail", e).setBody(body).commit();
    throw e;
  }
};

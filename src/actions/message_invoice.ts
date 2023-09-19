import { Config, EVENT } from "../types";
import Repzo from "repzo";
import { _send } from "../util.js";
import { Service } from "repzo/src/types";
import { v4 as uuid } from "uuid";

interface ultraMsg {
  token: string;
  instanceId: string;
  total: string;
  currency: string;
  to?: string;
  clientName?: string;
}
export const message_invoice = async (event: EVENT, options: Config) => {
  const repzo = new Repzo(options.data?.repzoApiKey, { env: options.env });
  const action_sync_id: string = event?.headers?.action_sync_id || uuid();
  const actionLog = new Repzo.ActionLogs(repzo, action_sync_id);
  let body: Service.FullInvoice.InvoiceSchema | any;
  try {
    await actionLog.load(action_sync_id);

    body = event.body;
    try {
      if (body) body = JSON.parse(body);
    } catch (e) {}

    let client = await repzo.client.get(body.client_id);

    await actionLog
      .addDetail(
        `Repzo Ultramsg: Started Sending a Message - ${body?.serial_number?.formatted}`
      )
      .commit();

    const ultramsg_client_body: ultraMsg = {
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
  } catch (e: any) {
    //@ts-ignore
    console.error(e?.response || e);
    await actionLog.setStatus("fail", e).setBody(body).commit();
    throw e;
  }
};

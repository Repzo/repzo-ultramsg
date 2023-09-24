import { Config, EVENT, ultraMsgSendData } from "../types";
import Repzo from "repzo";
import { _sendUltraMessage } from "../util.js";
import { Service } from "repzo/src/types";
import { v4 as uuid } from "uuid";

export const message_invoice = async (event: EVENT, options: Config) => {
  const repzo = new Repzo(options.data?.repzoApiKey, { env: options.env });
  const action_sync_id: string = event?.headers?.action_sync_id || uuid();
  const actionLog = new Repzo.ActionLogs(repzo, action_sync_id);
  let body: Service.FullInvoice.InvoiceSchema;
  try {
    await actionLog.load(action_sync_id);

    if (typeof event.body === "string" && event.body.trim() !== "") {
      body = JSON.parse(event.body);
    } else if (typeof event.body === "object" && event.body !== null) {
      body = event.body;
    } else {
      await actionLog
        .setStatus("fail")
        .addDetail(`Repzo Ultramsg: Error event body was of a wrong type`)
        .commit();
      throw new Error(`Repzo Ultramsg: Error event body was of a wrong type`);
    }
    let client = await repzo.client.get(body.client_id);
    if (typeof client.cell_phone !== "string" || !client.cell_phone) {
      await actionLog
        .setStatus("fail")
        .addDetail(
          `Repzo Ultramsg: Error ${body?.client_name} does not have a cellphone`
        )
        .commit();
      throw `Repzo Ultramsg: Error ${body?.client_name} does not have a cellphone`;
    }
    await actionLog
      .addDetail(
        `Repzo Ultramsg: Started Sending a Message - ${body?.serial_number?.formatted} `
      )
      .commit();
    const msgBody = `Dear ${body.client_name}, your total invoice is ${
      parseInt(body.total.toString()) / 1000
    } ${body.currency} `;
    const ultramsg_client_body: ultraMsgSendData = {
      to: client.cell_phone,
      body: msgBody,
      token: options.data.token,
      instanceId: options.data.instanceId,
    };
    await actionLog.addDetail(`message ${msgBody} sent attempting`).commit();
    const result = await _sendUltraMessage(ultramsg_client_body);
    await actionLog
      .addDetail(`Message Sent Successfully`, result)
      .setStatus("success")
      .setBody(body)
      .commit();
    // console.log(result)
    return result;
  } catch (e: any) {
    //@ts-ignore
    console.log(e);
    console.error(e?.response || e);
    await actionLog.setStatus("fail", e).setBody(event.body).commit();
    throw e;
  }
};

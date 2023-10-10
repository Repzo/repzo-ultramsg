import { Config, EVENT, ultraMsgSendDoc } from "../types";
import Repzo from "repzo";
import { _getPrintMedia, _sendUltraMsgDoc } from "../util.js";
import { Service } from "repzo/src/types";
import { v4 as uuid } from "uuid";

export const document_invoice = async (event: EVENT, options: Config) => {
  const repzo = new Repzo(options.data?.repzoApiKey, { env: options.env });
  const action_sync_id: string = event?.headers?.action_sync_id || uuid();
  const actionLog = new Repzo.ActionLogs(repzo, action_sync_id);
  let body: Service.FullInvoice.InvoiceSchema;
  let clientPhoneNumber: string = "";

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

    if (options.data.invoices.document.documentRecipientType === "Cell Phone") {
      if (typeof client.cell_phone !== "string" || !client.cell_phone) {
        await actionLog
          .setStatus("fail")
          .addDetail(
            `Repzo Ultramsg: Error ${body?.client_name} does not have a cellphone`
          )
          .commit();
        throw `Repzo Ultramsg: Error ${body?.client_name} does not have a cellphone`;
      } else clientPhoneNumber = client.cell_phone;
    }

    if (options.data.invoices.document.documentRecipientType === "Phone") {
      if (typeof client.phone !== "string" || !client.phone) {
        await actionLog
          .setStatus("fail")
          .addDetail(
            `Repzo Ultramsg: Error ${body?.client_name} does not have a phone`
          )
          .commit();
        throw `Repzo Ultramsg: Error ${body?.client_name} does not have a phone`;
      } else clientPhoneNumber = client.phone;
    }

    if (clientPhoneNumber.trim() == "") {
      await actionLog
        .setStatus("fail")
        .addDetail(
          `Repzo Ultramsg: Error ${body?.client_name} does not have contact info`
        )
        .commit();
      throw `Repzo Ultramsg: Error ${body?.client_name} does not have contact info`;
    }
    let convertInvoiceToPdf: Service.QuickConvertToPdf.QuickConvertToPdfSchema;
    try {
      convertInvoiceToPdf = await repzo.quickConvertToPdf.create({
        document_id: [body._id],
        document_type: "invoice",
        sync_id: body.sync_id,
      });
    } catch (e) {
      await actionLog
        .setStatus("fail")
        .addDetail(`Repzo Ultramsg: Error in converting invoice to pdf`)
        .commit();
      throw e;
    }

    if (
      !convertInvoiceToPdf._id ||
      convertInvoiceToPdf._id.trim() == "" ||
      convertInvoiceToPdf.state === "failed"
    ) {
      throw `Repzo Ultramsg: Error, failed to convert invoice to pdf`;
    }
    let invoicePdf: Service.QuickConvertToPdf.QuickConvertToPdfSchema;

    try {
      invoicePdf = await _getPrintMedia(convertInvoiceToPdf._id, repzo);
    } catch (e) {
      await actionLog
        .setStatus("fail")
        .addDetail(`Repzo Ultramsg:  Error, failed to fetch invoice pdf`)
        .commit();
      throw e;
    }

    if (typeof invoicePdf.print_media !== "string" && invoicePdf.print_media) {
      if (
        !invoicePdf.print_media.publicUrl ||
        typeof invoicePdf.print_media.publicUrl !== "string"
      )
        throw `Repzo Ultramsg: Error,invoice document not found `;

      if (
        !invoicePdf.print_media.file_name ||
        typeof invoicePdf.print_media.file_name !== "string"
      )
        throw `Repzo Ultramsg: Error,invoice document does not have a file name`;
      await actionLog
        .addDetail(
          `Repzo Ultramsg: Started Sending a Document - ${body?.serial_number?.formatted} `
        )
        .commit();
      const ultramsg_client_body: ultraMsgSendDoc = {
        to: clientPhoneNumber,
        body: options.data.invoices.document.documentCaption,
        token: options.data.token,
        instanceId: options.data.instanceId,
        document: invoicePdf.print_media.publicUrl,
        fileName: invoicePdf.print_media.file_name,
      };

      await actionLog
        .addDetail(`Document ${ultramsg_client_body.body} sent attempting`)
        .commit();
      const result = await _sendUltraMsgDoc(ultramsg_client_body);
      await actionLog
        .addDetail(`Document Sent Successfully`, result)
        .setStatus("success")
        .setBody(body)
        .commit();

      return result;
    }
  } catch (e: any) {
    //@ts-ignore
    console.error(e?.response || e);
    await actionLog.setStatus("fail", e).setBody(event.body).commit();
    throw e;
  }
};

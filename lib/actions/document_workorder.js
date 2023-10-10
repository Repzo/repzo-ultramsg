import Repzo from "repzo";
import { _getPrintMedia, _sendUltraMsgDoc } from "../util.js";
import { v4 as uuid } from "uuid";
export const document_workorder = async (event, options) => {
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
  let clientPhoneNumber = "";
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
    let client = await repzo.client.get(body.client);
    if (options.data.workorders.recipientType === "Cell Phone") {
      if (typeof client.cell_phone !== "string" || !client.cell_phone) {
        await actionLog
          .setStatus("fail")
          .addDetail(
            `Repzo Ultramsg: Error ${
              body === null || body === void 0 ? void 0 : body.client_name
            } does not have a cellphone`
          )
          .commit();
        throw `Repzo Ultramsg: Error ${
          body === null || body === void 0 ? void 0 : body.client_name
        } does not have a cellphone`;
      } else clientPhoneNumber = client.cell_phone;
    }
    if (options.data.workorders.recipientType === "Phone") {
      if (typeof client.phone !== "string" || !client.phone) {
        await actionLog
          .setStatus("fail")
          .addDetail(
            `Repzo Ultramsg: Error ${
              body === null || body === void 0 ? void 0 : body.client_name
            } does not have a phone`
          )
          .commit();
        throw `Repzo Ultramsg: Error ${
          body === null || body === void 0 ? void 0 : body.client_name
        } does not have a phone`;
      } else clientPhoneNumber = client.phone;
    }
    if (clientPhoneNumber.trim() == "") {
      await actionLog
        .setStatus("fail")
        .addDetail(
          `Repzo Ultramsg: Error ${
            body === null || body === void 0 ? void 0 : body.client_name
          } does not have contact info`
        )
        .commit();
      throw `Repzo Ultramsg: Error ${
        body === null || body === void 0 ? void 0 : body.client_name
      } does not have contact info`;
    }
    let convertWorkorderToPdf;
    try {
      convertWorkorderToPdf = await repzo.quickConvertToPdf.create({
        document_id: [body._id],
        document_type: "workorder",
        sync_id: body.sync_id,
      });
    } catch (e) {
      await actionLog
        .setStatus("fail")
        .addDetail(`Repzo Ultramsg: Error in converting work order to pdf`)
        .commit();
      throw e;
    }
    if (
      !convertWorkorderToPdf._id ||
      convertWorkorderToPdf._id.trim() == "" ||
      convertWorkorderToPdf.state === "failed"
    ) {
      throw `Repzo Ultramsg: Error, failed to convert work order to pdf`;
    }
    let workorderPdf;
    try {
      workorderPdf = await _getPrintMedia(convertWorkorderToPdf._id, repzo);
    } catch (e) {
      await actionLog
        .setStatus("fail")
        .addDetail(`Repzo Ultramsg:  Error, failed to fetch work order pdf`)
        .commit();
      throw e;
    }
    if (
      typeof workorderPdf.print_media !== "string" &&
      workorderPdf.print_media
    ) {
      if (
        !workorderPdf.print_media.publicUrl ||
        typeof workorderPdf.print_media.publicUrl !== "string"
      )
        throw `Repzo Ultramsg: Error,work order document not found `;
      if (
        !workorderPdf.print_media.file_name ||
        typeof workorderPdf.print_media.file_name !== "string"
      )
        throw `Repzo Ultramsg: Error,work order document does not have a file name`;
      await actionLog
        .addDetail(
          `Repzo Ultramsg: Started Sending a Document - ${
            (_c =
              body === null || body === void 0
                ? void 0
                : body.serial_number) === null || _c === void 0
              ? void 0
              : _c.formatted
          } `
        )
        .commit();
      const ultramsg_client_body = {
        to: clientPhoneNumber,
        body: options.data.workorders.documentCaption,
        token: options.data.token,
        instanceId: options.data.instanceId,
        document: workorderPdf.print_media.publicUrl,
        fileName: workorderPdf.print_media.file_name,
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
  } catch (e) {
    //@ts-ignore
    console.error((e === null || e === void 0 ? void 0 : e.response) || e);
    await actionLog.setStatus("fail", e).setBody(event.body).commit();
    throw e;
  }
};

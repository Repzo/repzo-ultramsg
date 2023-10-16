import Repzo from "repzo";
import { Service } from "repzo/lib/types";
import { CommandEvent } from "../types";
import { _sendUltraMessage } from "../util.js";

export const join = async (commandEvent: CommandEvent) => {
  const repzo = new Repzo(commandEvent.app.formData?.repzoApiKey, {
    env: commandEvent.env,
  });

  const commandLog = new Repzo.CommandLog(
    repzo,
    commandEvent.app,
    commandEvent.command
  );
  try {
    await commandLog.load(commandEvent.sync_id);
    await commandLog.addDetail("Repzo Ultramsg: Join").commit();

    const body: Service.JoinActionsWeHook.Data = {
      data: [
        // message invoice
        {
          app: "repzo-ultramsg",
          app_id: commandEvent?.app?._id,
          action: "message_invoice",
          event: "invoice.create",
          join:
            commandEvent?.app?.formData?.invoices?.message.messageInvoiceHook ||
            false,
        },

        //document invoice
        {
          app: "repzo-ultramsg",
          app_id: commandEvent?.app?._id,
          action: "document_invoice",
          event: "invoice.create",
          join:
            commandEvent?.app?.formData?.invoices?.document
              .documentInvoiceHook || false,
        },

        //document workorder
        {
          app: "repzo-ultramsg",
          app_id: commandEvent?.app?._id,
          action: "document_workorder",
          event: "workorder.create",
          join:
            commandEvent?.app?.formData?.workorders?.documentWorkorderHook ||
            false,
        },

        //document salesorder
        {
          app: "repzo-ultramsg",
          app_id: commandEvent?.app?._id,
          action: "document_salesorder",
          event: "salesorder.create",
          join:
            commandEvent?.app?.formData?.salesorders?.document
              .documentSalesorderHook || false,
        },

        //message salesorder
        {
          app: "repzo-ultramsg",
          app_id: commandEvent?.app?._id,
          action: "message_salesorder",
          event: "salesorder.create",
          join:
            commandEvent?.app?.formData?.salesorders?.message
              .messageSalesorderHook || false,
        },
        //message payment
        {
          app: "repzo-ultramsg",
          app_id: commandEvent?.app?._id,
          action: "message_payment",
          event: "payment.create",
          join:
            commandEvent?.app?.formData?.payments.messagePaymentHook || false,
        },
        //message refund
        {
          app: "repzo-ultramsg",
          app_id: commandEvent?.app?._id,
          action: "message_refund",
          event: "refund.create",
          join: commandEvent?.app?.formData?.refunds.messageRefundHook || false,
        },
        //message visit
        {
          app: "repzo-ultramsg",
          app_id: commandEvent?.app?._id,
          action: "message_visit",
          event: "visit.end",
          join: commandEvent?.app?.formData?.visits.messageVisitHook || false,
        },
      ],
    };

    const result = await repzo.joinActionsWebHook.update(null, body);

    if (result?.status == "failure") {
      await commandLog.setStatus("fail", result.error).setBody(result).commit();
      return;
    }

    await commandLog.setStatus("success").setBody(result).commit();
  } catch (e: any) {
    //@ts-ignore
    console.error(e?.response?.data || e);
    await commandLog.setStatus("fail", e).commit();
    throw e;
  }
};

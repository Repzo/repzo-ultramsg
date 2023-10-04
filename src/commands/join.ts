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
            commandEvent?.app?.formData?.invoices?.messageInvoiceHook || false,
        },

        //document invoice
        {
          app: "repzo-ultramsg",
          app_id: commandEvent?.app?._id,
          action: "document_invoice",
          event: "invoice.create",
          join:
            commandEvent?.app?.formData?.invoices?.documentInvoiceHook || false,
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

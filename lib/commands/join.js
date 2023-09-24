import Repzo from "repzo";
export const join = async (commandEvent) => {
  var _a, _b, _c, _d, _e, _f;
  const repzo = new Repzo(
    (_a = commandEvent.app.formData) === null || _a === void 0
      ? void 0
      : _a.repzoApiKey,
    {
      env: commandEvent.env,
    }
  );
  const commandLog = new Repzo.CommandLog(
    repzo,
    commandEvent.app,
    commandEvent.command
  );
  try {
    await commandLog.load(commandEvent.sync_id);
    await commandLog.addDetail("Repzo Ultramsg: Join").commit();
    const body = {
      data: [
        // message invoice
        {
          app: "repzo-ultramsg",
          app_id:
            (_b =
              commandEvent === null || commandEvent === void 0
                ? void 0
                : commandEvent.app) === null || _b === void 0
              ? void 0
              : _b._id,
          action: "message_invoice",
          event: "invoice.create",
          join:
            ((_e =
              (_d =
                (_c =
                  commandEvent === null || commandEvent === void 0
                    ? void 0
                    : commandEvent.app) === null || _c === void 0
                  ? void 0
                  : _c.formData) === null || _d === void 0
                ? void 0
                : _d.invoices) === null || _e === void 0
              ? void 0
              : _e.messageInvoiceHook) || false,
        },
      ],
    };
    const result = await repzo.joinActionsWebHook.update(null, body);
    if (
      (result === null || result === void 0 ? void 0 : result.status) ==
      "failure"
    ) {
      await commandLog.setStatus("fail", result.error).setBody(result).commit();
      return;
    }
    await commandLog.setStatus("success").setBody(result).commit();
  } catch (e) {
    //@ts-ignore
    console.error(
      ((_f = e === null || e === void 0 ? void 0 : e.response) === null ||
      _f === void 0
        ? void 0
        : _f.data) || e
    );
    await commandLog.setStatus("fail", e).commit();
    throw e;
  }
};

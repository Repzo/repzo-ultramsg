import Repzo from "repzo";
export const join = async (commandEvent) => {
  var _a,
    _b,
    _c,
    _d,
    _e,
    _f,
    _g,
    _h,
    _j,
    _k,
    _l,
    _m,
    _o,
    _p,
    _q,
    _r,
    _s,
    _t,
    _u,
    _v,
    _w,
    _x;
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
              : _e.message.messageInvoiceHook) || false,
        },
        //document invoice
        {
          app: "repzo-ultramsg",
          app_id:
            (_f =
              commandEvent === null || commandEvent === void 0
                ? void 0
                : commandEvent.app) === null || _f === void 0
              ? void 0
              : _f._id,
          action: "document_invoice",
          event: "invoice.create",
          join:
            ((_j =
              (_h =
                (_g =
                  commandEvent === null || commandEvent === void 0
                    ? void 0
                    : commandEvent.app) === null || _g === void 0
                  ? void 0
                  : _g.formData) === null || _h === void 0
                ? void 0
                : _h.invoices) === null || _j === void 0
              ? void 0
              : _j.document.documentInvoiceHook) || false,
        },
        //document workorder
        {
          app: "repzo-ultramsg",
          app_id:
            (_k =
              commandEvent === null || commandEvent === void 0
                ? void 0
                : commandEvent.app) === null || _k === void 0
              ? void 0
              : _k._id,
          action: "document_workorder",
          event: "workorder.create",
          join:
            ((_o =
              (_m =
                (_l =
                  commandEvent === null || commandEvent === void 0
                    ? void 0
                    : commandEvent.app) === null || _l === void 0
                  ? void 0
                  : _l.formData) === null || _m === void 0
                ? void 0
                : _m.workorders) === null || _o === void 0
              ? void 0
              : _o.documentWorkorderHook) || false,
        },
        //document salesorder
        {
          app: "repzo-ultramsg",
          app_id:
            (_p =
              commandEvent === null || commandEvent === void 0
                ? void 0
                : commandEvent.app) === null || _p === void 0
              ? void 0
              : _p._id,
          action: "document_salesorder",
          event: "salesorder.create",
          join:
            ((_s =
              (_r =
                (_q =
                  commandEvent === null || commandEvent === void 0
                    ? void 0
                    : commandEvent.app) === null || _q === void 0
                  ? void 0
                  : _q.formData) === null || _r === void 0
                ? void 0
                : _r.salesorders) === null || _s === void 0
              ? void 0
              : _s.document.documentSalesorderHook) || false,
        },
        //message salesorder
        {
          app: "repzo-ultramsg",
          app_id:
            (_t =
              commandEvent === null || commandEvent === void 0
                ? void 0
                : commandEvent.app) === null || _t === void 0
              ? void 0
              : _t._id,
          action: "message_salesorder",
          event: "salesorder.create",
          join:
            ((_w =
              (_v =
                (_u =
                  commandEvent === null || commandEvent === void 0
                    ? void 0
                    : commandEvent.app) === null || _u === void 0
                  ? void 0
                  : _u.formData) === null || _v === void 0
                ? void 0
                : _v.salesorders) === null || _w === void 0
              ? void 0
              : _w.message.messageSalesorderHook) || false,
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
      ((_x = e === null || e === void 0 ? void 0 : e.response) === null ||
      _x === void 0
        ? void 0
        : _x.data) || e
    );
    await commandLog.setStatus("fail", e).commit();
    throw e;
  }
};

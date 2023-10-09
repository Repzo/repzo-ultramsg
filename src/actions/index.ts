import { Config, Action } from "../types";
import { message_invoice } from "./message_invoice.js";
import { document_workorder } from "./document_workorder.js";
import { document_invoice } from "./document_invoice.js";
import { document_salesorder } from "./document_salesorder.js";
import { message_salesorder } from "./message_salesorder.js";
export const actions = async (event: any, options: Config) => {
  switch (event.queryStringParameters?.action) {
    case "message_invoice":
      return await message_invoice(event, options);
    case "document_workorder":
      return await document_workorder(event, options);
    case "document_invoice":
      return await document_invoice(event, options);
    case "document_salesorder":
      return await document_salesorder(event, options);
    case "message_salesorder":
      return await message_salesorder(event, options);
    default:
      throw `Route: ${event.queryStringParameters?.action} not found`;
  }
};

export const actionsList: Action[] = [
  {
    action: "message_invoice",
    name: "message invoice",
    description:
      "Send a message about total invoice amount to client's cellphone.",
  },
  {
    action: "document_invoice",
    name: "document invoice",
    description:
      "Send a document that contains invoice details to client's cellphone.",
  },
  {
    action: "document_workorder",
    name: "document workorder",
    description:
      "Send a document that contains work order updates to client's cellphone.",
  },
  {
    action: "document_salesorder",
    name: "document salesorder",
    description:
      "Send a document that contains sales order updates to client's cellphone.",
  },
  {
    action: "message_salesorder",
    name: "message salesorder",
    description:
      "Send a message about total sales order amount to client's cellphone.",
  },
];

import { Config, Action } from "../types";
import { message_invoice } from "./message_invoice.js";

export const actions = async (event: any, options: Config) => {
  switch (event.queryStringParameters?.action) {
    case "message_invoice":
      return await message_invoice(event, options);

    default:
      throw `Route: ${event.queryStringParameters?.action} not found`;
  }
};

export const actionsList: Action[] = [
  {
    action: "message_invoice",
    name: "message invoice",
    description: "send message about invoice details to client cellphone.",
  },
];

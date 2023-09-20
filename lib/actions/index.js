import { message_invoice } from "./message_invoice.js";
export const actions = async (event, options) => {
    var _a, _b;
    switch ((_a = event.queryStringParameters) === null || _a === void 0 ? void 0 : _a.action) {
        case "message_invoice":
            return await message_invoice(event, options);
        default:
            throw `Route: ${(_b = event.queryStringParameters) === null || _b === void 0 ? void 0 : _b.action} not found`;
    }
};
export const actionsList = [
    {
        action: "message_invoice",
        name: "message invoice",
        description: "message invoice ..",
    },
];

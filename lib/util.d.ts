import { ultraMsgSendData, ultraMsgSendDoc } from "./types";
import { Service } from "repzo/src/types";
import Repzo from "repzo";
export declare const _sendUltraMessage: (
  data: ultraMsgSendData
) => Promise<any>;
export declare const _sendUltraMsgDoc: (data: ultraMsgSendDoc) => Promise<any>;
export declare const sleep: (s: number) => Promise<unknown>;
export declare const _getPrintMedia: (
  pdfId: string,
  repzo: Repzo
) => Promise<Service.QuickConvertToPdf.QuickConvertToPdfSchema>;

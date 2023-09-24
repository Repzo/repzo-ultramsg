import { Command, CommandEvent } from "./../types";
export declare const commands: (CommandEvent: CommandEvent) => Promise<void>;
export declare const commandsList: Command[];

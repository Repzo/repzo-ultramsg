import { Command, CommandEvent } from "./../types";

import { join } from "./join.js";

export const commands = async (CommandEvent: CommandEvent) => {
  switch (CommandEvent.command) {
    case "join":
      return await join(CommandEvent);

    default:
      throw `Route: ${CommandEvent.command} not found`;
  }
};

export const commandsList: Command[] = [
  {
    command: "join",
    name: "Join",
    description: "",
  },
];

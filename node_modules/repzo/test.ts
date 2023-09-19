import Repzo from "./src/index.js";
let repzo = new Repzo("");
let clients = repzo.client.find({ search: "Mecca" });
console.log(clients);
repzo.client.create({ name: "kf" });
repzo.headers["ho"] = "faf";
repzo.client.update("", {});
// repzo.

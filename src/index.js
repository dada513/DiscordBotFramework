import * as config from "../config.json";
import * as lang from "../lang.json";
import * as sql from "./sql";
import { parse } from "discord-command-parser";
import Discord, { Message } from "discord.js";
import fs from "fs-extra";
import path from "path";

const commands = {};
const eventBank = { onready: [] };

const client = new Discord.Client();

export class Plugin {
  constructor() {
    this.client = client;
  }

  /**
   *
   * @param {string} cmd
   * @param {CommandCB} exec
   */
  addCommand(cmd, exec) {
    commands[cmd] = exec;
  }

  onReady(exec) {
    eventBank.onready.push(exec);
  }
}

/**
 * MessageListener
 * @callback CommandCB
 * @param {Message} message
 * @param {any} parsed
 */

const files = fs.readdirSync(path.join(__dirname, "plugins"));
files.forEach((file) => {
  const plugin = require("./plugins/" + file);
  new plugin.default();
});

client.once("ready", async () => {
  eventBank.onready.forEach((exec) => exec());
  const f = await fs.readFile("./banner.txt", "utf8");
  f.split("\n").forEach((line) => console.log(line));
  console.log(`BOT LISTENING`);
});

client.on("message", async (message) => {
  const prefix = await sql.getPrefix();
  const parsed = parse(message, prefix);
  if (!parsed.success) return;
  if (commands[parsed.command]) {
    commands[parsed.command](message, parsed);
  } else {
    return message.channel.send(lang.nosuchcommand);
  }
});

client.login(config.token);

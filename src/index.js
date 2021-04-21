import * as lang from "../lang.json";
import { parse } from "discord-command-parser";
import Discord, { Message } from "discord.js";
import fs from "fs-extra";
import path from "path";
import mongoose from "mongoose";
// import "./models/something.js"

mongoose.connect(process.env.MONGO, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
});

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

const dirs = fs.readdirSync(path.join(__dirname, "plugins"));
dirs.forEach((dir) => {
  const plugin = require(`./plugins/${dir}/${dir}.js`);
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

client.login(process.env.TOKEN);

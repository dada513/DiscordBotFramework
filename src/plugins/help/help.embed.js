import { MessageEmbed } from "discord.js";

const embed = new MessageEmbed();
embed
  .setAuthor("nazwa bota")
  .setTitle("Command list")
  .addField(";help", "shows this message");

export default embed;

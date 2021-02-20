import { Plugin } from "../../index";
import helpEmbed from "./help.embed";

export default class HelpCommand extends Plugin {
  constructor() {
    super();
    console.log("Loading Help Module");

    this.addCommand("help", async (message) => {
      message.channel.send(helpEmbed);
    });
  }
}

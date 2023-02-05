const { MessageEmbed } = require("discord.js");

module.exports = {
    name: "ping",
    category: "Information",
    description: "Check Ping Bot",
    args: false,
    usage: "",
    permission: [],
    owner: false,
    execute: async (message, args, client, prefix) => {
      
  await message.reply({ content: "Pinging..." }).then(async (msg) => {
  const api_ping = client.ws.ping;
  
  const PingEmbed = new MessageEmbed()
    .setAuthor({ name: "Pong"})
    .addField("API Latency", `\`[ ${api_ping}ms ]\``, true)

  await msg.edit({
    embeds: [PingEmbed]
  })
 })
 }
}
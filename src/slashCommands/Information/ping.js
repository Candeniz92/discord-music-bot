const { MessageEmbed, CommandInteraction, Client } = require("discord.js")

module.exports = {
    name: "ping",
    description: "return websocket ping",

    /**
     * @param {Client} client 
     * @param {CommandInteraction} interaction 
     */

    run: async (client, interaction) => {
        await interaction.deferReply({
            ephemeral: false
        });
        const api_ping = client.ws.ping;
        await interaction.editReply({
            embeds: [new MessageEmbed().setAuthor({ name: "Pong"})
            .addField("API Latency", `\`[ ${api_ping}ms ]\``, true)]
        });
    }
			}
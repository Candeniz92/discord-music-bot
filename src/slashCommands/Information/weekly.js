const { MessageEmbed, CommandInteraction, Client } = require("discord.js");
const playlistSchema = require('../../models/playlist');

module.exports = {
    name: "weekly",
    description: "Weekly Playlist",

    /**
     * @param {Client} client 
     * @param {CommandInteraction} interaction 
     */

    run: async (client, interaction) => {
        await interaction.deferReply({
            ephemeral: false
        });
        let schemadata = await playlistSchema.findOne({name: 'spotify'})
        const embed = new MessageEmbed()
            .setAuthor({ name: "Weekly Playlist"})
            .setDescription(`This week playlist: [Click Here](${schemadata.url})`)
        await interaction.editReply({ embeds: [embed] });
    }
}
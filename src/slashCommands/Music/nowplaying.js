const { MessageEmbed, CommandInteraction, Client } = require("discord.js")
const { convertTime } = require('../../utils/convert.js');

module.exports = {
    name: "nowplaying",
    description: "Show now playing song",
    permissions: [],
    player: true,
    inVoiceChannel: false,
    sameVoiceChannel: false,
    /**
     * @param {Client} client 
     * @param {CommandInteraction} interaction 
     */

    run: async (client, interaction) => {
        await interaction.deferReply({
          ephemeral: false
        });
         const player = interaction.client.manager.get(interaction.guildId);

        if (!player.queue.current) {
            let thing = new MessageEmbed()
                .setColor("RED")
                .setDescription("There is no music playing.");
            return interaction.editReply({embeds: [thing]});
        }

        const song = player.queue.current
        var total = song.duration;
        var current = player.position;

        let embed = new MessageEmbed()
            .setAuthor({ name: `Now Playing`})
            .setDescription(`[${song.title}](${song.uri}) [${song.requester}] \n \`${convertTime(current)} / ${convertTime(total)}\` `)
         return interaction.editReply({embeds: [embed]})
            
    }
};

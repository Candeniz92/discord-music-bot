const { MessageEmbed } = require("discord.js");
const { convertTime } = require('../../utils/convert.js');

module.exports = {
    name: "nowplaying",
    aliases: ["np"],
    category: "Music",
    description: "Show now playing song",
    args: false,
    usage: "",
    permission: [],
    owner: false,
    player: true,
    inVoiceChannel: false,
    sameVoiceChannel: false,
execute: async (message, args, client, prefix) => {
  
        const player = message.client.manager.get(message.guild.id);

        if (!player.queue.current) {
            let thing = new MessageEmbed()
                .setColor("RED")
                .setDescription("There is no music playing.");
            return message.channel.send({embeds: [thing]});
        }
        const song = player.queue.current
        var total = song.duration;
        var current = player.position;
        
        let embed = new MessageEmbed()
            .setAuthor({ name: `Now Playing`})
            .setDescription(`[${song.title}](${song.uri}) [${song.requester}] \n \`${convertTime(current)} / ${convertTime(total)}\` `)
            return message.channel.send({embeds: [embed]})

    }
}

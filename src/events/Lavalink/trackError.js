const { MessageEmbed } = require('discord.js');

module.exports = async (player, track, payload) => {
    console.error(payload.error);
    const channel = client.channels.cache.get(player.textChannel);
    const thing = new MessageEmbed()
      .setColor("RED").setDescription("❌ Error when loading song! Track is error");
    channel.send({embeds: [thing]});
    console.log(`Error when loading song! Track is error in [${player.guild}]`);
    if (!player.voiceChannel) player.destroy();
}

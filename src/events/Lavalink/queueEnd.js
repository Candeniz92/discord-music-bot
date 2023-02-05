const { MessageEmbed } = require('discord.js');

module.exports = async (player) => {
      player.destroy();
      player.queue.clear()
      const embed = new MessageEmbed()
      .setDescription("I left the channel because the music queue is over")
      client.channels.cache.get(player.textChannel).send({ embeds: [embed]});
}

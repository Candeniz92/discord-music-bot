const { CommandInteraction, Client, MessageEmbed } = require("discord.js");

module.exports = {
  name: "skip",
  description: "To skip a song/track from the queue.",
  permissions: [],
  player: true,
  inVoiceChannel: true,
  sameVoiceChannel: true,

  /**
   * @param {Client} client 
   * @param {CommandInteraction} interaction 
   * @param {String} color 
   */

  run: async (client, interaction) => {
    await interaction.deferReply({
      ephemeral: false
    });

    const player = client.manager.get(interaction.guildId);

    if (player && player.state !== "CONNECTED") {
      player.destroy();
      return await interaction.editReply({
        embeds: [new MessageEmbed().setDescription(`Nothing is playing right now.`)]
      }).catch(() => { });
    };
    if (!player.queue) return await interaction.editReply({
      embeds: [new MessageEmbed().setDescription("Nothing is playing right now.")]
    }).catch(() => { });
    if (!player.queue.current) return await interaction.editReply({
      embeds: [new MessageEmbed().setDescription("Nothing is playing right now.")]
    }).catch(() => { });

    if (!player.queue.size) return await interaction.editReply({
      embeds: [new MessageEmbed().setDescription("No songs left in the queue to skip.")]
    }).catch(() => { });

    return player.stop();
  }
}

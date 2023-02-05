const { MessageEmbed, CommandInteraction, Client } = require("discord.js")

module.exports = {
  name: "stop",
  description: "Stops the music",
  permissions: [],
  player: true,
  inVoiceChannel: true,
  sameVoiceChannel: true,

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
      return interaction.editReply({ embeds: [thing] });
    }

    player.stop();
    player.queue.clear();

    return interaction.editReply("Stopped the music");

  }
};

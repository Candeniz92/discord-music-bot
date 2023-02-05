const { MessageEmbed, CommandInteraction, Client } = require("discord.js")

module.exports = {
  name: "pause",
  description: "Pause the currently playing music",
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

    if (player.paused) {
      let thing = new MessageEmbed()
        .setColor("RED")
        .setDescription(`The player is already paused.`)
      return interaction.editReply({ embeds: [thing] });
    }

    player.pause(true);

    const song = player.queue.current;

    let thing = new MessageEmbed()
      .setDescription(`**Paused**\n[${song.title}](${song.uri})`)
    return interaction.editReply({ embeds: [thing] });

  }
};

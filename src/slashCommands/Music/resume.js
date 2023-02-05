const { MessageEmbed, CommandInteraction, Client } = require("discord.js")

module.exports = {
  name: "resume",
  description: "Resume currently playing music",
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
    const song = player.queue.current;

    if (!player.queue.current) {
      let thing = new MessageEmbed()
        .setColor("RED")
        .setDescription("There is no music playing.");
      return interaction.editReply({ embeds: [thing] });
    }

    if (!player.paused) {
      let thing = new MessageEmbed()
        .setColor("RED")
        .setDescription(`The player is already **resumed**.`)
      return interaction.editReply({ embeds: [thing] });
    }

    player.pause(false);

    let thing = new MessageEmbed()
      .setDescription(`**Resumed**\n[${song.title}](${song.uri})`)
    return interaction.editReply({ embeds: [thing] });

  }
};

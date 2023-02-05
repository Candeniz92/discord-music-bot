const { MessageEmbed, CommandInteraction, Client, Permissions } = require("discord.js")

module.exports = {
  name: "join",
  description: "Join voice channel",
  permissions: [],
  player: false,
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
    let player = interaction.client.manager.get(interaction.guildId);
    if (player && player.voiceChannel && player.state === "CONNECTED") {
      return await interaction.editReply({ embeds: [new MessageEmbed().setDescription(`I'm already connected to <#${player.voiceChannel}> voice channel!`)] })
    } else {
      if (!interaction.guild.me.permissions.has([Permissions.FLAGS.CONNECT, Permissions.FLAGS.SPEAK])) return interaction.editReply({ embeds: [new MessageEmbed().setDescription(`I don't have enough permissions to execute this command! please give me permission \`CONNECT\` or \`SPEAK\`.`)] });
      const { channel } = interaction.member.voice;
      if (!interaction.guild.me.permissionsIn(channel).has([Permissions.FLAGS.CONNECT, Permissions.FLAGS.SPEAK])) return interaction.editReply({ embeds: [new MessageEmbed().setDescription(`I don't have enough permissions connect your vc please give me permission \`CONNECT\` or \`SPEAK\`.`)] });
      if (!interaction.guild.me.permissions.has([Permissions.FLAGS.CONNECT, Permissions.FLAGS.SPEAK])) return interaction.editReply({ embeds: [new MessageEmbed().setDescription(`I don't have enough permissions to execute this command.`)] });

      player = client.manager.create({
        guild: interaction.guildId,
        textChannel: interaction.channelId,
        voiceChannel: interaction.member.voice.channelId,
        selfDeafen: true,
        volume: 80
      })
      if (player && player.state !== "CONNECTED") player.connect();

      let thing = new MessageEmbed()
        .setDescription(`Joined <#${channel.id}> and <#${interaction.channel.id}>`)
      return interaction.editReply({ embeds: [thing] });

    };

  }
};

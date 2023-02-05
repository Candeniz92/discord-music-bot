const { CommandInteraction, Client, MessageEmbed, Permissions } = require("discord.js");
const { convertTime } = require('../../utils/convert.js');
const SpotifyWebApi = require('spotify-web-api-node');
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFYID,
  clientSecret: process.env.SPOTIFYSECRET,
});

const spotifySchema = require('../../models/spotify');

module.exports = {
  name: "play",
  description: "To play some song.",
  player: false,
  inVoiceChannel: true,
  sameVoiceChannel: true,
  options: [
    {
      name: "input",
      description: "The search input (name/url)",
      required: true,
      type: "STRING"
    }
  ],

  /**
   * @param {Client} client
   * @param {CommandInteraction} interaction
   */

  run: async (client, interaction,) => {
    await interaction.deferReply({
      ephemeral: false
    });
    if (!interaction.guild.me.permissions.has([Permissions.FLAGS.CONNECT, Permissions.FLAGS.SPEAK])) return interaction.editReply({ embeds: [new MessageEmbed().setDescription(`I don't have enough permissions to execute this command! please give me permission \`CONNECT\` or \`SPEAK\`.`)] });
    const { channel } = interaction.member.voice;
    if (!interaction.guild.me.permissionsIn(channel).has([Permissions.FLAGS.CONNECT, Permissions.FLAGS.SPEAK])) return interaction.editReply({ embeds: [new MessageEmbed().setDescription(`I don't have enough permissions connect your vc please give me permission \`CONNECT\` or \`SPEAK\`.`)] });

    let spotifyschemadata = await spotifySchema.findOne({settingsName: 'spotify'})
    spotifyApi.setAccessToken(spotifyschemadata.spotifyAccessToken);

    let sonuc;
    let arama = interaction.options.getString("input");

    let res;

    let player = client.manager.create({
      guild: interaction.guildId,
      textChannel: interaction.channelId,
      voiceChannel: interaction.member.voice.channelId,
      selfDeafen: true,
      volume: 100
    });

    if (player.state != "CONNECTED") await player.connect();
    // spotifyApi.searchTracks(`${arama}`)
    //   .then(async function(data) {
    //     const parca = data.body.tracks.items[0];
    //     if (arama.includes('spotify.com/track/')) {
    //       sonuc = arama
    //     } else { sonuc = parca.external_urls.spotify;
    //     }

    try {
      res = await player.search(arama);
      if (res.loadType === "LOAD_FAILED") {
        if (!player.queue.current) player.destroy();
        return await interaction.editReply({ embeds: [new MessageEmbed().setDescription(`:x: | **There was an error while searching**`)] });
      }
    } catch (err) {
      console.log(err)
    }
    switch (res.loadType) {
      case "NO_MATCHES":
        if (!player.queue.current) player.destroy();
        return await interaction.editReply({ embeds: [new MessageEmbed().setDescription("❌ | **No results were found.**")] });

      case "TRACK_LOADED":
        player.queue.add(res.tracks[0], interaction.user);
        if (!player.playing && !player.paused && !player.queue.length)
          player.play();
        const trackload = new MessageEmbed()
          .setDescription(`**Added song to queue** [${res.tracks[0].title}](${res.tracks[0].uri}) - \`[${convertTime(res.tracks[0].duration)}]\``);
        return await interaction.editReply({ embeds: [trackload] });

        case 'PLAYLIST_LOADED':
          player.queue.add(res.tracks);
          if (!player.playing && !player.paused && player.queue.totalSize === res.tracks.length) player.play();
          const thing = new MessageEmbed()
            .setDescription(`**Added song to queue**\n${res.tracks.length} Songs [${res.playlist.name}]`)
          return await interaction.editReply({ embeds: [thing] });

        case 'SEARCH_RESULT':
          var track = res.tracks[0];
          player.queue.add(track);
          if (!player.playing && !player.paused && !player.queue.size) {
            return player.play();
          } else {
            const thing = new MessageEmbed()
              .setDescription(`**Added song to queue**\n[${track.title}](${track.uri})`)
            return await interaction.editReply({ embeds: [thing] });
          }
    }
  // })
  }
}


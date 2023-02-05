const { MessageEmbed, Permissions } = require("discord.js");
const { convertTime } = require('../../utils/convert.js');
const SpotifyWebApi = require('spotify-web-api-node');
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFYID,
  clientSecret: process.env.SPOTIFYSECRET,
});

const spotifySchema = require('../../models/spotify');

module.exports = {
  name: "play",
  category: "Music",
  aliases: ["p"],
  description: "Plays audio from YouTube or Soundcloud",
  args: true,
  usage: "Please enter a song name or <youtube | soundcloud | spotify url>",
  permission: [],
  owner: false,
  player: false,
  inVoiceChannel: true,
  sameVoiceChannel: true,
  execute: async (message, args, client, prefix) => {
    if (!message.guild.me.permissions.has([Permissions.FLAGS.CONNECT, Permissions.FLAGS.SPEAK])) return message.channel.send({ embeds: [new MessageEmbed().setDescription(`I don't have enough permissions to execute this command! please give me permission \`CONNECT\` or \`SPEAK\`.`)] });
    const { channel } = message.member.voice;
    if (!message.guild.me.permissionsIn(channel).has([Permissions.FLAGS.CONNECT, Permissions.FLAGS.SPEAK])) return message.channel.send({ embeds: [new MessageEmbed().setDescription(`I don't have enough permissions connect your vc please give me permission \`CONNECT\` or \`SPEAK\`.`)] });
    
    let spotifyschemadata = await spotifySchema.findOne({settingsName: 'spotify'})
    spotifyApi.setAccessToken(spotifyschemadata.spotifyAccessToken);

    const player = client.manager.create({
      guild: message.guild.id,
      voiceChannel: message.member.voice.channel.id,
      textChannel: message.channel.id,
      selfDeafen: true,
      volume: 100,
    });

    if (player.state != "CONNECTED") await player.connect();
    let sonuc;
    let arama = args.join(' ');
    
    // spotifyApi.searchTracks(`${arama}`)
    //   .then(async function(data) {
    //     const parca = data.body.tracks.items[0];
    //     if (arama.includes('spotify.com/track/')) {
    //       sonuc = arama
    //     } else { sonuc = parca.external_urls.spotify;
    //     }
        
    let res;

    try {
      res = await player.search(arama, message.author); //sonuc
      if (!player)
        return message.channel.send({ embeds: [new MessageEmbed().setDescription("Nothing is playing right now...")] });
      if (res.loadType === 'LOAD_FAILED') {
        if (!player.queue.current) player.destroy();
        throw res.exception;
      }
    } catch (err) {
      return message.reply(`there was an error while searching: ${err.message}`);
    }

    switch (res.loadType) {
      case 'NO_MATCHES':
        if (!player.queue.current) player.destroy();
        return message.channel.send({ embeds: [new MessageEmbed()].setDescription(`No matches found for - ${arama}`) });

      case 'TRACK_LOADED':
        var track = res.tracks[0];
        player.queue.add(track);
        if (!player.playing && !player.paused && !player.queue.size) {
          return player.play();
        } else {
          const thing = new MessageEmbed()
            .setDescription(`**Added song to queue**\n[${track.title}](${track.uri})`)
          return message.channel.send({ embeds: [thing] });
        }

        case 'PLAYLIST_LOADED':
          player.queue.add(res.tracks);
          if (!player.playing && !player.paused && player.queue.totalSize === res.tracks.length) player.play();
          const thing = new MessageEmbed()
            .setDescription(`**Added song to queue**\n${res.tracks.length} Songs [${res.playlist.name}]`)
          return message.channel.send({ embeds: [thing] });

        case 'SEARCH_RESULT':
          var track = res.tracks[0];
          player.queue.add(track);
          if (!player.playing && !player.paused && !player.queue.size) {
            return player.play();
          } else {
            const thing = new MessageEmbed()
              .setDescription(`**Added song to queue**\n[${track.title}](${track.uri})`)
            return message.channel.send({ embeds: [thing] });
          }
    }
  // })
  }
}
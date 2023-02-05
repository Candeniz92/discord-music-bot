const { CommandInteraction, Client, MessageEmbed, Permissions } = require("discord.js");

const SpotifyWebApi = require('spotify-web-api-node');
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFYID,
  clientSecret: process.env.SPOTIFYSECRET,
});

const playlistSchema = require('../../models/playlist');
const spotifySchema = require('../../models/spotify');

module.exports = {
  name: "remove",
  description: "Remove track from playlist",
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

  run: async (client, interaction, prefix) => {
    await interaction.deferReply({
        ephemeral: false
      });
      let schemadata = await playlistSchema.findOne({name: 'spotify'})
      let spotifyschemadata = await spotifySchema.findOne({settingsName: 'spotify'})
      spotifyApi.setAccessToken(spotifyschemadata.spotifyAccessToken);

    let arrr = [];
    let data = await spotifyApi.getPlaylist(schemadata.id)
    let tracks = data.body.tracks.items;
      tracks.forEach(item => {
        let playlisttrack = item.track.id;
        arrr.push(playlisttrack);
      });

    let search = interaction.options.getString("input");
    spotifyApi.searchTracks(`${search}`)
    .then(function(data) {
      const track = data.body.tracks.items[0];
      if(arrr.includes(track.id)) {
            var trackss = [{ uri : `spotify:track:${track.id}` }];
            var playlistId = schemadata.id;
            spotifyApi.removeTracksFromPlaylist(playlistId, trackss)
            .then(function(data) {
                interaction.editReply({ embeds: [ new MessageEmbed().setDescription(`**${track.name} - ${track.artists[0].name}** removed from playlist.`)] })
            })
      } else {
        interaction.editReply({ embeds: [ new MessageEmbed().setDescription(`There is no such song in the playlist.`)] })
      }
    })
}
}


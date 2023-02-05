const { MessageEmbed } = require("discord.js");

const SpotifyWebApi = require('spotify-web-api-node');
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFYID,
  clientSecret: process.env.SPOTIFYSECRET,
});

const playlistSchema = require('../../models/playlist');
const spotifySchema = require('../../models/spotify');


module.exports = {
    name: "remove",
    category: "Music",
    description: "Remove track from playlist",
    args: false,
    usage: "Please enter a song name.",
    permission: [],
    owner: false,
    execute: async (message, args, client, prefix) => {
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

        let search = args.join(' ');
        spotifyApi.searchTracks(`${search}`)
        .then(function(data) {
          const track = data.body.tracks.items[0];
          if(arrr.includes(track.id)) {
                var trackss = [{ uri : `spotify:track:${track.id}` }];
                var playlistId = schemadata.id;
                spotifyApi.removeTracksFromPlaylist(playlistId, trackss)
                .then(function(data) {
                    message.channel.send({ embeds: [ new MessageEmbed().setDescription(`**${track.name} - ${track.artists[0].name}** removed from playlist.`)] })
                })
          } else {
            message.channel.send({ embeds: [ new MessageEmbed().setDescription(`There is no such song in the playlist.`)] })
          }
        })
 }
 }
const { MessageEmbed } = require('discord.js');
const SpotifyWebApi = require('spotify-web-api-node');
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFYID,
  clientSecret: process.env.SPOTIFYSECRET,
});


const playlistSchema = require('../../models/playlist');
const spotifySchema = require('../../models/spotify');

module.exports = async (client, player, track, payload) => {
    let schemadata = await playlistSchema.findOne({name: 'spotify'})
    let spotifyschemadata = await spotifySchema.findOne({settingsName: 'spotify'})
    spotifyApi.setAccessToken(spotifyschemadata.spotifyAccessToken);
    
    const thing = new MessageEmbed()
    .setAuthor({ name: `Now Playing`}).setDescription(`[${track.title}](${track.uri}) [${track.requester}]`)
    let NowPlaying = await client.channels.cache.get(player.textChannel).send({ embeds: [thing]});
    player.setNowplayingMessage(NowPlaying);

    let arrr = [];
    let data = await spotifyApi.getPlaylist(schemadata.id)
    let tracks = data.body.tracks.items;
      tracks.forEach(item => {
        let playlisttrack = item.track.id;
        arrr.push(playlisttrack);
      });

    spotifyApi.searchTracks(`${track.author} ${track.title}`)
        .then(function(data) {
          const track = data.body.tracks.items[0];
          if(arrr.includes(track.id)) {
            return;
          } else {
              spotifyApi.addTracksToPlaylist(schemadata.id, [`spotify:track:${track.id}`])
              .then(function(data) {
              console.log('Added tracks to playlist!');
              }, function(err) {
              console.log('Something went wrong!', err);
              });
          }
        })
}
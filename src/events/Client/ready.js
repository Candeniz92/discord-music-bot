const { prefix } = require("../../config.js");
const playlistSchema = require('../../models/playlist');
const moment = require('moment');
const cron = require('node-cron');
const { refreshAllSpotifyAccessTokens } = require('../../utils/func');
const spotifySchema = require('../../models/spotify');

const SpotifyWebApi = require('spotify-web-api-node');
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFYID,
  clientSecret: process.env.SPOTIFYSECRET,
});

module.exports ={
name: "ready",
  run: async (client) => {
    client.manager.init(client.user.id);
    console.log(`Bot online!`);
    client.user.setActivity(`/help | ${prefix}help`, {type: "PLAYING"});

    let spotifyschemadata = await spotifySchema.findOne({settingsName: 'spotify'})
    if(!spotifyschemadata) {
      await spotifySchema.create({ settingsName: 'spotify', spotifyAccessToken: 'null'}).save();
    }
    spotifyApi.setAccessToken(spotifyschemadata.spotifyAccessToken);

    cron.schedule('*/50 * * * *', async () => {
      console.log(`[CRON-LOG] Spotify access token refresh cronjob executed.`);
      await refreshAllSpotifyAccessTokens();
    }, { scheduled: true, timezone: 'Europe/Istanbul' });


    let currentDate = moment().format('YYYY-MM-DD');
    let oldDate = moment().subtract(7,'d').format('YYYY-MM-DD');
    
    // Check Schema
    let schemadata = await playlistSchema.findOne({name: 'spotify'})
     if(!schemadata) {
      await spotifyApi.createPlaylist('Weekly playlist', { 'description': `Weekly Playlist - Date: ${currentDate}`, 'public': true })
      .then(function(data) {
        let plurl = data.body.external_urls.spotify;
        let plid = data.body.id;
        playlistSchema.create({name: 'spotify', url: plurl, id: plid, createdAt: currentDate}).save();
      });
     } else {
       // Checking every days
       cron.schedule('0 0 * * *', async () => {
        if(oldDate === schemadata.createdAt) {
          await spotifyApi.createPlaylist('Weekly playlist', { 'description': `Weekly Playlist - Date: ${currentDate}`, 'public': true })
          .then(async function(dataa) {
            let plurl = dataa.body.external_urls.spotify;
            let plid = dataa.body.id;
            await playlistSchema.findOneAndUpdate(
              { name: 'spotify' }, 
              { $set: { url: plurl, id: plid, createdAt: currentDate, } }
            )
          });
        }
       },
       { scheduled: true, timezone: 'Europe/Istanbul' }
       )
     }
  }
}
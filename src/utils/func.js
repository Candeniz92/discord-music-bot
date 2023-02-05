const axios = require('axios');
const qs = require('qs');
require('dotenv').config();
const spotifySchema = require('../models/spotify');

const getSpotifyCredentials = async () => {
    try {
        return await spotifySchema.findOne({name: 'spotify'})
    } catch (err) {
        console.error(`[ERROR] ${err}`, 'getSpotifyCredentials');
    }
};

const refreshSpotifyAccessToken = async () => {
    try {
        const spotifyCredentials = await getSpotifyCredentials();
        if (!spotifyCredentials) {
            console.error(`[ERROR] Spotify credentials or spotify refresh token not found.`, 'refreshSpotifyAccessToken');
        } else {
            await axios.post(
                'https://accounts.spotify.com/api/token',
                qs.stringify({
                    grant_type: 'refresh_token',
                    refresh_token: process.env.REFRESH_TOKEN,
                    client_id: process.env.SPOTIFYID,
                    client_secret: process.env.SPOTIFYSECRET,
                })
            )
            .then(async (response) => {
                await spotifySchema.findOneAndUpdate(
                    { settingsName: 'spotify' },
                    {
                        $set: {
                            spotifyAccessToken: response.data.access_token,
                        },
                    }
                );
            })
            .catch((err) => {
                console.error(`[POST-ERROR] ${err}`, 'refreshSpotifyAccessToken');
                return false;
            });
        }
    } catch (err) {
        console.error(`[ERROR] ${err}`, 'refreshSpotifyAccessToken');
    }
    return true;
};

const refreshAllSpotifyAccessTokens = async () => {
    try {
        if (await getSpotifyCredentials()) {
            const result = await refreshSpotifyAccessToken();
            if (result) {
                console.log(`[SPOTIFY-TOKEN-LOG] spotify access token refreshed.`);
            } else {
                console.error(`[SPOTIFY-TOKEN-LOG] spotify access token NOT refreshed.`);
            }
        } else {
            console.log(`[SPOTIFY-TOKEN-LOG] spotify settings not found.`);
        }
    } catch (err) {
        console.error(`[ERROR] ${err}`, 'refreshAllSpotifyAccessTokens');
    }
};

module.exports = {
    refreshAllSpotifyAccessTokens,
};
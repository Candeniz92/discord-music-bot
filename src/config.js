require("dotenv").config();

module.exports = {
    token: process.env.TOKEN,
    prefix: process.env.PREFIX,
    ownerID: process.env.OWNERID,
    SpotifyID: process.env.SPOTIFYID, 
    SpotifySecret: process.env.SPOTIFYSECRET,
    mongourl: process.env.MONGO_URI,

    nodes: [
        {
            host: process.env.NODE_HOST,
            port: parseInt(process.env.NODE_PORT),
            password: process.env.NODE_PASSWORD,
            secure: parseBoolean(process.env.NODE_SECURE),
        }
    ],
}

function parseBoolean(value){
    if (typeof(value) === 'string'){
        value = value.trim().toLowerCase();
    }
    switch(value){
        case true:
        case "true":
            return true;
        default:
            return false;
    }
}

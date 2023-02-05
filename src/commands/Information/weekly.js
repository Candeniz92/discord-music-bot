const { MessageEmbed } = require("discord.js");
const playlistSchema = require('../../models/playlist');

module.exports = {
    name: "weekly",
    category: "Information",
    description: "Weekly Playlist",
    args: false,
    usage: "",
    permission: [],
    owner: false,
    execute: async (message, args, client) => {
      let schemadata = await playlistSchema.findOne({name: 'spotify'})
  const embed = new MessageEmbed()
    .setAuthor({ name: "Weekly Playlist"})
    .setDescription(`This week playlist: [Click Here](${schemadata.url})`)

     message.channel.send({ embeds: [embed] })
     
 }
 }
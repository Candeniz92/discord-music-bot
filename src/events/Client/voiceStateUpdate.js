const { MusicBot } = require("../../structures/MusicClient");
const { VoiceState, MessageEmbed } = require("discord.js");
/*
 * @param {MusicBot} client
 * @param {VoiceState} oldState
 * @param {VoiceState} newState
 * @returns {Promise<void>}
 */
module.exports = {
  name: "voiceStateUpdate",
  run: async (client, oldState, newState) => {

  let guildId = newState.guild.id;
  const player = client.manager.get(guildId);


  if (!player || player.state !== "CONNECTED") return;


  const stateChange = {};

  if (oldState.channel === null && newState.channel !== null)
    stateChange.type = "JOIN";
  if (oldState.channel !== null && newState.channel === null)
    stateChange.type = "LEAVE";
  if (oldState.channel !== null && newState.channel !== null)
    stateChange.type = "MOVE";
  if (oldState.channel === null && newState.channel === null) return;
  if (newState.serverMute == true && oldState.serverMute == false)
    return player.pause(true);
  if (newState.serverMute == false && oldState.serverMute == true)
    return player.pause(false);

  if (stateChange.type === "MOVE") {
    if (oldState.channel.id === player.voiceChannel) stateChange.type = "LEAVE";
    if (newState.channel.id === player.voiceChannel) stateChange.type = "JOIN";
  }

  if (stateChange.type === "JOIN") stateChange.channel = newState.channel;
  if (stateChange.type === "LEAVE") stateChange.channel = oldState.channel;

  if (!stateChange.channel || stateChange.channel.id !== player.voiceChannel)
    return;

  stateChange.members = stateChange.channel.members.filter(
    (member) => !member.user.bot
  );

  switch (stateChange.type) {
    case "JOIN":
      if (stateChange.members.size === 1 && player.paused) {
        let emb = new MessageEmbed()
          .setAuthor({name:`Resuming paused queue`})
          .setDescription(
            `Resuming playback because all of you left me with music to play all alone`
          );
        await client.channels.cache.get(player.textChannel).send({embeds: [emb]});

        let msg2 = await client.channels.cache
          .get(player.textChannel)
          .send({embeds: [player.nowPlayingMessage.embeds[0]]});
        player.setNowplayingMessage(msg2);

        player.pause(false);
      }
      break;
    case "LEAVE":
      if (stateChange.members.size === 0 && !player.paused && player.playing) {
        player.pause(true);

        let emb = new MessageEmbed()
          .setAuthor({name: `Paused!`})
          .setDescription(`The player has been paused because everybody left`);
        await client.channels.cache.get(player.textChannel).send({embeds: [emb]});
      }
      break;
  }
 }
};

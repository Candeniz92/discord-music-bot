const { MessageEmbed, Client, Permissions } = require("discord.js")

module.exports = {
    name: "interactionCreate",
    /**
    * @param {Client} client 
    * @param {CommandInteraction} interaction 
    */
    run: async (client, interaction) => {

        let prefix = client.prefix;

        if (interaction.isCommand() || interaction.isContextMenu()) {

            const SlashCommands = client.slashCommands.get(interaction.commandName);
            if (!SlashCommands) return;

            if (SlashCommands.owner && interaction.author.id !== `${client.owner}`) {
                await interaction.editReply({
                    content: `Only Owner can use this command!`
                }).catch(() => { });
            }
            if(interaction.channel.id != process.env.CHANNEL_ID) {
                return await interaction.reply({ content: `You cannot use command this channel.`, ephemeral: true })
            }
            if (!interaction.member.roles.cache.has(process.env.ROLE_ID)) {
                return await interaction.reply({ content: `You cannot use this command.`, ephemeral: true })
            }
            if (!interaction.member.permissions.has(SlashCommands.permissions || [])) {
                return await interaction.reply({ content: `You need this \`${SlashCommands.permissions.join(", ")}\` permission to use this command `, ephemeral: true })
            }
            const player = interaction.client.manager.get(interaction.guildId);
            if (SlashCommands.player && !player) {
                return await interaction.editReply({
                    content: `There is no player for this guild.`, ephemeral: true
                }).catch(() => { });
            }
            if (SlashCommands.inVoiceChannel && !interaction.member.voice.channel) {
                return await interaction.editReply({
                    content: `You must be in a voice channel!`, ephemeral: true
                }).catch(() => { });
            }
            if (SlashCommands.sameVoiceChannel) {
                if (interaction.guild.me.voice.channel) {
                    if (interaction.member.voice.channel !== interaction.guild.me.voice.channel) {
                        return await interaction.reply({
                            content: `You must be in the same channel as ${interaction.client.user}`, ephemeral: true
                        }).catch(() => { });
                    }
                }
            }

            try {
                await SlashCommands.run(client, interaction, prefix);
            } catch (error) {
                if (interaction.replied) {
                    await interaction.editReply({
                        content: `An unexcepted error occured.`
                    }).catch(() => { });
                } else {
                    await interaction.followUp({
                        ephemeral: true,
                        content: `An unexcepted error occured.`
                    }).catch(() => { });
                }
                console.error(error);
            };
        } else return;
    }
};
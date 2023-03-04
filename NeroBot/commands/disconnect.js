const { SlashCommandBuilder } = require("@discordjs/builders");
const { Player } = require("discord-player");
const { ActivityType } = require("discord.js");

module.exports = {
	data: new SlashCommandBuilder()
        .setName("disconnect")
        .setDescription("Disconnect Nero from the voice channel and clear the queue."),
	execute: async (interaction) => {
        const player = Player.singleton();
        // Get the current queue
		const queue = player.nodes.get(interaction.guildId);

		if (queue == null || !queue.connection) {
			await interaction.reply("I have to be connected to be disconnected, Praetor! <:neroSmug:784115410831802378>");
			return;
		}
        // Deletes all the songs from the queue and exits the channel
		queue.delete();
        interaction.client.user.setActivity('her Praetor closely!', {type: ActivityType.Watching});

        await interaction.reply("See you next time, Praetor! <:neroSleep:784437008990470265>");
	},
}
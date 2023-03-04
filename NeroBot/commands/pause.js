const { SlashCommandBuilder } = require("@discordjs/builders");
const { Player } = require("discord-player");

module.exports = {
	data: new SlashCommandBuilder()
        .setName("pause")
        .setDescription("Pause the music player"),
	execute: async (interaction) => {
        const player = Player.singleton();
        // Get the queue for the server
		const queue = player.nodes.get(interaction.guildId);

        // Check if no song is playing
        if (queue == null) {
			await interaction.reply("Nothing is currently playing, Praetor!");
			return;
		} else if (!queue.node.isPlaying()) {
            await interaction.reply("The current track has already been paused, Praetor!");
			return;
        }

        // Pause the current song
		queue.node.pause();

        await interaction.reply("I've paused the player, Praetor! <:umu:473851038592663552>");
	},
}
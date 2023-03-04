const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");
const { Player } = require("discord-player");

module.exports = {
	data: new SlashCommandBuilder()
        .setName("skip")
        .setDescription("Skip the current song"),

	execute: async (interaction) => {
        await interaction.deferReply();

        const player = Player.singleton();
        // Get the queue for the server
		const queue = player.nodes.get(interaction.guildId);

        // If there is no queue, return
		if (queue == null) {
			await interaction.editReply("There is nothing to skip, Praetor!");
			return;
		}

        const currentSong = queue.currentTrack;

        // Skip the current song
		queue.node.skip();

        // Return an embed to the user saying the song has been skipped
        await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setDescription(`${currentSong.title} has been skipped!`)
                    .setThumbnail(currentSong.thumbnail)
                    .setColor('#BF0000')
            ]
        })
	},
}
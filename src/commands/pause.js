const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");
const { Player } = require("discord-player");

module.exports = {
	data: new SlashCommandBuilder()
        .setName("pause")
        .setDescription("Pause the music player"),
	execute: async (interaction) => {
        await interaction.deferReply();

        const player = Player.singleton();
        // Get the queue for the server
		const queue = player.nodes.get(interaction.guildId);

        // Check if no song is playing
        if (queue == null) {
			await interaction.editReply("Nothing is currently playing, Praetor!");
			return;
		} else if (!queue.node.isPlaying()) {
            await interaction.editReply("The music player has already been paused. Resume to continue the queue, Praetor!");
			return;
        }

        const currentSong = queue.currentTrack;

        // Pause the current song
		queue.node.pause();

        await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setDescription(`Paused **[${currentSong.title}](${currentSong.url})**` +
                        `\n\n${queue.node.createProgressBar()}`
                    )
                    .setThumbnail(currentSong.thumbnail)
                    .setColor('#BF0000')
            ]
        });
	},
}
const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");
const { Player } = require("discord-player");

module.exports = {
	data: new SlashCommandBuilder()
        .setName("resume")
        .setDescription("Resume the music player"),
	execute: async (interaction) => {
        await interaction.deferReply();

        const player = Player.singleton();
        // Get the queue for the server
		const queue = player.nodes.get(interaction.guildId);

        // Check if already playing a song
        if (queue == null) {
			await interaction.editReply("There is nothing to resume, Praetor!");
			return;
        } else if (queue.node.isPlaying()) {
            await interaction.editReply("I'm already playing a song, Praetor!");
			return;
		}

        const currentSong = queue.currentTrack;

        // Pause the current song
		queue.node.resume();

        await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setDescription(`Resumed **[${currentSong.title}](${currentSong.url})**` +
                        `\n\n${queue.node.createProgressBar()}`
                    )
                    .setThumbnail(currentSong.thumbnail)
                    .setColor('#BF0000')
            ]
        });
	},
}
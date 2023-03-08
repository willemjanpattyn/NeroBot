const { EmbedBuilder, Interaction, SlashCommandBuilder } = require("discord.js");
const { Player } = require("discord-player");

module.exports = {
	data: new SlashCommandBuilder()
        .setName("skip")
        .setDescription("Skip the current song")
        .addIntegerOption(option => 
            option
                .setName("to")
                .setDescription("Skip directly to track number in the queue")
                .setMinValue(1)
            ),
    /**
   * @param { Interaction } interaction
   */
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
        let index = interaction.options.getInteger('to');

        if (index != null) {
            let nextTrack = queue.tracks.at(index - 1);
            if (nextTrack != null) {
                queue.node.skipTo(nextTrack);
                await interaction.editReply({
                    embeds: [
                        new EmbedBuilder()
                            .setDescription(`Now playing **[${nextTrack.title}](${nextTrack.url})**`)
                            .setThumbnail(nextTrack.thumbnail)
                            .setColor('#BF0000')
                    ]
                });
            } else {
                await interaction.editReply("Specify a track number in the queue, Praetor!");
            }

        } else {
            // Skip the current song
            queue.node.skip();

            // Return an embed to the user saying the song has been skipped
            await interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setDescription(`Skipped **[${currentSong.title}](${currentSong.url})**`)
                        .setThumbnail(currentSong.thumbnail)
                        .setColor('#BF0000')
                ]
            });
        }
	},
}
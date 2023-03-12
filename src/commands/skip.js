const { EmbedBuilder, Interaction, SlashCommandBuilder } = require("discord.js");
const { useQueue } = require("discord-player");

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
        const queue = useQueue(interaction.guildId);
        
        // Check if user is in the same voice channel
        if (!interaction.member.voice.channel || queue && (queue.channel !== interaction.member.voice.channel)) {
            return interaction.reply({ content:"You need to be in the same voice channel as me to input music commands, Praetor.", ephemeral: true});
        } else if (!queue || (!queue.currentTrack && queue.isEmpty())) {
			return interaction.reply({ content: "There is nothing to skip, Praetor!", ephemeral: true });
		}

        await interaction.deferReply();

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

            // Resume the player if paused
            if (queue.node.isPaused()) {
                queue.node.resume();
            }

            // Return an embed to the user saying the song has been skipped
            await interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setDescription(`⏩ | Skipped **[${currentSong.title}](${currentSong.url})**`)
                        .setThumbnail(currentSong.thumbnail)
                        .setColor('#BF0000')
                ]
            });
        }
	},
}
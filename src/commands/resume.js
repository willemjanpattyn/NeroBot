const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");
const { useQueue } = require("discord-player");

module.exports = {
	data: new SlashCommandBuilder()
        .setName("resume")
        .setDescription("Resume the music player"),
    /**
   * @param { Interaction } interaction
   */
	execute: async (interaction) => {
        const queue = useQueue(interaction.guildId);
        
        // Check if user is in the same voice channel
        if (!interaction.member.voice.channel || queue && (queue.channel !== interaction.member.voice.channel)) {
            return interaction.reply({ content:"You need to be in the same voice channel as me to input music commands, Praetor.", ephemeral: true});
        } else if (!queue || (!queue.currentTrack && queue.isEmpty())) {
			return interaction.reply({ content: "There is nothing to resume, Praetor!", ephemeral: true });
        } else if (queue.node.isPlaying()) {
            return interaction.reply({ content: "I'm already playing a song, Praetor!", ephemeral: true });
		}

        await interaction.deferReply();

        const currentSong = queue.currentTrack;

        // Pause the current song
		queue.node.resume();

        await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setDescription(`▶️ | Resumed **[${currentSong.title}](${currentSong.url})**` +
                        `\n\n${queue.node.createProgressBar()}`
                    )
                    .setThumbnail(currentSong.thumbnail)
                    .setColor('#BF0000')
            ]
        });
	},
}
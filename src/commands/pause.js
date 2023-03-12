const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");
const { useQueue } = require("discord-player");

module.exports = {
	data: new SlashCommandBuilder()
        .setName("pause")
        .setDescription("Pause the music player"),
    /**
   * @param { Interaction } interaction
   */
	execute: async (interaction) => {
        const queue = useQueue(interaction.guildId);
        
        // Check if user is in the same voice channel
        if (!interaction.member.voice.channel || queue && (queue.channel !== interaction.member.voice.channel)) {
            return interaction.reply({ content:"You need to be in the same voice channel as me to input music commands, Praetor.", ephemeral: true});
        } else if (!queue) {
            return interaction.reply({ content:"Nothing is currently playing, Praetor!", ephemeral: true });
        } else if (!queue.node.isPlaying()) {
            return interaction.reply({ content: "The music player has already been paused or is waiting for more songs to be added to the queue, Praetor!", ephemeral: true });
        }

        await interaction.deferReply();

        const currentSong = queue.currentTrack;

        // Pause the current song
		queue.node.pause();

        await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setDescription(`⏸️ | Paused **[${currentSong.title}](${currentSong.url})**` +
                        `\n\n${queue.node.createProgressBar()}`
                    )
                    .setThumbnail(currentSong.thumbnail)
                    .setColor('#BF0000')
            ]
        });
	},
}
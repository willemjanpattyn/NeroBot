const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");
const { useQueue } = require("discord-player");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("queue")
        .setDescription("Show the queue and what's currently playing"),
    /**
   * @param { Interaction } interaction
   */
    execute: async (interaction) => {
        const queue = useQueue(interaction.guildId);

        // Check if user is in the same voice channel
        if (!interaction.member.voice.channel || queue && (queue.channel !== interaction.member.voice.channel)) {
            return interaction.reply({ content:"You need to be in the same voice channel as me to input music commands, Praetor.", ephemeral: true});
        } 

        await interaction.deferReply();

        // check if there are songs in the queue
		if (!queue || (!queue.currentTrack && queue.isEmpty())) {
			await interaction.editReply("There are no songs in the queue, Praetor!")
			return;
		}

        let queueString = "There are no songs queued";
        if (!queue.isEmpty()) {
            // Build queue string
            queueString = queue.tracks.map((song, i) => {
                return `${i + 1}) \`[${song.duration}]\` ${song.title} - <@${song.requestedBy.id}>`
            }).join("\n");
        }

        // Get the current song
        const currentSong = queue.currentTrack;

        await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setDescription(`**Currently Playing**\n` + 
                        (currentSong ? `\`[${currentSong.duration}]\` ${currentSong.title} - <@${currentSong.requestedBy.id}>` : "None") + 
                        `\n\n${queue.node.createProgressBar()}` +
                        `\n\n**Queue**\n${queueString}`
                    )
                    .setColor('#BF0000')
                    .setThumbnail(currentSong.thumbnail)
            ]
        });
    }
}
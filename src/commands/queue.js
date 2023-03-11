const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");
const { Player } = require("discord-player");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("queue")
        .setDescription("Show the queue and what's currently playing"),

    execute: async (interaction) => {
        await interaction.deferReply();

        const player = Player.singleton();
        const queue = player.nodes.get(interaction.guildId)

        // check if there are songs in the queue
		if (queue == null || (!queue.currentTrack && queue.isEmpty())) {
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
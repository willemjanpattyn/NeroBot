const { ActivityType, SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { useQueue } = require("discord-player");

module.exports = {
	data: new SlashCommandBuilder()
        .setName("disconnect")
        .setDescription("Disconnect Nero from the voice channel and clear the queue."),
	/**
   * @param { Interaction } interaction
   */
	execute: async (interaction) => {
        const queue = useQueue(interaction.guildId);
        
        // Check if user is in the same voice channel
        if (!interaction.member.voice.channel || queue && (queue.channel !== interaction.member.voice.channel)) {
            return interaction.reply({ content:"You need to be in the same voice channel as me to input music commands, Praetor.", ephemeral: true});
        } else if (!queue || !queue.connection) {
			return interaction.reply({ content: "The stage needs to start before it can be ended, Praetor! <:neroSmug:784115410831802378>", ephemeral: true });
		}

        await interaction.deferReply();

        // Deletes all the songs from the queue and exits the channel
		queue.delete();
		
        await interaction.editReply({
			embeds: [
				new EmbedBuilder()
					.setTitle('The curtains have fallen')
					.setDescription('Until the next stage, Praetor!')
					.setColor('#BF0000')
					.setImage('https://cdn.discordapp.com/attachments/929321015685828659/1084546090336006284/nero_end.jpg')
			]
		});
	},
}
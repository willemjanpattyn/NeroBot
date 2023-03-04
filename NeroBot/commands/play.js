const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");
const { QueryType, Player } = require("discord-player");
const { ActivityType } = require("discord.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("play")
		.setDescription("Play a song from YouTube")
		.addSubcommand(subcommand =>
			subcommand
				.setName("search")
				.setDescription("Search for a song to add to the queue")
				.addStringOption(option =>
					option.setName("searchterms").setDescription("search keywords").setRequired(true)
				)
		)
        .addSubcommand(subcommand =>
			subcommand
				.setName("playlist")
				.setDescription("Add a YouTube playlist to the queue")
				.addStringOption(option => option.setName("url").setDescription("playlist URL").setRequired(true))
		)
		.addSubcommand(subcommand =>
			subcommand
				.setName("song")
				.setDescription("Add a YouTube video via URL to the queue")
				.addStringOption(option => option.setName("url").setDescription("video URL").setRequired(true))
		),
	execute: async (interaction) => {
        // Make sure the user is inside a voice channel
		if (!interaction.member.voice.channel) return interaction.reply("You need to be in a voice channel to play a song.");

        const player = Player.singleton();
        // Create a play queue for the server
        const queue = player.nodes.create(interaction.guild, {
            metadata: {
                channel: interaction.channel,
                client: interaction.guild.members.me,
                requestedBy: interaction.user,
            }
        });

        // Wait until you are connected to the channel
        if (!queue.connection) await queue.connect(interaction.member.voice.channel);

		let embed = new EmbedBuilder();

		if (interaction.options.getSubcommand() === "song") {
            let url = interaction.options.getString("url");
            
            // Search for the song using the discord-player
            const result = await player.search(url, {
                requestedBy: interaction.user,
                searchEngine: QueryType.YOUTUBE_VIDEO
            });

            // finish if no tracks were found
            if (result.isEmpty()) {
                await interaction.deferReply();
                return interaction.editReply("I couldn't find this URL, Praetor!");
            }

            // Add the track to the queue
            const song = result.tracks[0];
            queue.addTrack(song);
            embed
                .setDescription(`**[${song.title}](${song.url})** has been added to the queue`)
                .setThumbnail(song.thumbnail)
                .setFooter({ text: `Duration: ${song.duration}`})
                .setColor('#BF0000');

		}
        else if (interaction.options.getSubcommand() === "playlist") {

            // Search for the playlist using the discord-player
            let url = interaction.options.getString("url");
            const result = await player.search(url, {
                requestedBy: interaction.user,
                searchEngine: QueryType.YOUTUBE_PLAYLIST
            });

            if (result.isEmpty()) {
                await interaction.deferReply();
                return interaction.reply(`No playlists found with ${url}, Praetor!`);
            }
            
            // Add the tracks to the queue
            const playlist = result.playlist;
            queue.addTrack(playlist);
            embed
                .setDescription(`**${playlist.tracks.length} songs from [${playlist.title}](${playlist.url})** have been added to the queue`)
                .setColor('#BF0000');

		} 
        else if (interaction.options.getSubcommand() === "search") {

            // Search for the song using the discord-player
            let url = interaction.options.getString("searchterms");
            const result = await player.search(url, {
                requestedBy: interaction.user,
                searchEngine: QueryType.AUTO
            });

            // finish if no tracks were found
            if (result.isEmpty()) {
                await interaction.deferReply();
                return interaction.editReply("I didn't find any results, Praetor. Specify your search or use the url command");
            }
            
            // Add the track to the queue
            const song = result.tracks[0];
            queue.addTrack(song);
            embed
                .setDescription(`**[${song.title}](${song.url})** has been added to the queue`)
                .setThumbnail(song.thumbnail)
                .setFooter({ text: `Duration: ${song.duration}`})
                .setColor('#BF0000');
		}

        // Play the song
        if (!queue.node.isPlaying()) {
            await queue.node.play();
            interaction.client.user.setActivity('music with her Praetor!', {type: ActivityType.Listening});
        }
        
        // Respond with the embed containing information about the player
        await interaction.reply({
            embeds: [embed]
        });
	},
}
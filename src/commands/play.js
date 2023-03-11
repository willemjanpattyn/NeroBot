const { ActivityType, EmbedBuilder, Interaction, SlashCommandBuilder } = require("discord.js");
const { QueryType, Player } = require('discord-player');
const UrlType = {
    Unknown: -1,
	Video: 0,
	Playlist: 1,
	Search: 2,
};

module.exports = {
	data: new SlashCommandBuilder()
		.setName("play")
		.setDescription("Play a song from YouTube")
        .addStringOption(option => 
            option
                .setName("query")
                .setDescription("Video URL, playlist URL or search terms")
                .setRequired(true)
        ),
    /**
   * @param { Interaction } interaction
   */
	execute: async (interaction) => {
        await interaction.deferReply();

        // Make sure the user is inside a voice channel
		if (!interaction.member.voice.channel) return interaction.editReply("You need to be in a voice channel to play a song.");

        const player = Player.singleton();

        // Create a play queue for the server
        const queue = player.nodes.create(interaction.guild, {
            metadata: {
                channel: interaction.channel,
                client: interaction.guild.members.me,
                requestedBy: interaction.user,
            },
            leaveOnEmpty: false,
            leaveOnEnd: false,
        });

        // Wait until you are connected to the channel
        if (!queue.connection) await queue.connect(interaction.member.voice.channel);

		let embed = new EmbedBuilder();

        let url = interaction.options.getString('query');

        // Validate the type of query
        let urlType = validateYouTubeUrl(url);

        if (urlType == UrlType.Video) {
            const result = await player.search(url, {
                requestedBy: interaction.user,
                searchEngine: QueryType.YOUTUBE_VIDEO
            });

            // finish if no tracks were found
            if (result.isEmpty()) {
                return interaction.editReply("No video found with that URL, Praetor!");
            }

            // Add the track to the queue
            const song = result.tracks[0];
            queue.addTrack(song);
            embed
                .setDescription(`**[${song.title}](${song.url})** has been added to the queue`)
                .setThumbnail(song.thumbnail)
                .setFooter({ text: `Duration: ${song.duration}`})
                .setColor('#BF0000');

        } else if (urlType == UrlType.Playlist) {
            const result = await player.search(url, {
                requestedBy: interaction.user,
                searchEngine: QueryType.YOUTUBE_PLAYLIST
            });

            if (result.isEmpty()) {
                return interaction.editReply(`No playlist found with that URL, Praetor!`);
            }
            
            // Add the tracks to the queue
            const playlist = result.playlist;
            queue.addTrack(playlist);
            embed
                .setDescription(`**${playlist.tracks.length} songs from [${playlist.title}](${playlist.url})** have been added to the queue`)
                .setThumbnail(playlist.thumbnail.toString().split('?')[0]) // URL until .jpg
                .setColor('#BF0000');

        } else {
            const result = await player.search(url, {
                requestedBy: interaction.user,
                searchEngine: QueryType.AUTO
            });

            // finish if no tracks were found
            if (result.isEmpty()) {
                return interaction.editReply("I didn't find any results, Praetor. Specify your search or input a video URL");
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
        await interaction.editReply({
            embeds: [embed]
        });
	},
}

/// https://stackoverflow.com/questions/28735459/how-to-validate-youtube-url-in-client-side-in-text-box
function validateYouTubeUrl(url) {    
    let urlType = UrlType.Unknown;

    if (url != undefined || url != '') {        
        let videoRegExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|\?v=)([^#\&\?]*).*/;
        let playlistRegExp = /^.*(youtu.be\/|list=)([^#\&\?]*).*/;
        let videoMatch = url.match(videoRegExp);

        if (videoMatch && videoMatch[2].length == 11) {
            urlType = UrlType.Video;         
        } else if(url.match(playlistRegExp)) {
            urlType = UrlType.Playlist;
        } else {
            urlType = UrlType.Search;
        }
    }

    return urlType;
}
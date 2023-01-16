const { SlashCommandBuilder } = require('discord.js');

function getFgoProfile(e,user){
    var db = require("../run.js").db;

    return new Promise(async function(resolve,reject){
        try {
            db.query(`SELECT * FROM fgo_profiles WHERE user_id = '${user.id}';`, (err, result) => {
                if (err) {
                    reject(err);
                    console.log(err);
                }
                else {
                    if (result.rowCount > 0) {
                        let ign;
                        let fc;
                        let support_img;
                        let region;
            
                        for (let row of result.rows) {
                            if (e.guild.members.cache.get(row.user_id) != null) {
                                if (row.ign != "undefined")
                                    ign = "" + row.ign;
                                if (row.friend_code != "undefined")
                                    fc = "" + row.friend_code;
                                if (row.img_url != "undefined")
                                    support_img = "" + row.img_url;
                                if (row.region != "undefined")
                                    region = "" + row.region;
                            }
                        }
                        //message.channel.send({ embeds:[fgo.getFgoEmbed(u,ign,fc,region,support_img)] });
                        resolve({embeds: [getFgoEmbed(user,ign,fc,region,support_img)]});
                    }
                    else {
                        resolve({content:`**${user.username}** hasn't set their FGO profile yet.`});
                    }
                }
            });
        } catch (error) {
            reject(error);
        }
    });
}

function setFgoProfile(e,ign,fc,support_img,region) {
    var db = require("../run.js").db;

    return new Promise(async function(resolve, reject){
        try {
            db.query(`SELECT * FROM fgo_profiles WHERE user_id = '${e.user.id}';`, (err, result) => {
                if (err) {
                    console.log(err);
                    reject(err);
                }
                else {
                    if (result.rowCount > 0) {  // Update profile
                        for (let row of result.rows) {
                            if (e.guild.members.cache.get(row.user_id) != null) {
                                if (ign == undefined) {
                                    if (row.ign != "undefined") {
                                        ign = "" + row.ign;
                                    }
                                    else {
                                        ign = undefined;
                                    }
                                }
                                if (fc == undefined) {
                                    if (row.friend_code != "undefined") {
                                        fc = "" + row.friend_code;
                                    }
                                    else {
                                        fc = undefined;
                                    }
                                }
                                if (support_img == undefined) {
                                    if (row.img_url != "undefined") {
                                        support_img = "" + row.img_url;
                                    }
                                    else {
                                        support_img = undefined;
                                    }
                                }
                                if (region == undefined) {
                                    if (row.region != "undefined") {
                                        region = "" + row.region;
                                    }
                                    else {
                                        region = undefined;
                                    }
                                }
        
                                db.query(`UPDATE fgo_profiles SET ign = '${ign}', friend_code = '${fc}', img_url = '${support_img}', region = '${region}' WHERE user_id = '${e.user.id}';`, (err, result) => {
                                    if (err) {
                                        reject(err);
                                    }
                                });
                            }
                        }
                    }
                    else {  // New profile
                        db.query(`INSERT INTO fgo_profiles VALUES ('${e.user.id}','${ign}','${fc}','${support_img}','${region}');`, (err, result) => {
                            if (err) {
                                reject(err);
                                console.log(err);
                            }
                        });
                    }
                }
        
                resolve(
                    {
                        content: ":white_check_mark: | Profile saved successfully!",
                        embeds:[ getFgoEmbed(e.user,ign,fc,region,support_img) ]
                    }
                );


            });
        } catch (error) {
            
        }
    });
}

function getFgoEmbed(user, ign, friendCode, region, image) {
    const { EmbedBuilder } = require("discord.js");
    return new EmbedBuilder()
        .setColor(0xbf0000)
        .setTitle("FGO Profile for " + user.username)
        .addFields(
            {
                name: "IGN",
                value: ign || "Not Provided",
                inline: true
            },
            {
                name: "Friend ID",
                value: friendCode || "Not Provided",
                inline: true
            },
            {
                name: "Region",
                value: region || "Not Provided",
                inline: true
            }
        )
        .setThumbnail(user.displayAvatarURL())
        .setImage(image);
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('fgo')
        .setDescription('View and edit Fate/Grand Order profile')
        .addSubcommand((subcommand) =>
            subcommand
                .setName('show')
                .setDescription('Shows a user\'s Fate/Grand Order profile')
                .addUserOption((option) =>
                    option.setName('user').setRequired(true).setDescription('Name of the user')))
        .addSubcommand((subcommand) => 
            subcommand
                .setName('set')
                .setDescription('Create or edit your Fate/Grand Order profile')
                .addStringOption((option) =>
                    option.setName('name').setDescription('Your in-game name'))
                .addStringOption((option) =>
                    option.setName('code').setDescription('Your friend code (e.g. 123,456,789)'))
                .addStringOption((option) =>
                    option.setName('region').setDescription('Server you play in')
                        .addChoices(
                            { name: 'Japan', value: 'JP'},
                            { name: 'North America', value: 'NA'}, 
                            { name: 'Taiwan', value: 'TW'}, 
                            { name: 'China', value: 'CH'}, 
                            { name: 'Korea', value: 'KR'}, 
                        ))
                .addAttachmentOption((option) =>
                    option.setName('image').setDescription('An image of your support list'))),
    async execute(interaction) {
        await interaction.deferReply();
        const subCmd = interaction.options.getSubcommand();
        if (subCmd === 'show') {
            const user = interaction.options.getUser('user')
            var reply = await getFgoProfile(interaction,user);
        }
        else if (subCmd === 'set') {
            const name = interaction.options.getString('name');
            const code = interaction.options.getString('code');
            const region = interaction.options.getString('region');
            const image = interaction.options.getAttachment('image');
            var imageUrl = null;
            if (image !== null) {
                imageUrl = image.attachment;
            }

            var reply = await setFgoProfile(interaction,name,code,imageUrl,region)
        }

        await interaction.editReply(reply);
    },
    run: async (client, message, args) => {
        if (message.channel.name != "mobage" && message.channel.name != "my-room" && message.channel.name != "bot-testing") return;
    
        var u = null;
    
        //Show user FGO profile
        if (args != "") {
            if (message.mentions.members.first()) {
                u = message.mentions.members.first().user;
            }
            else {
                var query = args.join(' ').toLowerCase();
                u = message.guild.members.cache.filter(u => u.user.username.toLowerCase().includes(query) || u.displayName.toLowerCase().includes(query)).first().user;
            }
            if (u == null) {
                return message.channel.send("No user found.");
            }
        }
        //Show own FGO profile
        else {
            u = message.author;
        }
        let reply = await getFgoProfile(message,u);
        message.channel.send(reply);
    }
}
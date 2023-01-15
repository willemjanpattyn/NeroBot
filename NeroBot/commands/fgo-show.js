const { SlashCommandBuilder } = require('discord.js');

function getFgoProfile(e,user){
    var db = require("../run.js").db;
    var fgo = require("../tools.js");

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
                        resolve(fgo.getFgoEmbed(user,ign,fc,region,support_img));
                    }
                    else {
                        resolve(`**${user.username}** hasn't set their FGO profile yet.`);
                    }
                }
            });
        } catch (error) {
            reject(error);
        }
    });
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('fgo')
        .setDescription('View and edit Fate/Grand Order profile')
        .addSubcommand((subcommand) =>
            subcommand
            .setName('show')
            .setDescription('Shows a user\'s FGO profile')
            .addUserOption((option) =>
                option.setName('user').setRequired(true).setDescription('Name of the user')
            )
    ),
    async execute(interaction) {
        await interaction.deferReply();
        const user = interaction.options.getUser('user')
        var reply = await getFgoProfile(interaction,user);
        if (typeof reply === "object") {    // send embed
            await interaction.editReply({embeds: [reply]});
        }
        else {
            await interaction.editReply(reply);
        }
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
        console.log(u);
        let reply = await getFgoProfile(message,u);
        if (typeof reply === "object") {    // send embed
            message.channel.send({embeds: [reply]});
        }
        else {
            message.channel.send(reply);
        }
    }
}
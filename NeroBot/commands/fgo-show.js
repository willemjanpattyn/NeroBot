exports.run = (client, message, args) => {
    //if (message.channel.name != "bot-testing") return;
    if (message.channel.name != "mobage" && message.channel.name != "my-room" && message.channel.name != "bot-testing") return;

    var runNode = require("../run.js");
    var db = runNode.db;

    var u = null;

    //Show user FGO profile
    if (args != "") {
        if (message.mentions.members.first()) {
            u = message.mentions.members.first().user;
        }
        else {
            var query = args.join(' ').toLowerCase();
            u = message.guild.members.filter(u => u.user.username.toLowerCase().includes(query) || u.displayName.toLowerCase().includes(query)).first().user;
        }
        if (u == null) {
            return message.channel.send("No user found.");
        }
    }
    //Show own FGO profile
    else {
        u = message.author;
    }

    db.query(`SELECT * FROM fgo_profiles WHERE user_id = '${u.id}';`, (err, result) => {
        if (err) {
            message.channel.send("Something went wrong...");
            console.log(err);
        }
        if (result.rowCount > 0) {
            let ign;
            let fc;
            let support_img;
            let region;

            for (let row of result.rows) {
                if (message.guild.members.get(row.user_id) != null) {
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
            message.channel.send({
                embed: {
                    color: 0xbf0000,
                    title: "FGO Profile for " + u.username,
                    fields: [
                        {
                            name: "IGN",
                            value: ign || "Not Provided",
                            inline: true
                        },
                        {
                            name: "Friend ID",
                            value: fc || "Not Provided",
                            inline: true
                        },
                        {
                            name: "Region",
                            value: region || "Not Provided",
                            inline: true
                        }
                    ],
                    thumbnail: { url: u.displayAvatarURL },
                    image: { url: support_img }
                }
            });
        }
        else {
            if (u.id == message.author.id) {
                message.channel.send("You haven't set your FGO profile yet. Refer to `!help fgo` to setup your FGO profile.");
            }
            else {
                message.channel.send(`**${u.username}** hasn't set their FGO profile yet.`);
            }
        }
    });
}

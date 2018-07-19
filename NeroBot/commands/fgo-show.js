exports.run = (client, message, args) => {
    //if (message.channel.name != "bot-testing") return;
    if (message.channel.name != "fgo-mobage" || message.channel.name != "my-room" || message.channel.name != "bot-testing") return;

    var runNode = require("../run.js");
    var db = runNode.db;

    var u = null;

    //Show user FGO profile
    if (args != "") {
        console.log(args);
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
            let ign = null;
            let fc = null;
            let support_img = null;
            let region = null;

            for (let row of result.rows) {
                if (message.guild.members.get(row.user_id) != null) {
                    ign = "" + row.ign;
                    fc = "" + row.friend_code;
                    support_img = "" + row.img_url;
                    region = "" + row.region;

                }
            }
            console.log(u.username);
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
                    image: { url: support_img },
                    content: "test"
                }
            });
        }
        else {
            message.channel.send(`**${u.username}** hasn't set their FGO profile yet.`);
        }
    });
}
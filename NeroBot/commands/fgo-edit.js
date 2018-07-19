exports.run = (client, message, args) => {
    //if (message.channel.name != "bot-testing") return;
    if (message.channel.name != "fgo-mobage" && message.channel.name && "my-room" && message.channel.name != "bot-testing") return;

    var runNode = require("../run.js");
    var db = runNode.db;

    args = args.join(' ');
    let u = message.author;
    let msg = "";

    var ign = null;
    var fc = null;
    var region = null;
    let img = message.attachments.first();
    let support_img = null;

    if (args || img) {
        args = args.match(/((?:ign)|(?:id)|(?:region)) ?: ?[^\|]+/gi);
        if (img) {
            support_img = img.url;
        }
        if (args) {
            args.forEach(item => {
                item = item.split(':');
                item[0] = item[0].toLowerCase().trim();
                item[1] = item.slice(1).join(':').trim();
                if (item[0] == "ign") {
                    ign = item[1];
                }
                if (item[0] == "id") {
                    fc = item[1];
                }
                if (item[0] == "region") {
                    switch (item[1]) {
                        case "jp":
                            region = "JP"
                            break;
                        case "na":
                            region = "NA"
                            break;
                        case "tw":
                            region = "TW"
                            break;
                        case "ch":
                            region = "CH"
                            break;
                        case "kor":
                            region = "KOR"
                            break;
                    }
                }
            });
            console.log(ign + " " + fc + " " + region);

        }
        db.query(`SELECT * FROM fgo_profiles WHERE user_id = '${u.id}';`, (err, result) => {
            if (err) {
                message.channel.send("Something went wrong...");
                console.log(err);
            }
            if (result.rowCount > 0) {
                for (let row of result.rows) {
                    if (message.guild.members.get(row.user_id) != null) {
                        if (ign == null)
                            ign = "" + row.ign;
                        if (fc == null)
                            fc = "" + row.friend_code;
                        if (support_img == null)
                            support_img = "" + row.img_url;
                        if (region == null)
                            region = "" + row.region;
                    }

                    db.query(`UPDATE fgo_profiles SET ign = '${ign}', friend_code = '${fc}', img_url = '${support_img}', region = '${region}' WHERE user_id = '${u.id}';`, (err, result) => {
                        if (err) {
                            console.log(err);
                        }
                    });
                }
            }
            else {
                db.query(`INSERT INTO fgo_profiles VALUES ('${u.id}','${ign}','${fc}','${support_img}','${region}');`, (err, result) => {
                    if (err) {
                        message.channel.send("Something went wrong when creating profile!");
                        return console.log(err);
                    }
                });
            }

            message.channel.send("Profile saved successfully!", {
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
        });
    }
    else {
        message.channel.send("Please input something! Refer to `!help fgo` for more info.");
    }
}
exports.run = (client, message, args) => {
    //if (message.channel.name != "bot-testing") return;
    if (message.channel.name != "fgo-mobage" && message.channel.name && "my-room" && message.channel.name != "bot-testing") return;

    var runNode = require("../run.js");
    var db = runNode.db;

    args = args.join(' ');
    let u = message.author;
    let msg = "";

    var ign;
    var fc;
    var region;
    let img = message.attachments.first();
    let support_img;

    let error = false;

    args = args.match(/((?:ign)|(?:id)|(?:region)) ?: ?[^\|]+/gi);
    if (args || img) {
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
                    if (item[1].match(/(^\d{3},\d{3},\d{3}$)/gm)) {
                        fc = item[1];
                        //console.log("id match");
                    }
                    else {
                        //console.log("id no match");
                        msg += "Please input valid friend ID format e.g. `123,456,789`\n";
                        error = true;
                    }
                }
                if (item[0] == "region") {
                    switch (item[1].toLowerCase()) {
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
                        default:
                            msg += "Please input a valid region `<JP|NA|TW|CH|KR>`\n";
                            error = true;
                    }
                }
            });
        }
        if (!error) {
            db.query(`SELECT * FROM fgo_profiles WHERE user_id = '${u.id}';`, (err, result) => {
                if (err) {
                    message.channel.send("Something went wrong...");
                    console.log(err);
                }
                if (result.rowCount > 0) {
                    if (args || img) {
                        for (let row of result.rows) {
                            if (message.guild.members.get(row.user_id) != null) {
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

                                db.query(`UPDATE fgo_profiles SET ign = '${ign}', friend_code = '${fc}', img_url = '${support_img}', region = '${region}' WHERE user_id = '${u.id}';`, (err, result) => {
                                    if (err) {
                                        console.log(err);
                                    }
                                });
                            }
                        }
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
                //console.log(support_img);
                message.channel.send(":white_check_mark: | Profile saved successfully!", {
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
            });
        }
        else {
            return message.channel.send(":no_entry_sign: | The following errors occured:\n" + msg);
        }
    }
    else {
        return message.channel.send(":no_entry_sign: | Please use valid arguments `<IGN:|ID:|Region:>`. To add image, add it as an attachment. Refer to `!help fgo` for more info.");
    }
}
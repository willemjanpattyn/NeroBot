exports.run = (client, message, args) => {
    var runNode = require("../run.js");
    var db = runNode.db;
    try {
        if (db != null)
            db.connect();
    } catch (err) {
        console.log(err);
    }
    console.log("Sucessfully conencted to DB");

    var padEnd = require("pad-end");

    db.query("SELECT * FROM bdays ORDER BY birthday;", (err, result) => {
        if (err) throw err;
        var output = "```";
        for (let row of result.rows) {
            console.log(JSON.stringify(row));

            var formattedDate = "" + row.birthday;
            console.log(formattedDate);
            var month = formattedDate.substring(4, 7);
            var day = formattedDate.substring(8, 10);
            var username = "" + row.username;
            output += padEnd(username, 15, "") + "\t" + day + " " + month + "\n";
        }
        output += "```";

        message.channel.send("Here is the list of birthdays, Praetor!\n" + {
            embed: {
                color: 0xbf0000,
                author: {
                    name: client.user.username,
                    icon_url: client.user.avatarURL
                },
                title: "Nero Mancave Birthday List",
                description: "A list of birthdays of members of this guild.",
                fields: [{
                    value: output
                }],
                timestamp: new Date(),
                footer: {
                    icon_url: client.user.avatarURL,
                    text: "&copy; ROMA"
                }
            }
        });
    });
}


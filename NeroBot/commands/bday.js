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

    if (args == "") {
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

            message.channel.send({
                embed: {
                    color: 0xbf0000,
                    author: {
                        name: client.user.username,
                        icon_url: client.user.avatarURL
                    },
                    title: "Nero Mancave Birthday List",
                    description: "A list of birthdays of members of this guild.",
                    fields: [{
                        name: "List",
                        value: output
                    }],
                    timestamp: new Date(),
                    footer: {
                        icon_url: client.user.avatarURL,
                        text: "MASANI ROMA"
                    }
                }
            });
        });
    }
    else if (args[0] == "set") {
        message.channel.send("Setting bday is still in progress...");
    }
    else {
        console.log(args[0]);
        var u = message.mentions.members.first();

        db.query(`SELECT * FROM bdays WHERE user_id = ${u.user.id};`, (err, result) => {
            if (err) throw err;
            for (let row of result.rows) {
                var formattedDate = "" + row.birthday;
                var month = formattedDate.substring(4, 7);
                var day = formattedDate.substring(8, 10);

                message.channel.send(`${u.user.username}'s birthday is on ${day} ${month}!`);
            }
        });
    }
    
}


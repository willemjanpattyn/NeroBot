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

                let formattedDate = "" + row.birthday;
                console.log(formattedDate);
                let month = formattedDate.substring(4, 7);
                let day = formattedDate.substring(8, 10);
                let username = "" + row.username;
                output += padEnd(username, 15, "") + "\t" + month + " " + day + "\n";
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
        let givenBday = "" + args[1];
        let u = message.author;
        var day = givenBday.split('/')[0];
        var month = givenBday.substring(givenBday.lastIndexOf('/') + 1);
        console.log(day + " " + month);

        db.query(`SELECT * FROM bdays WHERE user_id = '${u.id}';`, (err, result) => {
            if (err) throw err;
            console.log(result.rowCount);
            if (result.rowCount > 0) {
                db.query(`UPDATE bdays SET birthday = '2000-${month}-${day}' WHERE user_id = '${u.id}';`, (err, result) => {
                    if (err) {
                        message.channel.send("Please input a correct date format [DD/MM]...");
                        throw err;
                    }
                    message.channel.send(`Your birthday has been updated to ${givenBday}!`);
                });
            }
            else {
                db.query(`INSERT INTO bdays (user_id, username, birthday) VALUES ('${u.id}', '${u.username}', '2000-${month}-${day}');`, (err, result) => {
                    if (err) {
                        message.channel.send("Please input a correct date format [DD/MM]...");
                        throw err;
                    }
                    message.channel.send(`Your birthday has been set to ${givenBday}!`);
                });
            }
        });
    }
    else {
        console.log(args[0]);
        let u = message.mentions.members.first();
        console.log(u.user.id);
        db.query(`SELECT * FROM bdays WHERE user_id = '${u.user.id}';`, (err, result) => {
            if (err) throw err;
            for (let row of result.rows) {
                let formattedDate = "" + row.birthday;
                let month = formattedDate.substring(4, 7);
                let day = formattedDate.substring(8, 10);

                message.channel.send(`${u.user.username}'s birthday is on ${month} ${day}!`);
            }
        });
    } 
}


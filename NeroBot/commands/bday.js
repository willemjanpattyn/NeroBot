exports.run = (client, message, args) => {

    var runNode = require("../run.js");
    var db = runNode.db;

    //Show list of birthdays
    if (args == "") {
        if (message.channel.name != "my-room" && message.channel.name != "bot-testing") return; // Ignore all channels except #my-room
        var padEnd = require("pad-end");

        db.query("SELECT * FROM bdays ORDER BY birthday;", (err, result) => {
            if (err) {
                message.channel.send("Something went wrong...");
                console.log(err);
            }
            else {
                var output = "```";
                for (let row of result.rows) {
                    let formattedDate = "" + row.birthday;
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
            }
        });
    }
    //Set birthday
    else if (args[0].toLowerCase() == "set") {
        let givenBday = "" + args[1];
        let u = message.author;
        var day = givenBday.split('/')[0];
        var month = givenBday.substring(givenBday.lastIndexOf('/') + 1);
        console.log(day + " " + month);

        db.query(`SELECT * FROM bdays WHERE user_id = '${u.id}';`, (err, result) => {
            if (err) {
                message.channel.send("Something went wrong...");
                console.log(err);
            }
            console.log(result.rowCount);
            if (result.rowCount > 0) {
                db.query(`UPDATE bdays SET birthday = '2000-${month}-${day}' WHERE user_id = '${u.id}';`, (err, result) => {
                    if (err) {
                        message.channel.send("Please input a correct date format [DD/MM]...");
                        console.log(err);
                    }
                    else {
                        console.log(`COMMAND_LOG: ${message.author.username} (${message.author.id}) updated their birthday to ${givenBday}`);
                        message.channel.send(`Your birthday has been updated to ${givenBday}!`);
                    }
                });
            }
            else {
                db.query(`INSERT INTO bdays (user_id, username, birthday) VALUES ('${u.id}', '${u.username}', '2000-${month}-${day}');`, (err, result) => {
                    if (err) {
                        message.channel.send("Please input a correct date format [DD/MM]...");
                        console.log(err);
                    }
                    else {
                        console.log(`COMMAND_LOG: ${message.author.username} (${message.author.id}) set their birthday to ${givenBday}`);
                        message.channel.send(`Your birthday has been set to ${givenBday}!`);
                    }
                });
            }
        });
    }
    //Show user birthday
    else {
        let u = message.mentions.members.first();
        if (u == null) {
            return message.channel.send("Please mention a valid user...");
        }
        db.query(`SELECT * FROM bdays WHERE user_id = '${u.user.id}';`, (err, result) => {
            if (err) {
                console.log(err);
                return message.channel.send("Please input a correct user...");
            }
            else {
                for (let row of result.rows) {
                    let formattedDate = "" + row.birthday;
                    let month = formattedDate.substring(4, 7);
                    let day = formattedDate.substring(8, 10);

                    var dateResult = row.birthday;
                    //console.log(dateResult);
                    var currentDate = new Date();
                    currentDate.setFullYear(2000);
                    //console.log(currentDate);

                    if (currentDate > dateResult) {
                        dateResult.setFullYear(2001);
                    }

                    var amountOfDays = Math.floor(Math.abs((currentDate.getTime() - dateResult.getTime()) / (24 * 60 * 60 * 1000))) + 1;

                    if (amountOfDays == 0 || amountOfDays == 365) {
                        message.channel.send(`${u.user.username}'s birthday is on ${month} ${day}, which is today! Happy Birthday, ${u}!!\nhttps://www.youtube.com/watch?v=IylJ_daGouw`);
                    }
                    else {
                        message.channel.send(`${u.user.username}'s birthday is on ${month} ${day}! (${amountOfDays} day(s) remaining)`);
                    }
                }
            }
        });
    } 
}
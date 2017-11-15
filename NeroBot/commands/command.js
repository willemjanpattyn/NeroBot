exports.run = (client, message, args) => {
	var runNode = require("../run.js");
	var db = runNode.db;
	var prefix = runNode.prefix;

	console.log(args[0] + " " + args[1]);

    if (args[0] == "list") {
        var padEnd = require("pad-end");
        db.query("SELECT * FROM commands;", (err, result) => {
            if (err) return console.log(err);

            let output = "```";

            var index = 1;
            for (let row of result.rows) {
                output += padEnd(index + ".",4,"") + row.command_name + "\n";
                index++;
            }
            output += "```";

            message.channel.send("List of available custom commands\n" + output);
        });
    }
    else if (args[0] == "edit") {
        if (args.length != 3 || !args[1].startsWith(prefix) || !args[2].startsWith(prefix)) {
            return message.channel.send("Please input the correct command format\n```!command edit !old !new```");
        }
        db.query(`UPDATE commands SET command_name = '${args[2]}' WHERE command_name = '${args[1]}';`, (err, result) => {
            if (err) {
                message.channel.send("New command name may already exist, please use a different name!");
                return console.log(err);
            }
            else if (result.rowCount < 1) {
                return message.channel.send("The command you're trying to update doesn't exist!");
            }
            else {
                return message.channel.send(`Updated command ${args[1]} to ${args[2]}`);
            }
        });
    }
    else if (args[0] == "del" || args[0] == "delete") {
        if (message.member.roles.has("&343063483836792833")) {
            if (args.length != 2 || !args[1].startsWith(prefix)) {
                return message.channel.send("Please input the correct command format\n```!command delete !todeletecommand```");
            }
            db.query(`DELETE FROM commands WHERE command_name = '${args[1]}';`, (err, result) => {
                if (err) {
                    message.channel.send("Something went wrong deleting the command...");
                    return console.log(err);
                }
                else if (result.rowCount < 1) {
                    return message.channel.send("The command you're trying to delete doesn't exist!");
                }
                return message.channel.send(`Succesfully deleted the ${args[1]} command!`);
            });
        }
        else {
            return channel.message.send("You don't have the permission to use this command!");
        }
    }
    else {
        if (args.length != 2 || !args[0].startsWith(prefix)) {
            message.channel.send("Please input the correct command format\n```!command !yourcommand http://i.imgur.com/YrgluxT.gif ```");
        }
        else {
            if (!args[1].startsWith("http") || args[1].match(/\.(jpeg|jpg|gif|png)$/) == null) {
                console.log(args[1].startsWith("http"));
                console.log(args[1].match(/\.(jpeg|jpg|gif|png)$/));
                message.channel.send("Please input a correct image URL (.png, .jpg, gif)");
            }
            else {
                db.query(`INSERT INTO commands VALUES ('${args[0]}','${args[1]}');`, (err, result) => {
                    if (err) {
                        message.channel.send("Command may already exist, please use a different name!");
                        return console.log(err);
                    }
                    var output = "\n```";
                    output += args[0] + " (" + args[1] + ")```";
                    message.channel.send("New command has been created" + output);
                });
            }
        }
    }
}
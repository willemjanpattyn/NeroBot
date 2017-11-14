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
    else {
        if (args.length != 2 || !args[0].startsWith(prefix)) {
            message.channel.send("Please input the correct command format\n```!command !yourCommand http://i.imgur.com/YrgluxT.gif ```");
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
                        console.log(err);
                        return;
                    }
                    var output = "\n```";
                    output += args[0] + " (" + args[1] + ")```";
                    message.channel.send("New command has been created" + output);
                });
            }
        }
    }
}
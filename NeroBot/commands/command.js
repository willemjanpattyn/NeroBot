exports.run = (client, message, args) => {
    var runNode = require("../run.js");
    var db = runNode.db;
    var prefix = runNode.prefix;

    //Show list commands
    if (args[0].toLowerCase() == "list") {
        var padEnd = require("pad-end");
        db.query("SELECT * FROM commands;", (err, result) => {
            if (err) return console.log(err);

            let output = "```";

            var index = 1;
            for (let row of result.rows) {
                output += padEnd(index + ".", 4, "") + row.command_name + "\n";
                index++;
            }
            output += "```";

            message.author.send("List of available custom commands\n" + output);
            //message.channel.send("List of available custom commands\n" + output).
            //    then(msg => {
            //        msg.delete(15000);
            //    });
        });
    }
    //Rename command
    else if (args[0].toLowerCase() == "rename") {
        if (args.length != 3 || !args[1].startsWith(prefix) || !args[2].startsWith(prefix)) {
            return message.channel.send("Please input the correct command format\n```!command rename !old !new```");
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
                console.log(`COMMAND_LOG: User ${message.author.username} (${message.author.id}) updated command ${args[1]} to ${args[2]}`);
                return message.channel.send(`Updated command ${args[1]} to ${args[2]}`);
            }
        });
    }
    //Edit URL command
    else if (args[0].toLowerCase() == "url") {
        if (args.length != 3 || !args[1].startsWith(prefix)) {
            return message.channel.send("Please input the correct command format\n```!command url !yourcommand http://newimageurl.png```");
        }
        db.query(`UPDATE commands SET img_url = '${args[2]}' WHERE command_name = '${args[1]}';`, (err, result) => {
            if (err) {
                message.channel.send("An error has occured!");
                return console.log(err);
            }
            else if (!args[2].startsWith("http") || args[2].match(/\.(jpeg|jpg|gif|png)$/) == null) {
                return message.channel.send("Please input a correct image URL (.png, .jpg, gif)");
            }
            else if (result.rowCount < 1) {
                return message.channel.send("The command you're trying to update doesn't exist!");
            }
            else {
                console.log(`COMMAND_LOG: User ${message.author.username} (${message.author.id}) updated image URL of ${args[1]} to ${args[2]}`);
                return message.channel.send(`Updated image URL of ${args[1]} to <${args[2]}>`);
            }
        });
    }
    //Delete command
    else if (args[0].toLowerCase() == "del" || args[0].toLowerCase() == "delete") {
        if (message.member.roles.has("343063483836792833")) {
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
                console.log(`COMMAND_LOG: User ${message.author.username} (${message.author.id}) deleted ${args[1]}`);
                return message.channel.send(`Succesfully deleted the ${args[1]} command!`);
            });
        }
        else {
            message.channel.send("You don't have the permission to use this command!");
        }
    }
    //Insert command
    else {
        if (args.length != 2 || !args[0].startsWith(prefix)) {
            message.channel.send("Please input the correct command format\n```!command !yourcommand http://i.imgur.com/YrgluxT.gif ```");
        }
        else {
            if (!args[1].startsWith("http") || args[1].match(/\.(jpeg|jpg|gif|png)$/) == null) {
                //console.log(args[1].startsWith("http"));
                //console.log(args[1].match(/\.(jpeg|jpg|gif|png)$/));
                message.channel.send("Please input a correct image URL (.png, .jpg, gif)");
            }
            else {
                var commandName = ("" + args[0]).toLowerCase();
                var imgUrl = "" + args[1];

                db.query(`INSERT INTO commands VALUES ('${commandName}','${imgUrl}');`, (err, result) => {
                    if (err) {
                        message.channel.send("Command may already exist, please use a different name!");
                        return console.log(err);
                    }
                    var output = "\n```";
                    output += commandName + " (" + imgUrl + ")```";
                    message.channel.send("New command has been created" + output);
                    console.log(`COMMAND_LOG: User ${message.author.username} (${message.author.id}) inserted ${output}`);
                });
            }
        }
    }
}
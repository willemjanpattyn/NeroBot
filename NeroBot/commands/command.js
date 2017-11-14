exports.run = (client, message, args) => {
	var runNode = require("../run.js");
	var db = runNode.db;
	var prefix = runNode.prefix;

	try {
		if (db != null)
			db.connect();
			console.log("Sucessfully conencted to DB");
	} catch (err) {
		console.log(err);
	}

	if (args.length != 2 || !args[0].startsWith(prefix) || !args[1].startsWith("http") || !args[1].endsWith(".png") || !args[1].endsWith(".jpg") || !args[1].endsWith(".gif")) {
		message.channel.send("Please input the correct format\n```!command !yourCommand http://i.imgur.com/YrgluxT.gif [URL needs to end with .png/.jpg/.gif]```");
	}
	else {
		db.query(`INSERT INTO commands VALUES ('${args[0]}','${args[1]}');`, (err, result) => {
			if (err) {
				message.channel.send("Command may already exist, please use a different name!");
				console.log(err);
				return;
			}
			var output = "\n```";
			output += args[0] + " " + args[1] + "```";
			message.channel.send("New command has been created" + output);
		});
	}
}
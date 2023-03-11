// Deploy commands
// https://discordjs.guide/creating-your-bot/command-deployment.html#command-registration

const { REST, Routes } = require('discord.js');
const fs = require('node:fs');
require("dotenv").config({path:__dirname+'/../process.env'});

const commands = [];
// Grab all the command files from the commands directory you created earlier
const commandFiles = fs.readdirSync('./src/commands').filter(file => file.endsWith('.js'));

// Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
for (const file of commandFiles) {
    if (file !== "fgo-edit.js") {
    	const command = require(`./commands/${file}`);
	    commands.push(command.data.toJSON());
    }

}

// Construct and prepare an instance of the REST module
const rest = new REST({ version: '10' }).setToken(process.env.BOT_TOKEN);

// and deploy your commands!
(async () => {
	try {
		console.log(`Started refreshing ${commands.length} application (/) commands.`);

		// The put method is used to fully refresh all commands in the guild with the current set
		const data = await rest.put(
			Routes.applicationGuildCommands(process.env.BOT_CLIENT, process.env.GUILD_ID),
			{ body: commands },
		);

		console.log(`Successfully reloaded ${data.length} application (/) commands.`);
	} catch (error) {
		// And of course, make sure you catch and log any errors!
		console.error(error);
	}
})();

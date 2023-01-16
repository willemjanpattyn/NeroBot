const { SlashCommandBuilder } = require('discord.js');

function getAllCustomCommands(){
    var db = require("../run.js").db;
    let choices = [];
    
    return new Promise(async function(resolve, reject){
        try {
            await db.query("SELECT * FROM commands;", (err, result) => {
                  if (err) {
                    console.log(err);
                    reject(err);
                  }

                  for (let row of result.rows) {
                    var commandName = row.command_name;
                    var commandVal = row.value;
                    if (row.command_name.startsWith("!")){
                        commandName = row.command_name.substring(1);
                    }
                    //choices.push(commandName);
            
                    choices.push(
                        {
                            name: commandName,
                            value: commandVal
                        }
                    )
                  }
                  resolve(choices);
                }
              );
        } catch (error) {
            reject(error)
        }
    });

}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('command')
        .setDescription('Custom commands')
        .addStringOption((option) =>
            option
                .setName('use')
                .setDescription('Search to find commands')
                .setAutocomplete(true)),
    async autocomplete(interaction){
        const focusedValue = interaction.options.getFocused();
        const choices = await getAllCustomCommands();
        const filtered = choices.filter(choice => choice.name.startsWith(focusedValue)).slice(0,25);
        console.log(filtered);
        await interaction.respond(
			filtered.map(choice => ({ name: choice.name, value: choice.value })),
		);
    },
    async execute(interaction) {
        const value = interaction.options.getString('use');
        await interaction.reply(value);
	},
}
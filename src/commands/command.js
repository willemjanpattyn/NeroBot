const { SlashCommandBuilder } = require('discord.js');

function addCommand(commandName,content) {
    var db = require("../run.js").db;
    
    return new Promise(async function(resolve, reject){
        try {
            await db.query(`INSERT INTO commands VALUES ('${commandName}','${content}');`, (err, result) => {
                  if (err) {
                    console.log(err);
                    resolve({content: `**${commandName}** may already exist. Please use a different name!`});
                  } else {
                    resolve({content: `**${commandName}** has been successfully created!`});
                  }
                }
              );
        } catch (error) {
            reject(error)
        }
    });
}

function renameCommand(oldCommand,newCommand) {
    var db = require("../run.js").db;
    
    return new Promise(async function(resolve, reject){
        try {
            await db.query(`UPDATE commands SET command_name = '${newCommand}' WHERE command_name = '${oldCommand}';`, (err, result) => {
                  if (err) {
                    console.log(err);
                    resolve({content: `**${newCommand}** may already exist. Please rename differently!`});
                  } else if (result.rowCount < 1) {
                    resolve({content: `You are trying to rename **${oldCommand}**, which does not exist.`});
                  } else {
                    resolve({content: `${oldCommand} has been successfully renamed to **${newCommand}**!`});
                  }
                }
              );
        } catch (error) {
            reject(error)
        }
    });
}

function editCommand(commandName,newContent) {
    var db = require("../run.js").db;
    
    return new Promise(async function(resolve, reject){
        try {
            await db.query(`UPDATE commands SET value = '${newContent}' WHERE command_name = '${commandName}';`, (err, result) => {
                  if (err) {
                    console.log(err);
                    resolve({content: `An error occurred while updating the command.`});
                  } else if (result.rowCount < 1) {
                    resolve({content: `You are trying to update **${commandName}**, which does not exist.`});
                  } else {
                    resolve({content: `The content of ${commandName} has been successfully modified.`});
                  }
                }
              );
        } catch (error) {
            reject(error)
        }
    });
}

function findCustomCommands(search){
    var db = require("../run.js").db;
    let choices = [];
    
    return new Promise(async function(resolve, reject){
        try {
            await db.query(`SELECT * FROM commands WHERE command_name LIKE '%${search}%' LIMIT 25;`, (err, result) => {
                  if (err) {
                    console.log(err);
                    reject(err);
                  }

                  for (let row of result.rows) {
                    var commandName = row.command_name;
                    if (row.command_name.startsWith("!")){
                        commandName = row.command_name.substring(1);
                    }
                    choices.push(commandName);
                  }
                  resolve(choices);
                }
              );
        } catch (error) {
            reject(error)
        }
    });
}

function getCustomCommand(command) {
    var db = require("../run.js").db;
    
    return new Promise(async function(resolve, reject){
        try {
            await db.query(`SELECT * FROM commands WHERE command_name = '${command}';`, (err, result) => {
                  if (err) {
                    console.log(err);
                    reject(err);
                  }

                  for (let row of result.rows) {
                    var value = row.value;
                  }
                  if (value === undefined) {
                    resolve({content: `**${command}** command does not exist!`});
                  } else {
                    resolve(value);
                  }
                }
              );
        } catch (error) {
            reject(error)
        }
    });
}

function isReservedCommand(commandName) {
    var isReserved = false;
    if(commandName == "add" || commandName == "find" || commandName == "cl" || commandName == "edit" || commandName == "rename" || commandName == "bday" || commandName == "fgo-show" || commandName == "fgo-edit" || commandName == "help"){
        isReserved = true;
    } else if (commandName.includes("padoru")) {
        isReserved = true;
    }

    return isReserved
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('command')
        .setDescription('Custom commands')
        .addSubcommand((subcommand) =>
            subcommand
                .setName('use')
                .setDescription('Use a custom command')
                .addStringOption((option) =>
                    option
                        .setName('search')
                        .setDescription('Search to find a custom command you want to use')
                        .setRequired(true)
                        .setAutocomplete(true))
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName('add')
                .setDescription('Add a new custom command')
                .addStringOption((option) =>
                    option
                        .setName('name')
                        .setDescription('The name you want to give new command')
                        .setMinLength(2)
                        .setMaxLength(20)
                        .setRequired(true))
                .addStringOption((option) =>
                    option
                        .setName('text')
                        .setDescription('The text content you want to give the new custom command'))
                .addAttachmentOption((option) =>
                    option
                        .setName('file')
                        .setDescription('The image or file you want to give the new custom command'))
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName('rename')
                .setDescription('Rename a custom command')
                .addStringOption((option) =>
                    option
                        .setName('old')
                        .setDescription('The custom command you want to rename')
                        .setRequired(true)
                        .setAutocomplete(true))
                .addStringOption((option) =>
                    option
                        .setName('new')
                        .setDescription('The new name you want to give the custom command')
                        .setMinLength(2)
                        .setMaxLength(20)
                        .setRequired(true))
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName('edit')
                .setDescription('Edit the content of an existing command. A file upload is prioritized.')
                .addStringOption((option) =>
                    option
                        .setName('command')
                        .setDescription('The custom command you want to change the content of')
                        .setRequired(true)
                        .setAutocomplete(true))
                .addStringOption((option) =>
                    option
                        .setName('text')
                        .setDescription('The text content you want to give the custom command'))
                .addAttachmentOption((option) =>
                    option
                        .setName('file')
                        .setDescription('The image or file you want to give the custom command'))
        ),
    async autocomplete(interaction){
        const focusedValue = interaction.options.getFocused();
        const choices = await findCustomCommands(focusedValue);
        await interaction.respond(
			choices.map(choice => ({ name: choice, value: choice })),
		);
    },
    async execute(interaction) {
        const subCmd = interaction.options.getSubcommand();
        if (subCmd === 'use') {
            const commandName = interaction.options.getString('search');
            var reply = await getCustomCommand(commandName);
        } else if (subCmd === 'add') {
            const commandName = interaction.options.getString('name');
            if (!isReservedCommand(commandName)) {
                const textContent = interaction.options.getString('text');
                const fileContent = interaction.options.getAttachment('file');
    
                if (fileContent !== null) {
                    var reply = await addCommand(commandName,fileContent.attachment);
                } else if (textContent !== null) {
                    var reply = await addCommand(commandName,textContent);
                } else {
                    var reply = "Please input text or upload a file to assign to the new command.";
                }
            } else {
                if (commandName.includes("padoru")) {
                    var reply = "I will not tolerate such a command, Praetor! <:neroDisgust:781128108891832342>";
                } else {
                    var reply = "This command name is reserved. Please choose a different name.";
                }
            }
        } else if (subCmd === 'rename') {
            const oldCmd = interaction.options.getString('old');
            const newCmd = interaction.options.getString('new');
            if (!isReservedCommand(newCmd)) {
                var reply = await renameCommand(oldCmd,newCmd);
            } else {
                if (newCmd.includes("padoru")) {
                    var reply = "I will not tolerate such a command, Praetor! <:neroDisgust:781128108891832342>";
                } else {
                    var reply = "This command name is reserved. Please choose a different name.";
                }
            }
            
        } else if (subCmd === 'edit') {
            const commandName = interaction.options.getString('command');
            const textContent = interaction.options.getString('text');
            const fileContent = interaction.options.getAttachment('file');

            if (fileContent !== null) {
                var newContent = fileContent.attachment;
            } else if (textContent !== null) {
                var newContent = textContent;
            }
            var reply = await editCommand(commandName,newContent);
        }

        await interaction.reply(reply);
	},
}
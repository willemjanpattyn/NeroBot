const Discord = require('discord.js');
const client = new Discord.Client();

//const path = require('path');

//client.registry
//    // Registers your custom command groups
//    .registerGroup('social', 'Social commands')
//    // Registers all built-in groups, commands, and argument types
//    .registerDefaults()
//    // Registers all of your commands in the ./commands/ directory
//    .registerCommandsIn(path.join(__dirname, "/commands"));


client.on('ready', () => {
    console.log('I am ready, Praetor!')
});

client.on('message', message => {
    if (message.content === '!umu')
        message.channel.sendMessage("<:nero_umu:343092064822755338>");
});

//Login
client.login(process.env.BOT_TOKEN);

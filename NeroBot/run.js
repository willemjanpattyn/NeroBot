const Commando = require('discord.js-commando');
const client = new Commando.Client({
    owner: '232430593193803777'
});

const path = require('path');

client.registry
    // Registers your custom command groups
    .registerGroups([
        ['social', 'Social commands']
    ])
    // Registers all built-in groups, commands, and argument types
    .registerDefaults()
    // Registers all of your commands in the ./commands/ directory
    .registerCommandsIn(path.join(__dirname, '/commands'));


//client.on('read', () => {
//    console.log('I am ready, Praetor!')
//});

//client.on('message', message => {
//    if (message.content === 'ping') {
//        message.reply('pong');
//    }
//});


//Login
client.login(process.env.BOT_TOKEN);

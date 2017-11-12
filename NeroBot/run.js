const Commando = require('discord.js-commando');
const client = new Commando.Client({
    owner: '232430593193803777'
});

const path = require('path');

client.registry
    // Registers your custom command groups
    .registerGroup('social', 'Social commands')
    // Registers all built-in groups, commands, and argument types
    .registerDefaults()
    // Registers all of your commands in the ./commands/ directory
    .registerCommandsIn(path.join(__dirname, "/commands"));


client.on('ready', () => {
    console.log('I am ready, Praetor!')
});


//Login
client.login(process.env.BOT_TOKEN);

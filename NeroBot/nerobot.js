const Discord = require('discord.js');
const client = new Discord.Client();

client.on('read', () => {
    console.log('I am ready, Praetor!')
});

client.on('message', message => {
    if (message.content === 'ping') {
        message.reply('pong');
    }
});

//Login
client.login(process.env.BOT_TOKEN);

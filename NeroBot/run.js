const Discord = require("discord.js");
const client = new Discord.Client();

const prefix = "!";

client.on("ready", () => {
    console.log("I am ready, Praetor!");
    client.user.setGame("with her Praetor!");
});

client.on("message", message => {
    if (message.author.bot) return;
    if (message.content.indexOf(prefix) !== 0) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    //Commands
    try {
        let commandFile = require(`./commands/${command}.js`);
        commandFile.run(client, message, args);
    } catch (err) {
        console.error(err);
    }
});

client.on("guildMemberAdd", member => {
    const channel = member.guild.channels.find("name", "general");
    const channel2 = member.guild.channels.find("name", "name-color");
    if (!channel || !channel2) return;
    channel.send(`umu, a new Praetor! Welcome to our server,  ${member}!!`);
    channel2.send(`${member}, if you wish to change your color and get a role name, mention them here!`);
});

//Login
client.login(process.env.BOT_TOKEN);

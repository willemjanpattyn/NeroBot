const Discord = require("discord.js");
const client = new Discord.Client();

const { Client } = require("pg");

const prefix = "!";
exports.prefix = prefix;

var db;

client.on("ready", () => {
    console.log("I am ready, Praetor!");
    client.user.setGame("with her Praetor!");

    db = null;
    try {
        if (db == null) {
            db = new Client({
                connectionString: process.env.DATABASE_URL,
                ssl: true,
            });
            db.connect();
        }
    } catch (err) {
        console.log(err);
    }
    exports.db = db;
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
        //Try to look if command in commands table
        const custCommmand = (prefix + command).toLowerCase();
        db.query(`SELECT * FROM commands WHERE command_name = '${custCommmand}'`, (err, result) => {
            if (err) {
                return console.log(err);
            }
            var img = "";
            for (let row of result.rows) {
                img = row.img_url;
            }
            message.channel.send(img);
        });
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

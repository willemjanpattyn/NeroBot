const Discord = require("discord.js");
const client = new Discord.Client();

const { Client } = require("pg");

const prefix = "!";
exports.prefix = prefix;

var db;

const cooldown = new Set();

client.on("ready", () => {
    console.log("I am ready, Praetor!");
    client.user.setGame("with her Praetor!");
    setInterval(getDaysUntil, 60000);

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

function getDaysUntil() {

    var episodeCount = 7;
    db.query(`SELECT * FROM fate_extra_eps WHERE episode_count = ${episodeCount};`, (err, result) => {
        if (err) {
            console.log(err);
        }
        else {
            for (let row of result.rows) {
                //var releaseDate = new Date("Jan 27, 2018 16:00:00");
                var releaseDate = new Date(row.release_date);
                releaseDate.setHours(15, 0, 0, 0);

                var oneDay = 24 * 60 * 60 * 1000;
                var today = new Date();
                var daysLeft = (releaseDate.getTime() - today.getTime()) / oneDay;
                console.log(daysLeft);
                var distance = releaseDate.getTime() - today.getTime();

                var days = Math.floor(distance / (1000 * 60 * 60 * 24));
                var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                var seconds = Math.floor((distance % (1000 * 60)) / 1000);

                if (daysLeft <= 0) {
                    //client.user.setGame("Fate/EXTRA IS OUT!!!");
                    episodeCount++;
                }
                else {
                    //client.user.setGame("Episode " + episodeCount + days + "d " + hours + "h " + minutes + "m " + "left until Fate/EXTRA!!");
                    client.user.setGame(`${days}d ${hours}h ${minutes}m left until Fate/EXTRA ep ${episodeCount}!!`);
                    //console.log(`${days}d ${hours}h ${minutes}m left until Fate/EXTRA ep ${episodeCount}!!`);
                }
            }
        }
    });
}

client.on("message", async message => {

    if (message.author.bot) return;

    ////Special Xmas message
    //if (message.content.toLowerCase().includes("merry christmas") || message.content.toLowerCase().includes("merry xmas")) {
    //    return message.channel.send("PADORU PADORUUU~");
    //}

    if (message.content.indexOf(prefix) !== 0) return;

    if (cooldown.has(message.author.id)) {
        console.log(`COOLDOWN_LOG: User ${message.author.username} (${message.author.id}) set on cooldown`);
        console.log();
        return message.channel.send("Easy there, Praetor! I'm going to become angry!!")
            .then(msg => {
                msg.delete(5000)
            });
    }

    cooldown.add(message.author.id);
    setTimeout(() => {
        cooldown.delete(message.author.id);
    }, 2500);

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
        console.log(`COMMAND_LOG: User ${message.author.username} (${message.author.id}) issued !command command`);
    }
});

client.on("guildMemberAdd", member => {
    const channel = member.guild.channels.find("name", "general");
    const channel2 = member.guild.channels.find("name", "name-color");
    if (!channel || !channel2) return;
    channel.send(`umu, a new Praetor! Welcome to our server,  ${member}!!`);
    channel2.send(`${member}, if you wish to change your color and get a role name, mention them here!`);
    console.log(`USERJOIN_LOG: User ${member.username} (${member.id}) joined the server.`);
});

//Login
client.login(process.env.BOT_TOKEN);

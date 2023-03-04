'use strict';

require("dotenv").config({path:__dirname+'/../process.env'});
const { Player } = require("discord-player")

const fs = require('node:fs');
const path = require('node:path');

// Discord client
const DiscordClient = require("discord.js").Client;
const {GatewayIntentBits, EmbedBuilder, ActivityType, Partials, Events, Collection} = require("discord.js");

const client = new DiscordClient({ 
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.GuildMessageTyping,
    GatewayIntentBits.GuildVoiceStates,
  ],
  partials: [Partials.Channel],
});

// Load slash commands
// https://discordjs.guide/creating-your-bot/command-handling.html#loading-command-files
client.commands = new Collection();

const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	// Set a new item in the Collection with the key as the command name and the value as the exported module
	if ('data' in command && 'execute' in command) {
		client.commands.set(command.data.name, command);
	} else {
		console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
	}
}

// Discord player singleton
const player = Player.singleton(client);

// Slash command listener
client.on(Events.InteractionCreate, async interaction => {
  const command = interaction.client.commands.get(interaction.commandName);
  if (!command) {
    console.error(`No command matching ${interaction.commandName} was found.`);
    return;
  }

  if (interaction.isChatInputCommand()) {
    try {
      await command.execute(interaction);
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
    }
  }
  else if (interaction.isAutocomplete()) {
		try {
			await command.autocomplete(interaction);
		} catch (error) {
			console.error(error);
		}
  }

});

// Postgres client
const PostgresClient = require("pg").Client

const gwId = "434375055917711360";

const prefix = "!";
exports.prefix = prefix;

var db;

const cooldown = new Set();

client.on("ready", () => {
  console.log("I am ready, Praetor!");
  client.user.setActivity('her Praetor closely!', {type: ActivityType.Watching});

  db = null;
  try {
    if (db == null) {
      db = new PostgresClient({
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        user: process.env.DB_USER,
        password: process.env.DB_PW,
      });
      db.connect();
    }
  } catch (err) {
    console.log(err);
  }
  exports.db = db;
});

//New member join message
client.on("guildMemberAdd", member => {
  console.log(member);
  console.log("inside guildMemberAdd");
  
  const channel = member.guild.channels.cache.find(ch => ch.name === 'general');
  if (!channel) return;

  let welcomeTitle = 'Welcome to the Nero Mancave!';
  let welcomeMessage = `For rules and more information on the server, please check <#549612774431391747>. If you wish to change your color and get a role name, you can mention them in <#348786731421794315>!
  \nEnjoy your stay! ${client.emojis.cache.get("473851038592663552")}`;
  let guildIcon = member.guild.iconURL();
  let welcomeImg = 'https://cdn.discordapp.com/attachments/549671414857334794/781133659829960735/nero_welcome.gif';

  const welcomeEmbed = new EmbedBuilder()
    .setColor('#BF0000')
    .setTitle(welcomeTitle)
    .setDescription(welcomeMessage)
    .setThumbnail(guildIcon)
    .setImage(welcomeImg)
    .setFooter({ text: `Spiritron Hacker: ${member.guild.members.cache.filter(member => !member.user.bot).size}`});


    channel.send(
      {
        content: `Youkoso ${member}! <:neroPog:738375594495967292>`,
        embeds: [welcomeEmbed]
      }
    );
});

//Server boost message
client.on('guildMemberUpdate', (oldMember, newMember) => {

  console.log(oldMember.id);

  const hadRole = oldMember.roles.cache.find(role => role.id === '587326284527566859');
  const hasRole = newMember.roles.cache.find(role => role.id === '587326284527566859');

  if(!hadRole && hasRole){
    const channel = newMember.guild.channels.cache.find(ch => ch.name === 'general');
    if (!channel) return;

    let guildIcon = oldMember.guild.iconURL();
    let boostTitle = 'Thank you for mana transferring!';
    let boostMessage = `Open the gates! Raise the curtains for our new Mana Transferer!\n\nThank you very much for the support, ${newMember}! ${client.emojis.cache.get("473851038592663552")}`;
    let boostImg = 'https://cdn.discordapp.com/attachments/549671414857334794/781131980741017630/nero_boost.gif';

    const boostEmbed = new EmbedBuilder()
      .setColor('#F47FFA')
      .setTitle(boostTitle)
      .setDescription(boostMessage)
      .setThumbnail(guildIcon)
      .setImage(boostImg);
    
      channel.send({embeds: [boostEmbed]});
  }
});

process.on("unhandledRejection", (error) => {
  console.log("unhandledRejection", error.message);
});

client.on("messageCreate", async (message) => {
  if (message.author.bot) return;

  if(message.content.toLowerCase().includes("padoru")){
    return message.channel.send("<:neroDisgust:781128108891832342>");
  }

  if (message.content.indexOf(prefix) !== 0) return;

  if (cooldown.has(message.author.id)) {
    console.log(
      `COOLDOWN_LOG: User ${message.author.username} (${message.author.id}) set on cooldown`
    );
    console.log();
    return message.channel
      .send("Easy there, Praetor! I'm going to become angry!!")
      .then((msg) => {
        msg.delete(5000);
      });
  }

  cooldown.add(message.author.id);
  setTimeout(() => {
    cooldown.delete(message.author.id);
  }, 2500);

  const args = message.content.slice(prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();

  if (command == "optin") {
    if (
      message.channel.name != "my-room" &&
      message.channel.name != "bot-testing"
    )
      return;
    if (args[0] != null) {
      if (args[0].toLowerCase() == "gw") {
        if (!message.member.roles.cache.find(role => role.id === gwId)) {
          message.member
            .roles.add(gwId)
            .then(
              console.log(
                `OPT_IN: ${message.author.username} opted in Group Watch`
              )
            )
            .catch(console.error);
          message.channel.send(
            `You are now opted in the Group Watch role, ${message.author.username}! ${client.emojis.cache.get("473851038592663552")}`
          );
        } else {
          message.channel.send("You are already opted in this role.");
        }
      } else {
        message.channel.send("Please enter a valid argument: `gw`");
      }
    }
    return;
  } else if (command == "optout") {
    if (
      message.channel.name != "my-room" &&
      message.channel.name != "bot-testing"
    )
      return;
    if (args[0] != null) {
      if (args[0].toLowerCase() == "gw") {
        if (message.member.roles.cache.find(role => role.id === gwId)) {
          message.member
            .roles.remove(gwId)
            .then(
              console.log(
                `OPT_OUT: ${message.author.username} opted out of Group Watch`
              )
            )
            .catch(console.error);
          message.channel.send(
            `You are now opted out of the Group Watch role, ${message.author.username}.`
          );
        } else {
          message.channel.send("You are not opted in this role.");
        }
      } else {
        message.channel.send("Please enter a valid argument: `gw`");
      }
    }
    return;
  }

  //Custom command command
  //Rename command
  if (command == "rename") {
    if (args.length < 2) {
      return message.channel.send(
        "Please input the correct command format\n```!rename old new```"
      );
    }
    db.query(
      `UPDATE commands SET command_name = '${args[1]}' WHERE command_name = '${args[0]}';`,
      (err, result) => {
        if (err) {
          message.channel.send(
            "New command name may already exist, please use a different name!"
          );
          return console.log(err);
        } else if (result.rowCount < 1) {
          return message.channel.send(
            "The command you're trying to update doesn't exist!"
          );
        } else {
          console.log(
            `COMMAND_LOG: User ${message.author.username} (${message.author.id}) updated command ${args[0]} to ${args[1]}`
          );
          return message.channel.send(
            `Renamed command ${args[0]} to **${args[1]}**`
          );
        }
      }
    );
  }
  //Edit URL command
  else if (command == "edit") {
    console.log(args.length, args[0], args[1], args[2]);
    if (args.length < 2) {
      return message.channel.send(
        "Please input the correct command format\n```!edit yourcommand new_command_value```"
      );
    }
    var value = "";
    if (args.length >= 2) {
      for (var i = 1; i < args.length; i++) {
        value += args[i] + " ";
      }
    }
    db.query(
      `UPDATE commands SET value = '${value}' WHERE command_name = '${args[0]}';`,
      (err, result) => {
        if (err) {
          message.channel.send("An error has occured!");
          return console.log(err);
        } else if (result.rowCount < 1) {
          return message.channel.send(
            "The command you're trying to update doesn't exist!"
          );
        } else {
          console.log(
            `COMMAND_LOG: User ${message.author.username} (${message.author.id}) updated value of ${args[0]} to ${value}`
          );
          return message.channel.send(`Updated value of **${args[0]}**`);
        }
      }
    );
  }
  //Find command
  else if(command == "find"){
    if (args.length < 1) {
      return message.channel.send(
        "Please input the correct command format\n```!find search_value```"
      );
    }
    db.query(`SELECT * FROM commands WHERE command_name ILIKE '%${args[0]}%';`, (err, result) => {
      if (err) {
        message.channel.send(
          "Something went wrong finding the command..."
        );
        return console.log(err);
      }
      else if(args[0].length <= 2){
        return message.channel.send(
          "Please enter a search value of more than 2 characters."
        );
      }
      else if(result.rowCount < 1){
        return message.channel.send(
          "No search results..."
        );
      }
      console.log(result.rows);
      let output = `${result.rowCount} result(s) found for ${args[0]}: `;

      for(let i = 0; i < result.rowCount; i++){
        //If reached the end
        if(i == result.rowCount - 1){
          output+= `\`${result.rows[i].command_name}\``;
        } else{
          output+= `\`${result.rows[i].command_name}\`, `;
        }
      }
      return message.channel.send(output);
    });
  }
  //Delete command
  else if (command == "del" || command == "delete") {
    if (message.member.roles.cache.find(role => role.id === '343063483836792833')) {
      console.log(args[0], args.length);
      if (args.length < 1 || !args[0].startsWith(prefix)) {
        return message.channel.send(
          "Please input the correct command format\n```!delete todeletecommand```"
        );
      }
      db.query(
        `DELETE FROM commands WHERE command_name = '${args[0]}';`,
        (err, result) => {
          if (err) {
            message.channel.send(
              "Something went wrong deleting the command..."
            );
            return console.log(err);
          } else if (result.rowCount < 1) {
            return message.channel.send(
              "The command you're trying to delete doesn't exist!"
            );
          }
          console.log(
            `COMMAND_LOG: User ${message.author.username} (${message.author.id}) deleted ${args[0]}`
          );
          return message.channel.send(
            `Succesfully deleted the **${args[0]}** command!`
          );
        }
      );
    } else {
      return message.channel.send(
        "You don't have the permission to use this command!"
      );
    }
  }
  //Insert command
  else if (command == "add") {
    if (args.length < 2 || !args[0].startsWith(prefix)) {
      return message.channel.send(
        "Please input the correct command format\n```!add yourcommand command_value```"
      );
    } else {
      var commandName = ("" + args[0]).toLowerCase();

      if(commandName == "!add" || commandName == "!find" || commandName == "!cl" || commandName == "!edit" || commandName == "!rename" || commandName == "!bday" || commandName == "!fgo-show" || commandName == "!fgo-edit" || commandName == "!help"){
        return message.channel.send("This command name is reserved. Please choose a different name.");
      }
      if(commandName.includes("padoru")){
        return message.channel.send(`I will not tolerate such a command, Praetor! ${client.emojis.cache.get("781128108891832342")}`);
      }
      var value = "";
      if (args.length >= 2) {
        for (var i = 1; i < args.length; i++) {
          if (i == args.length) {
            value += args[i];
          } else {
            value += args[i] + " ";
          }
        }
      }
      

      db.query(
        `INSERT INTO commands VALUES ('${commandName}','${value}');`,
        (err, result) => {
          if (err) {
            return message.channel.send(
              "Command may already exist, please use a different name!"
            );
          }
          console.log(
            `COMMAND_LOG: User ${message.author.username} (${message.author.id})`
          );
          return message.channel.send(`**${commandName}** has been created!`);
        }
      );
    }
  }

  //Commands
  try {
    let commandFile = require(`./commands/${command}.js`);
    commandFile.run(client, message, args);
  } catch (err) {
    //Try to look if command in commands table
    const custCommmand = (command).toLowerCase();
    db.query(
      `SELECT * FROM commands WHERE command_name = '${custCommmand}'`,
      (err, result) => {
        if (err) {
          return console.log(err);
        }
        var val = "";
        for (let row of result.rows) {
          val = row.value;
        }
        message.channel.send(val);
      }
    );
    //console.log(`COMMAND_LOG: User ${message.author.username} (${message.author.id}) issued !command command`);
  }
});

//Login
client.login(process.env.BOT_TOKEN);

const { SlashCommandBuilder } = require('discord.js');

function getHelpText(category) {
    var output = `:warning: **This is a legacy command!** Type **/${category}** to use the slash command equivalent. There will be no support for legacy commands in the future.\n\n`;
    switch(category) {
        case 'bday': 
            output += "`!bday` __`View birthdays of members or set your own birthday`__\n\n";
            output += "**Usage:** `!bday [set] <DD/MM>` | `!bday <user>`\n\n";
            output += "**Examples:**\n`!bday` Shows list of birthdays of members\n`!bday set 12/05` Set or update your birthday\n`!bday Nero` View user's birthday (search or mention)\n\n";
            break;
        case 'fgo':
            output += "`!fgo-show | !fgo-edit` __`View or update FGO profile`__\n\n";
            output += "**Usage:** `!fgo-show <user>` | `!fgo-edit [IGN: ign | ID: id | Region: <JP|NA|TW|CH|KR>]` [Add screenshot as attachment!]\n\n";
            output += "**Examples:**\n`!fgo-show` Shows own FGO profile\n";
            output += "`!fgo-show Nero` Shows user's FGO profile (search or mention)\n";
            output += "`!fgo-edit IGN: Duwangel | ID: 123,456,789 | Region: JP` Creates or updates your FGO profile\n";
            output += "`!fgo-edit IGN: Yosoku Assistant ` Updates only your IGN";
            break;
        case 'opt':
            output += "`!optin | !optout` __`Adds or removes mentionable role`__\n\n";
            output += "**Usage:** `!optin <role>` | `!optout <role>`\n";
            output += "**Args:** `gw`\n\n";
            output += "**Examples:**\n`!optin gw` Opts you in the Group Watch role\n";
            output += "`!optout gw` Opts you out of the Group Watch role";
            break;
        case 'command':
            output += "__`View custom command list or set your own commands`__\n\n";        
            output += "**Usage examples:**\n`!cl` Shows list of of available custom created commands as a DM (Due to character limit per post, Nero will send several messages) [DEPRECATED]\n";
            output += "`!add !yourcommand http://i.imgur.com/YrgluxT.gif` Adds your own command\n";
            output += "`!find search_value` Find a command\n";
            output += "`!rename !old !new` Rename a command\n";
            output += "`!edit !yourcommand http://i.imgur.com/YrgluxT.gif` Edits value of the command\n";
            output += "`!delete !yourcommand` Deletes the command [Admin only]\n";
            break;
        default:
            output += ":clipboard: | **Nero Command List**\n";
            output += "Use `!help <command>` to get more info on a specific command, for example: `!help bday`\n\n";
            output += "`bday`, `command`, `opt`, `fgo`";
    }

    return output;
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('helplegacy')
		.setDescription('Show information for a specific legacy command')
        .addStringOption(option =>
            option.setName('category')
                .setDescription('Command category')
                .setRequired(true)
                .addChoices(
                    { name: 'birthday', value: 'bday'},
                    { name: 'Fate/Grand Order', value: 'fgo'}, 
                    { name: 'role opt-ins', value: 'opt'}, 
                    { name: 'custom commands', value: 'command'}, 
                )
            ),
	async execute(interaction) {
        const category = interaction.options.getString('category');

		await interaction.reply({content: getHelpText(category), ephemeral: true});
	},
    run: (client, message, args) => {

        if (args == "") {
            var category = "none";
        }
        else {
            category = args[0].toLowerCase();
        }
        let output = getHelpText(category);
        
        message.channel.send(output);
    }
};
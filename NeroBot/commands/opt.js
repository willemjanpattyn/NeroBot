const { SlashCommandBuilder } = require('discord.js');

const roles = [
    {
        name: 'Group Watch',
        value: '434375055917711360'
    },
    {
        name: 'Cotton pickers',
        value: '624256525472366607'
    },
    {
        name: 'epyck_gaemurz',
        value: '696797879490183178'
    },
];

function optInRole(e,roleId) {
    if (!e.member.roles.cache.find(role => role.id === roleId)) {
        e.member
          .roles.add(roleId)
          .then(
            console.log(
              `OPT_IN: ${e.user.username} opted in Group Watch`
            )
          )
          .catch(console.error);
        return `You are now opted in the ${roles.find(role => role.value === roleId).name} role, ${e.user.username}! <:umu:473851038592663552>`;
      } else {
       return "You are already opted in this role.";
    }
}

function optOutRole(e,roleId) {
    if (e.member.roles.cache.find(role => role.id === roleId)) {
        e.member
          .roles.remove(roleId)
          .then(
            console.log(
              `OPT_OUT: ${e.user.username} opted out of ${roles.find(role => role.value === roleId).name}`
            )
          )
          .catch(console.error);

        return `You are now opted out of the Group Watch role, ${e.user.username}.`;
    } else {
        return "You are not opted in this role.";
    }
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('opt')
		.setDescription('Opt-in/out a role')
        .addSubcommand((subcommand) =>
            subcommand
            .setName('in')
            .setDescription('Opt-in role')
            .addStringOption((option) => 
                option
                    .setName('role')
                    .setDescription('Role you want to opt-in')
                    .setRequired(true)
                    .setAutocomplete(true)
            )
      )
        .addSubcommand((subcommand) =>
            subcommand
            .setName('out')
            .setDescription('Opt-out role')
            .addStringOption((option) => 
                option
                    .setName('role')
                    .setDescription('Role you want to opt-out')
                    .setRequired(true)
                    .setAutocomplete(true)
            )
      ),
    async autocomplete(interaction){
        await interaction.respond(roles);
    },
	async execute(interaction) {
        const role = interaction.options.getString('role');
        const subCmd = interaction.options.getSubcommand();

        if (subCmd === 'in') {
            var reply = optInRole(interaction,role);
        }
        else if (subCmd === 'out') {
            var reply = optOutRole(interaction,role);
        }

        await interaction.reply(reply);
	}
};
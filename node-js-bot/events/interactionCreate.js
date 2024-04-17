const { InteractionType } = require("discord.js");

module.exports = {
    name: 'interactionCreate',
    async execute(interaction) {
        if (interaction.isChatInputCommand()) {
            const command = interaction.client.commands.get(interaction.commandName);
            if (!command) return;
            try {
                await command.execute(interaction);
            }
            catch (error) {
                console.error(error);
                await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
            }
        } else if (interaction.isButton()) {
            const { customId } = interaction;
            const button = interaction.client.buttons.get(customId);
            if (!button) {
                console.log('button does not exist');
                return;
            }
            try {
                await button.execute(interaction);
            }
            catch (error) {
                console.error(error);
                await interaction.reply({ content: 'There was an error while executing this button!', ephemeral: true });
            }
        } else if (interaction.type == InteractionType.ModalSubmit) {
            const modal = interaction.client.modals.get(interaction.customId);
            if (!modal) return;
            try {
                await modal.execute(interaction);
            }
            catch (error) {
                console.log('idk the error not showing');
                console.error(error);
                await interaction.reply({ content: 'There was an error while executing this modal!', ephemeral: true });
            }
        } else {
            return;
        }
    },
};
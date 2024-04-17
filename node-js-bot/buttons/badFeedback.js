const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    data: {
        name: 'badFeedback',
    },
    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });
        // TODO: Send feedback to database
        const message = interaction.message;

        const disabledButton = new ButtonBuilder()
            .setCustomId('disabled')
            .setLabel('Feedback Sent!')
            .setStyle(ButtonStyle.Danger)
            .setDisabled(true);

        const row = new ActionRowBuilder()
            .addComponents(disabledButton);

        await message.edit({ components: [row] });
        await interaction.editReply({
            content: 'Feedback sent! Thank you!',
            ephemeral: true
        });
    },
};
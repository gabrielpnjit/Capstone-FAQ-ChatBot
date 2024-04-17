const { ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');

module.exports = {
    data: {
        name: 'badFeedback',
    },
    async execute(interaction) {
        await interaction.deferReply();
        // TODO: Send feedback to database

        await interaction.editReply({
            content: 'Bad Feedback sent!',
            ephemeral: true
        });
    },
};
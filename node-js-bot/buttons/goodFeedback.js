const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { Logs } = require('../db/connection.js');

module.exports = {
    data: {
        name: 'goodFeedback',
    },
    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });
        const message = interaction.message;

        // creating disabled buttons
        const disabledButton = new ButtonBuilder()
            .setCustomId('disabled')
            .setLabel('Feedback Sent!')
            .setStyle(ButtonStyle.Success)
            .setDisabled(true);

        const row = new ActionRowBuilder()
            .addComponents(disabledButton);

        const feedbackValue = 'Good'
        const questionId = message.id;

        // update bot log with feedback based on questionId
        await Logs.findOneAndUpdate({ questionId: questionId }, { feedback: feedbackValue })
            .then(async res => {
                console.log('Successfully sent good feedback!')
                await message.edit({ components: [row] });
                await interaction.editReply({
                    content: 'Feedback sent! Thank you!',
                    ephemeral: true
                });
            })
            .catch(async err => {
                console.error(`Error updating feedback!: ${err}`)
            })
    },
};
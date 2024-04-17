const { SlashCommandBuilder, ActionRowBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, PermissionFlagsBits } = require('discord.js');


module.exports = {
    data: {
        name: 'goodFeedback',
    },
    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });
        // TODO: Send feedback to database
        const channelId = interaction.channel.id;
        const messageId = interaction.message.id;
        const channel = await interaction.client.channels.fetch(channelId);
        const message = await channel.messages.fetch(messageId);

        const disabledButton = new ButtonBuilder()
            .setCustomId('disabled')
            .setLabel('Feedback Sent!')
            .setStyle(ButtonStyle.Success)
            .setDisabled(true);

        const row = new ActionRowBuilder()
            .addComponents(disabledButton);

        await message.edit({ components: [row] });
        await interaction.editReply({
            content: 'Good Feedback sent!',
            ephemeral: true
        });
    },
};
const { SlashCommandBuilder, ActionRowBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, PermissionFlagsBits } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies with Pong!'),
	async execute(interaction) {
		const row = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId('goodFeedback')
                .setLabel('Good!')
                .setEmoji('👍')
                .setStyle(ButtonStyle.Success),
			new ButtonBuilder()
                .setCustomId('badFeedback')
                .setLabel('Bad!')
                .setEmoji('👎')
                .setStyle(ButtonStyle.Danger),
        );

        await interaction.reply({ content: 'Hi!', components: [row] });
	},
};
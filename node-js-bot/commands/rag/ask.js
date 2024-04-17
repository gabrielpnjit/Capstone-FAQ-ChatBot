const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ask')
		.setDescription('Ask a question about the Capstone Course!')
		.addStringOption(option =>
			option.setName('question')
				.setDescription('Question to ask')
				.setRequired(true)),
	async execute(interaction) {
		await interaction.deferReply()
		const question = interaction.options.getString('question')
		// localhost changed to 127.0.0.1 because for some reason it refuses to connect with localhost
		fetch('http://127.0.0.1:8000/rag-pinecone/invoke', {
		    method: 'POST',
		    headers: {
		        'Content-Type': 'application/json',
		    },
		    body: JSON.stringify({ input: question })
		})
		.then(response => {
		    if (response.ok && response.headers.get('content-type') === 'application/json') {
		        return response.json();
		    } else {
		        throw new Error(`Error ${response.status}: ${response.statusText}`);
		    }
		})
		.then(async data => {
			const sources_contexts = data.output.context;
			// console.log(sources_contexts)
			let sources = [];
			// get unique sources
			for (let i = 0; i < sources_contexts.length; i++) {
				let curr_source = sources_contexts[i];
				if (sources.length <= 0) {
					sources.push(curr_source.metadata.source)
					console.log(sources)
				}
				else {
					for (let j = 0; j < sources.length; j++) {
						if (curr_source.metadata.source != sources[j]) {
							sources.push(curr_source.metadata.source)
						}
					}
				}
			}
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
	
			await interaction.editReply({ content: `${data.output.answer}\n\nSources: ${sources}`, components: [row] });
		})
		.catch(async error => {
		    console.error(error);
			await interaction.editReply('Error generating answer!');
		});
	},
};
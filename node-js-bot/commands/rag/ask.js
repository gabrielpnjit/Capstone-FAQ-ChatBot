const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { ATLAS_URI } = require('../../config.json');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const { Logs } = require('../../db/connection.js');

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
			let sources = [];
			let sourceData
			// get unique sources
			console.log(`Source Count: ${sources_contexts.length}`)
			for (let i = 0; i < sources_contexts.length; i++) {
				let curr_source = sources_contexts[i];
				if (sources.length <= 0) {
					sourceData = {
						source: curr_source.metadata.source,
						sourceName: curr_source.metadata.sourceName,
					}
					sources.push(sourceData);
				} 
				else {
					let unique = true;
					for (let j = 0; j < sources.length; j++) {
						if (curr_source.metadata.source == sources[j].source) {
							// console.log(`Source1: ${curr_source.metadata.source}`)
							// console.log(`Source2: ${sources[j].source}`)
							unique = false;
							break;
						}
					}
					if (unique) {
						console.log(curr_source.metadata.source)
						sourceData = {
							source: curr_source.metadata.source,
							sourceName: curr_source.metadata.sourceName,
						}
						sources.push(sourceData);
					}
				}
			}
			console.log(sources)
			// Build the button row
			const row = new ActionRowBuilder()
				.addComponents(
					new ButtonBuilder()
						.setCustomId(`goodFeedback`)
						.setLabel('Good!')
						.setEmoji('👍')
						.setStyle(ButtonStyle.Success),
					new ButtonBuilder()
						.setCustomId(`badFeedback`)
						.setLabel('Bad!')
						.setEmoji('👎')
						.setStyle(ButtonStyle.Danger),
				);
			let sourcesFormatted = [];
			for (let i = 0; i < sources.length; i++) {
				sourcesFormatted.push(`[${sources[i].sourceName}](<${sources[i].source}>)`)
			}

			await interaction.editReply({ content: `${data.output.answer}\n\nSources: ${sourcesFormatted}`, components: [row] })
			.then(async message => {
				// Save question and reply to the database
				const time = new Date().toString()
				const messageLinkUrl = `https://discord.com/channels/${interaction.guildId}/${interaction.channelId}/${message.id}`
				const log = new Logs({
					questionId: message.id,
					question: question,
					answer: data.output.answer,
					feedback: "None Given",
					timestamp: time,
					messageLink: messageLinkUrl,
					sources: JSON.stringify(sources)
				});
				await log.save();
			});
		})
		.catch(async error => {
			console.error(error);
			await interaction.editReply('Error generating answer!');
		});

		// Capture button click event and update feedback for specific question.
		// const collector = interaction.channel.createMessageComponentCollector({ time: null });
		// collector.on('collect', async (buttonInteraction) => {
		// 	const feedbackValue = buttonInteraction.customId.startsWith('badFeedback') ? 'Bad' : 'Good';
		// 	const questionId = buttonInteraction.customId.split('_')[1]; // Extract question ID from custom ID
		// 	if (questionId) {
		// 		await Log.findOneAndUpdate({ questionId: questionId }, { feedback: feedbackValue });}
		// });
	},
	
};
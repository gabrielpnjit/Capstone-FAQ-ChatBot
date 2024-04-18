const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { ATLAS_URI } = require('../../config.json');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const mongoose=require('mongoose');

const logSchema = new mongoose.Schema({
	questionId: mongoose.Schema.Types.ObjectId, // Change to ObjectId type
	question: String,
	Answer: String,
	feedback: String
});

const Log = mongoose.model('Log', logSchema);

// Connect to the MongoDB database using Mongoose
mongoose.connect(ATLAS_URI, {}) 
	.then(() => console.log('Connected to MongoDB'))
	.catch((err) => console.error('MongoDB connection error:', err));

module.exports = {
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('Ask a question about the Capstone Course!')
		.addStringOption(option =>
			option.setName('question')
				.setDescription('Question to ask')
				.setRequired(true)),
	async execute(interaction) {
		await interaction.deferReply()
		const question = interaction.options.getString('question')
		console.log(question);

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
			// get unique sources
			for (let i = 0; i < sources_contexts.length; i++) {
				let curr_source = sources_contexts[i];
				if (sources.length <= 0) {
					sources.push(curr_source.metadata.source);
				} else {
					for (let j = 0; j < sources.length; j++) {
						if (curr_source.metadata.source != sources[j]) {
							sources.push(curr_source.metadata.source);
						}
					}
				}
			}

			// Save question and reply to the database
			const log = new Log({
				questionId: new mongoose.Types.ObjectId(), // Generate a unique ID
				question: question,
				Answer: data.output.answer,
			});
			
			await log.save();
			await interaction.editReply(`${data.output.answer}\n\nSources: ${sources}`);

			// Build the button row
			const row = new ActionRowBuilder()
				.addComponents(
					new ButtonBuilder()
						.setCustomId(`goodFeedback_${log.questionId}`) //Include the question ID
						.setLabel('Good!')
						.setEmoji('👍')
						.setStyle(ButtonStyle.Success),
					new ButtonBuilder()
						.setCustomId(`badFeedback_${log.questionId}`)
						.setLabel('Bad!')
						.setEmoji('👎')
						.setStyle(ButtonStyle.Danger),
				);

			// Edit the reply with the button row
			await interaction.editReply({ content: `${data.output.answer}\n\nSources: ${sources}`, components: [row] });
		})
		.catch(async error => {
			console.error(error);
			await interaction.editReply('Error generating answer!');
		});

		// Capture button click event and update feedback for specific question.
		const collector = interaction.channel.createMessageComponentCollector({ time: null });
		collector.on('collect', async (buttonInteraction) => {
			const feedbackValue = buttonInteraction.customId.startsWith('badFeedback') ? 'Bad' : 'Good';
			const questionId = buttonInteraction.customId.split('_')[1]; // Extract question ID from custom ID
			if (questionId) {
				await Log.findOneAndUpdate({ questionId: questionId }, { feedback: feedbackValue });}
		});
	},
	
};
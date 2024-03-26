const { SlashCommandBuilder } = require('discord.js');
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
		interaction.deferReply()
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
		    // console.log(data.output);
			await interaction.editReply(data.output);
		})
		.catch(async error => {
		    console.error(error);
			await interaction.editReply('Error generating answer!');
		});
	},
};
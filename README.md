# 🤖Capstone FAQ Discord Bot❔
## About
This repo contains all components of the Capstone FAQ Discord Bot:
- RAG Langchain Endpoint
- Discord Bot
- Dashboard Website

The goal of the Capstone FAQ Discord Bot is to answer various questions related to NJIT's CS491 Capstone Course. with the ability for the bot to "learn" by adjusting its knowledge base.

The bot utilizes retrieval-augmental generation (RAG) and OpenAI's Gpt-3.5 LLM to generate responses.

The bot in action!:

![image](https://github.com/gabrielpnjit/Capstone-FAQ-ChatBot/assets/90277223/acc61a67-e7da-48cf-965e-9c0faf6792d1)

# Setup
Below is how to setup the entire project
## Langchain RAG-Pinecone Setup
\*Requires Python Version 3.11+
### 1. pip install:
- `$ pip install --upgrade langchain langchain-cli langchain-pinecone langchain-openai langchain-cohere`
- Navigate to "rag-app" directory and execute `$ pip install .`
### 2. Set Environment Variables
The following commands are used in a Linux/Unix Shell:
- `$ export OPENAI_API_KEY=[KEY HERE]`
	- [OpenAI API Key](https://platform.openai.com/api-keys)
- `$ export PINECONE_API_KEY=[KEY HERE]`
	- [Pinecone API Key](https://docs.pinecone.io/guides/getting-started/authentication)
- `$ export PINECONE_ENVIRONMENT=[PINECONE ENVIRONMENT HERE]`
	- Your Pinecone environment, found in the [Pinecone console](https://app.pinecone.io/), e.g. us-west1-gcp, us-east-1-aws, etc.
- `$ export PINECONE_INDEX=[PINECONE INDEX NAME HERE]`
	- [Indexes Tab](https://app.pinecone.io/)
- `$ COHERE_API_KEY=[COHERE API KEY HERE]`
	- [Cohere API Key](https://dashboard.cohere.com/api-keys)

If using Microsoft PowerShell:
```powershell
$Env:OPENAI_API_KEY = '[KEY HERE]'
$Env:PINECONE_API_KEY = '[KEY HERE]'
$Env:PINECONE_ENVIRONMENT = '[PINECONE ENVIRONMENT HERE]'
$Env:PINECONE_INDEX = '[PINECONE INDEX NAME HERE]'
$Env:COHERE_API_KEY = '[COHERE API KEY HERE]'
```
### 3. Pinecone Documents:
- Go to rag-app\\packages\\rag-pinecone\\rag_pinecone\\chain.py
```python
from langchain_community.document_loaders.csv_loader import CSVLoader
# from langchain_community.document_loaders import Docx2txtLoader
# from langchain_community.document_loaders import UnstructuredPowerPointLoader
# from langchain_community.document_loaders import PyPDFLoader
# from langchain_community.document_loaders import TextLoader

loader = CSVLoader("packages/rag-pinecone/documents/capstone-schedule.csv")
docs = loader.load()
```
- Adjust these lines to load the documents into the pinecone database that you want to use. Make sure to use the appropriate document loader. 
- Don't run this code for the same document multiple times because it will create duplicate entries into the pinecone database, as well as use up OpenAI tokens because of the embedding.
### 4. Start Langserve
- In rag-app directory: `$ langchain serve`
- Playground: http://localhost:8000/rag-pinecone/playground/
### 5. Editing rag-pinecone package
- Whenever you make changes in the rag-pinecone package, specifically to the chain.py file, you must run `$ pip install . --force-reinstall` to apply the changes.
- You made need to run `$ pip cache purge` first
## Discord Bot Setup
### 1. Create Discord Bot Application
- Login to [Discord Developer Website](https://discord.com/login?redirect_to=%2Fdevelopers%2Fapplications)
- Click "New Application" button on the top right and name and create your bot
- Note down "APPICATION ID" this will be the `"clientId"` in the `config.json` file
- Go to the "Bot" page in the navigation bar
- Under "Privileged Gateway Intents" enable all intents and save changes
    - PRESENCE INTENT
    - SERVER MEMBERS INTENT
    - MESSAGE CONTENT INTENT
- Under the "Bot" page, click the "Reset Token" button and copy the newly generated token. This will be the `"token"` in the `config.json` file
![image](https://github.com/gabrielpnjit/Capstone-FAQ-ChatBot/assets/90277223/4b0393c8-119c-4f10-a4ad-6b2d4f128032)
### 2. Invite Bot to Server
- Go to the "Installation" page in the navigation bar on the left
- Under "Authorization Methods", ensure only "Guild Install" is checked.
- Under "Install Link", select "Discord Provided Link"
- Under "Default Install Settings" add "bot" under the scopes
- Under "Permissions" select:
    - Manage Messages
    - Read Message History
    - Read Messages/View Channels
    - Send Messages
    - Send Messages in Threads
    - Use Slash Commands
- Copy the "Install Link" and visit the URL to invite the bot to your selected server
![image](https://github.com/gabrielpnjit/Capstone-FAQ-ChatBot/assets/90277223/4df5310a-118a-4fbd-b592-a15841349546)
- The bot should now be in the server
### 3. Configure config.json
- In the `node-js-bot` directory, create a file called `config.json` with the same contents from `config-template.json`
```json
{
    "clientId": "CLIENT_ID_HERE",
    "guildId": "GUILD_ID_HERE",
    "token": "BOT_TOKEN_HERE",
    "ATLAS_URI": "ATLAS_URI_HERE"
}
```
- Edit the values
- `"clientId"`: Refer to step 1
- `"guildId"`: Right Click on Desired Server Icon > Click Copy Server ID
- `"token"`: Refer to step 1
- `"ATLAS_URI"`: Go to [Database Deployments](https://cloud.mongodb.com/v2),
  - Click "Connect" on the desired cluster
  - Click "Drivers"
  - Copy the URI strin at the bottom, and replace <username> and <password> with your username and password
![image](https://github.com/gabrielpnjit/Capstone-FAQ-ChatBot/assets/90277223/e6e09cf5-ac6d-4ffa-b732-ab113f6938e4)
### 4. Deploy Commands
- Install the necessary node modules with `$ npm install`
- Run `$ node deploy-commands.js` to deploy all the commands to the bot
### 5. Run The Bot
- You can now run the bot with `$ node index.js`
## Dashboard Site Setup - MERN
\* Node Version 20.12+ required!
### Backend (Express + MongoDB + Pinecone)
1. `$ cd` into the `server/` directory
2. Run `$ npm install`
3. Create `config.env` file with same variables as in `config.env.template` file, and replace the corresponding values (you can ignore the 4 AUTH0 values for now)
4. Run the server with `$ node --env-file=config.env server.js`
### Frontend (React + Vite)
1. `$ cd` into the `client/` directory
2. Run `$ npm install`
3. Run `$ npm run dev`

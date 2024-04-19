# Discord Bot Setup
## 1. Create Discord Bot Application
- Login to [Discord Developer Website](https://discord.com/login?redirect_to=%2Fdevelopers%2Fapplications)
- Click "New Application" button on the top right and name and create your bot
- Note down "APPICATION ID" this will be the `"clientId"` in the `config.json` file
![image](https://github.com/gabrielpnjit/Capstone-FAQ-ChatBot/assets/90277223/ea2f0d01-2479-4724-a7b9-6e09f3b50282)
- Go to the "Bot" page in the navigation bar
- Under "Privileged Gateway Intents" enable all intents and save changes
    - PRESENCE INTENT
    - SERVER MEMBERS INTENT
    - MESSAGE CONTENT INTENT
- Under the "Bot" page, click the "Reset Token" button and copy the newly generated token. This will be the `"token"` in the `config.json` file
![image](https://github.com/gabrielpnjit/Capstone-FAQ-ChatBot/assets/90277223/4b0393c8-119c-4f10-a4ad-6b2d4f128032)
## 2. Invite Bot to Server
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
## 3. Configure config.json
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
## 4. Deploy Commands
- Run `$ node deploy-commands.js` to deploy all the commands to the bot
## 5. Run The Bot
- You can now run the bot with `$ node index.js`

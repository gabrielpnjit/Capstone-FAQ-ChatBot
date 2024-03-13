import sys
import json
import discord
import os
import logging
from discord.ext import commands
from dotenv import load_dotenv
from DocLoader import Documents
from ChatBot import Chatbot
from google.oauth2 import service_account
from googleapiclient.discovery import build

logging.basicConfig(filename='err.log',level=logging.ERROR, format='%(asctime)s:%(levelname)s:%(message)s')
load_dotenv()
TOKEN = os.getenv('DISCORD_TOKEN')
# example local sources
sources = [

    {
        "title": "Schedule",
        "path": "LIVESCHEDULE.csv"
    },
    {
        "title": "handbook",
        "path": "handbook.pdf"
    }]
class App:
    intents = discord.Intents.default()
    intents.message_content=True
    bot = commands.Bot(command_prefix='!', intents=intents)
    client=discord.Client(intents=intents)

    def __init__(self, chatbot: Chatbot):
        self.chatbot = chatbot
    @bot.event
    async def on_ready():
        print(f'Logged in as {App.bot.user.name}')

    #ONBOARDING NEW USERS
    @client.event
    async def on_member_join(member):
       await member.create_dm()
       await member.dm_channel.send(
          f'Hi {member.name}, welcome to GUILD NAME, Please set your username to your actual name'
       )

    #THIS HANDLES FAQ
    @bot.event
    async def on_message(message):
        # Accumulate response parts
            async with message.channel.typing():
              if message.author == app.bot.user:
                return
              text_response = ""
              citation_response = ""
              document_response = ""
              all_responses = []

              query = message.content
              # Get the chatbot response
              response = app.chatbot.generate_response(query)

              # Print the chatbot response
              citations_flag = False
              docnames = {}
              for event in response:
                  stream_type = type(event).__name__

                  # Text
                  if stream_type == "StreamTextGeneration":
                     text_response += event.text

                  # Citations
                  if stream_type == "StreamCitationGeneration":
                      if not citations_flag:               
                          citations_flag = True
                      citation_response = event.citations[0]

                  # Documents
                  if citations_flag:
                      if stream_type == "StreamingChat":
                
                          documents = [{'id': doc['id'],
                                      'text': doc['text'][:50] + '...',
                                      'title': doc['title'],
                                      'path': doc['path']}
                                      for doc in event.documents]
                          for doc in documents:
                            if doc["title"] in docnames:
                              continue
                            else:
                              docnames[doc["title"]] = doc["path"]
              await message.channel.send(text_response)
              await message.channel.send("\n\nCITATIONS:")
              await message.channel.send(citation_response)
              await message.channel.send("\n\nDOCUMENTS:")
              for docname in docnames:
                await message.channel.send(docname + ": " + docnames[docname])
              await app.bot.process_commands(message)

    #ERROR LOGGING
    @client.event 
    async def on_error(event, message):
        logging.error('Unhandled exception during event {}:'.format(event), exc_info=True)

documents = Documents(sources)
chatbot = Chatbot(documents)
app = App(chatbot)
app.bot.run(TOKEN)

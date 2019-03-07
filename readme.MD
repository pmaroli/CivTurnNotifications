A server that handles POST requests for Civ and converts them into a format that can be sent to a Discord Bot.


Use "npm install" to install relevant node packages.
Use "npm start" to start the server.

Instruct Civ to send post requests to '/sendmsg' with the following format:
{ "value1":"[game name]", "value2":"[player name]", "value3":"[game turn number]" }
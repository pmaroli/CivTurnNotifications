// { "value1":"[game name]", "value2":"[player name]", "value3":"[game turn number]" }
const express = require('express');
const axios = require('axios');
const Joi = require('joi');
const config = require('secrets')

const app = express();

app.use(express.json()); // Use express.json middleware (content type: application/json)

const discordID = {
    syndragore: "<@149330458872643584>",
    imag95: "<@279497304602574849>",
    Kingraju: "<@457232849829888001>",
    Chaosblader7: "<@308483214068940801>",
    "Ham God": "<@161595897682067456>",
}

app.post('/sendmsg', (req, res) => {

    const { error } = validateRequest(req.body); // Destructuring the error object
    if (error) { return res.status(400).send(error.details[0].message) }; // Set a bad request status

    const gameName = req.body.value1;
    const playerName = req.body.value2;
    const turn = req.body.value3;
    const discordTag = discordID[playerName]; // Get Discord IDs from the discordID dictionary

    const msg = `Sup ${discordTag}, it's time to take your turn #${turn} in ${gameName}!`;

    axios.post(config.discordBotLink, { content: msg }) // Send a POST request to the Discord server in the proper format

    res.send(`{ content: "${msg}" }`);
})

function validateRequest(request) {
    const schema = Joi.object().keys({
        value2: Joi.string().valid(Object.keys(discordID)).required(), //Only allow user names that are registered with discord tags
        value1: Joi.string().required(),
        value3: Joi.string().required()
    })

    return Joi.validate(request, schema)
}

port = process.env.PORT || 3000;
app.listen(port, () => { console.log(`Civ Discord server listening on port: ${port}`)});
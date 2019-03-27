// { "value1":"[game name]", "value2":"[player name]", "value3":"[game turn number]" }
const express = require('express');
const axios = require('axios');
const Joi = require('joi');
const nodemailer = require('nodemailer');
const path = require('path');
const admin = require('firebase-admin');

admin.initializeApp({
    credential: admin.credential.cert({
        "project_id": process.env.project_id,
        "client_email": process.env.client_email,
        "private_key": process.env.private_key.replace(/\\n/g, '\n')
    }),
    databaseURL: process.env.dbURL
});
const db = admin.firestore();

const app = express();
app.use(express.json()); // Use express.json middleware (content type: application/json)

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));
app.get('/', (req, res) => {
    res.render("index.html")
});

app.post('/api/sendmsg', (req, res) => {

    const { error } = validateRequest(req.body); // Destructuring the error object
    if (error) { return res.status(400).send(error.details[0].message) }; // Set a bad request status

    const gameName = req.body.value1;
    const playerName = req.body.value2;
    const turn = req.body.value3;

    // NOTE: If multiple users have the same playerName, this will only select the first playerName found
    db.collection('users').where('playerName', '==', playerName).limit(1).get().then((snapshot) => {
        if( snapshot.empty ) { res.send('No matching username is registered!'); return }

        snapshot.forEach(doc => {

            if ( doc.data().discordNotifs ) {
                const msg = `Sup ${doc.data().discordID}, it's time to take your turn #${turn} in ${gameName}!`;
                axios.post(process.env.discordBotLink, { content: msg }); // Send a POST request to the Discord server in the proper format
            }

            // Send an email using nodemailer
            if ( doc.data().emailNotifs ) {
                var transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        user: process.env.email,
                        pass: process.env.password
                    }
                });

                var mailOptions = {
                    from: process.env.email,
                    to: doc.data().email,
                    subject: `Turn #${turn} in ${gameName}`,
                    text: `Sup ${playerName}, it's time to take your turn #${turn} in ${gameName}!`
                };

                transporter.sendMail(mailOptions, function (error, info) {
                    if (error) { console.log(error) }
                    else { console.log('Email sent: ' + info.response) }
                });
            }

            res.send(`${playerName} has been notified!`);
        });
    });

})

function validateRequest(request) {
    const schema = Joi.object().keys({
        value2: Joi.string().required(),
        value1: Joi.string().required(),
        value3: Joi.string().required()
    })

    return Joi.validate(request, schema)
}

port = process.env.PORT || 5000;
app.listen(port, () => { console.log(`Civ Discord server listening on port: ${port}`)});
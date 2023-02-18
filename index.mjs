'use strict';

import express from 'express';
import fetch from 'node-fetch';
import 'dotenv/config';
import asyncHandler from 'express-async-handler';
import {products} from './products.js';

const PORT = process.env.PORT
const app = express();

app.use(express.urlencoded({
    extended: true
}));

app.use(express.static('public'));


let htmlTop = `
<!DOCTYPE html>
<html>
<head>
    <meta charset='utf-8'>
    <meta http-equiv='X-UA-Compatible' content='IE=edge'>
    <title>Freddie Main III</title>
    <meta name='viewport' content='width=device-width, initial-scale=1'>
    <link rel='stylesheet' type='text/css' media='screen' href='main.css'>
    <script src='main.js'></script>
</head>
<body>
    <main>
        <section>         
            <header><h1> Freddie Main III | Contact</h1></header>
                <nav>
                    <a href="index.html">Homepage</a>
                    <a href="gallery.html">Gallery</a>
                    <a href="contact.html">Contact</a>
                    <a href="order.html">Order</a>
                </nav>
        </section>

`;

let htmlBottom = `
</main>
<footer> <p>&copy; Freddie Main III, 2023</p></footer>
</body> 
</html>
`;

const printInterval = 10;
let apiCount = 0;

// this is for the contact section and the survey.
app.post("/results", (req, res) => {
    let video_game = req.body.vg
    if (typeof(req.body.vg) !== 'string') {
        video_game = req.body.vg.join(`, `)
    }

    const person = req.body.firstlast;
    const message = req.body.comments;
    const sport = req.body.sport;
    const games = video_game;
    const pronoun = req.body.Pronouns;

    console.log(req.body);

    res.send(`${htmlTop}
        <h2> Why hello there ${person}!</h2>
            <p>Thank you taking our brief survey!
            Now we know you like to watch ${sport} and like to play ${games} types of games!
            I myself love to watch Baseball and play FPS games.</p>

            <p>You have the prefered pronouns of: ${pronoun}</p>

            <p>I appreciate you looking at my site and taking the survey, hope you come back again and have a good day.</p>
            
            <p>Thank you for the lovely message you left us.</P>
            <p> ${message}</p>
            

            ${htmlBottom}`);


//Extra Credit Email attempt via nodemailer:

    async function main(){
        nodemailer.createTestAccount((err, account) => {
            if (err) {
                console.error('Failed to create a testing account');
                console.error(err);
                return process.exit(1);
            }

            console.log('Credentials obtained, sending message...');

            let transporter = nodemailer.createTransport(
                {
                    host: account.smtp.host,
                    port: account.smtp.port,
                    secure: account.smtp.secure,
                    auth: {
                        user: account.user,
                        pass: account.pass
                    },
                    logger: true,
                    transactionLog: true, 
                    allowInternalNetworkInterfaces: false
                },
                {
                    from: 'Nodemailer <example@nodemailer.com>',
                }
            );

            let message = {

                to: 'Nodemailer <example@nodemailer.com>',

                // Subject of the message
                subject: 'Results from Your Survey' + Date.now(),

                // HTML body
                html: `<p><b>Hello</b> ${person} </p>
                <p>I wanted to thank you for taking the survey on my website, below are the results you submitted:</p>
                <p>You selected ${sport}, as your favorite sport.</p>
                <P>You like the following type of video games: ${games}</p>
                <P> You have the prefered pronouns of ${pronoun}</p>
                <p>You also left us the following message:</p>
                <p>${comment}</p>
                <p>Again, thank you ${person} for taking the time to look at my site and take my survey. I hope you have a good one!</p>
                <p>Thanks,</p>
                <p>Freddie Main III</p>`,

            };

            transporter.sendMail(message, (error, info) => {
                if (error) {
                    console.log('Error occurred');
                    console.log(error.message);
                    return process.exit(1);
                }

                //console.log('Message sent successfully!');
                console.log(nodemailer.getTestMessageUrl(info));

            });
        });
    }
});

// This section is for the order html
app.post("/summary", (req, res) => {
    const name = req.body.firstlast;
    const street = req.body.street;
    const zip = req.body.zip;
    const city = req.body.city;
    const state = req.body.state;
    const choice = req.body.Items;
    const quantity = req.body.quantity;
    const delivery =  req.body.delivery;

        let found = false;
        for (let key in products) {
            if (products[key].product === choice) {
            found = key;
            break;
            }
        }

    const picked = products[found];
        picked.totalPrice = picked.price * quantity;
    const grandTotal = picked.totalPrice.toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD'
        });

        console.log(req.body);

    res.send(`${htmlTop}
        <p>Thank you for the order ${name}, below you will find your order summary.</p>
        <p><strong>You have selected:</strong> ${choice}</p> 
        <p><strong>You are ordering quantity of:</strong> ${quantity}</p>
        <p><strong>Grand Total for the order:</strong> ${grandTotal}</p>  

        <p><strong>Shipping address:</strong></p>
        <p> ${street} </p>
        <p> ${city}, ${state} ${zip}</p>
        <p><strong>You have the following delivery instructions:</strong></p>
        <p>${delivery}</p>
        ${htmlBottom}`);

});

//A6: This is for the random user using async and fetch

//extra credit middleware
app.use('/random-person', (req, res, next) => {
    apiCount += 1;

    if (apiCount % printInterval === 0 ){
        console.log(`Total Retreived Requests: ${apiCount}`);
    }
});


app.get('/random-person', asyncHandler(async(req, res) => {
    const response = await fetch('https://randomuser.me/api/');
    const data = await response.json();
    res.send(data);
}));

//error message
app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).send(`<h3>OOPS!</h3><p>Something is broken! Please try again.</p>`)
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
  //console.log('Message sent successfully!');
  
});

require('dotenv').config();
const inquirer = require("inquirer")
const nodemailer = require('nodemailer');
const fs = require("fs")

function start() {
    inquirer.prompt({
        type: "list",
        name: "action",
        message: "Would you like to add an individual to the contacts list?",
        choices: ["Yes", "No"]
    }).then(answer => {
        switch (answer.action) {
            case "Yes":
                add();
                break;
            case "No":
                end();
                break;
        }
    })
}

function add() {
    inquirer.prompt([
        {
            name: "first_name",
            type: "input",
            message: "Please enter the individuals first name."
        },
        {
            name: "last_name",
            type: "input",
            message: "Please enter the individuals last name."
        },
        {
            name: "email",
            type: "input",
            message: "Please enter the individuals email."
        },
        {
            name: "phonenumber",
            type: "input",
            message: "Please enter the individuals phone number."
        }
    ]).then(answer => {
        let obj = {
            first_name: answer.first_name,
            last_name: answer.last_name,
            email: answer.email,
            phonenumber: answer.phonenumber
        };
        fs.appendFile("database.json", JSON.stringify(obj), err => {
            console.log(err)
        })
    }).then(() => {
        start()
    })
}

function end() {
    fs.readFile("database.json", "utf8", (err, data) => {
        if (err) {
            return console.log(err)
        } else {
            console.log(JSON.parse(JSON.stringify(data)))
        }

    })
}
// Step 1
// var transporter = nodemailer.createTransport({
//     service: 'Gmail',
//     auth: {
//         user: process.env.EMAIL || 'cashforkeystacoma@gmail.com', // TODO: your gmail account
//         pass: process.env.PASS || 'gemini253' // TODO: your gmail password
//     }
// });

// // Step 2
// let mailOptions = {
//     from: 'adamcarlbirgenheier@gmail.com', // TODO: email sender
//     to: 'adamcarlbirgenheier@gmail.com', // TODO: email receiver
//     subject: 'Nodemailer - Test',
//     text: 'Wooohooo it works!!'
// };

// // Step 3
// transporter.sendMail(mailOptions, (err, data) => {
//     if (err) {
//         return log(err);
//     }
//     return log('Email sent!!!');
// });

start()
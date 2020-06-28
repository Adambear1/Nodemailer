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
        fs.readFile("database.json", "utf-8", (err, data) => {
            var _json = JSON.parse(data)
            _json.push(obj)
            console.log(_json)
            fs.writeFile("database.json", JSON.stringify(_json), (err, data) => {
                if (err) {
                    console.log(err)
                }
                else {
                    console.log(data)
                }
            })
        })
    }).then(() => {
        start()
    })
}

function end() {
    inquirer.prompt([
        {
            name: "name",
            type: "list",
            message: "Would you like to message your contact list?",
            choices: ["Yes", "No"]
        },
    ]).then(answers => {
        switch (answers.name) {
            case "Yes":
                contact();
                break;
            case "No":
                console.log("Program has ended. Thank you.")
        }
    })
}
function contact() {
    fs.readFile("database.json", "utf8", (err, data) => {
        if (err) {
            return console.log(err)
        } else {
            inquirer.prompt({
                name: "message",
                type: "input",
                message: "Please input a message you would like to send.",
            }).then(_message => {
                var _data = JSON.parse((data))
                for (let i = 0; i < _data.length; i++) {
                    //Email
                    var transporter = nodemailer.createTransport({
                        service: 'Gmail',
                        auth: {
                            user: process.env.EMAIL || 'cashforkeystacoma@gmail.com', // TODO: your gmail account
                            pass: process.env.PASS || 'gemini253' // TODO: your gmail password
                        }
                    });
                    let mailOptions = {
                        from: 'cashforkeystacoma@gmail.com', // TODO: email sender
                        to: _data[i].email, // TODO: email receiver
                        subject: `A Message For ${_data[i].first_name} ${_data[i].last_name}`,
                        text: _message.message
                    };
                    transporter.sendMail(mailOptions, (err, data) => {
                        if (err) {
                            return (err);
                        }
                        return log('Email sent!!!');
                    });
                    //Text
                    const Nexmo = require("nexmo")
                    const nexmo = new Nexmo({
                        apiKey: process.env.APIKEY,
                        apiSecret: process.env.SECRET
                    }, { debug: true });
                    const number = _data[i].phonenumber.length >= 7 ? false : "1" + _data[i].phonenumber;
                    const message = `Hi ${_data[i].first_name} ${_data[i].last_name}, I would like to let you know that ${_message}`;
                    nexmo.message.sendSms(
                        "14256209722", number, message, { type: "unicode" }, (error, responseData) => {
                            if (error) {
                                console.log(error)
                            } else {
                                console.dir(responseData)
                            }
                        }
                    )
                }
                console.log(`${_data.length} messages have been sent. This program will now shut off.`)
            })
        }
    })
}


start()
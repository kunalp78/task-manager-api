const mailjet = require ('node-mailjet')
mailjet.connect(process.env.MJ_APIKEY_PUBLIC,process.env.MJ_APIKEY_PRIVATE)
// MJ_APIKEY_PUBLIC=54d0f6973b688d5b5e331d52e7cb1a92
// MJ_APIKEY_PRIVATE=8d4e50426f5da08b48c81d1723164661
const sendWelcomeEmail = (email, name)=>{
    console.log(email, name)
    mailjet
    .post("send", {'version': 'v3.1'})
    .request({
      "Messages":[
        {
          "From": {
            "Email": "kunalp78@gmail.com",
            "Name": "Kunal"
          },
          "To": [
            {
              "Email": email,
              "Name": name
            }
          ],
          "Subject": "Greetings from The E-Guardians.",
          "TextPart": "Account Login to The E-Guardians",
          "HTMLPart": `<h3>Dear ${name}, welcome to <a href='https://www.theeguardians.online.com/'>The E-Guardians</a>!</h3><br />May the delivery force be with you!`,
          "CustomID": "Wow"
        }
      ]
    })
}
const sendGoodByeEmail = (email, name)=>{
    mailjet
    .post("send", {'version': 'v3.1'})
    .request({
      "Messages":[
        {
          "From": {
            "Email": "kunalp78@gmail.com",
            "Name": "Kunal"
          },
          "To": [
            {
              "Email": email,
              "Name": name
            }
          ],
          "Subject": "Apology from The E guardians",
          "TextPart": "Deletion of Account",
          "HTMLPart": `<h3>Dear ${name}, <h3><br>Pls write us on our email where we went wrong. We would really like you to join us again<br> Thankyou`,
          "CustomID": "AppClosureTest"
        }
      ]
    })
}
module.exports = {
    sendWelcomeEmail,
    sendGoodByeEmail
}
var nodemailer = require('nodemailer')
const from = `Ballot | ${process.env.APP_NAME.toUpperCase()} [Do Not Reply] <${process.env.EMAIL}>`
const user = process.env.EMAIL_USER
const pass = process.env.EMAIL_PASS
const host = process.env.EMAIL_HOST

var transporter = nodemailer.createTransport({
  host,
  port:25,
  secure:false,
  auth: {
      user,
      pass
  },
  tls:{
    rejectUnauthorized: false
  },
  debug: true
})

exports.sendConfirmationMail = async (to,html,subject) => {
    try {

          await transporter.sendMail({
            from,
            to: `${to.fullName} <${to.prospectiveMail}>`,
            subject,
            html
        })

    } catch (error) {
        console.error(error)
        throw "Internal Server Error"
    }
}


// try {
//   await transporter.verify()
//   await transporter.sendMail({
//       from: `Do Not Reply <noreply@uiballot.com>`,
//       to: `Jesutomiwa Salam <ifyroberts@gmail.com>`,
//       subject: "Ifejesu, Please Confirm Accreditation",
//       html: `Dear <strong>Ifejesu Salam</strong>,<br><br>You have been assigned a voter ID. Kindly visit the ITeMS building and tender your Data Capture Form for retrieval.<br> Upon retrieval, please visit your profile on <a href="https://osmis.ui.edu.ng">osmis.ui.edu.ng</a> to indicate retrieval. <br><br>The UI Ballot Team`
//   })

//   res.send("Mail Sent")    
// } catch (error) {
//   console.log(error)
//   res.send(`Mail Not Sent ${error}`)
// }

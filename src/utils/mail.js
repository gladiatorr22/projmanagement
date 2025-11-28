import Mailgen from "mailgen";
import nodemailer from "nodemailer"

const sendEmail = async(options)=>{
    const mailGenerator = new Mailgen({
        theme:"default",
        product:{
            name: "task manager",
            link: "https://taskmanagerlink.com"
        }
    })
    const emailTextual = mailGenerator.generatePlaintext(options.MailgenContent)

    const eamilHtml = mailGenerator.generate(options.MailgenContent)

    
    var transport = nodemailer.createTransport({
        host: process.env.MAILTRAP_SMTP_HOST,
        port: process.env.MAILTRAP_SMTP_PORT,
        auth: {
            user: process.env.MAILTRAP_SMTP_USER,
            pass: process.env.MAILTRAP_SMTP_PASS
        }
    });

    const mail = {
        from: "mail.taskmanager@example.com",
        to : options.email,
        subject: options.subject,
        text:emailTextual,
        html:eamilHtml
    }

    try {
        await transporter.sendEmail(mail)
    } catch (error) {
        console.error("email sevice failed , make sure that you have provided your credentials")
        console.error("error",error)
    }
}

const emailVerificationMailgenContent = (username,verificationUrl) => {
    return{
        body: {
            name: username,
            intro: "welcome to our app we're excited to have youu on board!",
            action: {
                instructions: "to verify your email please click on the following button",
                button: {
                    color: "#22BC66 ",
                    text: "Verify your email",
                    url: verificationUrl
                },

            },
            outro: "need help, or have questions? just reply to this email"
        }
    }
}

const forgotPasswordMailgenContent = (username,passwordResetUrl) => {
    return{
        body: {
            name: username,
            intro: "We got a request to reset the password of your acc",
            action: {
                instructions: "to reset your password please click on the following button",
                button: {
                    color: "#bc2222ff ",
                    text: "Forgot Password",
                    url: passwordResetUrl
                },

            },
            outro: "need help, or have questions? just reply to this email"
        }
    }
}

export {
    forgotPasswordMailgenContent,emailVerificationMailgenContent,sendEmail
}
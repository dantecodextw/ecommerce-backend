import nodemailer from "nodemailer"
const sendMail = async (data) => {
    const transporter = nodemailer.createTransport({
        host: "sandbox.smtp.mailtrap.iol",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: "1b60d62a50a84d",
            pass: process.env.MAIL_PASS,
        },
    });
    const mailOptions = {
        from: "shopee@gmail.com",
        to: data.email,
        subject: data.subject,
        text: data.body,
        html: data.html
    }
    const info = await transporter.sendMail(mailOptions, (error, info) => {
        if (error) console.log(error)
        else console.log("email sent succesfully")
    });

}
export default sendMail;

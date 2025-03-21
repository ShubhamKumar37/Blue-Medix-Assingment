import nodemailer from "nodemailer"
const mailSender = async (title, email, body) => {
    try {
        let transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS,
            }
        });

        let info = await transporter.sendMail({
            from: `BlueMedix `,
            to: `${email}`,
            subject: `${title}`,
            html: `${body}`,
        });
        console.log("This is the response of mail = ", info);
    }
    catch (error) {
        console.log(error);
    }
}

export { mailSender };
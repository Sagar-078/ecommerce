const nodemailer = require("nodemailer");

export const mailsender = async (email:any, title:any, body:any) => {
    try{

        let transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS
            }
        })

        let info = await transporter.sendMail({
            from: 'Flipkart',
            to: `${email}`,
            subject: `${title}`,
            html: `${body}`
        })
        console.log("info of mail sender ", info);

        return info;

    }catch(error: any){
        console.log("error at mailsender ", error);
    }
}
const axios = require("axios");

const sendWithBrevo = async (email, title, body) => {
    const apiKey = process.env.BREVO_KEY;
    if (!apiKey) {
        throw new Error("BREVO_KEY is not configured");
    }

    const senderEmail = process.env.BREVO_SENDER || process.env.MAIL_FROM || process.env.MAIL_USER;
    if (!senderEmail) {
        throw new Error("BREVO_SENDER is not configured");
    }

    const senderName = process.env.BREVO_SENDER_NAME || "Shaadibio";
    const start = Date.now();

    const response = await axios.post(
        "https://api.brevo.com/v3/smtp/email",
        {
            sender: { email: senderEmail, name: senderName },
            to: [{ email }],
            subject: title,
            htmlContent: `<div>${body}</div>`
        },
        {
            headers: {
                accept: "application/json",
                "content-type": "application/json",
                "api-key": apiKey
            }
        }
    );

    const elapsedMs = Date.now() - start;
    console.log(`[MailSender] Brevo email sent in ${elapsedMs}ms`);
    return response.data;
};

const mailSender = async (email, title, body) => {
    try {
        console.log(`[MailSender] Sending email to: ${email}`);

        return await sendWithBrevo(email, title, body);
    } catch (error) {
        console.error("[MailSender] Error while sending mail:", error.message);
        throw error;
    }
};

module.exports = mailSender;

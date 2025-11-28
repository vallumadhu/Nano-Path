const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

const sendMail = async (to, sub, msg) => {
    try {
        const result = await resend.emails.send({
            from: 'Orb Share <onboarding@resend.dev>',
            to,
            subject: sub,
            html: msg,
        });
        console.log('Mail sent:', result.data.id);
        return result;
    } catch (err) {
        console.error('Mail error:', err);
        throw err;
    }
};

module.exports = sendMail;
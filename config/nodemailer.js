/**
 * Created by Marie Foussette on 26/04/15.
 */

module.exports = function (nodemailer, smtpTransport, app) {
    var transporter = nodemailer.createTransport(smtpTransport({
        host: 'smtp.mail.fr',
        port: 25,
        auth: {
            user: 'user@mail.fr',
            pass: 'pass'
        }
    }));

    var mailOptions = {};
    var receivers = 'user@mail.fr';

    app.post('/api/contact', function (req, res) {
        var contact = req.body;

        mailOptions = {
            from: contact.name + '<' + contact.email + '>',
            to: receivers,
            subject: contact.subject,
            text: contact.comment
        };

        transporter.sendMail(mailOptions, function (error, info) {
           if (error) {
               console.log(error);
               res.sendStatus(400);
           } else {
               console.log('Message send:' + info.response);
               res.sendStatus(200);
           }
        });

    });
};
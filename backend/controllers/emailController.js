const EmailSubscriber = require('../models/EmailSubscriber');
const mailSender = require('../utils/mailSender');

// Email format validator
const isValidEmail = (email) => /^\S+@\S+\.\S+$/.test(email);

exports.subscribe = async (req, res) => {
  try {
    const { email } = req.body;

    // --- Validation ---
    if (!email || !isValidEmail(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address.',
      });
    }

    // --- Save to MongoDB ---
    let subscriber;
    try {
      subscriber = await EmailSubscriber.create({ email });
    } catch (dbErr) {
      if (dbErr.code === 11000) {
        // Duplicate email – still send a confirmation but warn
        return res.status(409).json({
          success: false,
          message: 'This email is already subscribed.',
        });
      }
      throw dbErr;
    }

    // --- Send automated email via mailSender (Brevo) ---
    const emailBody = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px; background: #f9fafb; border-radius: 12px;">
          <div style="background: linear-gradient(135deg, #6366f1, #8b5cf6); padding: 24px; border-radius: 8px; text-align: center; margin-bottom: 24px;">
            <h1 style="color: white; margin: 0; font-size: 28px;">Welcome! 🎉</h1>
          </div>
          <div style="background: white; padding: 24px; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
            <p style="font-size: 16px; color: #374151;">Hello,</p>
            <p style="font-size: 16px; color: #374151;">
              Thank you for registering your email with us. This is an automated confirmation message.
            </p>
            <p style="font-size: 16px; color: #374151;">You will now receive updates and important notifications from our platform.</p>
            <div style="margin: 24px 0; padding: 16px; background: #ede9fe; border-left: 4px solid #6366f1; border-radius: 4px;">
              <p style="margin: 0; color: #4c1d95; font-size: 14px;">
                📧 Subscribed email: <strong>${email}</strong>
              </p>
            </div>
            <p style="font-size: 14px; color: #9ca3af;">
              If you did not sign up for this, please ignore this email.
            </p>
          </div>
          <p style="text-align: center; margin-top: 16px; font-size: 13px; color: #9ca3af;">
            Best Regards,<br /><strong>System Team</strong>
          </p>
        </div>
    `;

    try {
        await mailSender(email, 'Welcome to Our Platform', emailBody);
    } catch (mailErr) {
        console.error('Email delivery error:', mailErr);
        // We still return success because the user is subscribed in the DB
    }

    return res.status(200).json({
      success: true,
      message: 'Email sent successfully. Please check your inbox!',
      data: { id: subscriber._id, email: subscriber.email, createdAt: subscriber.createdAt },
    });
  } catch (err) {
    console.error('Subscribe error:', err);
    return res.status(500).json({
      success: false,
      message: 'Something went wrong. Please try again later.',
    });
  }
};

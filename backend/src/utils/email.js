export const sendEmail = async ({ to, subject, template, context }) => {
    // For testing purposes, just log the email details
    console.log('Sending email:', {
      to,
      subject,
      template,
      context
    });
  
    // In a real application, you would integrate with an email service like:
    // - Nodemailer
    // - SendGrid
    // - Amazon SES
    // etc.
  
    return Promise.resolve();
  };
import nodemailer from 'nodemailer';

console.log('=== EMAIL CONFIGURATION ===');
console.log('SMTP_HOST:', process.env.SMTP_HOST);
console.log('SMTP_PORT:', process.env.SMTP_PORT);
console.log('SMTP_USER:', process.env.SMTP_USER);
console.log('SMTP_FROM:', process.env.SMTP_FROM);
console.log('SMTP_PASS:', process.env.SMTP_PASS ? '***SET***' : '***NOT SET***');
console.log('==========================');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Transporter doğrulama
transporter.verify(function(error, success) {
  if (error) {
    console.log('❌ SMTP CONNECTION ERROR:', error);
  } else {
    console.log('✅ SMTP SERVER IS READY TO TAKE OUR MESSAGES');
  }
});

export const sendEmail = async (to: string, subject: string, html: string) => {
  console.log('📧 SENDING EMAIL...');
  console.log('To:', to);
  console.log('Subject:', subject);
  console.log('HTML Length:', html.length);
  
  try {
    const result = await transporter.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to,
      subject,
      html,
    });
    
    console.log('✅ EMAIL SENT SUCCESSFULLY!');
    console.log('Message ID:', result.messageId);
    console.log('Response:', result.response);
    
    return result;
  } catch (error: any) {
    console.log('❌ EMAIL SEND ERROR:');
    console.log('Error:', error);
    console.log('Error Code:', error?.code);
    console.log('Error Message:', error?.message);
    throw error;
  }
};

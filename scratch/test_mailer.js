const { sendMail, getOutbox } = require('../lib/email/mailer');

async function testEmail() {
  console.log('Testing sendMail directly...');
  const result = await sendMail({
    to: 'admin@temp-telecom.com',
    subject: 'Welcome to ZoikoNex - Tenant Onboarded',
    html: '<h1>Welcome to ZoikoNex</h1><p>Your tenant is live.</p>',
    text: 'Welcome to ZoikoNex. Your tenant is live.',
  });

  console.log('Result:', result);
  const outbox = getOutbox();
  console.log('Outbox items count:', outbox.length);
  console.log('Latest email:', outbox[0]);
}

testEmail();

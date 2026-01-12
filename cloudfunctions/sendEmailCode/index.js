const cloud = require('wx-server-sdk');
const nodemailer = require('nodemailer');

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });

function ensureEcjtuEmail(email) {
  return typeof email === 'string' && email.endsWith('@ecjtu.edu.cn');
}

function createTransport() {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 465);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    throw new Error('邮件服务未配置');
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass }
  });
}

async function sendMail({ to, code }) {
  const transporter = createTransport();
  const from = process.env.SMTP_FROM || process.env.SMTP_USER;

  return transporter.sendMail({
    from,
    to,
    subject: '校邮验证码',
    text: `您的验证码是：${code}，10分钟内有效。`
  });
}

exports.main = async (event) => {
  const { email } = event;
  if (!ensureEcjtuEmail(email)) {
    throw new Error('仅支持 @ecjtu.edu.cn 邮箱');
  }

  const code = String(Math.floor(100000 + Math.random() * 900000));
  const db = cloud.database();
  const { OPENID } = cloud.getWXContext();
  const now = Date.now();

  await db.collection('email_codes').add({
    data: {
      openid: OPENID,
      email,
      code,
      expiresAt: now + 10 * 60 * 1000,
      createdAt: new Date(now)
    }
  });

  await sendMail({ to: email, code });

  return { success: true };
};

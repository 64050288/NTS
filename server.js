// server.js
import express from 'express';
import path    from 'path';
import { fileURLToPath } from 'url';
import nodemailer from 'nodemailer';
import { PORT, GMAIL_USER, GMAIL_APP_PASSWORD } from './env.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);
const app = express();

// 1) เสิร์ฟไฟล์ static (รวม contacts.html, css, js ต่างๆ)
app.use(express.static(path.join(__dirname, 'light')));

// 2) ตั้ง body‑parser
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// 3) ★ แนะนำ: เปลี่ยน form action บน contacts.html เป็น action="/contact"
//    แล้วจับที่นี่เลย ไม่ต้องมี php/ อีกต่อไป
app.post('/contact', async (req, res) => {
  const { name = '', email = '', comments = '' } = req.body;

  if (!name.trim()) 
    return res.status(400).send('กรุณากรอกชื่อ');
  if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    return res.status(400).send('อีเมลไม่ถูกต้อง');
  if (!comments.trim())
    return res.status(400).send('กรุณากรอกข้อความ');

  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: { user: GMAIL_USER, pass: GMAIL_APP_PASSWORD },
  });

  try {
    await transporter.sendMail({
      from: `"Contact Form" <${GMAIL_USER}>`,
      to: GMAIL_USER,
      replyTo: `${name} <${email}>`,
      subject: `ข้อความจาก ${name}`,
      text: [
        'คุณได้รับข้อความจากแบบฟอร์มเว็บไซต์',
        `ชื่อ:   ${name}`,
        `อีเมล: ${email}`,
        '',
        'ข้อความ:',
        comments,
      ].join('\n'),
    });
    return res.send('ส่งข้อความสำเร็จ ขอบคุณค่ะ');
  } catch (err) {
    console.error(err);
    return res.status(500).send(`เกิดข้อผิดพลาด: ${err.message}`);
  }
});

// 4) Start server
app.listen(PORT, () =>
  console.log(`Server running at http://localhost:${PORT}`)
);

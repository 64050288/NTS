// env.js
import dotenv from 'dotenv';
dotenv.config();

export const PORT               = Number(process.env.PORT)               || 3500;
export const GMAIL_USER         = process.env.GMAIL_USER                 || '';
export const GMAIL_APP_PASSWORD = process.env.GMAIL_APP_PASSWORD         || '';


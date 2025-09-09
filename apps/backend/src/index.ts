import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { validateInitData } from './telegram/validateInitData.js';

dotenv.config();

const app = express();
const port = Number(process.env.PORT || 8080);
const botToken = process.env.BOT_TOKEN || '';

if (!botToken) {
	console.warn('[WARN] BOT_TOKEN не задан в окружении. /auth/validate-init будет возвращать ошибку.');
}

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.get('/health', (_req, res) => {
	res.json({ ok: true, service: 'backend', env: process.env.NODE_ENV || 'development' });
});

app.post('/auth/validate-init', (req, res) => {
	try {
		const initData: unknown = (req.body && (req.body as any).initData) || (req.headers['x-telegram-init-data'] as string | undefined);
		if (!initData || typeof initData !== 'string') {
			return res.status(400).json({ ok: false, error: 'initData required' });
		}
		if (!botToken) {
			return res.status(500).json({ ok: false, error: 'BOT_TOKEN is not configured' });
		}
		const result = validateInitData(initData, botToken);
		if (!result.valid) {
			return res.status(401).json({ ok: false, error: 'Invalid initData' });
		}
		return res.json({ ok: true, user: result.user, authDate: result.authDate });
	} catch (err) {
		console.error(err);
		return res.status(500).json({ ok: false, error: 'Internal error' });
	}
});

// Telegram webhook endpoint (минимальный заглушка)
app.post('/tg/webhook', (_req, res) => {
	// Здесь будет обработка апдейтов Telegram (messages, callback_query, web_app_data)
	res.json({ ok: true });
});

app.listen(port, () => {
	console.log(`[backend] Listening on http://localhost:${port}`);
});



import crypto from 'crypto';

type ValidateResult = {
	valid: boolean;
	user?: unknown;
	authDate?: number;
};

export function validateInitData(initData: string, botToken: string): ValidateResult {
	try {
		const urlParams = new URLSearchParams(initData);
		const hash = urlParams.get('hash');
		if (!hash) return { valid: false };
		urlParams.delete('hash');

		const dataCheckString = [...urlParams.entries()]
			.sort(([a], [b]) => a.localeCompare(b))
			.map(([k, v]) => `${k}=${v}`)
			.join('\n');

		const secretKey = crypto
			.createHmac('sha256', 'WebAppData')
			.update(botToken)
			.digest();
		const calcHash = crypto
			.createHmac('sha256', secretKey)
			.update(dataCheckString)
			.digest('hex');

		if (calcHash !== hash) return { valid: false };

		let user: unknown;
		const userStr = urlParams.get('user');
		if (userStr) {
			try { user = JSON.parse(userStr); } catch { user = undefined; }
		}
		const authDateStr = urlParams.get('auth_date');
		const authDate = authDateStr ? Number(authDateStr) : undefined;

		return { valid: true, user, authDate };
	} catch {
		return { valid: false };
	}
}



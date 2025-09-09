import React, { useEffect, useMemo, useState } from "react";
import WebApp from "@twa-dev/sdk";

export default function App() {
	const [validated, setValidated] = useState<boolean | null>(null);
	const [error, setError] = useState<string | null>(null);
	const initData = useMemo(() => WebApp.initData || "", []);

	useEffect(() => {
		WebApp.expand();
		WebApp.BackButton.hide();
		WebApp.disableVerticalSwipes();
	}, []);

	useEffect(() => {
		async function run() {
			if (!initData) return setError("Запустите из Telegram");
			const apiBase =
				(import.meta as any).env?.VITE_API_URL ?? "http://localhost:8080";
			try {
				const res = await fetch(apiBase + "/auth/validate-init", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						"X-Telegram-Init-Data": initData,
					},
					body: JSON.stringify({ initData }),
				});
				const data = await res.json();
				if (data.ok) setValidated(true);
				else {
					setError(data.error || "Ошибка авторизации");
					setValidated(false);
				}
			} catch (e) {
				setError("Сеть недоступна");
				setValidated(false);
			}
		}
		run();
	}, [initData]);

	return (
		<div
			style={{
				minHeight: "100vh",
				background: WebApp.themeParams.bg_color || "#0b0b0b",
				color: WebApp.themeParams.text_color || "#fff",
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				flexDirection: "column",
				gap: 12,
				fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Arial",
			}}
		>
			<h1 style={{ margin: 0 }}>BLACKSCUM SHOP</h1>
			{validated === null && <p>Проверяем сессию…</p>}
			{validated === false && <p>Ошибка: {error}</p>}
			{validated === true && <p>Готово. Каркас работает.</p>}
		</div>
	);
}

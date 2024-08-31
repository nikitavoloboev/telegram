import { useEffect, useState } from "react"

declare global {
	interface Window {
		Telegram?: {
			WebApp: any
		}
	}
}

export const useTelegramWebApp = () => {
	const [twa, setTwa] = useState<any>(null)

	useEffect(() => {
		if (window.Telegram?.WebApp) {
			setTwa(window.Telegram.WebApp)
		}
	}, [])

	return twa
}

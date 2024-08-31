import { useIntegration } from "@tma.js/react-router-integration"
import {
	bindMiniAppCSSVars,
	bindThemeParamsCSSVars,
	bindViewportCSSVars,
	initNavigator,
	useLaunchParams,
	useMiniApp,
	useThemeParams,
	useViewport,
} from "@tma.js/sdk-react"
import { type FC, useEffect, useMemo } from "react"
import { Navigate, Route, Router, Routes } from "react-router-dom"

import { routes } from "@/navigation/routes.tsx"

interface AppProps {
	twa: any
}

export const App: FC<AppProps> = ({ twa }) => {
	const miniApp = useMiniApp()
	const themeParams = useThemeParams()
	const viewport = useViewport()

	useEffect(() => {
		return bindMiniAppCSSVars(miniApp, themeParams)
	}, [miniApp, themeParams])

	useEffect(() => {
		return bindThemeParamsCSSVars(themeParams)
	}, [themeParams])

	useEffect(() => {
		return viewport && bindViewportCSSVars(viewport)
	}, [viewport])

	const navigator = useMemo(() => initNavigator("app-navigation-state"), [])
	const [location, reactNavigator] = useIntegration(navigator)

	useEffect(() => {
		navigator.attach()
		return () => navigator.detach()
	}, [navigator])

	return (
		<div className={miniApp.isDark ? "dark" : "light"}>
			<Router location={location} navigator={reactNavigator}>
				<Routes>
					{routes.map((route) => (
						<Route
							key={route.path}
							path={route.path}
							element={<route.Component twa={twa} />}
							index={route.index}
						/>
					))}
					<Route path="*" element={<Navigate to="/" />} />
				</Routes>
			</Router>
		</div>
	)
}

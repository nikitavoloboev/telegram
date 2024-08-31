import { App } from "@/components/App.tsx"
import { ErrorBoundary } from "@/components/ErrorBoundary.tsx"
import "@fontsource-variable/inter"
import "@fontsource/dela-gothic-one"
import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister"
import { QueryClient } from "@tanstack/react-query"
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client"
import { SDKProvider, useLaunchParams } from "@tma.js/sdk-react"
import { TonConnectUIProvider } from "@tonconnect/ui-react"
import { useEffect, useMemo, type FC } from "react"
import { useTelegramWebApp } from "../hooks/useTelegramWebApp"

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			staleTime: Infinity,
		},
	},
})
const localStoragePersister = createSyncStoragePersister({
	storage: window.localStorage,
})

const ErrorBoundaryError: FC<{ error: unknown }> = ({ error }) => (
	<div>
		<p>An unhandled error occurred:</p>
		<blockquote>
			<code>
				{error instanceof Error
					? error.message
					: typeof error === "string"
					? error
					: JSON.stringify(error)}
			</code>
		</blockquote>
	</div>
)

const Inner: FC = () => {
	const debug = useLaunchParams().startParam === "debug"
	const manifestUrl = useMemo(() => {
		return new URL("tonconnect-manifest.json", window.location.href).toString()
	}, [])
	const twa = useTelegramWebApp()

	useEffect(() => {
		if (debug) {
			import("eruda").then((lib) => lib.default.init())
		}
	}, [debug])

	useEffect(() => {
		if (twa) {
			twa.ready()
		}
	}, [twa])

	return (
		<TonConnectUIProvider
			manifestUrl={manifestUrl}
			// TODO: not sure what should be here
			// using code from https://github.com/ton-community/tma-usdt-payments-demo
			// actionsConfiguration={{
			// 	twaReturnUrl:
			// 		"https://t.me/tma_jetton_processing_bot/tma_jetton_processing",
			// }}
		>
			<SDKProvider acceptCustomStyles debug={debug}>
				<PersistQueryClientProvider
					client={queryClient}
					persistOptions={{ persister: localStoragePersister }}
					onSuccess={() => {
						queryClient.invalidateQueries()
					}}
				>
					<App twa={twa} />
				</PersistQueryClientProvider>
			</SDKProvider>
		</TonConnectUIProvider>
	)
}

export const Root: FC = () => (
	<ErrorBoundary fallback={ErrorBoundaryError}>
		<Inner />
	</ErrorBoundary>
)

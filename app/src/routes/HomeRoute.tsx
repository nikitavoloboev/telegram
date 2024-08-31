import { useViewport } from "@tma.js/sdk-react"
import { TonConnectButton, useTonWallet } from "@tonconnect/ui-react"
import { useEffect, useState } from "react"
import { proxy } from "valtio"
import { TonApiClient, Api } from "@ton-api/client"
import { Address } from "@ton/core"

// Configure the client
// const http = new TonApiClient({
// 	baseUrl: "https://tonapi.io",
// })

// Initialize the API
// const api = new Api(http)

// Use the API
// async function fetchAccountJettonBalance() {
// 	const accountId = Address.parse(
// 		"UQDYzZmfsrGzhObKJUw4gzdeIxEai3jAFbiGKGwxvxHinf4K"
// 	)
// 	const jettonId = Address.parse(
// 		"EQCxE6mUtQJKFnGfaROTKOt1lZbDiiX1kCixRv7Nw2Id_sDs"
// 	)
// 	const balance = await api.accounts.getAccountJettonBalance(
// 		accountId,
// 		jettonId
// 	)
// 	console.log("Account balance:", balance)
// }

// global state
export const HomeRouteState = proxy({})
interface HomeRouteProps {}
const HomeRoute: React.FC<HomeRouteProps> = () => {
	const viewport = useViewport()
	viewport?.expand()
	const wallet = useTonWallet()

	// useEffect(() => {
	// 	// TODO: how to get account id?
	// 	// fetchAccountJettonBalance()
	// })

	// TODO: should come from wallet
	// using this: https://gist.github.com/mois-ilya/f00114baec5f44be2a365bee14c88280 as example how to get jetton balance
	const [jettonTokens, setJettonTokens] = useState<number | null>(null)

	return (
		<div className="w-screen mx-auto flex flex-col p-3 items-center justify-center">
			<div className="flex items-center flex-col gap-2 top-2 ml-auto">
				<TonConnectButton />
			</div>
			<div className="flex flex-col gap-3 items-center mt-4 justify-center">
				{/* TODO: shows only if Jetton coins is > 0*/}
				{wallet && jettonTokens && (
					<div>Balance of Jetton coins: {jettonTokens}</div>
				)}
				{wallet && jettonTokens && jettonTokens > 0 && (
					<input
						placeholder="Enter tokens to burn"
						className="text-black"
						type="text"
					/>
				)}
			</div>
		</div>
	)
}

export default HomeRoute

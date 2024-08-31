import { useViewport } from "@tma.js/sdk-react"
import { TonConnectButton, useTonWallet } from "@tonconnect/ui-react"
import { useState } from "react"
import { proxy } from "valtio"
import { TonApiClient, Api } from "@ton-api/client"

// global state
export const HomeRouteState = proxy({})
interface HomeRouteProps {}
const HomeRoute: React.FC<HomeRouteProps> = () => {
	const viewport = useViewport()
	viewport?.expand()

	const wallet = useTonWallet()

	// TODO: should come from wallet
	// using this: https://gist.github.com/mois-ilya/f00114baec5f44be2a365bee14c88280 as example how to get jetton balance
	const [jettonTokens, setJettonTokens] = useState(0)

	return (
		<div className="w-screen mx-auto flex flex-col p-3 items-center justify-center">
			<div className="flex items-center flex-col gap-2 top-2 ml-auto">
				<TonConnectButton />
			</div>
			<div className="flex flex-col gap-3 items-center mt-4 justify-center">
				{/* TODO: shows only if Jetton coins is > 0*/}
				{wallet && <div>Balance of Jetton coins: {jettonTokens}</div>}
				{wallet && jettonTokens > 0 && (
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

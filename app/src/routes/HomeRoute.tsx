import { useViewport } from "@tma.js/sdk-react"
import { proxy } from "valtio"

export const HomeRouteState = proxy({})
interface HomeRouteProps {}

const HomeRoute: React.FC<HomeRouteProps> = () => {
	const viewport = useViewport()

	viewport?.expand()
	return (
		<>
			<div>test</div>
		</>
	)
}

export default HomeRoute

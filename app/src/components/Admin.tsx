import { HomeRouteState } from "@/routes/HomeRoute"
import { useProxy } from "valtio/utils"

export default function Admin() {
	const local = useProxy(HomeRouteState)
	return <></>
}

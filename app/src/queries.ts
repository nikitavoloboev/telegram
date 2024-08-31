import { treaty } from "@elysiajs/eden"
import { queryOptions } from "@tanstack/react-query"
import { App } from "api/src/api"

const app = treaty<App>("")

export const rootQueryOptions = queryOptions({
	queryKey: ["/"],
	queryFn: async () => {
		const { data } = await app.index.get()
		return data
	},
})

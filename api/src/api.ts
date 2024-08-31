import { cors } from "@elysiajs/cors"
import { Elysia } from "elysia"

const app = new Elysia()
	.onError(({ error }) => {
		console.log(error, "error")
		return new Response(error.toString())
	})
	.use(cors())
	.get("/", async () => {})
	.listen(process.env.PORT ?? 8787)

export type App = typeof app

console.log(`Server is running at ${app.server?.hostname}:${app.server?.port}`)

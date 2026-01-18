import { mainAppRoutes } from "./features/main_app/routes.ts";

const server = Bun.serve({
    routes: {
        ...mainAppRoutes,
    },
    port: 6969,
})

console.log(`Server running at http://localhost:${server.port}/`)

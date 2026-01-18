import ReactSPA from "../dist/public/index.html"
import { getApplication } from "./features/app/handlers/getApplication"
import { postApplication } from "./features/app/handlers/postApplication"

const server = Bun.serve({
    port: 6969,
    routes: {
        "/api/application": {
            GET: getApplication,
            POST: postApplication
        },
        "/": ReactSPA
    }
})

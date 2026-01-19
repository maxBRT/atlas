import ReactSPA from "../dist/public/index.html"
import { getApplication } from "./features/app/handlers/getApplication"
import { postApplication } from "./features/app/handlers/postApplication"
import { getSpecByName } from "./features/specs/handlers/getSpecByName"
import { getSpecs } from "./features/specs/handlers/getSpecs"
import { postSpec } from "./features/specs/handlers/postSpec"
import { deleteSpec } from "./features/specs/handlers/deleteSpecs"

const server = Bun.serve({
    port: 6969,
    routes: {
        "/api/application": {
            GET: getApplication,
            POST: postApplication
        },
        "/api/specs/:filename": {
            GET: getSpecByName,
            DELETE: deleteSpec
        },
        "/api/specs": {
            GET: getSpecs,
            POST: postSpec,
        },
        "/": ReactSPA
    }
})

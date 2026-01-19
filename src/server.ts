import ReactSPA from "../dist/public/index.html"
import { getApplication } from "./features/app/handlers/getApplication"
import { postApplication } from "./features/app/handlers/postApplication"
import { getSpecByName } from "./features/specs/handlers/getSpecByName"
import { getSpecs } from "./features/specs/handlers/getSpecs"
import { postSpec } from "./features/specs/handlers/postSpec"
import { deleteSpec } from "./features/specs/handlers/deleteSpecs"
import { getTasks } from "./features/tasks/handlers/getTasks"
import { getTask } from "./features/tasks/handlers/getTask"
import { postTask } from "./features/tasks/handlers/postTask"
import { putTask } from "./features/tasks/handlers/putTask"
import { deleteTask } from "./features/tasks/handlers/deleteTask"

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
            POST: postSpec
        },
        "/api/tasks/:id": {
            GET: getTask,
            PUT: putTask,
            DELETE: deleteTask
        },
        "/api/tasks": {
            GET: getTasks,
            POST: postTask
        },
        "/": ReactSPA
    }
})

console.log(`Server started on port ${server.port}`)

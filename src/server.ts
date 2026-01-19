import ReactSPA from "../dist/public/index.html"
import { getDocuments } from "./features/documents/handlers/getDocuments"
import { getDocument } from "./features/documents/handlers/getDocument"
import { postDocument } from "./features/documents/handlers/postDocument"
import { deleteDocument } from "./features/documents/handlers/deleteDocument"
import { patchDocument } from "./features/documents/handlers/patchDocument"
import { getSpecByName } from "./features/specs/handlers/getSpecByName"
import { getSpecs } from "./features/specs/handlers/getSpecs"
import { postSpec } from "./features/specs/handlers/postSpec"
import { deleteSpec } from "./features/specs/handlers/deleteSpecs"
import { postSpecByFilename } from "./features/specs/handlers/postSpecByFilename"
import { getTasks } from "./features/tasks/handlers/getTasks"
import { getTask } from "./features/tasks/handlers/getTask"
import { postTask } from "./features/tasks/handlers/postTask"
import { putTask } from "./features/tasks/handlers/putTask"
import { deleteTask } from "./features/tasks/handlers/deleteTask"

const server = Bun.serve({
    port: 5107,
    routes: {
        "/api/documents/:filename": {
            GET: getDocument,
            POST: postDocument,
            DELETE: deleteDocument,
            PATCH: patchDocument
        },
        "/api/documents": {
            GET: getDocuments
        },
        "/api/specs/:filename": {
            GET: getSpecByName,
            POST: postSpecByFilename,
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
        "/": ReactSPA,
        "/documents/*": ReactSPA,
        "/specs/*": ReactSPA,
        "/tasks/*": ReactSPA
    }
})

console.log(`Server started on port ${server.port}`)

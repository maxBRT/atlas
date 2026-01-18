import { route } from "../../utils/router.ts";
import { json } from "../../utils/json.ts";
import { getApplication } from "./handlers/getApplication.ts";
import { postApplication } from "./handlers/postApplication.ts";

export const mainAppRoutes = {
    "/api/application": route({
        GET: getApplication,
        POST: postApplication,
    })
}

import { json } from "./json.ts";

export function route(methods: Record<string, (req: Request) => Response | Promise<Response>>) {
    return (req: Request) => {
        const handler = methods[req.method];
        if (!handler) {
            return json({ error: "Method not allowed" }, 405);
        }
        return handler(req);
    }
}

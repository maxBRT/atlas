/*
 * Helper function to return json
 */
export function json<T>(
    body: T, status = 200,
    headers: Record<string, string> = {}
) {
    return new Response(JSON.stringify(body), {
        status: status,
        headers: {
            "Content-Type": "application/json",
            ...headers,
        },
    });
}

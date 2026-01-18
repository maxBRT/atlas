import ReactSPA from "../dist/public/index.html"

const server = Bun.serve({
    port: 6969,
    routes: {
        "/": ReactSPA
    }
})

import { serveDir } from "https://deno.land/std@0.224.0/http/file_server.ts";

Deno.serve((req) => {
    const url = new URL(req.url);

    return serveDir(req, {
        fsRoot: "dist",
        urlRoot: "",
        showDirListing: false,
        enableCors: true,
    });
});

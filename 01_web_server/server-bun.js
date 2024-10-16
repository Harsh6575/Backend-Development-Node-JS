import { serve } from "bun";

serve({
  fetch(request) {
    const url = new URL(request.url);
    const { pathname } = url;

    if (pathname === "/") {
      return new Response("Hello, world!", {
        status: 200,
      });
    } else if (pathname === "/ice-tea") {
      return new Response("Ice Tea is good option!", {
        status: 200,
      });
    } else {
      return new Response("404 Not Found", {
        status: 404,
      });
    }
  },
  port: 3000,
  hostname: "127.0.0.1",
});

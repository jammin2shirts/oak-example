import { Application } from "https://deno.land/x/oak@v12.3.0/mod.ts";

const app = new Application();

app.use((ctx) => {
  ctx.response.body = "Hello World!";
});

await app.listen({ port: 8000 });
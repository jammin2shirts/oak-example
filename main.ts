import { Application, Router } from "https://deno.land/x/oak/mod.ts";
import { serverRoom } from "./wsRooms.ts";

interface Source extends WebSocket {
  roomname?:string;
}

const app = new Application();
const router = new Router();

router
  .get("/wss", async (ctx) => {
    if (!ctx.isUpgradable) {
      ctx.throw(501);
    }
    const ws:Source = await ctx.upgrade();
    serverRoom(ws);
  });

app.use(router.routes());
app.use(router.allowedMethods());
await app.listen({ port: 8000 });
// import { Application, Router, } from "https://deno.land/x/oak/mod.ts";

// const router = new Router();
// router
//   .get("/", (context) => {
//     context.response.body = "Hello world!";
//   })
//   .get("/elections/:county", async (context) => {
//     context.response.body = await (await fetch(`https://www.voterfocus.com/CampaignFinance/candidate_pr.php?c=`+context?.params?.county)).text();
//   })
//   .get("/wss", (ctx) => {
//     if (!ctx.isUpgradable) {
//       ctx.throw(501);
//     }
//     const ws = ctx.upgrade();
//     ws.onopen = () => {
//       console.log("Connected to client");
//       ws.send("Hello from server!");
//     };
//     ws.onmessage = (m) => {
//       console.log("Got message from client: ", m.data);
//       ws.send(m.data as string);
//       ws.close();
//     };
//     ws.onclose = () => console.log("Disconncted from client");
//   });

// const app = new Application();
// app.use(router.routes());
// app.use(router.allowedMethods());

// await app.listen({ port: 8000 });

import { WebSocketClient, WebSocketServer } from "https://deno.land/x/websocket@v0.1.4/mod.ts";

const wss = new WebSocketServer(8000);
wss.on("connection", function (ws: WebSocketClient) {
  console.dir(ws)
  console.log('connected')
  ws.on("message", function (message: string) {
    console.log(message);
    ws.send(message);
  });
});
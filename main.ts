// import { Application, Router } from "https://deno.land/x/oak/mod.ts";

// const availableRooms: string[] = ["wow"];
// const addNewRoom = (name: string) => {
//   availableRooms.push(name);
// };

// const respondWithAllRooms = (ws: WebSocket) => {
//   const refreshedRooms = {
//     name: "All Rooms",
//     action: "ShowRooms",
//     value: availableRooms,
//   };
//   ws.send(JSON.stringify(refreshedRooms));
// };
// const router = new Router();
// router
//   .get("/wss", (ctx) => {
//     if (!ctx.isUpgradable) {
//       ctx.throw(501);
//     }
//     const ws = ctx.upgrade();

//     ws.onopen = () => {
//       console.log("Connected to client");
//       // ws.send("Hello from server!");
//       respondWithAllRooms(ws);
//     };

//     ws.onmessage = (e) => {
//       const { name, action } = JSON.parse(e.data);
//       if (action == "AddRoom") {
//         addNewRoom(name);
//         respondWithAllRooms(ws);
//       }
//       console.log(`Got message from client:${name} - ${action}`);

//       ws.send("got the message");
//     };

//     ws.onclose = () => console.log("Disconncted from client");
//   })
//   .get("/wss/rooms", (ctx) => {
//     //use this to programmatically set new websockets for each new room added
//     ctx.response.body = availableRooms;
//   })
//   .get("/wss/:roomName", (ctx) => {
//     //use this to programmatically set new websockets for each new room added
//     if (availableRooms.includes(ctx?.params?.roomName)) {
//       console.log("this room exists");
//       ctx.response.body = `it's here`;
//     }
//   });

// const app = new Application();
// app.use(router.routes());
// app.use(router.allowedMethods());

// await app.listen({ port: 8000 });

import { WebSocketClient, WebSocketServer } from "https://deno.land/x/websocket@v0.1.4/mod.ts";

const wss = new WebSocketServer(8000);
wss.on("connection", function (ws: WebSocketClient) {
  console.log(`new connection added: ${wss.clients.size}`)
  ws.on("message", function (message: string) {
    console.log(message);
    // ws.send(message);
    wss.clients.forEach(client => {
      // console.dir(client)
      client.send('hello')
    })
  });
});
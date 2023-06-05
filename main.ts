

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
// rou


import { WebSocketClient, WebSocketServer } from "https://deno.land/x/websocket@v0.1.4/mod.ts";
import { Application, Router } from "https://deno.land/x/oak/mod.ts";
const rooms:string[] = [];
const app = new Application();
const router = new Router();
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

app.use(router.routes());
app.use(router.allowedMethods());
await app.listen({ port: 8000 });

const wss = new WebSocketServer(8000);
wss.on("connection", function (ws: WebSocketClient) {
  console.log(`new connection added: ${wss.clients.size}`)
  emitToAll();
  ws.on("message", (message) => {
    console.dir(message);
    const data = JSON.parse(message)
    rooms.push(data.name)
    console.dir(rooms)
    emitToAll();
  });
});

const emitToAll=()=>{
  wss.clients.forEach(client => {
    client.send(JSON.stringify(rooms))
  })
}
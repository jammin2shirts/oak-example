import { Application, Router } from "https://deno.land/x/oak/mod.ts";

const app = new Application();
const router = new Router();
const connectedClients = new Map();

const broadcast = (message: string) => {
  for (const client of connectedClients.values()) {
    client.send(message);
  }
};

function broadcast_usernames() {
  const usernames = [...connectedClients.keys()];
  console.log(
    "Sending updated username list to all clients: " +
      JSON.stringify(usernames),
  );
  broadcast(
    JSON.stringify({
      event: "update-users",
      usernames: usernames,
    }),
  );
}

router
  .get("/wss", async (ctx) => {
    if (!ctx.isUpgradable) {
      ctx.throw(501);
    }
    const username = ctx.request.url.searchParams.get("username");
    const ws = await ctx.upgrade();
    console.log(`New Connection Attempt, User: ${username}`)
    if (connectedClients.has(username)) {
      ws.close(1008, `Username ${username} is already taken`);
      return;
    }

    ws.username = username;
    connectedClients.set(username, ws);

    ws.onopen = () => {
      console.log('Connection opened now broadcasting all data')
      broadcast_usernames();
    };
    ws.onclose = (message) => {
      console.log(message)
      console.log(`Client ${ws.username} disconnected`);
      connectedClients.delete(ws.username);
      broadcast_usernames();
    };
    ws.onmessage = (m) => {
      console.log('message received')
      const data = JSON.parse(m.data);
      switch (data.event) {
        case "send-message":
          broadcast(
            JSON.stringify({
              event: "send-message",
              username: ws.username,
              message: data.message,
            }),
          );
          break;
      }
    };

    // ws.onmessage = (e) => {
    //   const { name, action } = JSON.parse(e.data);
    //   if (action == "AddRoom") {
    //     addNewRoom(name);
    //     respondWithAllRooms(ws);
    //   }
    //   console.log(`Got message from client:${name} - ${action}`);

    //   ws.send("got the message");
    // };
  })
  // .get("/wss/rooms", (ctx) => {
  //   //use this to programmatically set new websockets for each new room added
  //   ctx.response.body = availableRooms;
  // })
  // .get("/wss/:roomName", (ctx) => {
  //   //use this to programmatically set new websockets for each new room added
  //   if (availableRooms.includes(ctx?.params?.roomName)) {
  //     console.log("this room exists");
  //     ctx.response.body = `it's here`;
  //   }
  // });

app.use(router.routes());
app.use(router.allowedMethods());

await app.listen({ port: 8000 });

// import { WebSocketClient, WebSocketServer } from "https://deno.land/x/websocket@v0.1.4/mod.ts";

// const wss = new WebSocketServer(8000);
// wss.on("connection", function (ws: WebSocketClient) {
//   console.log('new connection')
//   ws.on("message", function (message: string) {
//     console.log(message);
//     // ws.send(message);
//     wss.clients.forEach(client => {
//       // console.dir(client)
//       client.send('hello')
//     })
//   });
// });

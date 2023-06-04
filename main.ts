import { Application, Router } from "https://deno.land/x/oak/mod.ts";

const availableRooms: string[] = ["wow"];
const addNewRoom = (name: string) => {
  availableRooms.push(name);
};

const respondWithAllRooms = (ws: WebSocket) => {
  const refreshedRooms = {
    name: "All Rooms",
    action: "ShowRooms",
    value: availableRooms,
  };
  const openBlob = new Blob([JSON.stringify(refreshedRooms, null, 2)], {
    type: "application/json",
  });
  ws.send(openBlob);
};
const router = new Router();
router
  .get("/wss", (ctx) => {
    if (!ctx.isUpgradable) {
      ctx.throw(501);
    }
    const ws = ctx.upgrade();

    ws.onopen = () => {
      console.log("Connected to client");
      // ws.send("Hello from server!");
      respondWithAllRooms(ws);
    };

    ws.onmessage = async ({ data }) => {
      const blob = new Blob([data]);
      const { name, action } = JSON.parse(await blob.text());
      if (action == "AddRoom") {
        addNewRoom(name);
        respondWithAllRooms(ws);
      }
      console.log(`Got message from client:${name} - ${action}`);

      ws.send("got the message");
    };

    ws.onclose = () => console.log("Disconncted from client");
  })
  .get("/wss/rooms", (ctx) => {
    //use this to programmatically set new websockets for each new room added
    ctx.response.body = availableRooms;
  })
  .get("/wss/:roomName", (ctx) => {
    //use this to programmatically set new websockets for each new room added
    if (availableRooms.includes(ctx?.params?.roomName)) {
      console.log("this room exists");
      ctx.response.body = `it's here`;
    }
  });

const app = new Application();
app.use(router.routes());
app.use(router.allowedMethods());

await app.listen({ port: 8000 });

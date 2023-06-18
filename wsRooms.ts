const connectedClients = new Map();
const roomsNames: Array<string> = ['First Room', 'Second Room'];
const connectedWs: Array<WebSocket> = [];

interface Source extends WebSocket {
  roomname?: string;
}
function broadcast(message: string) {
  //   for (const client of connectedClients.values()) {
  //     client.send(message);
  //   }
  for (const client of connectedWs.values()) {
    client.send(message);
  }
}

function add_room(name: string) {
  if (!roomsNames.includes(name)) {
    roomsNames.push(name);
  } else {
    throw new Error("Room already exists!");
  }
}

function broadcast_rooms() {
  //   const roomnames = [...connectedClients.keys()];

  console.log(
    `Sending updated roomnames list to all clients: ${
      JSON.stringify(roomsNames)
    }`,
  );
  broadcast(
    JSON.stringify({
      event: "update-rooms",
      roomnames: roomsNames,
    }),
  );
}

export function serverRoom(ws: Source) {
  connectedWs.push(ws);
  /**
     * For Adding a user to a new room:
     *
     * if (connectedClients.has(username)) {
        ws.close(1008, `Username ${username} is already taken`);
        return;
      }
      ws.username = username;
      connectedClients.set(username, ws);
     */

  ws.onopen = () => {
    console.log("Connection opened now broadcasting all data");
    broadcast_rooms();
  };

  ws.onclose = (message) => {
    console.log(`Client ${ws.roomname} disconnected`);
    connectedClients.delete(ws.roomname);
    broadcast_rooms();
  };

  ws.onmessage = (m) => {
    console.log("message received");
    const data = JSON.parse(m.data);
    console.dir(data);
    switch (data.action) {
      //   case "send-message":
      //     broadcast(
      //       JSON.stringify({
      //         event: "send-message",
      //         username: ws.roomname,
      //         message: data.message,
      //       }),
      //     );
      //     break;
      case "add-room":
        console.log(`Add Room message received`);
        add_room(data.name);
        console.log(`Room List: ${roomsNames.toString()}`);
        broadcast_rooms();
        break;
    }
  };
}

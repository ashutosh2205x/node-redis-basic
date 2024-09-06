const net = require("net");
const Parser = require("redis-parser");

const store = {};
const server = net.createServer((connection) => {
  console.log("connected...");
  const parser = new Parser({
    returnReply: (reply) => {
      console.log(reply); //cmd-> reply[0]
      switch (reply[0]) {
        case "set": {
          let key = reply[1];
          let value = reply[2];
          store[key] = value;
          connection.write("+OK\r\n");
          break;
        }

        case "get": {
          let key = reply[1];
          let value = store[key];
          if (!value) {
            connection.write("+OK\r\n");
          } else {
            connection.write(`$${value.length}\r\n${value}\r\n`);
          }

          connection.write("+OK\r\n");
          break;
        }

        default:
          break;
      }
    },
    returnError: (err) => console.log(err),
  });
  parser.execute();
  connection.write("+OK\r\n");
});

server.listen(800, () => console.log("server connected..."));

const SerialPort = require("serialport");

const parser = new SerialPort.parsers.Readline();
const port = new SerialPort("COM3", {
  baudRate: 9600,
  dataBits: 8,
  parity: "none",
  stopBits: 1,
  flowControl: false,
});

port.pipe(parser);

const serverUrl = "https://sensores-instru.herokuapp.com";

// t30h20d150 temp, humedad, dist
parser.on("data", async (data) => {
  const res = await fetch(serverUrl, {
    method: "POST",
    "Content-Type": "application/json",
    body: {
      data,
    },
  });
  const data = res.json();
  console.log(data);
});

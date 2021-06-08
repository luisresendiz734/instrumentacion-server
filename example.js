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

// t30h20d150 temp, humedad, dist
parser.on("data", (data) => {
  const ti = data.indexOf("t");
  const hi = data.indexOf("h");
  const di = data.indexOf("d");
  const temp = data.substring(ti + 1, hi);
  const hume = data.substring(hi + 1, di);
  const dist = data.substring(di + 1);

  console.log("data received: ", data);
  console.log("temp: ", temp);
  console.log("humedad: ", hume);
  console.log("distancia: ", dist);
});

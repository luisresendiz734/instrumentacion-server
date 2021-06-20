const { Router } = require("express");
const admin = require("firebase-admin");

const serviceAccount = require("../../intrumentacion-c6441-firebase-adminsdk-w2hdq-8da8bfa5a4.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://intrumentacion-c6441-default-rtdb.firebaseio.com/",
});

const db = admin.database();
const TEMP = "temperatura";
const HUME = "humedad";
const DIST = "distancia";
const KEYS = {
  T: "temperature",
  TH: "temperatureHistory",
  H: "humidity",
  HH: "humidityHistory",
  D: "distance",
  DH: "distanceHistory",
};

const useData = (data) => {
  const ti = data.indexOf("t");
  const hi = data.indexOf("h");
  const di = data.indexOf("d");
  const temperatura = Number(data.substring(ti + 1, hi));
  const humedad = Number(data.substring(hi + 1, di));
  const distancia = Number(data.substring(di + 1));
  return [temperatura, humedad, distancia];
};

const router = Router();

router.get("/", async (req, res) => {
  const temperatura = (await db.ref(KEYS.T).once("value")).val();
  const humedad = (await db.ref(KEYS.H).once("value")).val();
  const distancia = (await db.ref(KEYS.D).once("value")).val();
  const temperaturaHistory = (await db.ref(KEYS.TH).once("value")).val();
  const humedadHistory = (await db.ref(KEYS.HH).once("value")).val();
  const distanciaHistory = (await db.ref(KEYS.DH).once("value")).val();
  res.json({
    temperatura,
    temperaturaHistory,
    humedad,
    humedadHistory,
    distancia,
    distanciaHistory,
  });
});

router.post("/", async (req, res) => {
  const [t, h, d] = useData(req.body.data);
  db.ref(KEYS.T).set(t);
  db.ref(KEYS.H).set(h);
  db.ref(KEYS.D).set(d);

  const th = (await db.ref(KEYS.TH).get()).val();
  const hh = (await db.ref(KEYS.HH).get()).val();
  const dh = (await db.ref(KEYS.DH).get()).val();
  const motor = (await db.ref("motor").get()).val();

  if (t != th[th.length - 1]) db.ref(KEYS.TH).set([...th, t]);

  if (h != hh[hh.length - 1]) db.ref(KEYS.HH).set([...hh, h]);

  if (d != dh[dh.length - 1]) db.ref(KEYS.DH).set([...dh, d]);

  res.json({ motor });
});

module.exports = router;

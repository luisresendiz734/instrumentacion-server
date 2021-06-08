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

const router = Router();

router.get("/", async (req, res) => {
  const temperatura = (await db.ref(TEMP).once("value")).val();
  const humedad = (await db.ref(HUME).once("value")).val();
  const distancia = (await db.ref(DIST).once("value")).val();
  res.json({ temperatura, humedad, distancia });
});

router.post("/", (req, res) => {
  const { data } = req.body;
  const ti = data.indexOf("t");
  const hi = data.indexOf("h");
  const di = data.indexOf("d");
  const temp = Number(data.substring(ti + 1, hi));
  const hume = Number(data.substring(hi + 1, di));
  const dist = Number(data.substring(di + 1));
  db.ref(TEMP).set(temp);
  db.ref(HUME).set(hume);
  db.ref(DIST).set(dist);
  res.json({ temp, hume, dist });
});

module.exports = router;

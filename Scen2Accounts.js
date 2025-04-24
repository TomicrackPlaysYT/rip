const fs = require("node:fs");
const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./.data/AccountDatabase.db", (err) => {
  if (err) {
    return console.error(err.message);
  }
  console.log("Connected to the SQlite database.");
  db.run(
    "CREATE TABLE IF NOT EXISTS data(name text, data JSON)",
    (err) => err && console.error(err?.message)
  ); // Create Data Table
  db.run(
    "CREATE TABLE IF NOT EXISTS login(name text, pass VARCHAR(255) NOT NULL)",
    (err) => err && console.error(err?.message)
  ); // Create Login Table
});
let EncryptPass = ($) =>
  require("node:crypto").createHash("sha256").update($).digest("hex");

let CommandAccess = [];
let DevCommandAccess = [];
const Exists = {
  pass: ($) =>
    new Promise((resolve, reject) =>
      db.get(
        "SELECT EXISTS(SELECT 1 FROM login WHERE name = ? LIMIT 1) AS DoesExist;",
        [$.toLowerCase()],
        (err, row) => {
          if (err) return reject(err), console.error(err.message);
          resolve(!!row.DoesExist);
        }
      )
    ),
  data: ($) =>
    new Promise((resolve, reject) =>
      db.get(
        "SELECT EXISTS(SELECT 1 FROM data WHERE name = ? LIMIT 1) AS DoesExist;",
        [$.toLowerCase()],
        (err, row) => {
          if (err) return reject(err), console.error(err.message);
          resolve(!!row.DoesExist);
        }
      )
    ),
};
const AddPass = (Hash, User) =>
  new Promise((resolve, reject) => {
    Exists.pass(User.toLowerCase()).then((DoesExists) => {
      if (!DoesExists) {
        db.run(
          `INSERT INTO login(name, pass) VALUES(?,?)`,
          [User.toLowerCase(), Hash],
          function (err) {
            if (err) return reject(err), console.error(err.message);
            console.log(`Row(s) updated: ${this.changes}`);
            resolve();
          }
        );
      } else reject();
    });
  });
const AddData = (Data, User) =>
  new Promise((resolve, reject) => {
    Exists.data(User.toLowerCase()).then((DoesExists) => {
      if (!DoesExists) {
        db.run(
          `INSERT INTO data(name, data) VALUES(?,?)`,
          [User.toLowerCase(), JSON.stringify(Data)],
          function (err) {
            if (err) return reject(err), console.error(err.message);
            console.log(`Row(s) updated: ${this.changes}`);
            resolve();
          }
        );
      } else reject();
    });
  });
const UpdatePass = (Hash, User) =>
  new Promise((resolve, reject) => {
    db.run(
      `UPDATE login SET pass = ? WHERE name = ?`,
      [Hash, User.toLowerCase()],
      function (err) {
        if (err) return reject(err), console.error(err.message);
        resolve();
      }
    );
  });
const UpdateData = (Data, User) =>
  new Promise((resolve, reject) => {
    db.run(
      `UPDATE data SET data = ? WHERE name = ?`,
      [JSON.stringify(Data), User.toLowerCase()],
      function (err) {
        if (err) return reject(err), console.error(err.message);
        resolve();
      }
    );
  });
const GetPass = ($) =>
  new Promise((resolve, reject) =>
    db.get(
      "SELECT name user, pass Hash FROM login WHERE name = ?",
      [$.toLowerCase()],
      (err, row) => {
        if (err) return resolve(null), console.error(err.message);
        resolve(row?.Hash);
      }
    )
  );

const CreateData = ($) =>
  new Object({
    username: $,
    achievements: new Array(),
    gallery: new Array(),
    stars: 0,
    description: "",
    join: Math.floor(Date.now() / 1000),
    lastOnline: Math.floor(Date.now() / 1000),
    timePlayed: 0,
  });

//WriteData(CreateData("AbsentPopcorn33"), "AbsentPopcorn33"); console.log("Reset");
const AccessAccounts = {
  Add: async ($) => {
    if (
      !(
        (await Exists.pass($[0].toLowerCase())) ||
        (await Exists.pass($[0].toLowerCase()))
      )
    ) {
      await Promise.all([
        AddPass(EncryptPass($[1]), $[0].toLowerCase()),
        AddData(CreateData($[0]), $[0].toLowerCase()),
      ]);
      console.log(`Created Account: ${$[0]}`);
      return [true, await AccessAccounts.GetData($[0].toLowerCase())];
    } else {
      return [false, "Error Account Exists"];
    }
  },
  Login: async ($) => {
    let pass = (await GetPass($[0].toLowerCase())) === EncryptPass($[1])
    return [
      pass,
      pass && await AccessAccounts.GetData($[0].toLowerCase()),
    ];
  },
  GetGameData: async ($) => {
    let returnData = new Object({
      username: null,
      achievements: new Array(),
      gallery: new Array(),
      stars: 0,
      description: null,
      join: null,
      lastOnline: null,
      timePlayed: 0,
      maxScore: 0,
      ascensions: 0,
      crossroads: 0,
      polygonKills: 0,
      tankKills: 0,
      celestialKills: 0,
      radiantPolygonKills: 0,
      abyss: 0,
      dims: new Object(),
      timeAlive: 0,
    });
    if ($) {
      Object.assign(
        returnData,
        (await AccessAccounts.GetData($.toLowerCase())) ?? CreateData($)
      );
    }
    return returnData;
  },
  GetData: ($) =>
    new Promise((resolve, reject) =>
      db.get(
        `SELECT name user, data data FROM data WHERE name  = ?`,
        [$.toLowerCase()],
        (err, row) => {
          if (err) {
            console.error(err.message);
            resolve({});
          }
          console.log(row);
          resolve(row ? JSON.parse(row.data) : {});
        }
      )
    ),
  SaveData: ($) => {
    AccessAccounts.GetData($[0].toLowerCase()).then((Data) => {
      for (let [key, val] of Object.entries($[1])) {
        //console.log(key, val);
        if (
          ![
            "stars",
            "description",
            "timePlayed",
            "maxScore",
            "ascensions",
            "crossroads",
            "polygonKills",
            "tankKills",
            "celestialKills",
            "radiantPolygonKills",
            "abyss",
          ].includes(key) ||
          val === null ||
          val === 0
        )
          continue;
        if ("number" == typeof val) val = Math.floor(val);
        Data[key] = val;
      }
      Data.lastOnline = Math.floor(Date.now() / 1000);
      Data.timePlayed += Data.timeAlive;
      UpdateData(Data, $[0].toLowerCase());
    });
  },
  UpdateGalley: ($) => {
    console.log($);
    AccessAccounts.GetData($[0].toLowerCase()).then((acc) => {
      let nr = $[1] < 0 ? -$[1] - 1 : $[1] + 2,
        nd = acc.gallery[nr] || 0,
        n3 = 1 << $[2];
      nd & n3 || ((nd |= n3), (acc.gallery[nr] = nd));
      acc.gallery = acc.gallery.map((value) => {
        return value ?? 0;
      });
      let length = acc.gallery.length - 1;
      while (length >= 0) {
        acc.gallery[length] = acc.gallery[length] ?? 0;
        length--;
      }
      console.log("gallery Updated");
      UpdateData(acc, $[0].toLowerCase());
    });
  },
  UpdateAchievements: ($) => {
    AccessAccounts.GetData($[0].toLowerCase()).then((Data) => {
      Data.achievments?.push?.($[1]);
      UpdateData(Data, $[0].toLowerCase());
    });
  },
};

module.exports = {
  CommandAccess: CommandAccess,
  DevCommandAccess: DevCommandAccess,
  AccessAccounts,
  IsDev: 0,


};

process.on("SIGTERM", async () => {
  console.log("Exit from SIGTERM");
  await new Promise((resolve) => db.close(() => resolve()));
  process.exit(0);
});

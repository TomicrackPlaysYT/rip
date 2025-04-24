let { AccessAccounts } = require("./Scen2Accounts.js");

commands.rules.red = [
  [
    [],
    function ($, e, t) {
      (e.team = 2),
        e.update(),
        (e.dim.updatedTanks[e.id] = e),
        e.ws.sendPacket("setStats", e.upgrades);
    },
  ],
];
commands.rules.power = [
  [
    [],
    function ($, e, t) {
      (e.weapon = "follower"),
        (e.body = "descendant"),
        e.ws.sendPacket(
          "announcement",
          "The descendants are unfinished, so dont get mad at missing features. -kingblade"
        );
      e.ws.sendPacket("announcement", "You are now a descendant.");
      e.score = 23.6e6;
      e.update(),
        (e.dim.updatedTanks[e.id] = e),
        e.ws.sendPacket("setStats", e.upgrades);
    },
  ],
  [
    ["targets"],
    function ($, e, t) {
      let a = $[0];
      for (let n = a.length - 1; n >= 0; n--) {
        let i = a[n];
        "tank" === i.objectType &&
          !i.static &&
          ((i.weapon = "follower"),
          (i.body = "descendant"),
          i.update(),
          (i.dim.updatedTanks[i.id] = i),
          i.ws && i.ws.sendPacket("setStats", i.upgrades));
      }
    },
  ],
];
(commands.rules.purify = [
  [
    [],
    function ($, e, t) {
      e.abyssalize(),
        e.ws.sendPacket("announcement", "You are now an abyssal.");
      e.update(),
        (e.dim.updatedTanks[e.id] = e),
        e.ws.sendPacket("setStats", e.upgrades);
    },
  ],
  [
    ["targets"],
    function ($, e, t) {
      let a = $[0];
      for (let n = a.length - 1; n >= 0; n--) {
        let i = a[n];
        "tank" === i.objectType &&
          !i.static &&
          (i.abyssalize(),
          i.update(),
          (i.dim.updatedTanks[i.id] = i),
          i.ws && i.ws.sendPacket("setStats", i.upgrades));
      }
    },
  ],
]),
  (commands.rules.dev = [
    [
      [],
      function ($, e, t) {
        e.dev(),
          e.ws.sendPacket(
            "announcement",
            "You now have access to developer classes."
          );
        e.update(),
          (e.dim.updatedTanks[e.id] = e),
          e.ws.sendPacket("setStats", e.upgrades);
      },
    ],
    [
      ["targets"],
      function ($, e, t) {
        let a = $[0];
        for (let n = a.length - 1; n >= 0; n--) {
          let i = a[n];
          "tank" === i.objectType &&
            !i.static &&
            (i.dev(),
            i.update(),
            (i.dim.updatedTanks[i.id] = i),
            i.ws && i.ws.sendPacket("setStats", i.upgrades));
        }
      },
    ],
  ]),
  (commands.rules.choose = [
    [
      [],
      function ($, e, t) {
        (e.weapon = "prefender"),
          (e.body = "predator"),
          e.ws.sendPacket("announcement", "Get to level 90 for a surprise...");
        e.update(),
          (e.dim.updatedTanks[e.id] = e),
          e.ws.sendPacket("setStats", e.upgrades);
      },
    ],
    [
      ["targets"],
      function ($, e, t) {
        let a = $[0];
        for (let n = a.length - 1; n >= 0; n--) {
          let i = a[n];
          "tank" === i.objectType &&
            !i.static &&
            ((i.weapon = "prefender"),
            (i.body = "predator"),
            i.update(),
            (i.dim.updatedTanks[i.id] = i),
            i.ws && i.ws.sendPacket("setStats", i.upgrades));
        }
      },
    ],
  ]);
commands.rules.devastate = [
  [
    [],
    function ($, e, t) {
      (e.weapon = "robert"),
        (e.body = "robert"),
        e.update(),
        (e.dim.updatedTanks[e.id] = e),
        e.ws.sendPacket("setStats", e.upgrades);
    },
  ],
  [
    ["targets"],
    function ($, e, t) {
      let a = $[0];
      for (let n = a.length - 1; n >= 0; n--) {
        let i = a[n];
        "tank" === i.objectType &&
          !i.static &&
          ((i.weapon = "robert"),
          (i.body = "robert"),
          i.update(),
          (i.dim.updatedTanks[i.id] = i),
          i.ws && i.ws.sendPacket("setStats", i.upgrades));
      }
    },
  ],
];
commands.rules.spectator = [
  [
    [],
    function ($, e, t) {
      (e.weapon = "a"),
        (e.body = "spectator"),
        e.update(),
        (e.dim.updatedTanks[e.id] = e),
        e.ws.sendPacket("setStats", e.upgrades);
    },
  ],
  [
    ["targets"],
    function ($, e, t) {
      let a = $[0];
      for (let n = a.length - 1; n >= 0; n--) {
        let i = a[n];
        "tank" === i.objectType &&
          !i.static &&
          ((i.weapon = "a"),
          (i.body = "spectator"),
          i.update(),
          (i.dim.updatedTanks[i.id] = i),
          i.ws && i.ws.sendPacket("setStats", i.upgrades));
      }
    },
  ],
];
//Debug Command
commands.rules.playerid = [
  /*  [
    ["int"],
    function ($, e, t) {
//      console.log(e.dim.tanks[$[0]]);
      e.ws.sendPacket("announcement", e.dim.tanks[$[0]]);
      //        fs.writeFileSync("./data.txt", util.inspect(e.dim.tanks[$[0]]), 'utf-8')
    },
  ],*/
  [
    ["targets", "string"],
    function ($, e, t) {
      //          fs.writeFileSync("./data.txt", util.inspect(e.dim.tanks[$[0]][$[1]]), 'utf-8')
      if ($[1] == "pos") {
        e.ws.sendPacket(
          "announcement",
          `X: ${Math.floor($[0][0].x)}, Y: ${Math.floor($[0][0].y)}`
        );
      } else if ($[1] == "score") {
        e.ws.sendPacket(
          "announcement",
          `Score: ${Math.floor($[0][0].score)}, displayScore: ${Math.floor($[0][0].displayScore)}`
        );
      } else {
        console.log($[0][0][$[1]]);
        e.ws.sendPacket("announcement", $[0][0][$[1].trim()]);
      }
    },
  ],
  /*[
    ["int", "string", "*"],
    function ($, e, t) {
      //          fs.writeFileSync("./data.txt", util.inspect(e.dim.tanks[$[0]][$[1]]), 'utf-8')
      e.ws.sendPacket("announcement", e.dim.tanks[$[0]][$[1]]);
      e.dim.tanks[$[0]][$[1]] = eval($[2]);
    },
  ],*/
];
commands.rules.localannounce = [
  [
    ["targets", "*"],
    function ($, e, t) {
      let a = $[0];
      for (let n = a.length - 1; n >= 0; n--) {
        let i = a[n];
        i.ws && i.ws.sendPacket("announcement", $[1]);
      }
    },
  ],
];

/*-- Account Commands --*/

commands.rules.terminateaccount = [
  [
    ["string"],
    ($, e, t) => {
      let Account = $[0];
      try {
        e.ws.sendPacket("announcement", AccessAccounts.remove(Account) ? `Cannot delete that account` : `Deleted account: ${Account}`);
      }catch {
        e.ws.sendPacket("announcement", `Failed to delete account: ${Account}`);
      }
    }
  ]
]

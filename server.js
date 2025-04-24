//const fs = require("fs");
//const fetch = require("fetch").fetchUrl;
const { BotData, ImportScen2Data, MessageSend, SetCommandAccess } = require("./DCBot.js"); //problem discord.js isnt compatible with node 14 so it wont work / something to do with undici wont work
let { CommandAccess, AccessAccounts, DevCommandAccess, IsDev } = require("./Scen2Accounts.js");
//console.log(CommandAccess);

const main = function (scenexe2) {
  let options = {
    parentPort: {
      postMessage: function ($) {
        switch ($[0]) {
          case "playerCount":
            BotData($);
            break;
          case "createMessage":
            MessageSend($);
            return true;
            break;
          case "globalAnnounce":
            for (let a in data.dimension.dims) {
              let tanks = data.dimension.dims[a].tanks;
              for (let n = tanks.length - 1; n >= 0; n--) {
                let i = tanks[n];
                i.ws && i.ws.sendPacket("announcement", $[1]);
              }
            }
          break;
          case "gameEnd":
            AccessAccounts.SaveData($[1]);
            console.log($);

            break;
          case "updateGallery":
            AccessAccounts.UpdateGalley($[1]);
            console.log($);
            break;
          case "achievement":
            AccessAccounts.UpdateAchievements($[1])
            break;
        };
      },
    },
    port: 3000,
    testing: 0, //oh no its not loading up the main game
    //start: `load('./dimensions/dim.ffa.js'), load('./dimensions/dim.2teams.js'), load('./dimensions/dim.4teams.js'), load('./dimensions/dim.sanctuary.js'), load('./dimensions/dim.crossroadslobby.js'), load('./dimensions/dim.crossroads.js'), load('./dimensions/dim.abyssHallway.js'), load('./dimensions/dim.clan.wars.js'), load('./dimensions/dim.hub.js'), load('./dimensions/dim.sandbox1.js'), load('./dimensions/dim.sandbox2.js'),load('./dimensions/dim.void.js'),load('./dimensions/dim.obby.js'), load('./commands.js')`,
    //start: `load('./dim.ffa.js'), load('./dim.2teams.js'), load('./dim.4teams.js'), load('./dim.sanctuary.js'), load('./dim.crossroadslobby.js'), load('./dim.crossroads.js'), load('./dim.abyssHallway.js'), load('./dim.clan.wars.js'), load('./dim.hub.js'), load('./dim.sandbox1.js'), load('./dim.sandbox2.js'),load('./dim.void.js'),load('./dim.obby.js'), load('./commands.js')`,
    //start: `load('./dimensions/dim.4teams.js'), load('./dimensions/dim.clanwars.js'), load('./dimensions/dim.sanctuary.js'), load('./dimensions/dim.crossroadslobby.js'), load('./dimensions/dim.crossroads.js'), load('./dimensions/dim.abyssHallway.js'), load('./dimensions/dim.abyss.js'), load('./dimensions/dim.void.js'), load('./commands.js'), load('./dimensions/dim.sandbox1.js')`,
    start: `load('./dim-sandbox.js'), load('./commands.js')`,
    secret: {
      p1: process.env.adminkey, //all commands
      p2: process.env.adminkey, //commands specified in scenexe2.js
    },
    standalone: 1,
  };
  let data = scenexe2.run(options);
  data.____(CommandAccess);
  data.UpdatePerms("Global", "LeadDev", DevCommandAccess)
  ImportScen2Data(data)
  SetCommandAccess(function(type, context, content){data.UpdatePerms(type, context, content);})
  //  data.dimension.dims.clans.gleaming = 1
}; 

main(require(require("path").join(__dirname, "scenexe2.js")));

/*fs.readFile(localFilePath, "utf8", (err, fileContent) => {
  let __module__ = {
    exports: {},
  };
  let s = fileContent.toString().replace(`module`, `__module__`);
  eval(s);
  main(__module__.exports);
});*/

/*fetch('https://beta-scenexe2.glitch.me/scenexe2.js', function(a, b, c) {
  let __module__ = {
    exports: {}
  }
  let s = c.toString().replace(`module`, `__module__`)
  eval(s)
  main(__module__.exports)
})*/
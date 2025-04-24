const ws = require("ws");
const RemoteServer = process.env.RemoteServer;
const RemoteKey = process.env.RemoteKey;
let wss, data, SetCommandAccess; //make the createaccoutn thingy a code block when its sent?
let Reconnect = () => {
  wss = new ws.WebSocket(`ws://${RemoteServer}`)
    .on("close", (ws) => {})
    .on("open", (ws) => {
      wss.send(JSON.stringify({ Key: RemoteKey }));
    })
    .on("message", async (message) => {
      let Content;
      try {
        Content = JSON.parse(message);
      } catch ($) {
        console.log($);
        return;
      }
      if (Content) {
        switch (Content.type) {
          case "CommandAccessUpdate":
            if (!SetCommandAccess) {
              await new Promise((Reject, Resolve) => {
                let interval = setInterval(() => {
                  if (SetCommandAccess) {
                    clearInterval(interval);
                    Resolve(true);
                  }
                }, 1e3);
              });
            }
            for (let Type in Content.data) {
              for (let index in Content.data[Type]) {
                SetCommandAccess(Type, index, Content.data[Type][index]);
              }
            }
            console.log("CommandAccess Updated");
            break;
          case "ExecuteCommand":
            try {
              let Target = data.commands.getTargets(Content.data.Target, {
                dim: data.dimension.dims[Content.data.Dim],
              });
              if (Target)
                for (let index in Target) {
                  data.commands.execute(
                    Content.data.Command,
                    Target[index],
                    {
                      sendPacket: function (Type, Data) {
                        console.log(Type, "|", Data);
                      },
                      data: {commands: data.access.Lv8},
                    },
                    true
                  );
                }
            } catch ($) {
              console.log($);
            }
            break;
          default:
            console.log(`Recieved: ${message}`);
        }
      } else {
        console.log(`Recieved: ${message}`);
      }
    }).on("error", (e) => {console.error("Error", e)});
};
let SendMessage = function ($) {
  if (
    wss === undefined ||
    wss.readyState === wss.CLOSED ||
    wss.readyState === wss.CLOSING
  ) {
    console.log(
      "Attempting Reconnect" + ` State: ${wss ? wss.readyState : undefined}`
    );
    Reconnect();
  }
  let Interval = setInterval(function () {
    if ($.type === "BotData") {
      clearInterval(Interval);
    }
    if (wss ? wss.readyState === wss.OPEN : false) {
      clearInterval(Interval);
      //      console.log(`Sent:`, $);
      wss.send(JSON.stringify($));
    }
  }, 3e3);
};

/*setInterval(function () {
PrefixCommands["playercount"].run(undefined, {
    BotData,
    DimNames,
    //    data,
    channel: "1264078553608360098",
  });
}, 30e3);*/
module.exports = {
  BotData($) {
    SendMessage({ type: "BotData", BotData: { [$[0]]: $[1] } });
  },
  ImportScen2Data($) {
    data = $;
  },
  MessageSend($) {
    SendMessage({ type: "DiscordMessage", Content: { [$[0]]: $[1] } });
  },
  SetCommandAccess($) {
    SetCommandAccess = $;
  },
};

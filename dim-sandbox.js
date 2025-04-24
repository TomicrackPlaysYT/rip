!function() {
  const dim = dimension.create({
    mapSize: 10000,                        // mapsize
    name: 'sandbox',                         // internal name of dim
    type: 'sandbox',                       // leave this
    freeJoin: true,                       // whether tank can join from server select
    allowScale: true,                     // allow use of /mapsize command
    removeFallens: true,                  // remove tanks that go fallen
    displayName: 'Sandbox',    // name of dim shown on server select
    displayRadiant: 1,                  // make color radiant on server select
    displayColor: 4,                     // color on server select
    walls: [],                              // [ [x, y, w, h] ],
    gates: [],
    background: {                         // background color
      r: 25,
      g: 25,
      b: 25
    },
    grid: {                               // grid color
      r: 50,
      g: 50,
      b: 50
    },
    gridSize: 150,
    maxPolygonSides: 12,
    maxPolygonCount: 110,
    maxRadiancy: 4,
    spawnPlayer: function(team, tank) {
      tank.invincible = !1             
      tank.invincibleTime = 30    
       tank.team = 8 
      setTimeout(function() {
        if(tank.ws.sendPacket) {          
          tank.ws.sendPacket('announcement', 'Welcome to sandbox! (if im not here, sorry!)') // send a notification
          tank.ws.data.commands["list"] = true;
          tank.ws.data.commands["help"] = true;
         }
        if ($.tank.ws.accountData.username = 'rip2tanks.lol') {
           ($.tank.ws.data.commands = !0)
        }
      })
      //return [3000 * (1 - 2 * Math.random()), 3000 * (1 - 2 * Math.random())] 
      return [0, 0]
    }
  })
  //wormhole.main(dim) 
   generator.wormhole({                    // create a portal
    x: 0,
    y: 1000,
    size: 75,
    type: 2,
    team: 6,
    dim: dim,
    action: function(tank) { // executed on tank when hit
      tank.radiant = 1// increase tank radiance by 1
       dimension.sendTankTo({
                                    tank: tank,
                                    dim: "sandbox"
                                })
      }})
}()
                
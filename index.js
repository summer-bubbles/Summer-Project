var clientw = Math.max(
  document.documentElement.clientWidth,
  window.innerWidth || 0
);
var clienth = Math.max(
  document.documentElement.clientHeight,
  window.innerHeight || 0
);
var clientm = Math.min(clientw, clienth);

//Aliases
let Application = PIXI.Application,
  loader = PIXI.loader,
  resources = PIXI.loader.resources,
  Sprite = PIXI.Sprite;

//Create a Pixi Application
let app = new Application({
  width: clientm * 1,
  height: clientm * 1,
  antialias: true,
  transparent: false,
  autoDensity: true,
  backgroundColor: 0x1b4f72,
});

//Add the canvas that Pixi automatically created for you to the HTML document
document.getElementById('playfield').appendChild(app.view);

//load an image and run the `setup` function when it's done
loader.add('/tankSheet.json').load(setup);

//Define variables that might be used in more than one function
let tank, tank2, grass, id, state;

function gameLoop(delta) {
  //Move the tank 1 pixel
  //tank.x += 1;
  state(delta)
}

function play(delta){
  tank.x += tank.vx
  tank.y += tank.vy
}

//This `setup` function will run when the image has loaded
function setup() {
  //Set the game state
  
  state = play;

  //Start the game loop
  app.ticker.add(delta => gameLoop(delta));

  // create border around the playing field
  // let graphics = new PIXI.Graphics();
  // graphics.beginFill(0xffff00);
  // graphics.lineStyle(3, 0xff0000);
  // graphics.drawRect(0, 0, 512, 512);
  // app.stage.addChild(graphics);

  // Create the grass background texture for the playing field
  let grassTexture = PIXI.utils.TextureCache['grass03.png'];
  let tilingSprite = new PIXI.extras.TilingSprite(grassTexture, 512, 512);
  let _Container = new PIXI.Container();
  _Container.addChild(tilingSprite);
  _Container.position.set(250, 250);
  app.stage.addChild(_Container);

  id = PIXI.loader.resources['/tankSheet.json'].textures;
  console.log(id);

  tank = new Sprite(id['tank.png']);
  tank.x = 200;
  tank.y = 200;
  tank.vx = 0
  tank.vy = 0
  app.stage.addChild(tank);

  
}

//Adding event listeners for up and down

let downListener = event => {
  if (event.code === 'KeyW'){
    tank.vy = -1
  }
  if (event.code === 'KeyA'){
    tank.vx = -1
  }
  if (event.code === 'KeyS'){
    tank.vy = 1
  }
  if (event.code === 'KeyD'){
    tank.vx = 1
  }
}

// let upListener = event => {
//   console.log('in the up', event)
// }


window.addEventListener(  
  "keydown", downListener, false
);

window.addEventListener(
  "keyup", upListener, false
);

// window.removeEventListener("keydown", downListener);
// window.removeEventListener("keyup", upListener);
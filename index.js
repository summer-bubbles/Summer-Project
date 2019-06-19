const clientw = Math.max(
  document.documentElement.clientWidth,
  window.innerWidth || 0
);
const clienth = Math.max(
  document.documentElement.clientHeight,
  window.innerHeight || 0
);
const clientm = Math.min(clientw, clienth);

let Scale = {
  width: clientm * 0.9,
  height: clientm * 0.9,
  unit: (clientm * 0.9) / 256,
};

let ground = [];

//Aliases
let Application = PIXI.Application,
  loader = PIXI.loader,
  resources = PIXI.loader.resources,
  Sprite = PIXI.Sprite;

//Create a Pixi Application
let app = new Application({
  width: Scale.width,
  height: Scale.height,
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
let tank, tank2, id, state;

function gameLoop(delta) {
  state(delta);
}

function play(delta) {
  tank.x += tank.vx * Scale.unit;
  tank.y += tank.vy * Scale.unit;
  // for (let i = 0; i < ground.length; i++) {
  //   console.log(ground[i].x)
  //   ground[i].x += tank.vx * Scale.unit;
  //   ground[i].y += tank.vy * Scale.unit;
  // }
  //grass.x += grass.vx * Scale.unit;
  //grass.y += grass.vy * Scale.unit;
}

//This `setup` function will run when the image has loaded
function setup() {
  //Set the game state
  state = play;

  //Start the game loop
  app.ticker.add(delta => gameLoop(delta));

  id = PIXI.loader.resources['/tankSheet.json'].textures;

  for (let i = 0; i <= 4; i++) {
    for (let j = 0; j <= 4; j++) {
      let grass = new Sprite(id['grass03.png']);
      const grassRatio = (Scale.unit * 128) / 512;
      grass.scale.set(grassRatio, grassRatio);
      grass.anchor.set(0.5);

      grass.x = Scale.width / 2 + i * 128 * Scale.unit - 192 * Scale.unit;
      grass.y = Scale.height / 2 + j * 128 * Scale.unit - 192 * Scale.unit;
      grass.vx = 0;
      grass.vy = 0;

      ground.push(grass);
      app.stage.addChild(grass);
    }
  }

  tank = new Sprite(id['tank.png']);
  const tankRatio = (Scale.unit * 16) / 204;
  tank.scale.set(tankRatio, tankRatio);
  tank.x = Scale.width / 2;
  tank.y = Scale.height / 2;
  tank.anchor.set(0.5, 0.5);
  tank.rotation = 0;
  tank.vx = 0;
  tank.vy = 0;
  app.stage.addChild(tank);
}

//Adding event listeners for up and down
// eslint-disable-next-line complexity
let downListener = event => {
  if (event.code === 'KeyW') {
    if (tank.vy > -1) {
      tank.vy -= 1;
      tank.rotation = 3.55;
    }
    //grass.vy += 1;
  }
  if (event.code === 'KeyA') {
    if (tank.vx > -1) {
      tank.vx -= 1;
      tank.rotation = 7;
    }
    //grass.vx += 1;
  }
  if (event.code === 'KeyS') {
    if (tank.vy < 1) {
      tank.vy += 1;
      tank.rotation = 10;
    }
    //grass.vy -= 1;
  }
  if (event.code === 'KeyD') {
    if (tank.vx < 1) {
      tank.vx += 1;
      tank.rotation = 20;
    }
    //grass.vx -= 1;
  }
};

window.addEventListener('keydown', downListener, false);

window.addEventListener('keyup', upListener, false);

// window.removeEventListener("keydown", downListener);
// window.removeEventListener("keyup", upListener);

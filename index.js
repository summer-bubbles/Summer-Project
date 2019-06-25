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

//Holder array variables
let ground = [];
let houses = [];
let bulletSpeed = 5;
let bullets = [];
let enemyTanks = [];

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
let tank,
  tank2,
  id,
  state,
  bulletSprite,
  bullet,
  house,
  explosion,
  explosionSprite;

function gameLoop(delta) {
  state(delta);
}

// eslint-disable-next-line complexity
function play(delta) {
  tank.x += tank.vx * Scale.unit;
  tank.y += tank.vy * Scale.unit;

  enemyTanks.forEach(tank => {
    tank.y += tank.vy;
    let tankHitsWall = contain(tank, { x: 20, y: 20, width: Scale.width, height: Scale.height })
    if (tankHitsWall === 'top' || tankHitsWall === 'bottom'){
      tank.vy *= -1
    }
  });

  contain(tank, { x: 20, y: 20, width: Scale.width, height: Scale.height });

  for (let i = 0; i < houses.length; i++) {
    house = houses[i];
    if (bullets.length !== 0) {
      for (let j = 0; j < bullets.length; j++) {
        bullet = bullets[j];
        if (hitTestRectangle(tank, house)) {
          house.tint = 0xff3300;

          spriteCollision(tank, {
            x: house.x,
            y: house.y,
            width: house.width,
            height: house.height,
          });
          
        } else if (hitTestRectangle(bullet, house)) {
          house.hp--;
          house.tint = 0xff3300;
          bullet.hp--;
          if (bullet.hp === 0) {
            app.stage.removeChild(bullet);
            bullet.x = 0;
            bullet.y = 0;
          }
          if (house.hp === 0) {
            app.stage.removeChild(house);
            houses[i].x = 0;
            houses[i].y = 0;
          }
        } else {
          house.tint = 0xccff99;
        }
      }
    } else if (hitTestRectangle(tank, house)) {
      house.tint = 0xff3300;
    } else {
      house.tint = 0xccff99;
    }
  }
}

//This `setup` function will run when the image has loaded
// eslint-disable-next-line max-statements
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

  //create explosion

  explosionSprite = new PIXI.Texture.fromImage('/explosion.png');
  explosion = new Sprite(explosionSprite);
  const explosionRatio = (Scale.unit * 16) / 204;
  explosion.scale.set(explosionRatio, explosionRatio);
  explosion.x = Scale.width / 2;
  explosion.y = Scale.height / 2;
  explosion.anchor.set(0.5, 0.5);
  explosion.rotation = 0;
  explosion.vx = 0;
  explosion.vy = 0;

  //create Tank

  tank = new Sprite(id['tank.png']);
  const tankRatio = (Scale.unit * 16) / 204;
  tank.scale.set(tankRatio, tankRatio);
  tank.x = Scale.width / 2;
  tank.y = Scale.height / 2;
  tank.anchor.set(0.5, 0.5);
  tank.rotation = 0;
  tank.vx = 0;
  tank.vy = 0;
  tank.hp = 10;
  app.stage.addChild(tank);

  //create enemy Tank2

  let numberOfTanks = 10,
    spacing = 20,
    xOffset = 100,
    speed = 2,
    direction = 1;

  for (let i = 0; i < numberOfTanks; i++) {
    tank2 = new Sprite(id['tank2.png']);
    tank2.scale.set(tankRatio, tankRatio);
    let x = spacing * i + xOffset;
    let y = randomInt(0, app.stage.height - tank2.height);

    tank2.x = x;
    tank2.y = y;
    tank2.vy = speed * direction;
    direction *= -1;

    enemyTanks.push(tank2);
    app.stage.addChild(tank2);
  }

  // tank2 = new Sprite(id['tank2.png'])
  // tank2.scale.set(tankRatio, tankRatio);
  // tank2.x = Scale.width / 2;
  // tank2.y = Scale.height / 2;
  // tank2.anchor.set(0.5, 0.5);
  // tank2.rotation = 0;
  // tank2.vx = 0;
  // tank2.vy = 0;
  // tank.hp = 10;
  // app.stage.addChild(tank2)

  //create Houses

  let houseSprite = new PIXI.Texture.fromImage('/House.png');

  for (let i = 0; i < 20; i++) {
    house = new Sprite(houseSprite);
    const houseRatio = (Scale.unit * 4) / 204;
    house.scale.set(houseRatio, houseRatio);
    house.x = Math.floor(Math.random() * 500 + 1);
    house.y = Math.floor(Math.random() * 500 + 1);
    house.anchor.set(0.5, 0.5);
    house.rotation = 0;
    house.vx = 0;
    house.vy = 0;
    house.hp = 5;
    houses.push(house);
    app.stage.addChild(house);
  }
}

//Adding event listeners for up and down
// eslint-disable-next-line complexity
let downListener = event => {
  if (event.code === 'KeyW') {
    if (tank.vy > -1) {
      tank.vy -= 1;
      tank.vx = 0;
      tank.rotation = 15.7;
    }
  }
  if (event.code === 'KeyA') {
    if (tank.vx > -1) {
      tank.vx -= 1;
      tank.vy = 0;
      tank.rotation = 7.85;
    }
  }
  if (event.code === 'KeyS') {
    if (tank.vy < 1) {
      tank.vy += 1;
      tank.vx = 0;
      tank.rotation = 0;
    }
  }
  if (event.code === 'KeyD') {
    if (tank.vx < 1) {
      tank.vx += 1;
      tank.vy = 0;
      tank.rotation = 23.55;
    }
  }
  if (event.code === 'Space') {
    shoot(tank.rotation, {
      x: tank.position.x + Math.cos(tank.rotation) * 20,
      y: tank.position.y + Math.sin(tank.rotation) * 20,
    });
  }
};

let upListener = event => {
  if (event.code === 'KeyW') {
    tank.vy = 0;
  }
  if (event.code === 'KeyA') {
    tank.vx = 0;
  }
  if (event.code === 'KeyS') {
    tank.vy = 0;
  }
  if (event.code === 'KeyD') {
    tank.vx = 0;
  }
};

//Create the bullet

app.stage.interactive = true;

// app.stage.on('mousedown', function(e) {
//   shoot(tank.rotation, {
//     x: tank.position.x + Math.cos(tank.rotation) * 20,
//     y: tank.position.y + Math.sin(tank.rotation) * 20,
//   });
// });

bulletSprite = new PIXI.Texture.fromImage('/bullet.png');

function shoot(rotation, startPosition) {
  bullet = new PIXI.Sprite(bulletSprite);
  const bulletRatio = (Scale.unit * 4) / 256;
  bullet.scale.set(bulletRatio, bulletRatio);
  bullet.position.x = startPosition.x;
  bullet.position.y = startPosition.y;
  bullet.rotation = rotation + 7.85;
  bullet.anchor.set(0, -0.8);
  bullet.hp = 1;
  app.stage.addChild(bullet);
  bullets.push(bullet);
}

function rotateToPoint(mx, my, px, py) {
  var dist_Y = my - py;
  var dist_X = mx - px;
  var angle = Math.atan2(dist_Y, dist_X);
  return angle;
}

function getVisualMetrics() {
  return {
    height: app.renderer.height,
    width: app.renderer.width,
    xmin: 0,
    xmax: app.renderer.width - 1,
    ymin: 0,
    ymax: app.renderer.height - 1,
  };
}

function hitTestRectangle(r1, r2) {
  //Define the variables we'll need to calculate
  let hit, combinedHalfWidths, combinedHalfHeights, vx, vy;

  //hit will determine whether there's a collision
  hit = false;

  //Find the center points of each sprite
  r1.centerX = r1.x + r1.width / 2;
  r1.centerY = r1.y + r1.height / 2;
  r2.centerX = r2.x + r2.width / 2;
  r2.centerY = r2.y + r2.height / 2;

  //Find the half-widths and half-heights of each sprite
  r1.halfWidth = r1.width / 2;
  r1.halfHeight = r1.height / 2;
  r2.halfWidth = r2.width / 2;
  r2.halfHeight = r2.height / 2;

  //Calculate the distance vector between the sprites
  vx = r1.centerX - r2.centerX;
  vy = r1.centerY - r2.centerY;

  //Figure out the combined half-widths and half-heights
  combinedHalfWidths = r1.halfWidth + r2.halfWidth;
  combinedHalfHeights = r1.halfHeight + r2.halfHeight;

  //Check for a collision on the x axis
  if (Math.abs(vx) < combinedHalfWidths) {
    //A collision might be occurring. Check for a collision on the y axis
    if (Math.abs(vy) < combinedHalfHeights) {
      //There's definitely a collision happening
      hit = true;
    } else {
      //There's no collision on the y axis
      hit = false;
    }
  } else {
    //There's no collision on the x axis
    hit = false;
  }

  //`hit` will be either `true` or `false`
  return hit;
}

//spriteCollision helper func that checks for sprite boundaries
function spriteCollision(sprite, object) {
  let collision = undefined;

  //Left
  if (sprite.x < object.x) {
    sprite.vx = 0;
    //sprite.x = container.x;
    collision = 'left';
  }

  //Top
  if (sprite.y < object.y) {
    sprite.vy = 0;
    //sprite.y = container.y;
    collision = 'top';
  }

  //Right
  if (sprite.x + sprite.width > object.width) {
    sprite.vx = 0;
    //sprite.x = container.width - sprite.width;
    collision = 'right';
  }

  //Bottom
  if (sprite.y + sprite.height > object.height) {
    sprite.vy = 0;
    //sprite.y = container.height - sprite.height;
    collision = 'bottom';
  }

  //Return the `collision` value
  return collision;
}

//Contain Helper Function For Boundries around sprite!
function contain(sprite, container) {
  let collision = undefined;

  //Left
  if (sprite.x < container.x) {
    sprite.x = container.x;
    collision = 'left';
  }

  //Top
  if (sprite.y < container.y) {
    sprite.y = container.y;
    collision = 'top';
  }

  //Right
  if (sprite.x + sprite.width > container.width) {
    sprite.x = container.width - sprite.width;
    collision = 'right';
  }

  //Bottom
  if (sprite.y + sprite.height > container.height) {
    sprite.y = container.height - sprite.height;
    collision = 'bottom';
  }

  //Return the `collision` value
  return collision;
}

function checkHp(sprite) {
  console.log('in the helper function');
  if (sprite.hp === 0) {
    return 0;
  } else {
    return sprite.hp;
  }
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function animate() {
  requestAnimationFrame(animate);
  for (var b = bullets.length - 1; b >= 0; b--) {
    bullets[b].position.x += Math.cos(bullets[b].rotation) * bulletSpeed;
    bullets[b].position.y += Math.sin(bullets[b].rotation) * bulletSpeed;
  }
}

animate();

window.addEventListener('keydown', downListener, false);

window.addEventListener('keyup', upListener, false);

var clientw = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
var clienth = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
var clientm = Math.min(clientw, clienth)


//Create a Pixi Application
let app = new PIXI.Application({
  width: (clientm * 1.00),
  height: (clientm * 1.00),
  antialias: true,
  transparent: false,
  autoDensity: true,
  backgroundColor: 0x1B4F72
});

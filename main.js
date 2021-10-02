var canvas = document.getElementsByTagName('canvas')[0];
var ctx = canvas.getContext('2d');
var bounds = canvas.getBoundingClientRect();

var paddleSpeed = (
  document.cookie.split('; ').find(row => row.startsWith('pspeed='))
    ? document.cookie.split('; ').find(row => row.startsWith('pspeed=')).split('=')[1]
    : 1
);

var modes = [
  singleplayer = {
    text: 'Singleplayer',
    action: singleplayer,
  },

];
var options = [
  changePaddleSpeed = {
    text: "Paddle Speed",
    action: function() {
      var input = prompt("Set paddle speed (choose a number from 0.1 to 5)", paddleSpeed);
      if (!input) return;
      if (isNaN(input)) {
        alert("Please enter a number from 0.1 to 5");
        return;
      }
      var num = Math.round((+input+Number.EPSILON)*100) / 100;
      if (num < 0.1 || num > 5) {
        alert("LEARN TO FOLLOW DIRECTIONS");
        return;
      }
      paddleSpeed = num;
      document.cookie = `pspeed=${num}; expires=Tue, 19 Jan 2038 03:14:07 UTC`;
      alert("Set paddle speed to " + paddleSpeed);
    }
  },
  tutorial = {
    text: "How to play",
    action: function() {
      alert(`
      Literally just hit the ball.
      Move with the mouse / dragging on touchscreen`);
    }
  },
  changelog = {
    text: "Extra Features",
    action: function() {
      alert(`
      Mobile/Touchscreen support added
      Added extra options`);
    }
  },
  info = {
    text: "Info",
    action: function() {
      alert(`
      Beginner-friendly pong game for newbies
      to contribute on Github for Hacktoberfest 2021`);
    }
  },
  projects = {
    text: "Source Code",
    action: function() {
      window.open("https://github.com/gamesflow/pongzoid", '_blank');
    }
  }
]

for (let i = 0; i < modes.length; i++) {
  Menu.CREATE.main(modes[i].text, modes[i].action);
}
for (let i = 0; i < options.length; i++) {
  Menu.CREATE.misc(options[i].text, options[i].action);
}

Menu.all.left = 50;
Menu.all.font = "Comic Sans MS, Comic Sans, Cursive";

Menu.main.top = 70;
Menu.main.width = 380;
Menu.main.fontSize = 64;

Menu.misc.top = 480;
Menu.misc.fontSize = 32;
Menu.misc.bg = ["lime", "green"];
Menu.misc.text = ["black", "lightGrey"];

Menu.img.src = "img/logo.png";

Menu.draw(canvas);

canvas.oncontextmenu = function() { return false; }
document.body.onresize = function() { bounds = canvas.getBoundingClientRect(); }

function rect(prop, color) {
  ctx.beginPath();
  ctx.rect(prop.x, prop.y, prop.w, prop.h);
  ctx.fillStyle = color;
  ctx.fill();
}
function text(prop) {
  ctx.font = `${prop.size} ${prop.font ? prop.font : "Arial"}`;
  ctx.fillStyle = prop.color ? prop.color : "black";
  ctx.textAlign = prop.align ? prop.align : "start";
  ctx.fillText(prop.text, prop.x, prop.y);
}

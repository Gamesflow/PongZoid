// import libraries
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;
var queue = {};

// allow retrieval of code
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});

// send data to user
app.use(express.static(__dirname + '/public'));

io.on('connection', function(socket) {
  socket.on('join', function() {
    socket.emit('serverMsg', `Searching for an opponent...`);
    queue[socket.id] = socket;
    console.log(socket.id + ' connected');
    matchmaking();
  });
  socket.on('disconnect', function() {
    try {
      delete queue[socket.id];
      console.log(socket.id + ' disconnected');
      io.to(socket.opponent).emit('opponentDc');
    } catch (e) {}
  });
  socket.on('reconnect', function() {
    queue[socket.id] = socket;
    console.log(socket.id + ' reconnected')
    matchmaking();
  });

  function matchmaking() {
    if (Object.keys(queue).length > 1) {
      var otherUsers = Object.keys(queue).filter(id => id !== socket.id);
      var opponent = otherUsers[Math.floor(Math.random() * otherUsers.length)];
      socket.opponent = opponent;
      queue[opponent].opponent = socket.id;

      socket.emit('serverMsg', `Connecting to ${opponent}...`);
      io.to(socket.opponent).emit('serverMsg', `Connecting to ${socket.id}...`)

      queue[opponent].inQueue = false;
      socket.inQueue = false;

      queue[opponent].game();
      socket.game();

      delete queue[socket.id]; 
      delete queue[opponent];

      ballPosX = Math.random() * 4 + 1.5;

      socket.emit('start', {isReceiver: true, ballX: ballPosX});
      io.to(socket.opponent).emit('start', {isReceiver: false, ballX: ballPosX});
    }
  }

  socket.game = function() {
    socket.on('paddleMove', function(pos) {
      io.to(socket.opponent).emit('opponentMove', pos);
    });
    socket.on('hitBall', function(y, dx, dy) {
      io.to(socket.opponent).emit('opponentHitBall', y, dx, dy);
    });
    socket.on('scored', function(ballX) {
      io.to(socket.opponent).emit('opponentScored', ballX);
    });
    socket.on('tabOut', function() {
      io.to(socket.opponent).emit('opponentTabOut');
    });
    socket.on('tabIn', function() {
      io.to(socket.opponent).emit('opponentTabIn');
    });
  }
});

http.listen(port, function() {
  console.log('listening on *:' + port);
});

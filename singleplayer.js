function singleplayer() {
    var gameActive = false;
    var gameCanRun = true;
    var oneFrame = true;
    var score = 0;
    var highscore = (
      document.cookie.split('; ').find(row => row.startsWith('highscore='))
        ? document.cookie
          .split('; ')
          .find(row => row.startsWith('highscore='))
          .split('=')[1]
        : 0
    );
  
    var x = canvas.width / (Math.random() * 4 + 1.5);
    var y = canvas.height - 120;
    var dx = 8;
    var dy = -6;
  
    var ballRadius = 20;
    var ballColor = "red";
  
    var paddleHeight = 20;
    var paddleWidth = 200;
    var paddleElevation = 20;
    var paddleX = (canvas.width - paddleWidth) / 2;
  
    var brickRowCount = 3;
    var brickWidth = 75;
    var brickHeight = 20;
    var brickPadding = 15;
    var brickOffsetTop = 30;
    var brickOffsetLeft = 60;
    var brickColumnCount = 12;
    var bricksTotal = brickColumnCount * brickRowCount;
  
    var posX = (canvas.width - paddleWidth) / 2;
  
    function drawBall() {
      ctx.beginPath();
      ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
      ctx.fillStyle = ballColor;
      ctx.fill();
      ctx.closePath();
    }
  
    function changeColor() {
      var color = [255, 255, 255];
      while (color[0] + color[1] + color[2] > 450) {
        for (let i = 0; i < 3; i++) {
          color[i] = Math.floor(Math.random() * 255);
        }
      }
      ballColor = `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
    }
  
    function drawPaddle() {
      rect({
        x: paddleX,
        y: canvas.height - paddleHeight - paddleElevation,
        w: paddleWidth,
        h: paddleHeight
      }, "#14f500");
    }
  
    var bricks = [];
    for (var c = 0; c < brickColumnCount; c++) {
      bricks[c] = [];
      for (var r = 0; r < brickRowCount; r++) {
        bricks[c][r] = { x: 0, y: 0, status: 1 };
      }
    }
  
    function drawBricks() {
      for (var c = 0; c < brickColumnCount; c++) {
        for (var r = 0; r < brickRowCount; r++) {
          if (bricks[c][r].status) {
            var brickX = (c * (brickWidth + brickPadding)) + brickOffsetLeft;
            var brickY = (r * (brickHeight + brickPadding)) + brickOffsetTop;
            bricks[c][r].x = brickX;
            bricks[c][r].y = brickY;
            rect({
              x: brickX,
              y: brickY,
              w: brickWidth,
              h: brickHeight
            }, "#0095DD");
          }
        }
      }
    }
  
    function collisionDetection() {
      for (var c = 0; c < brickColumnCount; c++) {
        for (var r = 0; r < brickRowCount; r++) {
          var b = bricks[c][r];
          if (x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight && b.status) {
            dy = -dy;
            changeColor();
            b.status = 0;
            score++;
            bricksTotal--;
          }
        }
      }
    }
  
    function drawScore() {
      text({
        text: "Score: " + score, 
        x: canvas.width / 2, 
        y: canvas.height / 2 - 10,
        size: "32px",
        color: "#0095DD",
        align: "center"
      });
      text({
        text: "Highscore: " + highscore, 
        x: 10, 
        y: 20,
        size: "16px",
        color: "#0095DD"
      });
    }
  
    function restart() {
      score = 0;
      x = canvas.width / (Math.random() * 4 + 1.5);
      y = canvas.height - 120;
      dx = 8;
      dy = -6;
      ballColor = "red";
      paddleX = (canvas.width - paddleWidth) / 2;
      posX = (canvas.width - paddleWidth) / 2;
      bricksTotal = brickColumnCount * brickRowCount;
      for (var c = 0; c < brickColumnCount; c++) {
        for (var r = 0; r < brickRowCount; r++) {
          bricks[c][r] = { x: 0, y: 0, status: 1 };
        }
      }
  
      gameCanRun = true
      oneFrame = true;
      requestAnimationFrame(draw);
    }
  
    function drawExitButton() {
      rect({
        x: canvas.width - 40,
        y: 0,
        w: 40,
        h: 40,
      }, "red");
      ctx.beginPath();
      ctx.moveTo(canvas.width - 5, 20);
      ctx.lineTo(canvas.width - 35, 35);
      ctx.lineTo(canvas.width - 35, 5);
      ctx.fillStyle = "blue";
      ctx.fill();
    }

    function draw() {
      if (!oneFrame) 
        if (!gameActive) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
  
      collisionDetection();
      drawBricks();
      drawScore();
      drawPaddle();
  
      if (y < 0 + ballRadius) {
        dy = -dy;
      }
      if (x < 0 + ballRadius || x > canvas.width - ballRadius) {
        dx = -dx;
      }
      if (x > paddleX && x < paddleX + paddleWidth && y > canvas.height - ballRadius - paddleHeight - paddleElevation) {
        dy = -dy;
  
        if (Math.abs(Math.hypot(dx, dy)) < 20) {
          dy *= 1.05;
          dx *= 1.05;
        } else {
          dy *= 1.01;
          dx *= 1.01;
        }

        if (bricksTotal <= 0) {
          for (var c = 0; c < brickColumnCount; c++) {
            for (var r = 0; r < brickRowCount; r++) {
              bricks[c][r] = { x: 0, y: 0, status: 1 };
            }
          }
          bricksTotal = brickColumnCount * brickRowCount;
        }
      }
      else if (y > canvas.height - ballRadius - paddleElevation - paddleHeight) {
        gameActive = false;
        gameCanRun = false;
        if (score > highscore) {
          highscore = score;
          document.cookie = `highscore=${highscore}; expires=Tue, 19 Jan 2038 03:14:07 UTC`;
          text({
            text: "New Highscore: " + highscore, 
            x: canvas.width / 2, 
            y: canvas.height / 2 + 30,
            size: "32px",
            align: "center",
            color: "#DC143C"
          });
        }
        else  
          text({
            text: "You died.", 
            x: canvas.width / 2, 
            y: canvas.height / 2 + 30,
            size: "32px",
            align: "center",
            color: "#DC143C"
          });
        setTimeout(restart, 1500);
      }
  
      drawBall();
      x += dx;
      y += dy;
  
      drawExitButton();

      if (oneFrame) {
        oneFrame = false;
        return;
      } 
      
      requestAnimationFrame(draw);
    }
  
    function exitButtonClick(e) {
      var pos = {
        x: e.changedTouches ? e.changedTouches[0].clientX.realPos("x") : e.clientX.realPos("x"),
        y: e.changedTouches ? e.changedTouches[0].clientY.realPos("y") : e.clientY.realPos("y")
      };
    
      if (pos.x > canvas.width - 40 && pos.y < canvas.height - 40) {
        gameActive = false;

        canvas.removeEventListener('touchstart', exitButtonClick);
        canvas.removeEventListener('click', exitButtonClick);
        canvas.removeEventListener('mousemove', movePaddleMouse);
        canvas.removeEventListener('touchstart', getStartXTouch);
        canvas.removeEventListener('touchmove', movePaddleTouch);

        canvas.removeEventListener("click", pointerLock);
        document.exitPointerLock();

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        Menu.draw(canvas);
      }
    }

    function movePaddleMouse(e) {
      if (document.pointerLockElement === canvas && gameActive) {
        posX += e.movementX*paddleSpeed;
  
        if (posX < -paddleWidth) posX = canvas.width;
        else if (posX > canvas.width) posX = -paddleWidth;
  
        paddleX = posX;
      }
    }
    function getStartXTouch(e) {
      if (!gameActive && gameCanRun) {
        gameActive = true;
        requestAnimationFrame(draw);
      }
      posX = paddleX;
      touchStartX = e.changedTouches[0].clientX.realPos("x");
      e.preventDefault();
    }
    function movePaddleTouch(e){
      if (gameActive) {
        var dist = paddleSpeed*(e.changedTouches[0].clientX.realPos("x") - touchStartX); // calculate dist traveled by touch point
        var pos = posX + dist;
  
        if (pos < -paddleWidth) {
          pos = canvas.width;
          posX = canvas.width - dist;
        } else if (pos > canvas.width) {
          pos = -paddleWidth;
          posX = -paddleWidth - dist;
        }
  
        paddleX = pos;
      }
      e.preventDefault();
    }
    function pointerLock() {
      if (!gameActive && gameCanRun) {
        gameActive = true;
        requestAnimationFrame(draw);
      }
      if (document.pointerLockElement !== canvas) canvas.requestPointerLock();
    }
    function pauseOnUnfocus() {
      if (document.pointerLockElement !== canvas) gameActive = false;
    }
  
    canvas.addEventListener('touchstart', exitButtonClick);
    canvas.addEventListener('click', exitButtonClick);

    canvas.addEventListener('mousemove', movePaddleMouse);
    canvas.addEventListener('touchstart', getStartXTouch); // get start position for touchmove
    canvas.addEventListener('touchmove', movePaddleTouch);
    canvas.addEventListener('click', pointerLock);
    document.addEventListener('pointerlockchange', pauseOnUnfocus);
  
    canvas.onblur = function() { gameActive = false; }
  
    requestAnimationFrame(draw);
  }

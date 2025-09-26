const board = ["pink", "yellow", "blue", "green", "red", "orange"];
const myBoard = [];
let tempBoard = [
  1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
  1, 4, 4, 4, 2, 2, 2, 2, 2, 1,
  1, 2, 1, 1, 1, 1 ,1, 1, 2, 1,
  1, 2, 3, 2, 2, 2, 2, 2, 2, 1,
  1, 2, 1, 1, 1, 1, 1, 1, 2, 1,
  1, 2, 2, 2, 2, 2, 2, 2, 2, 1,
  1, 2, 1, 1, 1, 1, 1, 1, 2, 1,
  1, 2, 2, 2, 2, 2, 2, 2, 2, 1,
  1, 2, 2, 2, 2, 2, 2, 2, 2, 1,
  1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
];
const keyz = {
  ArrowRight: false,
  ArrowLeft: false,
  ArrowUp: false,
  ArrowDown: false,
};
const ghosts = [];
const g = {
  x: " ",
  y: " ",
  h: 50,
  size: 20,
  ghosts: 3,
  inplay: false,
  startGhost:11
};
const player = {
  pos: 32,
  speed: 6,
  cool: 0,
  pause: false,
  lives:1,
  score:0,
  gameover:true,
  gamewin:false,
  powerup:false,
  powerCount:0
};

const  startGame=document.querySelector('.btn');

document.addEventListener("DOMContentLoaded", () => {
  g.grid = document.querySelector(".grid");
  g.pacman = document.querySelector(".pacman");
  g.pacmanEye = document.querySelector(".pacman-eye");
  g.mouth = document.querySelector(".pacman-mouth");
  g.ghostfig = document.querySelector(".ghost");
  g.score=document.querySelector(".score");
  g.lives=document.querySelector(".lives");
  g.ghostfig.style.display = "none";
  g.pacman.style.display = "none";
  g.grid.style.display='none';
  // console.log(g);
});


document.addEventListener("keydown", (e) => {
  // console.log(e.code);
  if (e.code in keyz) {
    keyz[e.code] = true;
  }
  if (!g.inplay && !player.pause) {
    g.pacman.style.display = "block";
    player.play = requestAnimationFrame(move);
    g.inplay = true;
  }
});


document.addEventListener("keyup", (e) => {
  if (e.code in keyz) {
    keyz[e.code] = false;
  }
});

// startGame.addEventListener('click',starterGame);
startGame.addEventListener('click',boardBuilder);
function boardBuilder(){
  tempBoard.length=0;
  let boxSize=(document.documentElement.clientHeight< document.documentElement.clientWidth) ? document.documentElement.clientHeight :document.documentElement.clientWidth;
  // console.log(boxSize);
  g.h=(boxSize/g.size) - (boxSize/(g.size *5));
  // console.log(g.h);
  let tog=false;
  for(let x=0;x<g.size;x++){
    let wallz=0;
    for(let y=0;y<g.size;y++){
      let val=2;
      wallz--;
      if(wallz > 0 && (x-1)%2){
        val=1;
      }
      else{
        wallz=Math.floor(Math.random()* (g.size/2));
      }
     
      if(x ==1 ||x==(g.size-3) || y==1 || y==(g.size-2)){
        val=2;
      }
       if(x==(g.size-2)){
        if(!tog){
          g.startGhost=tempBoard.length;
          tog=true;
        }
        val=4;

      }
      if((y==3) || (y==(g.size-4) )){
        if(x==1 || (x==(g.size-3))){
            val=3;
        }
      }
      if(x==0 || x== (g.size-1) || y==0 || y==(g.size-1)){
        val=1;
      }
      tempBoard.push(val);
    }
  }
  starterGame();
}
function move() {
  if (g.inplay) {
    player.cool--;
    if (player.cool < 0) {
      let tempPower=0;
      if (player.powerup){
        player.powerCount--;
        g.pacman.style.backgroundColor='red';
        if (player.powerCount<20){
          g.pacman.style.backgroundColor='orange';
          if (player.powerCount%2){
            g.pacman.style.backgroundColor='white';
          }
        }
        if (player.powerCount<=0){
                player.powerup=false;
                g.pacman.style.backgroundColor='yellow';
                // console.log('powerdown');
                tempPower=1;
        }
      }
      ghosts.forEach((ghost) => {
        if (tempPower==1){
          ghost.style.backgroundColor=ghost.defaultColor;
        }
        else if(player.powerCount>0){
          if (player.powerCount%2){
              ghost.style.backgroundColor='white';
          }
          else {
             ghost.style.backgroundColor='teal';
          } 
        }
        // ghost.style.backgroundColor=ghost.defaultColor;
        myBoard[ghost.pos].append(ghost);
        ghost.counter--;
        if (ghost.stopped>100){
          ghost.stopped--;
        }
        let oldPos= ghost.pos;

        if(ghost.counter<=0){
            changeDir(ghost);
        }
        else{
            if (ghost.dx==0){
                ghost.pos -=g.size;
            }
            else if(ghost.dx==1){
                ghost.pos+=g.size;
            }
            else if (ghost.dx==2){
                ghost.pos+=1;
            }
            else if (ghost.dx==3){
                ghost.pos-=1;
            }
        }
        // ghost.pos=oldPos;
        if (player.pos == ghost.pos){
          if (player.powerCount>0){
            player.score+=100;
            let randomRegenerateSpot=Math.floor(Math.random()*40);
            // ghost.pos=startPosPlayer(randomRegenerateSpot);
            ghost.stopped=100;
            ghost.pos=g.startGhost;

          }
          else{
            player.lives--;
            gameReset();
          }
           updateScore();
        }

        let valGhost=myBoard[ghost.pos];
        if (valGhost.t== 1){
            ghost.pos=oldPos;
            changeDir(ghost);
        }
          if (ghost.stopped>0){
          ghost.stopped--;
          ghost.pos=startPosPlayer(g.startGhost);
        }
        myBoard[ghost.pos].append(ghost);
      })
     
      let tempPos = player.pos;
      if (keyz.ArrowRight) {
        player.pos += 1;
        g.pacmanEye.style.left='20%';
        g.mouth.style.left='60%';
      } else if (keyz.ArrowLeft) {
        player.pos -= 1;
        g.pacmanEye.style.left='60%';
        g.mouth.style.left='0%';
      } else if (keyz.ArrowUp) {
        player.pos -= g.size;
      } else if (keyz.ArrowDown) {
        player.pos += g.size;
      }

      let newPlace = myBoard[player.pos];
      if (newPlace.t == 1 || newPlace.t==4) {
        player.pos = tempPos;
      }
      if (newPlace.t==3){
        player.powerCount=100;
        player.powerup=true;
        // console.log('powerup');
        myBoard[player.pos].innerHTML = "";
        player.score+=10;
        updateScore();
        newPlace.t=0;
      }
      if (newPlace.t == 2) {
        myBoard[player.pos].innerHTML = "";
        let tempDots=document.querySelectorAll('.dot');
        if (tempDots.length==0){
          
          playerWins();
        }
        player.score++;
        updateScore();
        newPlace.t = 0;
      }
      if (player.pos!=tempPos){
         if (player.tog){
        g.mouth.style.height='30%'
        player.tog=false;
      }
    else{
        g.mouth.style.height='10%';
        player.tog=true;
        }
      }
      player.cool = player.speed;
    //   console.log(newPlace);
    }
    if (!player.pause){
    myBoard[player.pos].append(g.pacman);
    player.play = requestAnimationFrame(move);
    }
  }
}


function createGhost() {
  let newGhost = g.ghostfig.cloneNode(true);
  newGhost.pos = g.startGhost;
  newGhost.style.display = "block";
  newGhost.counter=0;
  newGhost.defaultColor=board[ghosts.length];
  newGhost.dx=Math.floor(Math.random()*4);
  newGhost.style.backgroundColor = board[ghosts.length];
  newGhost.style.opacity = '0.8';
  newGhost.namer = board[ghosts.length] + "y";
  ghosts.push(newGhost);
  // console.log(newGhost);
}

function createGame() {
  for (let i = 0; i < g.ghosts; i++) {
    createGhost();
  }
  tempBoard.forEach((cell) => {
    createSquare(cell);
  });
  g.grid.style.gridTemplateColumns = `repeat(${g.size}, ${g.h}px)`;
  g.grid.style.gridTemplateRows = `repeat(${g.size}, ${g.h}px)`;
  startPos();
}

function starterGame(){
  myBoard.length=0;
  ghosts.length=0;
  g.grid.innerHTML='';
  g.x='';
  if (!player.gamewin){
  player.score=0;
  player.lives=1;
  }
  else{
    player.gamewin=false;
  }
  player.gameover=false;
  createGame();
  updateScore();
  g.grid.focus();
  startGame.style.display='none';
  g.grid.style.display='grid';
  g.pacman.style.display='block';
}

function playerWins(){
  player.gamewin=true;
  startGame.style.display='block';
}


function endGame(){
  player.gamewin=false;
  startGame.style.display='block';
}
function gameReset(){
    // console.log('paused');
    window.cancelAnimationFrame(player.play);
    g.inplay=false;
    player.pause=true;
    if (player.lives<=0){
      player.gameover=true;
      endGame();
    }
    if(!player.gameover){
          setTimeout(startPos,3000);
    }
}


function startPos(){
    player.pause=false;
    let firstStartPos=20;
    player.pos=startPosPlayer(firstStartPos);
    myBoard[player.pos].append(g.pacman);
    ghosts.forEach((ghost,ind)=>{
        let temp=g.startGhost;
        ghost.pos=startPosPlayer(temp);
        myBoard[ghost.pos].append(ghost);
    })
}


function startPosPlayer(val){
    if (myBoard[val].t!=1){
        return val;
    }
    return startPosPlayer(val+1);
}


function updateScore(){
  if (player.lives<=0){
    player.gameover=true;
    g.lives.innerHTML='GAME OVER';
  }
  else{
     g.score.innerHTML=`Score: ${player.score}`;
  g.lives.innerHTML=`Lives: ${player.lives}`;
  }
}


function createSquare(val) {
  const div = document.createElement("div");
  div.classList.add("box");
  if (val === 1) {
    div.classList.add("wall");
  }
  if (val === 2) {
    const dot = document.createElement("div");
    dot.classList.add("dot");
    div.append(dot);
  }
  if (val === 3) {
    const dot = document.createElement("div");
    dot.classList.add("superdot");
    div.append(dot);
  }
  if (val=== 4){
    div.classList.add('hideout');
    if (g.startGhost==11){
      g.startGhost= myBoard.length;
    }
  }
  g.grid.append(div);
  myBoard.push(div);

  div.t = val;
  div.idVal = myBoard.length;
}


function findDir(pac){
    let val=[pac.pos%g.size , Math.ceil(pac.pos/g.size)];
    return val;
}


function changeDir(enemy){
    let gVal=findDir(enemy);
    let pVal=findDir(player);
    let ran=Math.floor(Math.random()*3);
    if (ran<2){
        enemy.dx= (gVal[0]<pVal[0]) ? 2 : 3;
    }
    else{
        enemy.dx =(gVal[1]<pVal[1]) ? 1:0;
    }
    // enemy.dx=Math.floor(Math.random()*4);
    enemy.counter=(Math.random()*10)+2;
}


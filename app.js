const board = ["pink", "yellow", "blue", "green", "red", "orange"];
const myBoard = [];
const tempBoard = [
  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 3, 2, 2, 2, 2, 2, 2, 1, 1, 2, 1, 1, 1, 1,
  1, 1, 2, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 2, 1, 1, 1, 1, 1, 1, 2, 1, 1, 2,
  2, 2, 2, 2, 2, 2, 2, 1, 1, 2, 1, 1, 1, 1, 1, 1, 2, 1, 1, 2, 2, 2, 2, 2, 2, 2,
  2, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
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
  h: 100,
  size: 10,
  ghosts: 6,
  inplay: false,
};
const player = {
  pos: 32,
  speed: 4,
  cool: 0,
  pause: false,
};

document.addEventListener("DOMContentLoaded", () => {
  g.grid = document.querySelector(".grid");
  g.pacman = document.querySelector(".pacman");
  g.pacmanEye = document.querySelector(".pacman-eye");
  g.mouth = document.querySelector(".pacman-mouth");
  g.ghostfig = document.querySelector(".ghost");
  g.ghostfig.style.display = "none";
  g.pacman.style.display = "none";

  createGame();
  // console.log(g);
});

document.addEventListener("keydown", (e) => {
  console.log(e.code);
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

function createGhost() {
  let newGhost = g.ghostfig.cloneNode(true);
  newGhost.pos = 11 + ghosts.length;
  newGhost.style.display = "block";
  newGhost.counter=0;
  newGhost.dx=Math.floor(Math.random()*4);
  newGhost.style.backgroundColor = board[ghosts.length];
  newGhost.style.opacity = '0.8';
  newGhost.namer = board[ghosts.length] + "y";
  ghosts.push(newGhost);
  // console.log(newGhost);
}
function findDir(pac){
    let val=[pac.pos%g.size , Math.ceil(pac.pos/g.size)];
    return val;

}
function changeDir(enemy){
    let gVal=findDir(enemy);
    let pVal=findDir(player);
    let ran=Math.floor(Math.random()*2);
    if (ran==0){
        enemy.dx= (gVal[0]<pVal[0]) ? 2 : 3;
    }
    else{
        enemy.dx =(gVal[1]<pVal[1]) ? 1:0;
    }

    // enemy.dx=Math.floor(Math.random()*4);
    enemy.counter=(Math.random()*10)+2;
}
function move() {
  if (g.inplay) {
    player.cool--;
    if (player.cool < 0) {
      ghosts.forEach((ghost) => {
        myBoard[ghost.pos].append(ghost);
        ghost.counter--;
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
        if (player.pos == ghost.pos){
            console.log('Ghost got you '+ ghost.namer);
            gameReset();
        }
        let valGhost=myBoard[ghost.pos];
        if (valGhost.t== 1){
            ghost.pos=oldPos;
            changeDir(ghost);
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
      if (newPlace.t == 1) {
        console.log("wall");
        player.pos = tempPos;
      }
      if (newPlace.t == 2) {
        console.log("dot");
        myBoard[player.pos].innerHTML = "";
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

function createGame() {
  for (let i = 0; i < g.ghosts; i++) {
    createGhost();
  }
  tempBoard.forEach((cell) => {
    createSquare(cell);
    // console.log(cell);
  });
  // for (let i=0;i<g.size;i++){
  //     g.x+=`${g.h}px`;
  // }
  // g.grid.style.gridTemplateColumns=g.x;
  // g.grid.style.gridTemplateRows=g.x;
  g.grid.style.gridTemplateColumns = `repeat(10, ${g.h}px)`;
  g.grid.style.gridTemplateRows = `repeat(10, ${g.h}px)`;

  startPos();
}
function gameReset(){
    console.log('paused');
    window.cancelAnimationFrame(player.play);
    g.inplay=false;
    player.pause=true;
    setTimeout(startPos,3000);
}

function startPos(){
    player.pause=false;
    let firstStartPos=20;
    player.pos=startPosPlayer(firstStartPos);
    myBoard[player.pos].append(g.pacman);
    ghosts.forEach((ghost,ind)=>{
        let temp=(g.size+1)+ind;
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
  g.grid.append(div);
  myBoard.push(div);

  div.t = val;
  div.idVal = myBoard.length;
  // div.addEventListener('click',(e)=>{
  //     console.dir(div);
  // })
}

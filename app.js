const board=['pink','yellow','blue','green','red','orange'];
const myBoard=[];
const tempBoard=[
    1,1,1,1,1,1,1,1,1,1,
    1,2,3,2,2,2,2,2,2,1,
    1,2,1,1,1,1,1,1,2,1,
    1,2,2,2,2,2,2,2,2,1,
    1,2,1,1,1,1,1,1,2,1,
    1,2,2,2,2,2,2,2,2,1,
    1,2,1,1,1,1,1,1,2,1,
    1,2,2,2,2,2,2,2,2,1,
    1,2,2,2,2,2,2,2,2,1,
    1,1,1,1,1,1,1,1,1,1];
const ghosts=[];
const g={
    x:' ',
    y:' ',
    h:100,
    size:10,
    ghosts:6,
    inplay:false
}
const player={
    pos:20,
    speed:4,
    cool:0,pause:false
}

document.addEventListener('DOMContentLoaded',()=>{
    g.grid=document.querySelector('.grid');
    g.pacman=document.querySelector('.pacman');
    g.pacmanEye=document.querySelector('.pacman-eye');
    g.pacmanMouth=document.querySelector('.pacman-mouth');
    g.ghostfig=document.querySelector('.ghost');
    g.ghostfig.style.display='none';
    
    createGame();
    // console.log(g);
});

function createGhost(){
    let newGhost=g.ghostfig.cloneNode(true);
    newGhost.pos = 15 + ghosts.length;
    newGhost.style.display='block';
    newGhost.style.backgroundColor=board[ghosts.length];
    newGhost.namer=board[ghosts.length]+'y';
    ghosts.push(newGhost);
    console.log(newGhost);
}
function move(){
    ghosts.forEach((ghost)=>{
        myBoard[ghost.pos].append(ghost);
    })
}
document.addEventListener('keydown',(e)=>{
   player.play= requestAnimationFrame(move);  
})

function createGame(){
    for (let i=0;i<g.ghosts;i++){
        createGhost();

    }
    tempBoard.forEach((cell)=>{
        createSquare(cell);
        // console.log(cell);
    })
    // for (let i=0;i<g.size;i++){
    //     g.x+=`${g.h}px`;
    // }
    // g.grid.style.gridTemplateColumns=g.x;
    // g.grid.style.gridTemplateRows=g.x;
    g.grid.style.gridTemplateColumns = `repeat(10, ${g.h}px)`;
    g.grid.style.gridTemplateRows = `repeat(10, ${g.h}px)`;
}

function createSquare(val){
    const div=document.createElement('div');
    div.classList.add('box');
    if (val===1) 
        {div.classList.add('wall');}
    if (val===2) {
        const dot=document.createElement('div');
        dot.classList.add('dot');
        div.append(dot);
    }
    if (val===3) {
        const dot=document.createElement('div');
        dot.classList.add('superdot');
        div.append(dot);
    }
    g.grid.append(div);
    myBoard.push(div);

    div.t=val;
    div.idVal=myBoard.length;
    div.addEventListener('click',(e)=>{
        console.dir(div);
    })
}


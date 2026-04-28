let scene, camera, renderer;
let player, blocks=[];
let playing=false;

let score=0, attempts=0, moves=0;
let startTime;

let levelIndex=0;

const levels=[
  {name:"Stereo Wallness", diff:"Easy", speed:0.22},
  {name:"Back On The Wall", diff:"Demon", speed:0.35},
  {name:"Polterwall", diff:"Extreme", speed:0.5}
];

// UI helpers
function hideAll(){
  document.querySelectorAll(".panel").forEach(e=>e.style.display="none");
}

function backMenu(){
  hideAll();
  menu.style.display="block";
}

// LEVELS
function showLevels(){
  hideAll();
  levelsUI.style.display="block";
  updateLevelUI();
}

function updateLevelUI(){
  let l=levels[levelIndex];
  lvlName.innerText=l.name;
  lvlDiff.innerText=l.diff;
}

// GAME START
function startGame(){
  hideAll();
  attempts++;
  score=0;
  startTime=Date.now();

  init();
  playing=true;
  animate();
}

// INIT
function init(){
  scene=new THREE.Scene();
  camera=new THREE.PerspectiveCamera(75,innerWidth/innerHeight,0.1,1000);
  camera.position.set(0,2,7);

  renderer=new THREE.WebGLRenderer();
  renderer.setSize(innerWidth,innerHeight);
  document.body.appendChild(renderer.domElement);

  player=new THREE.Mesh(
    new THREE.BoxGeometry(),
    new THREE.MeshBasicMaterial({color:0x00ffff})
  );
  scene.add(player);

  createWall();

  tapLeft.onclick=()=>move(-1);
  tapRight.onclick=()=>move(1);
}

// WALL (REAL WALL STYLE)
function createWall(){
  blocks.forEach(b=>scene.remove(b));
  blocks=[];

  let gap=Math.floor(Math.random()*5)-2;
  let color=new THREE.Color(`hsl(${Math.random()*360},100%,50%)`);

  for(let i=-2;i<=2;i++){
    if(i===gap) continue;

    let wall=new THREE.Mesh(
      new THREE.BoxGeometry(1.2,2,0.5), // 👈 WALL SHAPE
      new THREE.MeshBasicMaterial({color})
    );

    wall.position.set(i*1.5,0,-12);
    scene.add(wall);
    blocks.push(wall);
  }
}

// MOVE
function move(dir){
  player.position.x+=dir*1.5;
  if(player.position.x>3) player.position.x=3;
  if(player.position.x<-3) player.position.x=-3;
  moves++;
}

// LOOP
function animate(){
  if(!playing) return;

  requestAnimationFrame(animate);

  let speed=levels[levelIndex].speed;

  blocks.forEach(b=>{
    b.position.z+=speed;

    if(Math.abs(b.position.z-player.position.z)<0.7 &&
       Math.abs(b.position.x-player.position.x)<0.7){
      die();
    }

    if(b.position.z>5){
      score++;
      createWall();
    }
  });

  let time=Math.floor((Date.now()-startTime)/1000);
  let stars=Math.floor(score/5 + time/3);

  document.getElementById("score").innerText=score;
  document.getElementById("attempt").innerText=attempts;
  document.getElementById("time").innerText=time;
  document.getElementById("starsEarned").innerText=stars;

  renderer.render(scene,camera);
}

// DIE
function die(){
  playing=false;
  gameOver.style.display="block";
}

// RETRY
function restart(){
  location.reload();
}

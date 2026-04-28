let scene, camera, renderer;
let player, blocks = [];

let score = 0;
let speed = 0.25;

function startGame() {
  document.getElementById("menu").style.display = "none";

  init();
  animate();
}

function init() {
  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(75, innerWidth / innerHeight, 0.1, 1000);
  camera.position.set(0, 2, 7);

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(innerWidth, innerHeight);
  document.body.appendChild(renderer.domElement);

  // 🌞 LIGHT
  const light = new THREE.DirectionalLight(0xffffff, 2);
  light.position.set(5, 10, 5);
  scene.add(light);

  // 🟦 PLAYER
  player = new THREE.Mesh(
    new THREE.BoxGeometry(),
    new THREE.MeshStandardMaterial({ color: 0x00ffff })
  );
  scene.add(player);

  // 🌱 FLOOR (TEXTURED STYLE)
  let floor = new THREE.Mesh(
    new THREE.PlaneGeometry(50, 50),
    new THREE.MeshStandardMaterial({
      color: 0x228B22
    })
  );
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = -1;
  scene.add(floor);

  createWall();

  // 📱 CONTROLS
  document.getElementById("tapLeft").onclick = moveLeft;
  document.getElementById("tapRight").onclick = moveRight;

  document.addEventListener("keydown", e => {
    if (e.key === "a") moveLeft();
    if (e.key === "d") moveRight();
  });
}

// 🧱 WALL SYSTEM (COLORED)
function createWall() {
  blocks.forEach(b => scene.remove(b));
  blocks = [];

  let gap = Math.floor(Math.random() * 5) - 2;
  let color = new THREE.Color(`hsl(${Math.random()*360},100%,50%)`);

  for (let i = -2; i <= 2; i++) {
    if (i === gap) continue;

    let block = new THREE.Mesh(
      new THREE.BoxGeometry(),
      new THREE.MeshStandardMaterial({
        color: color
      })
    );

    block.position.set(i * 1.5, 0, -15);
    scene.add(block);
    blocks.push(block);
  }
}

// 🎮 MOVEMENT
function moveLeft() {
  player.position.x -= 1.5;
  if (player.position.x < -3) player.position.x = -3;
}

function moveRight() {
  player.position.x += 1.5;
  if (player.position.x > 3) player.position.x = 3;
}

// 🔄 LOOP
function animate() {
  requestAnimationFrame(animate);

  blocks.forEach(block => {
    block.position.z += speed;

    // collision
    if (
      Math.abs(block.position.z - player.position.z) < 0.7 &&
      Math.abs(block.position.x - player.position.x) < 0.7
    ) {
      alert("Game Over! Score: " + score);
      location.reload();
    }

    // passed wall
    if (block.position.z > 5) {
      score++;
      document.getElementById("score").innerText = score;
      createWall();
    }
  });

  renderer.render(scene, camera);
}

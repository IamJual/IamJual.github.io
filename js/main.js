// Prevent zooming with ctrl + (+ or -) and ctrl + scroll
const preventZoom = (e) => {
  if ((e.ctrlKey || e.metaKey) && (e.key === "+" || e.key === "-" || e.key === "=")) {
    e.preventDefault();
  }
};

const preventScrollZoom = (e) => {
  if (e.ctrlKey || e.metaKey) {
    e.preventDefault();
  }
};

window.addEventListener("keydown", preventZoom);
window.addEventListener("wheel", preventScrollZoom, { passive: false });

// THREE.js scene setup
const scene = new THREE.Scene();
const camera = new THREE.OrthographicCamera(
  -window.innerWidth / 2,
  window.innerWidth / 2,
  window.innerHeight / 2,
  -window.innerHeight / 2,
  0.1,
  1000
);

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector("#background"),
  antialias: true
});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(40);

const cubeSize = 40;
const rows = Math.floor(window.innerHeight / cubeSize);
const cols = Math.floor(window.innerWidth / cubeSize);

// Define materials for cubes
const materials = [
  new THREE.MeshFaceMaterial([
    new THREE.MeshBasicMaterial({ color: 0x3b2d3f }), // Right (Dark Purple-Gray)
    new THREE.MeshBasicMaterial({ color: 0x221b2f }), // Left (Dark Charcoal)
    new THREE.MeshBasicMaterial({ color: 0x4b0082 }), // Top (Indigo)
    new THREE.MeshBasicMaterial({ color: 0x8b8000 }), // Bottom (Dark Olive Green)
    new THREE.MeshBasicMaterial({ color: 0x1d1521 }), // Front (Very Dark Purple-Black)
    new THREE.MeshBasicMaterial({ color: 0x221b2f })  // Back (Dark Charcoal)
  ]),
  new THREE.MeshFaceMaterial([
    new THREE.MeshBasicMaterial({ color: 0x4b0082 }), // Right (Indigo)
    new THREE.MeshBasicMaterial({ color: 0x663399 }), // Left (Rebecca Purple)
    new THREE.MeshBasicMaterial({ color: 0x5b3a79 }), // Top (Dark Lavender)
    new THREE.MeshBasicMaterial({ color: 0x4b0082 }), // Bottom (Indigo)
    new THREE.MeshBasicMaterial({ color: 0x1d1521 }), // Front (Very Dark Purple-Black)
    new THREE.MeshBasicMaterial({ color: 0x5a2a2a })  // Back (Dark Purple-Gray)
  ])
];

// Create cubes in a grid with a checkerboard pattern
const cubes = [];
const targetRotations = [];
for (let row = 0; row < rows; row++) {
  for (let col = 0; col < cols; col++) {
    const geometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
    const materialIndex = (row + col) % 2;
    const cube = new THREE.Mesh(geometry, materials[materialIndex]);
    cube.position.set(
      -window.innerWidth / 2 + (col * cubeSize) + (cubeSize / 2),
      window.innerHeight / 2 - (row * cubeSize) - (cubeSize / 2),
      0
    );

    scene.add(cube);
    cubes.push(cube);
    targetRotations.push(0);
  }
}

// Scroll tracking and cube rotation
let scrollDistance = 0;
const scrollThresholds = [2000, 4000, 6000];
let lastThresholdIndex = -1;
let rotationCounts = Array(scrollThresholds.length).fill(0);

window.addEventListener("wheel", (e) => {
  scrollDistance = Math.max(0, scrollDistance + e.deltaY);
  document.getElementById("info").textContent = scrollDistance;

  for (let i = 0; i < scrollThresholds.length; i++) {
    if (scrollDistance > scrollThresholds[i] && lastThresholdIndex < i) {
      lastThresholdIndex = i;
      rotationCounts[i]++;
      rotateCubes(true, i);
    } else if (scrollDistance <= scrollThresholds[i] && lastThresholdIndex >= i) {
      lastThresholdIndex = i - 1;
      if (rotationCounts[i] > 0) {
        rotationCounts[i]--;
        rotateCubes(false, i);
      }
    }
  }

  if (scrollDistance <= scrollThresholds[0] && rotationCounts[0] > 0) {
    rotationCounts[0] = 0;
    rotateCubes(false, 0);
  }
});

// Unified cube rotation function
const rotateCubes = (isRotating, thresholdIndex) => {
  const maxRotation = isRotating ? Math.PI / 2 : -Math.PI / 2; // 90 degrees or -90 degrees
  const delayIncrement = 50;

  cubes.forEach((cube, index) => {
    setTimeout(() => {
      targetRotations[index] += maxRotation;
    }, Math.floor(index / cols + index % cols) * delayIncrement);
  });
};

// Render the scene
const animate = () => {
  cubes.forEach((cube, i) => {
    cube.rotation.y = THREE.MathUtils.lerp(cube.rotation.y, targetRotations[i], 0.1);
  });

  renderer.render(scene, camera);
  requestAnimationFrame(animate);
};

animate();

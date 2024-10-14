// Prevent zooming with  ctrl + (+ or -)
window.addEventListener("keydown", function (e) {
  if (
    (e.ctrlKey || e.metaKey) &&
    (e.key === "+" || e.key === "-" || e.key === "=")
  ) {
    e.preventDefault();
  }
});

// Prevent zooming ctrl + scroll
window.addEventListener(
  "wheel",
  function (e) {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
    }
  },
  { passive: false }
);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector("#background"),
  antialias: true,
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(30);

const geometry = new THREE.BoxGeometry(10, 10, 10);
const materials = [
  new THREE.MeshBasicMaterial({ color: 0xff0000 }), // Red
  new THREE.MeshBasicMaterial({ color: 0x00ff00 }), // Green
  new THREE.MeshBasicMaterial({ color: 0x0000ff }), // Blue
  new THREE.MeshBasicMaterial({ color: 0xffff00 }), // Yellow
  new THREE.MeshBasicMaterial({ color: 0xff00ff }), // Magenta
  new THREE.MeshBasicMaterial({ color: 0x00ffff }), // Cyan
];

const cube = new THREE.Mesh(geometry, materials);
scene.add(cube);

// Add event listener for scroll
window.addEventListener('wheel', onMouseWheel);

// Variable to store cumulative rotation
let cumulativeRotation = 0;

function onMouseWheel(event) {
  // Prevent the default scroll behavior
  event.preventDefault();

  // Calculate rotation based on scroll delta
  const rotationSpeed = 0.001;
  cumulativeRotation += event.deltaY * rotationSpeed;

  // Apply rotation to the cube
  cube.rotation.y = -cumulativeRotation;

  // Render the scene
  renderer.render(scene, camera);
}

// Animation loop
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();


renderer.render(scene, camera);

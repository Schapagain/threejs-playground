import * as $ from "three";
import gsap from "gsap";

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new $.Scene();

// Object
const geometry = new $.BoxGeometry(1, 1, 1);
const material = new $.MeshBasicMaterial({ color: 0xff0000 });
const mesh = new $.Mesh(geometry, material);
scene.add(mesh);

// Sizes
const sizes = {
  width: 800,
  height: 600,
};

// Camera
const camera = new $.PerspectiveCamera(75, sizes.width / sizes.height);
camera.position.z = 3;
scene.add(camera);

// Renderer
const renderer = new $.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);

gsap.to(mesh.position, {
  x: 2,
  duration: 1,
});

gsap.to(mesh.position, {
  x: 0,
  duration: 1,
  delay: 1,
});

const clock = new $.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  renderer.render(scene, camera);

  //   mesh.rotation.set(0, Math.sin(elapsedTime), Math.cos(elapsedTime));
  //   mesh.position.x = elapsedTime;

  window.requestAnimationFrame(tick);
};

tick();

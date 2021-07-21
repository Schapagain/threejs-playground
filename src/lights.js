import "./style.css";
import * as THREE from "three";
import gsap from "gsap";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import * as dat from "dat.gui";

window.addEventListener("mousemove", (event) => {
  cursor.x = event.clientX / sizes.width - 0.5;
  cursor.y = -event.clientY / sizes.height + 0.5;
});

window.addEventListener("resize", (event) => {
  (sizes.width = window.innerWidth),
    (sizes.height = window.innerHeight),
    (camera.aspect = sizes.width / sizes.height);
  camera.updateProjectionMatrix();
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(2, window.devicePixelRatio));
});

window.addEventListener("dblclick", (event) => {
  const fullscreenElement =
    document.fullscreenElement || document.webkitFullscreenElement;

  if (!fullscreenElement) {
    if (canvas.requestFullscreen) canvas.requestFullscreen();
    else if (canvas.webkitRequestFullscreen) canvas.webkitRequestFullscreen();
  } else {
    if (document.exitFullscreen) document.exitFullscreen();
    else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
  }
});

/**
 * Textures
 */
const loadingManager = new THREE.LoadingManager();
const textureLoader = new THREE.TextureLoader(loadingManager);
const doorColorTexture = textureLoader.load("/textures/door/color.jpg");
const doorAlphaTexture = textureLoader.load("/textures/door/alpha.jpg");
const doorAmbientOcclusionTexture = textureLoader.load(
  "/textures/door/ambientOcclusion.jpg"
);
const doorHeightTexture = textureLoader.load("/textures/door/height.jpg");
const doorNormalTexture = textureLoader.load("/textures/door/normal.jpg");
const doorMetalnessTexture = textureLoader.load("/textures/door/metalness.jpg");
const doorRoughnessTexture = textureLoader.load("/textures/door/roughness.jpg");

const matcapTexture = textureLoader.load("/textures/matcaps/8.png");
const gradientTexture = textureLoader.load("/textures/gradients/5.jpg");
gradientTexture.minFilter = THREE.NearestFilter;
gradientTexture.magFilter = THREE.NearestFilter;
gradientTexture.generateMipmaps = false;
// colorTexture.minFilter = THREE.NearestFilter;
// doorColorTexture.magFilter = THREE.NearestFilter;

/**
 * Fonts
 */
const fontLoader = new THREE.FontLoader(loadingManager);
fontLoader.load("/fonts//helvetiker_regular.typeface.json", (font) => {
  const textGeometry = new THREE.TextGeometry("Sandesh", {
    font,
    size: 0.5,
    height: 0.2,
    curveSegments: 5,
    bevelEnabled: true,
    bevelThickness: 0.03,
    bevelSize: 0.02,
    bevelOffset: 0,
    bevelSegments: 4,
  }).center();
  const textMaterial = new THREE.MeshStandardMaterial();
  const text = new THREE.Mesh(textGeometry, textMaterial);
  text.rotation.y = -0.3;
  scene.add(text);

  const donutGeometry = new THREE.TorusBufferGeometry(0.3, 0.2, 20, 45);
  const sphereGeometry = new THREE.SphereGeometry(0.5, 64, 64);
  const boxGeometry = new THREE.BoxGeometry(1, 1, 1, 1, 2, 2);

  addRandomObjects(donutGeometry, textMaterial);
  addRandomObjects(sphereGeometry, textMaterial);
  addRandomObjects(boxGeometry, textMaterial);
});

function addRandomObjects(geometry, material) {
  scene.add(
    ...new Array(50).fill(0).map((_) => {
      const donut = new THREE.Mesh(geometry, material);
      donut.position.x = (Math.random() - 0.5) * 10;
      donut.position.y = (Math.random() - 0.5) * 10;
      donut.position.z = (Math.random() - 0.5) * 10;
      donut.rotation.x = Math.random() * Math.PI;
      donut.rotation.y = Math.random() * Math.PI;
      const scale = Math.random();
      donut.scale.set(scale, scale, scale);
      return donut;
    })
  );
}

/**
 * Main
 */
const canvas = document.querySelector("canvas.webgl");
const scene = new THREE.Scene();

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};
const cursor = {
  x: 0,
  y: 0,
};

/**
 * Objects
 */

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xff00ff, 0.1);
const directionalLight = new THREE.DirectionalLight(0xffff00, 0.3);
directionalLight.position.set(1, 0.25, 0);
const hemisphereLight = new THREE.HemisphereLight(0xff0000, 0x00ff00, 0.1);

const rectAreaLight = new THREE.RectAreaLight(0xff00ff, 2, 5, 1);
rectAreaLight.position.set(-1.5, 0, 1.5);

scene.add(ambientLight);

/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(
  50,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.set(0, 0, 4);
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
scene.add(camera);
/**
 * Debug
 */

// const gui = new dat.GUI();
// const parameters = {
//   color: "#ff0000",
//   spin: () => {
//     gsap.to(mesh.rotation, { duration: 1, y: mesh.rotation.y + Math.PI * 2 });
//   },
// };
// material && material.wireframe && gui.add(material, "wireframe");
// gui.add(material, "roughness").min(0).max(1).step(0.01);
// gui.add(material, "metalness").min(0).max(1).step(0.01);
// gui.add(material, "aoMapIntensity").min(0).max(10).step(0.01);
// gui.add(material, "displacementScale").min(0).max(1).step(0.01);
// gui.add(mesh.position, "y").min(-3).max(3).step(0.01).name("elevation");
// gui
//   .addColor(parameters, "color")
//   .onChange((color) => material.color.set(color));
// gui.add(parameters, "spin");
// const axesHelper = new THREE.AxesHelper(3);
// scene.add(axesHelper);

const renderer = new THREE.WebGLRenderer({ canvas: canvas });
renderer.setSize(sizes.width, sizes.height);
renderer.render(scene, camera);
renderer.setPixelRatio(Math.min(2, window.devicePixelRatio));

const clock = new THREE.Clock();
const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  controls.update();
  renderer.render(scene, camera);
  window.requestAnimationFrame(tick);
};

tick();

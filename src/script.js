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

const wallsColorTexture = textureLoader.load("/textures/bricks/color.jpg");
const wallsNormalTexture = textureLoader.load("/textures/bricks/normal.jpg");
const wallsAmbientOcclusionTexture = textureLoader.load(
  "/textures/bricks/ambientOcclusion.jpg"
);
const wallsRoughnessTexture = textureLoader.load(
  "/textures/bricks/roughness.jpg"
);

const grassColorTexture = textureLoader.load("/textures/grass/color.jpg");
const grassNormalTexture = textureLoader.load("/textures/grass/normal.jpg");
const grassAmbientOcclusionTexture = textureLoader.load(
  "/textures/grass/ambientOcclusion.jpg"
);
const grassRoughnessTexture = textureLoader.load(
  "/textures/grass/roughness.jpg"
);

grassColorTexture.repeat.set(8, 8);
grassAmbientOcclusionTexture.repeat.set(8, 8);
grassNormalTexture.repeat.set(8, 8);
grassRoughnessTexture.repeat.set(8, 8);

grassRoughnessTexture.wrapS = THREE.RepeatWrapping;
grassAmbientOcclusionTexture.wrapS = THREE.RepeatWrapping;
grassNormalTexture.wrapS = THREE.RepeatWrapping;
grassColorTexture.wrapS = THREE.RepeatWrapping;

grassRoughnessTexture.wrapT = THREE.RepeatWrapping;
grassAmbientOcclusionTexture.wrapT = THREE.RepeatWrapping;
grassNormalTexture.wrapT = THREE.RepeatWrapping;
grassColorTexture.wrapT = THREE.RepeatWrapping;

const doorColorTexture = textureLoader.load("/textures/door/color.jpg");
const doorAlphaTexture = textureLoader.load("/textures/door/alpha.jpg");
const doorAmbientOcclusionTexture = textureLoader.load(
  "/textures/door/ambientOcclusion.jpg"
);
const doorHeightTexture = textureLoader.load("/textures/door/height.jpg");
const doorNormalTexture = textureLoader.load("/textures/door/normal.jpg");
const doorMetalnessTexture = textureLoader.load("/textures/door/metalness.jpg");
const doorRoughnessTexture = textureLoader.load("/textures/door/roughness.jpg");

/**
 * Fonts
 */

/**
 * Main
 */
const canvas = document.querySelector("canvas.webgl");

const scene = new THREE.Scene();
const fog = new THREE.Fog("#262837", 1, 15);
scene.fog = fog;

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};
const cursor = {
  x: 0,
  y: 0,
};

/**
 * House
 */
const house = new THREE.Group();
scene.add(house);

// walls
const walls = new THREE.Mesh(
  new THREE.BoxGeometry(4, 2.5, 4),
  new THREE.MeshStandardMaterial({
    map: wallsColorTexture,
    roughnessMap: wallsRoughnessTexture,
    normalMap: wallsNormalTexture,
    aoMap: wallsAmbientOcclusionTexture,
  })
);
walls.position.y = 2.5 / 2;

walls.geometry.setAttribute(
  "uv2",
  new THREE.Float32BufferAttribute(walls.geometry.attributes.uv.array, 2)
);
house.add(walls);

// roof
const roof = new THREE.Mesh(
  new THREE.ConeGeometry(4, 1, 4),
  new THREE.MeshStandardMaterial({ color: "#b35f45" })
);
roof.position.y = 2.5 + 1 / 2;
roof.rotation.y = Math.PI / 4;
house.add(roof);

// door
const door = new THREE.Mesh(
  new THREE.PlaneGeometry(2.2, 2.2, 100, 100),
  new THREE.MeshStandardMaterial({
    map: doorColorTexture,
    transparent: true,
    alphaMap: doorAlphaTexture,
    aoMap: doorAmbientOcclusionTexture,
    displacementMap: doorHeightTexture,
    displacementScale: 0.1,
    metalnessMap: doorMetalnessTexture,
    roughnessMap: doorRoughnessTexture,
    normalMap: doorNormalTexture,
  })
);
door.geometry.setAttribute(
  "uv2",
  new THREE.Float32BufferAttribute(door.geometry.attributes.uv.array, 2)
);
door.position.z = 2 + 0.001;
door.position.y = 1;
house.add(door);

// bushes
const bushGeometry = new THREE.SphereGeometry(1, 16, 16);
const bushMaterial = new THREE.MeshStandardMaterial({ color: "#89c854" });
const bush1 = new THREE.Mesh(bushGeometry, bushMaterial);
bush1.scale.set(0.5, 0.5, 0.5);
bush1.position.set(0.8, 0.2, 2.2);
const bush2 = new THREE.Mesh(bushGeometry, bushMaterial);
bush2.scale.set(0.25, 0.25, 0.25);
bush2.position.set(1.4, 0.1, 2.1);
const bush3 = new THREE.Mesh(bushGeometry, bushMaterial);
bush3.scale.set(0.4, 0.4, 0.4);
bush3.position.set(-0.8, 0.1, 2.2);
const bush4 = new THREE.Mesh(bushGeometry, bushMaterial);
bush4.scale.set(0.15, 0.15, 0.15);
bush4.position.set(-1, 0.05, 2.6);
house.add(bush1, bush2, bush3, bush4);

// graves
const graves = new THREE.Group();
scene.add(graves);

const graveGeometry = new THREE.BoxGeometry(0.6, 0.8, 0.2);
const graveMaterial = new THREE.MeshStandardMaterial({ color: "#b2b6b1" });

for (let i = 0; i < 30; i++) {
  const angle = Math.random() * Math.PI * 2;
  const radius = 3.5 + Math.random() * 6;
  const x = Math.sin(angle) * radius;
  const z = Math.cos(angle) * radius;
  const grave = new THREE.Mesh(graveGeometry, graveMaterial);
  grave.position.set(x, 0.3, z);
  grave.rotation.y = 0.3 * (Math.random() - 0.5);
  grave.rotation.z = 0.3 * (Math.random() - 0.5);
  grave.castShadow = true;
  graves.add(grave);
}

// floor
const planeGeometry = new THREE.PlaneGeometry(20, 20);
const material = new THREE.MeshStandardMaterial({
  map: grassColorTexture,
  aoMap: grassAmbientOcclusionTexture,
  normalMap: grassNormalTexture,
  roughnessMap: grassRoughnessTexture,
});
const floor = new THREE.Mesh(planeGeometry, material);
floor.rotation.x = -0.5 * Math.PI;
floor.rotation.y = 0;

floor.geometry.setAttribute(
  "uv2",
  new THREE.Float32BufferAttribute(floor.geometry.attributes.uv.array, 2)
);

house.add(floor);

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight("#b9d5ff", 0.12);
const moonLight = new THREE.DirectionalLight("#b9d5ff", 0.12);
const doorLight = new THREE.PointLight("#ff7d46", 1, 7);
doorLight.position.set(0, 2.2, 2.7);
house.add(doorLight);

const ghost1 = new THREE.PointLight("#ff00ff", 2, 3);
const ghost2 = new THREE.PointLight("#00ffff", 2, 3);
const ghost3 = new THREE.PointLight("#ffff00", 2, 3);

scene.add(ghost1, ghost2, ghost3);
scene.add(ambientLight, moonLight);
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
renderer.setClearColor("#262837");
renderer.render(scene, camera);
renderer.setPixelRatio(Math.min(2, window.devicePixelRatio));

/**
 * Shadows
 */
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
moonLight.castShadow = true;
doorLight.castShadow = true;
ghost1.castShadow = true;
ghost2.castShadow = true;
ghost3.castShadow = true;
walls.castShadow = true;
bush1.castShadow = true;
bush2.castShadow = true;
bush3.castShadow = true;
bush4.castShadow = true;
floor.receiveShadow = true;

const clock = new THREE.Clock();
const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // update ghosts
  const ghost1Angle = elapsedTime * 0.25;
  ghost1.position.x = Math.cos(ghost1Angle) * 4;
  ghost1.position.z = Math.sin(ghost1Angle) * 4;
  ghost1.position.y = Math.sin(ghost1Angle * 3);

  const ghost2Angle = elapsedTime * 0.32;
  ghost2.position.x = Math.cos(ghost2Angle) * 5;
  ghost2.position.z = Math.sin(ghost2Angle) * 5;
  ghost2.position.y = Math.sin(ghost2Angle * 4) + Math.sin(elapsedTime * 2.5);

  const ghost3Angle = elapsedTime * 0.25;
  ghost3.position.x =
    Math.cos(ghost3Angle) * (7 + Math.sin(elapsedTime * 0.32));
  ghost3.position.z =
    Math.cos(ghost3Angle) * (7 + Math.sin(elapsedTime * 0.32));

  ghost3.position.y = Math.sin(ghost2Angle * 6) + Math.sin(elapsedTime * 2);

  controls.update();
  renderer.render(scene, camera);
  window.requestAnimationFrame(tick);
};

tick();

// import "./style.css";
// import * as THREE from "three";
// import gsap from "gsap";
// import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
// import * as dat from "dat.gui";

// window.addEventListener("mousemove", (event) => {
//   cursor.x = event.clientX / sizes.width - 0.5;
//   cursor.y = -event.clientY / sizes.height + 0.5;
// });

// window.addEventListener("resize", (event) => {
//   (sizes.width = window.innerWidth),
//     (sizes.height = window.innerHeight),
//     (camera.aspect = sizes.width / sizes.height);
//   camera.updateProjectionMatrix();
//   renderer.setSize(sizes.width, sizes.height);
//   renderer.setPixelRatio(Math.min(2, window.devicePixelRatio));
// });

// window.addEventListener("dblclick", (event) => {
//   const fullscreenElement =
//     document.fullscreenElement || document.webkitFullscreenElement;

//   if (!fullscreenElement) {
//     if (canvas.requestFullscreen) canvas.requestFullscreen();
//     else if (canvas.webkitRequestFullscreen) canvas.webkitRequestFullscreen();
//   } else {
//     if (document.exitFullscreen) document.exitFullscreen();
//     else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
//   }
// });

// /**
//  * Textures
//  */
// const loadingManager = new THREE.LoadingManager();
// const textureLoader = new THREE.TextureLoader(loadingManager);
// const doorColorTexture = textureLoader.load("/textures/door/color.jpg");
// const doorAlphaTexture = textureLoader.load("/textures/door/alpha.jpg");
// const doorAmbientOcclusionTexture = textureLoader.load(
//   "/textures/door/ambientOcclusion.jpg"
// );
// const doorHeightTexture = textureLoader.load("/textures/door/height.jpg");
// const doorNormalTexture = textureLoader.load("/textures/door/normal.jpg");
// const doorMetalnessTexture = textureLoader.load("/textures/door/metalness.jpg");
// const doorRoughnessTexture = textureLoader.load("/textures/door/roughness.jpg");

// const matcapTexture = textureLoader.load("/textures/matcaps/8.png");
// const gradientTexture = textureLoader.load("/textures/gradients/5.jpg");
// gradientTexture.minFilter = THREE.NearestFilter;
// gradientTexture.magFilter = THREE.NearestFilter;
// gradientTexture.generateMipmaps = false;
// // colorTexture.minFilter = THREE.NearestFilter;
// // doorColorTexture.magFilter = THREE.NearestFilter;

// loadingManager.onProgress = (y) => {
//   console.log("x", y);
// };

// /**
//  * Cube textures
//  */
// const cubeTextureLoader = new THREE.CubeTextureLoader(loadingManager);
// const environmentMapTexture = cubeTextureLoader.load(
//   ["px", "nx", "py", "ny", "pz", "nz"].map(
//     (dir) => `/textures/environmentMaps/1/${dir}.jpg`
//   )
// );

// /**
//  * Debug
//  */

// const gui = new dat.GUI();
// const parameters = {
//   color: "#ff0000",
//   spin: () => {
//     gsap.to(mesh.rotation, { duration: 1, y: mesh.rotation.y + Math.PI * 2 });
//   },
// };

// /**
//  * Main
//  */
// const canvas = document.querySelector("canvas.webgl");
// const scene = new THREE.Scene();

// const sizes = {
//   width: window.innerWidth,
//   height: window.innerHeight,
// };
// const cursor = {
//   x: 0,
//   y: 0,
// };

// /**
//  * Objects
//  */
// // const material = new THREE.MeshBasicMaterial();
// // material.map = doorColorTexture;
// // material.alphaMap = doorAlphaTexture;
// // material.transparent = true;
// // material.side = THREE.FrontSide;

// const material = new THREE.MeshStandardMaterial({
//   metalness: 0.7,
//   roughness: 0.2,
//   envMap: environmentMapTexture,
// });

// const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 64, 64), material);
// sphere.position.x = -1.5;
// const plane = new THREE.Mesh(new THREE.PlaneGeometry(1, 1, 100, 100), material);

// plane.geometry.setAttribute(
//   "uv2",
//   new THREE.BufferAttribute(plane.geometry.attributes.uv.array, 2)
// );

// const torus = new THREE.Mesh(
//   new THREE.TorusGeometry(0.3, 0.2, 64, 128),
//   material
// );
// torus.position.x = 1.5;
// scene.add(sphere, plane, torus);

// /**
//  * Lights
//  */

// const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
// const pointLight = new THREE.PointLight(0xffffff, 0.5);
// pointLight.position.x = 2;
// pointLight.position.y = 3;
// pointLight.position.z = 4;
// scene.add(ambientLight, pointLight);

// const camera = new THREE.PerspectiveCamera(
//   50,
//   sizes.width / sizes.height,
//   0.1,
//   100
// );
// camera.position.set(0, 0, 4);
// const controls = new OrbitControls(camera, canvas);
// controls.enableDamping = true;

// // // Debug
// material && material.wireframe && gui.add(material, "wireframe");
// gui.add(material, "roughness").min(0).max(1).step(0.01);
// gui.add(material, "metalness").min(0).max(1).step(0.01);
// gui.add(material, "aoMapIntensity").min(0).max(10).step(0.01);
// gui.add(material, "displacementScale").min(0).max(1).step(0.01);
// // gui.add(mesh.position, "y").min(-3).max(3).step(0.01).name("elevation");
// // gui
// //   .addColor(parameters, "color")
// //   .onChange((color) => material.color.set(color));
// // gui.add(parameters, "spin");

// scene.add(camera);
// // const axesHelper = new THREE.AxesHelper(3);
// // scene.add(axesHelper);

// const renderer = new THREE.WebGLRenderer({ canvas: canvas });
// renderer.setSize(sizes.width, sizes.height);
// renderer.render(scene, camera);
// renderer.setPixelRatio(Math.min(2, window.devicePixelRatio));

// const clock = new THREE.Clock();
// const tick = () => {
//   const elapsedTime = clock.getElapsedTime();

//   sphere.rotation.y = 0.1 * elapsedTime;
//   torus.rotation.y = 0.1 * elapsedTime;
//   plane.rotation.y = 0.1 * elapsedTime;

//   sphere.rotation.x = 0.15 * elapsedTime;
//   torus.rotation.x = 0.15 * elapsedTime;
//   plane.rotation.x = 0.15 * elapsedTime;

//   controls.update();
//   renderer.render(scene, camera);
//   window.requestAnimationFrame(tick);
// };

// tick();

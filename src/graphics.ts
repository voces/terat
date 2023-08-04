import * as THREE from "three";

export const scene = new THREE.Scene();
export const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000,
);
camera.position.set(0, -3, 5);
camera.lookAt(new THREE.Vector3());
camera.position.set(0, -2, 5);

export const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.VSMShadowMap;
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

export const sun = new THREE.DirectionalLight(0xffffff, 10);
sun.position.set(0, 0, 3);
sun.target.position.set(5, 2, 0);
sun.castShadow = true;
sun.shadow.camera.near = -12;
sun.shadow.camera.far = 21;
sun.shadow.camera.top = 15;
sun.shadow.camera.bottom = -5;
sun.shadow.camera.right = 8;
sun.shadow.camera.left = -13;
// sun.shadow.mapSize.width = 2048;
// sun.shadow.mapSize.height = 2048;
sun.shadow.bias = -0.001;
sun.shadow.normalBias = 0.05;
sun.shadow.radius = 2;
sun.shadow.blurSamples = 25;
scene.add(sun);
scene.add(sun.target);

const renderHooks: (() => void)[] = [];
export const addRenderHook = (hook: () => void) => {
  renderHooks.push(hook);
};
export const removeRenderHook = (hook: () => void) => {
  const idx = renderHooks.indexOf(hook);
  if (idx >= 0) renderHooks.splice(idx, 1);
};

const animate = () => {
  requestAnimationFrame(animate);
  for (const hook of renderHooks) hook();
  // renderer.render(scene, camera);
};
animate();

globalThis.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

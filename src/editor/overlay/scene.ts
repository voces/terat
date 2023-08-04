import {
  DirectionalLight,
  OrthographicCamera,
  Scene,
  Vector2,
  VSMShadowMap,
  WebGLRenderer,
} from "three";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { OutlinePass } from "three/addons/postprocessing/OutlinePass.js";
import { OutputPass } from "three/addons/postprocessing/OutputPass.js";
import { ShaderPass } from "three/addons/postprocessing/ShaderPass.js";
import { FXAAShader } from "three/addons/shaders/FXAAShader.js";
import { addRenderHook } from "../../graphics.ts";

export const overlayScene = new Scene();
const aspect = window.innerHeight / window.innerWidth;
export const overlayCamera = new OrthographicCamera(-1, 1, aspect, -aspect);
overlayCamera.position.set(0, 0, 5);

const sun = new DirectionalLight(0xffffff, 10);
sun.position.set(2, 3, -5);
sun.target.position.set(0, 0, 0);
sun.castShadow = true;
sun.shadow.bias = -0.00001;
sun.shadow.normalBias = 0.05;
sun.shadow.radius = 2;
sun.shadow.blurSamples = 25;
sun.shadow.camera.top = aspect;
sun.shadow.camera.bottom = -aspect;
sun.position.set(0, 0, 5);
overlayScene.add(sun);

const renderer = new WebGLRenderer({ antialias: true, alpha: true });
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = VSMShadowMap;
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.autoClear = false;
document.body.appendChild(renderer.domElement);
Object.assign(renderer.domElement.style, {
  position: "absolute",
  top: 0,
});

const composer = new EffectComposer(renderer);

const renderPass = new RenderPass(overlayScene, overlayCamera);
composer.addPass(renderPass);

export const outlinePass = new OutlinePass(
  new Vector2(window.innerWidth, window.innerHeight),
  overlayScene,
  overlayCamera,
);
composer.addPass(outlinePass);

const outputPass = new OutputPass();
composer.addPass(outputPass);

const effectFXAA = new ShaderPass(FXAAShader);
effectFXAA.uniforms["resolution"].value.set(
  1 / window.innerWidth,
  1 / window.innerHeight,
);
composer.addPass(effectFXAA);

globalThis.addEventListener("resize", () => {
  const width = window.innerWidth;
  const height = window.innerHeight;

  renderer.setSize(width, height);
  composer.setSize(width, height);
  overlayCamera.top = sun.shadow.camera.top = window.innerHeight /
    window.innerWidth;
  overlayCamera.bottom = sun.shadow.camera.bottom = -overlayCamera.top;
  overlayCamera.updateProjectionMatrix();

  effectFXAA.uniforms["resolution"].value.set(
    1 / window.innerWidth,
    1 / window.innerHeight,
  );
});

renderer.domElement.style.touchAction = "none";

addRenderHook(() => composer.render());

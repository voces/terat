import { Clock, Vector3 } from "three";
import { z } from "zod";
import { addRenderHook, camera, renderer, scene } from "../../graphics.ts";
import { keyboard } from "../keyboard.ts";
import { blueprints } from "../overlay/blueprints.ts";

const clock = new Clock();

addRenderHook(() => {
  const delta = clock.getDelta();

  let x = 0;
  let y = 0;
  const height = camera.position.z;
  if (keyboard.ArrowLeft || keyboard.a) x -= delta * height;
  if (keyboard.ArrowRight || keyboard.d) x += delta * height;
  if (keyboard.ArrowUp || keyboard.w) y += delta * height;
  if (keyboard.ArrowDown || keyboard.s) y -= delta * height;

  camera.position.add(new Vector3(x, y, 0));

  renderer.render(scene, camera);
});

const storedScene = localStorage.getItem("scene");
if (storedScene) {
  try {
    const parsedScene = JSON.parse(storedScene);
    const vector3Schema = z.object({
      x: z.number(),
      y: z.number(),
      z: z.number(),
    });
    const data = z.array(
      z.object({
        blueprint: z.number(),
        position: vector3Schema,
        rotation: vector3Schema,
        scale: z.number(),
      }),
    ).parse(parsedScene);

    for (const obj of data) {
      const o = blueprints[obj.blueprint].clone();
      o.position.set(obj.position.x, obj.position.y, obj.position.z);
      o.rotation.set(obj.rotation.x, obj.rotation.y, obj.rotation.z);
      o.scale.setScalar(obj.scale);
      scene.add(o);
    }
  } catch {
    alert("stored scene could not be parsed");
  }
}

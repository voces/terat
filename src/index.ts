import * as THREE from "three";
import { newApp } from "ecs";
import { addRenderHook, camera, scene, sun } from "./graphics.ts";
import { Entity } from "./types.ts";
import { createQuadtreeSystem, kdtree } from "./quadtree.ts";
// import "./levels/level1.ts";
import "./editor/index.ts";

let id = 0;
const app = newApp<Entity>({
  newEntity: (partial, app) => {
    const entity = { radius: 0, speed: 1, ...partial, id: partial.id ?? id++ };
    app.trackProp(entity, "position");
    app.trackProp(entity, "target");
    return entity;
  },
});

// Graphic system
{
  const data = new Map<Entity, THREE.Mesh>();
  const needsUpdate = new Set<Entity>();
  app.addSystem({
    props: ["mesh", "position"],
    onAdd: (entity) => {
      if (!entity.mesh.geometry.boundingBox) {
        entity.mesh.geometry.computeBoundingBox();
      }
      entity.mesh.position.set(
        entity.position.x,
        entity.position.y,
        -(entity.mesh.geometry.boundingBox?.min.z ?? 0) - 0.1,
      );
      data.set(entity, entity.mesh);
      scene.add(entity.mesh);
    },
    onRemove: (entity) => {
      const mesh = data.get(entity);
      if (mesh) scene.remove(mesh);
    },
    onChange: (entity) => needsUpdate.add(entity),
  });

  addRenderHook(() => {
    for (const entity of needsUpdate) {
      if (!entity.position || !entity.mesh) continue;
      entity.mesh.position.set(
        entity.position.x,
        entity.position.y,
        entity.mesh.position.z,
      );
      if (entity.isCharacter) {
        camera.position.set(entity.position.x, entity.position.y - 2, 5);
        sun.position.set(entity.position.x, entity.position.y, 3);
        sun.target.position.set(
          entity.position.x + 5,
          entity.position.y + 2,
          0,
        );
      }
    }
  });
}

// Movement system
app.addSystem({
  props: ["position", "isCharacter"],
  updateChild: (entity, delta) => {
    let x = 0;
    let y = 0;

    if (keyboard.ArrowLeft || keyboard.a) x -= delta;
    if (keyboard.ArrowRight || keyboard.d) x += delta;
    if (keyboard.ArrowUp || keyboard.w) y += delta;
    if (keyboard.ArrowDown || keyboard.s) y -= delta;

    if (x === 0 && y === 0) return;

    const a = Math.atan2(y, x);

    entity.position = {
      x: entity.position.x + Math.cos(a) * entity.speed * delta,
      y: entity.position.y + Math.sin(a) * entity.speed * delta,
    };
  },
});

app.addSystem({
  props: ["position", "target"],
  updateChild: (entity, delta) => {
    const target = entity.target.position;
    if (!target) return;
    const dy = target.y - entity.position.y;
    const dx = target.x - entity.position.x;
    const distance = ((dy) ** 2 + (dx) ** 2) / 2;
    const travel = delta * entity.speed;
    if (distance < travel) {
      if (entity.radius > entity.target.radius) {
        //location.reload();
      } else {
        const prevVolume = 4 / 3 * Math.PI * entity.target.radius ** 3;
        const eatenVolume = 4 / 3 * Math.PI * entity.radius ** 3;
        const nextVolume = prevVolume + eatenVolume / 2;
        const prevRadius = entity.target.radius;
        const nextRadius = (nextVolume / 4 * 3 / Math.PI) ** (1 / 3);
        entity.target.radius = nextRadius;
        if (entity.target.mesh?.geometry instanceof THREE.SphereGeometry) {
          entity.target.mesh.scale.multiplyScalar(nextRadius / prevRadius);
        }
        app.delete(entity);
      }
    }
    const a = Math.atan2(dy, dx);
    const x = entity.position.x + Math.cos(a) * travel;
    const y = entity.position.y + Math.sin(a) * travel;
    for (const e of kdtree.iterateRadius(x, y, entity.radius)) {
      if (!e.isCharacter && e !== entity) return;
    }
    entity.position = { x, y };
  },
});

createQuadtreeSystem(app);

// Game logic loop; called 50 times a second (every 20ms)
setInterval(app.update, 20);

const keyboard: { [key: string]: true } = {};
globalThis.addEventListener("keydown", (e) => (keyboard[e.key] = true));
globalThis.addEventListener("keyup", (e) => (delete keyboard[e.key]));
globalThis.addEventListener("blur", () => {
  for (const key in keyboard) delete keyboard[key];
});

// let character: Entity;
{
  // const mesh = new THREE.Mesh(
  //   new THREE.SphereGeometry(0.2),
  //   new THREE.MeshPhongMaterial(),
  // );
  // mesh.castShadow = true;
  // mesh.receiveShadow = true;
  // character = app.add({
  //   isCharacter: true,
  //   mesh: mesh,
  //   position: { x: 0, y: 0 },
  //   speed: 10,
  //   radius: 0.2,
  // });
}

// const spawnEnemy = () => {
//   if (app.entities.size > 1000) return;
//   const x = Math.random() * 250 - 125;
//   const y = Math.random() * 250 - 125;
//   if (
//     !character.position ||
//     ((character.position.x - x) ** 2 + (character.position.y - y) ** 2) <
//       15 ** 2
//   ) return;
//   const radius = 0.1 + Math.random() ** 5;
//   const mesh = new THREE.Mesh(
//     new THREE.SphereGeometry(radius),
//     new THREE.MeshPhongMaterial({ color: 0xff0000 }),
//   );
//   mesh.castShadow = true;
//   mesh.receiveShadow = true;
//   app.add({
//     mesh: mesh,
//     position: { x, y },
//     // target: character,
//     speed: 2,
//     radius,
//   });
// };

app.addSystem({
  update: () => {
    // spawnEnemy();
    // for (
    //   const enemy of kdtree.iterateRadius(
    //     character.position?.x ?? 0,
    //     character.position?.y ?? 0,
    //     15,
    //   )
    // ) {
    //   if (enemy.isCharacter || enemy.target) continue;
    //   enemy.target = character;
    // }
  },
});

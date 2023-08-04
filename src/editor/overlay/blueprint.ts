import {
  Group,
  Mesh,
  MeshBasicMaterial,
  Object3D,
  PlaneGeometry,
  Raycaster,
  Vector2,
} from "three";
import { camera as worldCamera, scene as worldScene } from "../../graphics.ts";
import { outlinePass, overlayCamera, overlayScene } from "./scene.ts";
import { blueprints } from "./blueprints.ts";
import { keyboard } from "../keyboard.ts";

// Add a plane to the world scene so we can place objects in the void
const plane = new Mesh(
  new PlaneGeometry(10000, 10000),
  new MeshBasicMaterial({ visible: false }),
);
worldScene.add(plane);

/**
 * A world object that represents an object to be placed. Could be from a
 * blueprint selection or a world object being modified.
 */
let blueprint: Object3D | undefined;
/**
 * When a world object is being modified, this points to the original world
 * object, where `visible` has been set to false.
 */
let restoreObject: Object3D | undefined;
/**
 * The currently selected overlay object.
 */
let selectedBlueprint: Object3D | undefined = undefined;

const raycaster = new Raycaster();

const moveBlueprint = (mouse: Vector2, event: PointerEvent) => {
  if (!blueprint) return;
  raycaster.setFromCamera(mouse, worldCamera);
  const intersect = raycaster.intersectObject(worldScene, true).find((i) => {
    // Don't intersect with yourself!
    if (i.object === blueprint) return false;
    // Or a child of yourself
    let child = false;
    blueprint?.traverse((c) => {
      if (c === i.object) child = true;
    });
    return !child;
  });
  if (!intersect) return;

  // We can improve placement by calculating depth maps along the ray (towards
  // the scene and towards the placing object) and finding the minimal distance

  // Ctrl is for rotations
  if (event.ctrlKey) {
    let angle = Math.atan2(
      intersect.point.y - blueprint.position.y,
      intersect.point.x - blueprint.position.x,
    );
    // Shift snaps to 16 possible rotations
    if (event.shiftKey) angle = Math.round(angle / Math.PI * 8) / 8 * Math.PI;
    if (angle < 0) angle += Math.PI * 2;
    // Rotation is done about an axis; z by default (so it spins)
    if (keyboard.z || keyboard.x) {
      if (keyboard.z) blueprint.rotation.x = (2 * Math.PI) - angle;
      if (keyboard.x) blueprint.rotation.y = angle + Math.PI / 2;
    } else blueprint.rotation.z = angle;
    // Not rotating, shift snaps position
  } else if (event.shiftKey) {
    blueprint.position.copy(
      intersect.point.clone().multiplyScalar(4).round().divideScalar(4),
    );
    // Free position placement
  } else blueprint.position.copy(intersect.point);
};

globalThis.addEventListener("pointermove", (event) => {
  const mouse = new Vector2(
    (event.clientX / window.innerWidth) * 2 - 1,
    -(event.clientY / window.innerHeight) * 2 + 1,
  );

  moveBlueprint(mouse, event);

  raycaster.setFromCamera(mouse, overlayCamera);

  const intersects = raycaster.intersectObject(overlayScene, true);

  // Not intersecting anything in the overlay
  if (intersects.length === 0) {
    return outlinePass.selectedObjects = selectedBlueprint
      ? [selectedBlueprint]
      : [];
  }

  // Intersecting something, get its root
  let hoveredObject = intersects[0].object;
  while (hoveredObject.parent instanceof Group) {
    hoveredObject = hoveredObject.parent;
  }
  if (!outlinePass.selectedObjects.includes(hoveredObject)) {
    outlinePass.selectedObjects.push(hoveredObject);
  }
});

globalThis.addEventListener("pointerdown", (event) => {
  if (event.isPrimary === false) return;

  // Right click cancels blueprint
  if (event.button === 2 && blueprint) return cancel();

  const x = (event.clientX / window.innerWidth) * 2 - 1;
  const y = -(event.clientY / window.innerHeight) * 2 + 1;

  // Blueprint selection
  raycaster.setFromCamera(new Vector2(x, y), overlayCamera);
  const intersects = raycaster.intersectObject(overlayScene, true);
  if (intersects.length > 0) {
    // Some blueprints are Groups; traverse up until we get its root
    selectedBlueprint = intersects[0].object;
    while (selectedBlueprint.parent instanceof Group) {
      selectedBlueprint = selectedBlueprint.parent;
    }
    // Remove currently active blueprint
    if (blueprint) cancel(false);
    if (typeof selectedBlueprint.userData.blueprintIndex === "number") {
      blueprint = blueprints[selectedBlueprint.userData.blueprintIndex].clone();
      worldScene.add(blueprint);
    }
    return;
  }

  // World interaction
  if (blueprint) {
    // Convert blueprint to world object
    worldScene.add(blueprint.clone());
    save();
  } else {
    // Convert world object to blueprint
    raycaster.setFromCamera(new Vector2(x, y), worldCamera);
    const intersects = raycaster.intersectObject(worldScene);
    if (intersects.length > 0) {
      let clickedObject = intersects[0].object;
      while (clickedObject.parent instanceof Group) {
        clickedObject = clickedObject.parent;
      }
      blueprint = clickedObject.clone();
      worldScene.add(blueprint);
      clickedObject.visible = false;
      restoreObject = clickedObject;
    }
  }
});

globalThis.addEventListener("contextmenu", (e) => e.preventDefault());

globalThis.addEventListener("wheel", (e) => {
  e.preventDefault();

  if (e.ctrlKey && blueprint) {
    blueprint.scale.multiplyScalar((100 + e.deltaY / 20) / 100);
  } else if (e.altKey) {
    worldCamera.rotation.x += Math.PI / (e.deltaY > 0 ? 16 : -16);
  } else {
    // TODO: should zoom to where center of screen intersects scene, so you can't go "below"
    // Going below could be made possible via shift (which would switch to absolute rather than relative movement)
    worldCamera.position.multiplyScalar((100 + e.deltaY / 20) / 100);
  }
}, { passive: false });

const cancel = (clearSelection = true) => {
  if (!blueprint) return;
  worldScene.remove(blueprint);
  blueprint = undefined;
  if (clearSelection) {
    selectedBlueprint = undefined;
    outlinePass.selectedObjects = [];
  }
  if (restoreObject) {
    restoreObject.visible = true;
    restoreObject = undefined;
  }
};

globalThis.addEventListener(
  "keydown",
  (e) => {
    if (e.key === "Escape" && blueprint) cancel();
    else if (e.key === "Delete" && blueprint) {
      if (restoreObject) {
        worldScene.remove(restoreObject);
        restoreObject = undefined;
        save();
        cancel();
      }
    }
  },
);

const save = () => {
  console.log("saving...");
  localStorage.setItem(
    "scene",
    JSON.stringify(
      worldScene.children.filter((c) =>
        typeof c.userData.blueprintIndex === "number" && c !== blueprint
      ).map((c) => ({
        blueprint: c.userData.blueprintIndex as number,
        position: { x: c.position.x, y: c.position.y, z: c.position.z },
        rotation: { x: c.rotation.x, y: c.rotation.y, z: c.rotation.z },
        scale: c.scale.z,
      })),
    ),
  );
};

import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

import { scene } from "../graphics.ts";
import { Group, InstancedMesh, Matrix4, Mesh, Vector3 } from "three";
import { Object3D } from "three";
import { BufferGeometry } from "three";

const loader = new GLTFLoader();

const dummy = new Object3D();

class InstancedGroup extends Group {
  constructor(group: Group, count: number) {
    super();
    for (const child of group.children) {
      if (child instanceof Mesh) {
        if (child.geometry instanceof BufferGeometry) {
          // child.receiveShadow = true;
          child.geometry.rotateX(Math.PI / 2);
          child.geometry.scale(0.25, 0.25, 0.25);
        }

        this.children.push(
          new InstancedMesh(child.geometry, child.material, count),
        );
      }
    }
  }

  setMatrixAt(index: number, matrix: Matrix4) {
    for (const child of this.children) {
      if (child instanceof InstancedMesh) child.setMatrixAt(index, matrix);
    }
  }

  setPositionAt(index: number, position: Vector3) {
    dummy.position.copy(position);
    // dummy.rotation.set(0, 0, 0);
    dummy.updateMatrix();
    for (const child of this.children) {
      if (child instanceof InstancedMesh) {
        child.setMatrixAt(index, dummy.matrix);
      }
    }
  }
}

const tilePaths = [
  // "assets/tileBrickA_large.gltf.glb",
  "assets/tileBrickB_large.gltf.glb",
  "assets/tileBrickB_largeCrackedA.gltf.glb",
  "assets/tileBrickB_largeCrackedB.gltf.glb",
];

const tileVariants = Array.from(
  { length: 121 },
  () => Math.floor(Math.random() * tilePaths.length),
);

for (let i = 0; i < tilePaths.length; i++) {
  loader.load(tilePaths[i], (gltf) => {
    const count = tileVariants.reduce(
      (count, c) => count + (c === i ? 1 : 0),
      0,
    );
    const obj = gltf.scene.children[0];
    if (obj instanceof Group) {
      const g = new InstancedGroup(obj, count);
      g.traverse((c) => c.receiveShadow = true);
      let t = 0;
      for (let n = 0; n < tileVariants.length; n++) {
        if (tileVariants[n] !== i) continue;
        g.setPositionAt(
          t,
          new Vector3(
            ((n % 11) - 5) * 1.5,
            (Math.floor(n / 11) - 5) * 1.5,
            -0.25,
          ),
        );
        t++;
      }
      scene.add(g);
    } else if (obj instanceof Mesh) {
      const m = new InstancedMesh(obj.geometry, obj.material, count);
      m.receiveShadow = true;
      m.geometry.rotateX(Math.PI / 2);
      m.geometry.scale(0.25, 0.25, 0.25);
      let t = 0;
      for (let n = 0; n < tileVariants.length; n++) {
        if (tileVariants[n] !== i) continue;
        dummy.position.set(
          ((n % 11) - 5) * 1.5,
          (Math.floor(n / 11) - 5) * 1.5,
          -0.25,
        );
        dummy.updateMatrix();
        m.setMatrixAt(t, dummy.matrix);
        t++;
      }
      scene.add(m);
    }
  });
}

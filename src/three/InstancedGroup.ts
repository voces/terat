import {
  BufferGeometry,
  Group,
  InstancedMesh,
  Matrix4,
  Mesh,
  Object3D,
  Vector3,
} from "three";

const dummy = new Object3D();

export class InstancedGroup extends Group {
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

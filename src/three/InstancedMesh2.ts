import { InstancedMesh, Object3D, Vector3 } from "three";

const dummy = new Object3D();

export class InstancedMesh2 extends InstancedMesh {
  setPositionAt(index: number, position: Vector3) {
    dummy.position.copy(position);
    dummy.updateMatrix();
    this.setMatrixAt(index, dummy.matrix);
  }
}

import {
  Box3,
  BufferGeometry,
  Mesh,
  MeshStandardMaterial,
  Object3D,
} from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { overlayScene } from "./scene.ts";

const blueprintPaths = [
  "assets/arrow.gltf.glb",
  "assets/artifact.gltf.glb",
  "assets/axe_common.gltf.glb",
  "assets/axe_rare.gltf.glb",
  "assets/axe_uncommon.gltf.glb",
  "assets/axeDouble_common.gltf.glb",
  "assets/axeDouble_rare.gltf.glb",
  "assets/axeDouble_uncommon.gltf.glb",
  "assets/banner.gltf.glb",
  "assets/barrel.gltf.glb",
  "assets/barrelDark.gltf.glb",
  "assets/bench.gltf.glb",
  "assets/bookA.gltf.glb",
  "assets/bookB.gltf.glb",
  "assets/bookC.gltf.glb",
  "assets/bookcase_broken.gltf.glb",
  "assets/bookcase.gltf.glb",
  "assets/bookcaseFilled_broken.gltf.glb",
  "assets/bookcaseFilled.gltf.glb",
  "assets/bookcaseWide_broken.gltf.glb",
  "assets/bookcaseWide.gltf.glb",
  "assets/bookcaseWideFilled_broken.gltf.glb",
  "assets/bookcaseWideFilled.gltf.glb",
  "assets/bookD.gltf.glb",
  "assets/bookE.gltf.glb",
  "assets/bookF.gltf.glb",
  "assets/bookOpenA.gltf.glb",
  "assets/bookOpenB.gltf.glb",
  "assets/bricks.gltf.glb",
  "assets/bucket.gltf.glb",
  "assets/chair.gltf.glb",
  "assets/chest_common_empty.gltf.glb",
  "assets/chest_common.gltf.glb",
  "assets/chest_rare_mimic.gltf.glb",
  "assets/chest_rare.gltf.glb",
  "assets/chest_uncommon_mimic.gltf.glb",
  "assets/chest_uncommon.gltf.glb",
  "assets/chestTop_common_empty.gltf.glb",
  "assets/chestTop_common.gltf.glb",
  "assets/chestTop_rare_mimic.gltf.glb",
  "assets/chestTop_rare.gltf.glb",
  "assets/chestTop_uncommon_mimic.gltf.glb",
  "assets/chestTop_uncommon.gltf.glb",
  "assets/coin.gltf.glb",
  "assets/coinsLarge.gltf.glb",
  "assets/coinsMedium.gltf.glb",
  "assets/coinsSmall.gltf.glb",
  "assets/crate.gltf.glb",
  "assets/crateDark.gltf.glb",
  "assets/cratePlatform_large.gltf.glb",
  "assets/cratePlatform_medium.gltf.glb",
  "assets/cratePlatform_small.gltf.glb",
  "assets/crossbow_common.gltf.glb",
  "assets/crossbow_rare.gltf.glb",
  "assets/crossbow_uncommon.gltf.glb",
  "assets/dagger_common.gltf.glb",
  "assets/dagger_rare.gltf.glb",
  "assets/dagger_uncommon.gltf.glb",
  "assets/door_gate.gltf.glb",
  "assets/door.gltf.glb",
  "assets/floorDecoration_shatteredBricks.gltf.glb",
  "assets/floorDecoration_tilesSmall.gltf.glb",
  "assets/floorDecoration_wood.gltf.glb",
  "assets/floorDecoration_woodLeft.gltf.glb",
  "assets/floorDecoration_woodRight.gltf.glb",
  "assets/hammer_common.gltf.glb",
  "assets/hammer_rare.gltf.glb",
  "assets/hammer_uncommon.gltf.glb",
  "assets/lootSackA.gltf.glb",
  "assets/lootSackB.gltf.glb",
  "assets/mug.gltf.glb",
  "assets/pillar_broken.gltf.glb",
  "assets/pillar.gltf.glb",
  "assets/plate.gltf.glb",
  "assets/plateFull.gltf.glb",
  "assets/plateHalf.gltf.glb",
  "assets/potA_decorated.gltf.glb",
  "assets/potA.gltf.glb",
  "assets/potB_decorated.gltf.glb",
  "assets/potB.gltf.glb",
  "assets/potC_decorated.gltf.glb",
  "assets/potC.gltf.glb",
  "assets/potionLarge_blue.gltf.glb",
  "assets/potionLarge_green.gltf.glb",
  "assets/potionLarge_red.gltf.glb",
  "assets/potionMedium_blue.gltf.glb",
  "assets/potionMedium_green.gltf.glb",
  "assets/potionMedium_red.gltf.glb",
  "assets/potionSmall_blue.gltf.glb",
  "assets/potionSmall_green.gltf.glb",
  "assets/potionSmall_red.gltf.glb",
  "assets/pots.gltf.glb",
  "assets/quiver_empty.gltf.glb",
  "assets/quiver_full.gltf.glb",
  "assets/quiver_half_full.gltf.glb",
  "assets/scaffold_high_cornerBoth.gltf.glb",
  "assets/scaffold_high_cornerLeft.gltf.glb",
  "assets/scaffold_high_cornerRight.gltf.glb",
  "assets/scaffold_high_railing.gltf.glb",
  "assets/scaffold_high.gltf.glb",
  "assets/scaffold_low_cornerBoth.gltf.glb",
  "assets/scaffold_low_cornerLeft.gltf.glb",
  "assets/scaffold_low_cornerRight.gltf.glb",
  "assets/scaffold_low_railing.gltf.glb",
  "assets/scaffold_low.gltf.glb",
  "assets/scaffold_medium_cornerBoth.gltf.glb",
  "assets/scaffold_medium_cornerLeft.gltf.glb",
  "assets/scaffold_medium_cornerRight.gltf.glb",
  "assets/scaffold_medium_railing.gltf.glb",
  "assets/scaffold_medium.gltf.glb",
  "assets/scaffold_small_high_cornerLeft.gltf.glb",
  "assets/scaffold_small_high_cornerRight.gltf.glb",
  "assets/scaffold_small_high_long.gltf.glb",
  "assets/scaffold_small_high_railing_long.gltf.glb",
  "assets/scaffold_small_high_railing.gltf.glb",
  "assets/scaffold_small_high.gltf.glb",
  "assets/scaffold_small_low_cornerLeft.gltf.glb",
  "assets/scaffold_small_low_cornerRight.gltf.glb",
  "assets/scaffold_small_low_long.gltf.glb",
  "assets/scaffold_small_low_railing_long.gltf.glb",
  "assets/scaffold_small_low_railing.gltf.glb",
  "assets/scaffold_small_low.gltf.glb",
  "assets/scaffold_small_medium_cornerLeft.gltf.glb",
  "assets/scaffold_small_medium_cornerRight.gltf.glb",
  "assets/scaffold_small_medium_long.gltf.glb",
  "assets/scaffold_small_medium_railing_long.gltf.glb",
  "assets/scaffold_small_medium_railing.gltf.glb",
  "assets/scaffold_stairs.gltf.glb",
  "assets/shield_common.gltf.glb",
  "assets/shield_rare.gltf.glb",
  "assets/shield_uncommon.gltf.glb",
  "assets/spellBook.gltf.glb",
  "assets/staff_common.gltf.glb",
  "assets/staff_rare.gltf.glb",
  "assets/staff_uncommon.gltf.glb",
  "assets/stairs_wide.gltf.glb",
  "assets/stairs.gltf.glb",
  "assets/stool.gltf.glb",
  "assets/sword_common.gltf.glb",
  "assets/sword_rare.gltf.glb",
  "assets/sword_uncommon.gltf.glb",
  "assets/tableLarge.gltf.glb",
  "assets/tableMedium.gltf.glb",
  "assets/tableSmall.gltf.glb",
  "assets/tileBrickA_large.gltf.glb",
  "assets/tileBrickA_medium.gltf.glb",
  "assets/tileBrickA_small.gltf.glb",
  "assets/tileBrickB_large.gltf.glb",
  "assets/tileBrickB_largeCrackedA.gltf.glb",
  "assets/tileBrickB_largeCrackedB.gltf.glb",
  "assets/tileBrickB_medium.gltf.glb",
  "assets/tileBrickB_small.gltf.glb",
  "assets/tileSpikes_large.gltf.glb",
  "assets/tileSpikes_shallow.gltf.glb",
  "assets/tileSpikes.gltf.glb",
  "assets/torch.gltf.glb",
  "assets/torchWall.gltf.glb",
  "assets/trapdoor.gltf.glb",
  "assets/wall_broken.gltf.glb",
  "assets/wall_door.gltf.glb",
  "assets/wall_end_broken.gltf.glb",
  "assets/wall_end.gltf.glb",
  "assets/wall_gate.gltf.glb",
  "assets/wall_gateCorner.gltf.glb",
  "assets/wall_gateDoor.gltf.glb",
  "assets/wall_window.gltf.glb",
  "assets/wall_windowGate.gltf.glb",
  "assets/wall.gltf.glb",
  "assets/wallCorner.gltf.glb",
  "assets/wallDecorationA.gltf.glb",
  "assets/wallDecorationB.gltf.glb",
  "assets/wallIntersection.gltf.glb",
  "assets/wallSingle_broken.gltf.glb",
  "assets/wallSingle_corner.gltf.glb",
  "assets/wallSingle_decorationA.gltf.glb",
  "assets/wallSingle_decorationB.gltf.glb",
  "assets/wallSingle_door.gltf.glb",
  "assets/wallSingle_split.gltf.glb",
  "assets/wallSingle_window.gltf.glb",
  "assets/wallSingle_windowGate.gltf.glb",
  "assets/wallSingle.gltf.glb",
  "assets/wallSplit.gltf.glb",
  "assets/weaponRack.gltf.glb",
];

const loader = new GLTFLoader();

export const blueprints = await Promise.all(
  blueprintPaths.map((path, index) =>
    new Promise<Object3D>((resolve) =>
      loader.load(path, (gltf) => {
        const obj = gltf.scene.children[0];
        obj.userData.blueprintIndex = index;
        obj.traverse((obj) => {
          obj.receiveShadow = true;
          obj.castShadow = true;
          if (obj instanceof Mesh && obj.geometry instanceof BufferGeometry) {
            obj.geometry.rotateX(Math.PI / 2);
            obj.geometry.scale(0.25, 0.25, 0.25);
            if (obj.material instanceof MeshStandardMaterial) {
              obj.material.color.copySRGBToLinear(obj.material.color);
            }
          }
        });
        resolve(gltf.scene.children[0]);
      })
    )
  ),
);

const selections = blueprints.map((b) => {
  const obj = b.clone();
  obj.rotation.set(Math.PI / -4, 0, Math.PI / -4);
  overlayScene.add(obj);
  return obj;
});

const positionSelections = () => {
  const aspect = window.innerHeight / window.innerWidth;
  const columns = 12;
  const rows = Math.ceil(blueprints.length / columns);
  const scale = (aspect * 2) / rows / Math.SQRT2;

  for (let i = 0; i < selections.length; i++) {
    const obj = selections[i];
    const box = new Box3().setFromObject(obj);
    obj.scale.multiplyScalar(
      (scale) /
        Math.max(
          box.max.x - box.min.x,
          box.max.y - box.min.y,
          box.max.z - box.min.z,
        ),
    );
    obj.position.set(
      -1 + scale * (i % columns + Math.SQRT2 / 2),
      aspect - (Math.floor(i / columns) + 0.75) * scale * Math.SQRT2,
      0,
    );
  }
};
positionSelections();
globalThis.addEventListener("resize", positionSelections);

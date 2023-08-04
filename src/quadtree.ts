// import { quadtree as createQuadtree } from "https://esm.sh/d3-quadtree@3.0.1";
import { Entity, Terat } from "./types.ts";
import { D2Tree } from "https://deno.land/x/d2tree@v0.2.0/mod.ts";

let created = false;
const data = new Map<Entity, NonNullable<Entity["position"]>>();

export const kdtree = new D2Tree({
  getItemPosition: (
    entity: Entity,
  ) => [entity.position?.x ?? 0, entity.position?.y ?? 0],
});

export const createQuadtreeSystem = (app: Terat) => {
  if (created) throw new Error("Quadtree already created");
  created = true;

  app.addSystem({
    props: ["position"],
    onAdd: (entity) => {
      kdtree.add(entity);
      data.set(entity, entity.position);
    },
    onChange: (entity) => {
      kdtree.update(entity);
    },
    onRemove: (entity) => {
      kdtree.remove(entity);
      data.delete(entity);
    },
    update: () => {
      // console.log(...kdtree.nearest(0, 0, 5));
    },
  });
};

import type { App } from "ecs";

export type Entity = {
  id: number;
  isCharacter?: boolean;
  mesh?: THREE.Mesh;
  position?: { x: number; y: number };
  target?: Entity;
  speed: number;
  radius: number;
};

export type Terat = App<Entity>;

export const keyboard: { [key: string]: true } = {};

globalThis.addEventListener(
  "keydown",
  (e) => keyboard[e.key.toLowerCase()] = true,
);
globalThis.addEventListener(
  "keyup",
  (e) => (delete keyboard[e.key.toLowerCase()]),
);
globalThis.addEventListener("blur", () => {
  for (const key in keyboard) delete keyboard[key];
});

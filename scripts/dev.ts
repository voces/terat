import { serve } from "https://deno.land/x/esbuild_serve@1.3.0/mod.ts";

const paths: string[] = [];
const addPaths = async (path: string) => {
  for await (const file of Deno.readDir(path)) {
    if (file.isDirectory) await addPaths(`${path}/${file.name}`);
    else paths.push(`${path}/${file.name}`);
  }
};
await addPaths("static");

serve({
  pages: { index: "src/index.ts" },
  assets: Object.fromEntries(paths.map((path) => [path.slice(7), `./${path}`])),
});

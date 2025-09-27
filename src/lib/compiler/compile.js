import fs from 'fs';
import path from 'path';
import Handlebars from 'handlebars';
import { buildManifest } from './manifest';

export async function compileFromPlan(plan){
  const tplPath = path.join(process.cwd(),'src/lib/compiler/template.sol.hbs');
  const tpl = fs.readFileSync(tplPath,'utf8');
  const compile = Handlebars.compile(tpl);
  const solidity = compile(plan);

  const manifest = buildManifest(plan);
  const outDir = path.join(process.cwd(),'src/generated');
  fs.writeFileSync(path.join(outDir,'contracts','ConditionalRecurringIntent.sol'), solidity);
  fs.writeFileSync(path.join(outDir,'manifests',`${manifest.id}.json`), JSON.stringify(manifest,null,2));
  return { solidity, manifest };
}

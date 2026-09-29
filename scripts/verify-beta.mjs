import fs from "node:fs";
import path from "node:path";

const required=[
  "app/login/page.tsx",
  "app/page.tsx",
  "app/patrimonio/page.tsx",
  "app/patrimonio/[id]/page.tsx",
  "app/patrimonio/[id]/editar/page.tsx",
  "app/intervencoes/[id]/page.tsx",
  "app/intervencoes/[id]/editar/page.tsx",
  "app/intervencoes/[id]/cronograma/page.tsx",
  "app/intervencoes/[id]/medicoes/page.tsx",
  "app/fiscalizacoes/page.tsx",
  "app/api/fiscalizacoes/export/route.ts",
  "app/controle/page.tsx",
  "app/conservacao/page.tsx",
  "app/campo/page.tsx",
  "app/inteligencia/page.tsx",
  "app/notificacoes/page.tsx",
  "app/buscar/page.tsx",
  "app/administracao/usuarios/page.tsx",
  "app/administracao/auditoria/page.tsx",
  "public/brand/iphan-lucio-costa.webp",
  "public/visual/login-hero.webp",
  "public/visual/heritage-hero.webp",
  "public/visual/intervention-progress.webp",
  "public/visual/priority-decisao.webp",
  "public/visual/priority-intervencao.webp",
  "public/visual/priority-medicao.webp",
  "public/visual/priority-fiscalizacao.webp",
  "public/visual/field-thumb-01.webp",
  "public/visual/field-thumb-02.webp",
  "public/visual/field-thumb-03.webp",
  "supabase/migrations/0011_evidence_measurement_link.sql",
  "supabase/migrations/0012_operational_update_rls.sql",
  "supabase/migrations/0014_conservation_risk_trigger.sql",
  "supabase/migrations/0016_unit_scope_rls_hardening.sql",
  "supabase/migrations/0017_intervention_update_rls.sql",
  "supabase/migrations/0018_complete_audit_triggers.sql",
  "supabase/migrations/0019_document_storage_unit_scope.sql",
  "supabase/migrations/0020_occurrence_read_scope.sql",
  "supabase/migrations/0021_profile_role_boundary.sql",
  "supabase/migrations/0022_occurrence_update_rls.sql",
];

const guardedRoutes=[
  ["app/patrimonio/novo/page.tsx","heritage.write"],
  ["app/intervencoes/nova/page.tsx","intervention.write"],
  ["app/campo/ocorrencia/page.tsx","field.write"],
  ["app/campo/evidencia/page.tsx","evidence.write"],
  ["app/fiscalizacoes/nova/page.tsx","inspection.write"],
  ["app/controle/decisao/nova/page.tsx","decision.write"],
  ["app/controle/restricao/nova/page.tsx","decision.write"],
  ["app/conservacao/nova/page.tsx","inspection.write"],
  ["app/documentos/novo/page.tsx","document.write"],
  ["app/intervencoes/[id]/medicoes/nova/page.tsx","measurement.write"],
  ["app/intervencoes/[id]/cronograma/novo/page.tsx","intervention.write"],
  ["app/patrimonio/[id]/editar/page.tsx","heritage.write"],
  ["app/intervencoes/[id]/editar/page.tsx","intervention.write"],
];

const missing=required.filter(file=>!fs.existsSync(path.join(process.cwd(),file)));
if(missing.length){
  console.error("Beta verification failed: missing required files:");
  missing.forEach(file=>console.error(" - "+file));
  process.exit(1);
}

const roots=["app","components","lib"];
const textExtensions=new Set([".ts",".tsx",".js",".mjs",".css"]);
const banned=[
  /images\.unsplash\.com/i,
  /source\.unsplash\.com/i,
  /heroFallback/i,
];

const violations=[];
function scan(dir){
  for(const entry of fs.readdirSync(dir,{withFileTypes:true})){
    const full=path.join(dir,entry.name);
    if(entry.isDirectory()) scan(full);
    else if(textExtensions.has(path.extname(entry.name))){
      const source=fs.readFileSync(full,"utf8");
      for(const pattern of banned){
        if(pattern.test(source)) violations.push(`${full}: ${pattern}`);
      }
    }
  }
}
roots.filter(fs.existsSync).forEach(scan);

const guardViolations=[];
for(const [file,permission] of guardedRoutes){
  const source=fs.readFileSync(path.join(process.cwd(),file),"utf8");
  if(!source.includes('requirePermission("'+permission+'"')){
    guardViolations.push(file+" -> "+permission);
  }
}
if(guardViolations.length){
  console.error("Beta verification failed: route permission guard missing:");
  guardViolations.forEach(item=>console.error(" - "+item));
  process.exit(1);
}

if(violations.length){
  console.error("Beta verification failed: prohibited visual fallback found:");
  violations.forEach(item=>console.error(" - "+item));
  process.exit(1);
}

console.log(`Beta verification passed: ${required.length} required artifacts/routes, ${guardedRoutes.length} protected write routes, and no prohibited external visual fallback found.`);

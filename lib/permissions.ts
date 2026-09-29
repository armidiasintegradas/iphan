export type Role =
  | "admin"
  | "gestor"
  | "coordenador"
  | "fiscal"
  | "tecnico"
  | "executor"
  | "consulta";

export type Permission =
  | "heritage.read"
  | "heritage.write"
  | "intervention.read"
  | "intervention.write"
  | "field.write"
  | "evidence.write"
  | "inspection.write"
  | "measurement.write"
  | "measurement.approve"
  | "decision.write"
  | "document.write"
  | "users.manage";

const matrix: Record<Role, Permission[]> = {
  admin: [
    "heritage.read","heritage.write","intervention.read","intervention.write",
    "field.write","evidence.write","inspection.write","measurement.write",
    "measurement.approve","decision.write","document.write","document.write","document.write","users.manage",
  ],
  gestor: [
    "heritage.read","heritage.write","intervention.read","intervention.write",
    "field.write","evidence.write","inspection.write","measurement.write",
    "measurement.approve","decision.write","users.manage",
  ],
  coordenador: [
    "heritage.read","heritage.write","intervention.read","intervention.write",
    "field.write","evidence.write","inspection.write","measurement.write",
    "measurement.approve","decision.write",
  ],
  fiscal: [
    "heritage.read","intervention.read","field.write","evidence.write",
    "inspection.write","measurement.write","document.write",
  ],
  tecnico: [
    "heritage.read","heritage.write","intervention.read","intervention.write",
    "field.write","evidence.write","inspection.write","decision.write","document.write",
  ],
  executor: [
    "heritage.read","intervention.read","field.write","evidence.write",
    "measurement.write","document.write",
  ],
  consulta: ["heritage.read","intervention.read"],
};

export function can(role: Role, permission: Permission) {
  return matrix[role]?.includes(permission) ?? false;
}

export const roleLabels: Record<Role,string> = {
  admin: "Superadministrador",
  gestor: "Superintendente / Gestor",
  coordenador: "Coordenador",
  fiscal: "Fiscal",
  tecnico: "Técnico",
  executor: "Executor / Contratada",
  consulta: "Consulta",
};

export { matrix as permissionMatrix };

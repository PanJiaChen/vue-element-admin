export function convertRole(role) {
  const { id, uuid, name, description } = role

  return {
    id,
    uuid,
    name,
    description,
    clientId: role.client_id,
    clientName: role.client_name,
    isCanExport: role.is_can_export,
    isCanReport: role.is_can_report,
    isPersonalAccess: role.is_personal_access,
    isPersonalLock: role.is_personal_lock
  }
}

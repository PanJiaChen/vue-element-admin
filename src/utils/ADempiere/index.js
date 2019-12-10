export function convertRoleFromGRPC(roleGRPC) {
  return {
    id: roleGRPC.getId(),
    uuid: roleGRPC.getUuid(),
    name: roleGRPC.getName(),
    desctiption: roleGRPC.getDescription(),
    clientId: roleGRPC.getClientid(),
    clientName: roleGRPC.getClientname(),
    organizationsList: roleGRPC.getOrganizationsList()
  }
}

export { default } from '@/utils/ADempiere/evaluator.js'
export * from '@/utils/ADempiere/auth.js'
export * from '@/utils/ADempiere/notification.js'
export * from '@/utils/ADempiere/valueUtils.js'
export * from '@/utils/ADempiere/contextUtils.js'
export * from '@/utils/ADempiere/dictionaryUtils.js'

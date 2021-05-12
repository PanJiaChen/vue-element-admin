// ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
// Copyright (C) 2017-Present E.R.P. Consultores y Asociados, C.A.
// Contributor(s): Yamel Senih ysenih@erpya.com www.erpya.com
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.

// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.

import { camelizeObjectKeys, renameObjectKey } from '../transformObject'

export function convertEntityLog(entityLog) {
  const convertedLog = camelizeObjectKeys(entityLog)
  convertedLog.changeLogsList = entityLog.change_logs.map(changeLog => camelizeObjectKeys(changeLog))
  delete convertedLog['changeLogs']
  return convertedLog
}

export function convertEntityChat(entityChat) {
  return camelizeObjectKeys(entityChat)
}

export function convertChatEntry(chatEntry) {
  return camelizeObjectKeys(chatEntry)
}

export function convertWorkflowProcess(workflowProcess) {
  const convertedProcess = camelizeObjectKeys(workflowProcess)
  convertedProcess.workflowEventsList = workflowProcess.workflow_events.map(item => camelizeObjectKeys(item))
  delete convertedProcess['workflowEvents']
  return convertedProcess
}

export function convertWorkflowDefinition(workflowDefinition) {
  const convertedDefinition = camelizeObjectKeys(workflowDefinition)
  convertedDefinition.startNode = convertWorkflowNode(workflowDefinition.start_node)
  convertedDefinition.workflowNodesList = workflowDefinition.workflow_nodes.map(item => convertWorkflowNode(item))
  delete convertedDefinition['workflowNodes']
  return convertedDefinition
}

function convertWorkflowNode(workflowNode) {
  const convertedNode = camelizeObjectKeys(workflowNode)
  convertedNode.documentAction = { ...workflowNode.document_action }
  convertedNode.transitionsList = workflowNode.transitions.map(item => convertWorkflowTransition(item))
  delete convertedNode['transitions']
  return convertedNode
}

function convertWorkflowTransition(workflowTransition) {
  const convertedTransition = camelizeObjectKeys(workflowTransition)
  convertedTransition.isStdUserWorkflow = workflowTransition.is_standard_user_workflow
  convertedTransition.workflowConditionsList = workflowTransition.workflow_conditions.map(item => convertWorkflowCondition(item))
  delete convertedTransition['workflowConditions']
  return convertedTransition
}

function convertWorkflowCondition(workflowCondition) {
  const convertedCondition = camelizeObjectKeys(workflowCondition)
  renameObjectKey(convertedCondition, 'confidentialType', 'conditionType')
  renameObjectKey(convertedCondition, 'confidentialTypeName', 'conditionTypeName')
  return convertedCondition
}


export function convertEntityLog(entityLogToConvert) {
  const { id, uuid } = entityLogToConvert

  return {
    logId: entityLogToConvert.log_id,
    id,
    uuid,
    tableName: entityLogToConvert.table_name,
    sessionUuid: entityLogToConvert.session_uuid,
    userUuid: entityLogToConvert.user_uuid,
    userName: entityLogToConvert.user_name,
    transactionName: entityLogToConvert.transaction_name,
    eventType: entityLogToConvert.event_type,
    eventTypeName: entityLogToConvert.event_type_name,
    logDate: entityLogToConvert.log_date,
    changeLogsList: entityLogToConvert.change_logs.map(changeLog => {
      return convertChangeLog(changeLog)
    })
  }
}

export function convertChangeLog(changeLogToConvert) {
  return {
    columnName: changeLogToConvert.column_name,
    displayColumnName: changeLogToConvert.display_column_name,
    oldValue: changeLogToConvert.old_value,
    newValue: changeLogToConvert.new_value,
    oldDisplayValue: changeLogToConvert.old_display_value,
    newDisplayValye: changeLogToConvert.new_display_value,
    description: changeLogToConvert.description
  }
}

export function convertEntityChat(entityChatToConvert) {
  const { id, uuid, description } = entityChatToConvert

  return {
    chatUuid: entityChatToConvert.chat_uuid,
    id,
    uuid,
    tableName: entityChatToConvert.table_name,
    chatTypeUuid: entityChatToConvert.chat_type_uuid,
    description,
    confidentialType: entityChatToConvert.confidential_type,
    confidentialTypeName: entityChatToConvert.confidential_type_name,
    moderationType: entityChatToConvert.moderation_type,
    moderationTypeName: entityChatToConvert.moderation_type_name,
    logDate: entityChatToConvert.log_date
  }
}

export function convertChatEntry(chatEntryToConvert) {
  return {
    chatUuid: chatEntryToConvert.chat_uuid,
    chatEntryUuid: chatEntryToConvert.chat_entry_uuid,
    subject: chatEntryToConvert.subject,
    characterData: chatEntryToConvert.character_data,
    userUuid: chatEntryToConvert.user_uuid,
    userName: chatEntryToConvert.user_name,
    chatEntryType: chatEntryToConvert.chat_entry_type,
    chatEntryTypeName: chatEntryToConvert.chat_entry_type_name,
    confidentialType: chatEntryToConvert.confidential_type,
    confidentialTypeName: chatEntryToConvert.confidential_type_name,
    moderatorStatus: chatEntryToConvert.moderator_status,
    moderatorStatusName: chatEntryToConvert.moderator_status_name,
    logDate: chatEntryToConvert.log_date
  }
}

export function convertWorkflowProcess(workflowProcessToConvert) {
  return {
    processUuid: workflowProcessToConvert.process_uuid,
    workflowUuid: workflowProcessToConvert.workflow_uuid,
    workflowName: workflowProcessToConvert.workflow_name,
    recordId: workflowProcessToConvert.record_id,
    tableName: workflowProcessToConvert.table_name,
    userUuid: workflowProcessToConvert.user_uuid,
    userName: workflowProcessToConvert.user_name,
    responsibleUuid: workflowProcessToConvert.responsible_uuid,
    responsibleName: workflowProcessToConvert.responsible_name,
    textMessage: workflowProcessToConvert.text_message,
    processed: workflowProcessToConvert.processed,
    workflowStateName: workflowProcessToConvert.workflow_state_name,
    workflowState: workflowProcessToConvert.workflow_state,
    priority: workflowProcessToConvert.priority,
    priorityName: workflowProcessToConvert.priority_name,
    workflowEventsList: workflowProcessToConvert.workflow_events.map(itemEvent => {
      return convertWorkflowEvent(itemEvent)
    }),
    logDate: workflowProcessToConvert.log_date
  }
}

export function convertWorkflowEvent(workflowEventToConvert) {
  return {
    nodeUuid: workflowEventToConvert.node_uuid,
    nodeName: workflowEventToConvert.node_name,
    recordId: workflowEventToConvert.record_id,
    tableName: workflowEventToConvert.table_name,
    userUuid: workflowEventToConvert.user_uuid,
    userName: workflowEventToConvert.user_name,
    responsibleUuid: workflowEventToConvert.responsible_uuid,
    responsibleName: workflowEventToConvert.responsible_name,
    textMessage: workflowEventToConvert.text_message,
    timeElapsed: workflowEventToConvert.time_elapsed,
    attributeName: workflowEventToConvert.attribute_name,
    oldValue: workflowEventToConvert.old_value,
    newValue: workflowEventToConvert.new_value,
    workflowState: workflowEventToConvert.workflow_state,
    workflowStateName: workflowEventToConvert.workflow_state_name,
    eventType: workflowEventToConvert.event_type,
    eventTypeName: workflowEventToConvert.event_type_name,
    logDate: workflowEventToConvert.log_date
  }
}

export function convertWorkflowDefinition(workflowDefinitionToConvert) {
  const { uuid, name, description, help } = workflowDefinitionToConvert

  return {
    uuid,
    value: workflowDefinitionToConvert.value,
    name,
    description,
    help,
    tableName: workflowDefinitionToConvert.table_name,
    responsibleUuid: workflowDefinitionToConvert.responsible_uuid,
    priority: workflowDefinitionToConvert.priority,
    validFrom: workflowDefinitionToConvert.valid_from,
    isDefault: workflowDefinitionToConvert.is_default,
    isValid: workflowDefinitionToConvert.is_valid,
    publishStatus: workflowDefinitionToConvert.publish_status,
    publishStatusName: workflowDefinitionToConvert.publish_status_name,
    durationUnit: workflowDefinitionToConvert.duration_unit,
    durationUnitName: workflowDefinitionToConvert.duration_unit_name,
    startNode: convertWorkflowNode(
      workflowDefinitionToConvert.start_node
    ),
    workflowNodesList: workflowDefinitionToConvert.workflow_nodes.map(itemWorkflowNode => {
      return convertWorkflowNode(itemWorkflowNode)
    })
  }
}

export function convertWorkflowNode(workflowNodeToConvert) {
  const { uuid, name, description, help } = workflowNodeToConvert

  return {
    uuid,
    value: workflowNodeToConvert.value,
    name,
    description,
    help,
    responsibleUuid: workflowNodeToConvert.responsible_uuid,
    documentAction: {
      ...workflowNodeToConvert.document_action
      // value, name
    },
    priority: workflowNodeToConvert.priority,
    action: workflowNodeToConvert.action,
    actionName: workflowNodeToConvert.action_name,
    transitionsList: workflowNodeToConvert.transitions.map(itemTransition => {
      return convertWorkflowTransition(itemTransition)
    })
  }
}

export function convertWorkflowTransition(workflowTransitionToConvert) {
  return {
    nodeNextUuid: workflowTransitionToConvert.node_next_uuid,
    description: workflowTransitionToConvert.description,
    isStdUserWorkflow: workflowTransitionToConvert.is_standard_user_workflow,
    isSandardUserWorkflow: workflowTransitionToConvert.is_standard_user_workflow,
    sequence: workflowTransitionToConvert.sequence,
    workflowConditionsList: workflowTransitionToConvert.workflow_conditions.map(conditionItem => {
      return convertWorkflowCondition(conditionItem)
    })
  }
}

export function convertWorkflowCondition(workflowConditionToConvert) {
  return {
    sequence: workflowConditionToConvert.sequence,
    columnName: workflowConditionToConvert.column_name,
    value: workflowConditionToConvert.value,
    conditionType: workflowConditionToConvert.confidential_type,
    conditionTypeName: workflowConditionToConvert.confidential_type_name,
    operation: workflowConditionToConvert.operation,
    operationName: workflowConditionToConvert.operation_name
  }
}

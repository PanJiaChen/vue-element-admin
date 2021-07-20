import language from '@/lang'
const steps = [
  {
    element: '#WorkflowActivity',
    popover: {
      title: language.t('form.activity.guide.table.title'),
      description: language.t('form.activity.guide.table.description'),
      position: 'bottom'
    }
  },
  {
    element: '#workflow',
    popover: {
      title: language.t('form.activity.guide.workflow.title'),
      description: language.t('form.activity.guide.workflow.description'),
      position: 'bottom'
    }
  },
  {
    element: '#logsWorkflow',
    popover: {
      title: language.t('form.activity.guide.workflowLogs.title'),
      description: language.t('form.activity.guide.workflowLogs.description'),
      position: 'top'
    }
  }
]
export default steps

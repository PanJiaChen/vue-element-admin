export default {
  route: {
    dashboard: 'Dashboard',
    documentation: 'Documentation',
    guide: 'Guide',
    forgotPassword: 'Forgot Password?',
    userEnrollment: 'Check in',
    page401: '401',
    page404: '404',
    profile: 'Profile',
    ProcessActivity: 'Process Activity',
    Role: 'Role',
    ReportViewer: 'Report Viewer'
  },
  notifications: {
    // simplex
    completed: 'Completed',
    loading: 'Loading',
    succesful: ' Successful ',
    error: ' Error ',
    opened: 'Opened',
    totalProcess: 'Total Processor Records ',
    // search
    searching: 'Searching records on the server',
    succcessSearch: 'The search has been made',
    searchWithOutRecords: 'The search ended without results',
    errorSearch: 'The search has not been completed',
    // process
    processing: 'Processing',
    processExecuted: 'Executed, see process activity',
    processError: 'Was not executed',
    //
    emptyValues: 'Parameter(s) empty value',
    fieldMandatory: 'The field is mandatory',
    requestError: 'Error executing the request',
    successChangeRole: 'The role has been changed',
    errorChangeRole: 'The role has not been changed',
    copySuccessful: 'Copied',
    copyUnsuccessful: 'Error, unable to copy',
    mandatoryFieldMissing: 'Missing fill in the fields ',
    updateFields: 'The record is updated with the field ',
    updateSuccessfully: 'Successfully made changes',
    invalidEmailFormat: 'Invalid email format',
    recordLocked: 'This record has been locked',
    recordUnlocked: 'This record has been unlocked'
  },
  navbar: {
    badge: {
      Notifications: 'Notifications',
      link: 'go to ProccesActivity'
    },
    dashboard: 'Dashboard',
    github: 'Github',
    logOut: 'Log Out',
    profile: 'Profile',
    theme: 'Theme',
    size: 'Global Size'
  },
  login: {
    noValidUser: 'Please enter the correct user name',
    noValidPassword: 'The password can not be empty',
    invalidLogin: 'User Id or Password invalid',
    unexpectedError: 'An unexpected error has occurred, try again',
    capsLock: 'Caps lock is On',
    title: 'Login Form',
    submit: 'Submit',
    logIn: 'Login',
    name: 'Name',
    lastName: 'Last name',
    eMail: 'Email',
    userName: 'User name',
    userNameOrEmail: 'User name or Email',
    userEnrollment: 'Enrollment user',
    userEnrollmentSuccessful: 'Successful user enrollment, check your email',
    passwordResetSendLink: 'The link to reset the password was sent to the email ',
    password: 'Password',
    passwordNew: 'New password',
    passwordConfirm: 'Password confirm',
    passwordConfirmNew: 'New password confirm',
    any: 'any',
    thirdparty: 'Or connect with',
    thirdpartyTips: 'Can not be simulated on local, so please combine you own business simulation.',
    invalidToken: 'The token used is invalid.',
    passwordReset: 'Password Reset',
    createPassword: 'Create password',
    passwordResetSuccessful: 'Password reset was successful',
    passwordAndConfirmNotMatch: 'The new password and your confirmation do not match.'
  },
  documentation: {
    documentation: 'Documentation',
    github: 'Github Repository'
  },
  permission: {
    addRole: 'New Role',
    editPermission: 'Edit',
    roles: 'Your roles',
    switchRoles: 'Switch roles',
    tips: 'In some cases, using v-permission will have no effect. For example: Element-UI  el-tab or el-table-column and other scenes that dynamically render dom. You can only do this with v-if.',
    delete: 'Delete',
    confirm: 'Confirm',
    cancel: 'Cancel'
  },
  guide: {
    description: 'The guide page is useful for some people who entered the project for the first time. You can briefly introduce the features of the project. Demo is based on ',
    button: 'Show Guide'
  },
  components: {
    date: {
      Today: 'Today',
      Yesterday: 'Yesterday',
      Week: 'Last week',
      LastMonth: 'Last month',
      CurrentMonth: 'The current month'
    },
    documentation: 'Documentation',
    binaryButton: 'Upload file',
    binaryTip: 'Only files with a size smaller than 500kb',
    imageError: 'The image exceeds 2MB and does not comply with the valid formats!',
    contextMenuRelations: 'Relations',
    contextMenuActions: 'Actions',
    contextMenuReferences: 'References',
    RunProcess: 'Run',
    ChangeParameters: 'Change Parameters',
    RunProcessAs: 'Run As',
    ExportTo: 'Export to',
    contextMenuDownload: 'Download',
    contextMenuShareLink: 'Share Link',
    contextMenuRefresh: 'Refresh',
    contextMennuExport: 'Export Smart Browser',
    contextMennuWindowReport: 'Export Records',
    contextMenuPrintFormatSetup: 'Print Format Setup',
    dateStartPlaceholder: 'Start date',
    dateEndPlaceholder: 'End date',
    timePlaceholder: 'Select time',
    dialogCancelButton: 'Cancel',
    dialogConfirmButton: 'Confirm',
    filterableItems: 'Optional Columns',
    fixedleItems: 'Fixed Columns',
    resetAllFilters: 'Reset all filters',
    switchActiveText: 'Yes',
    switchInactiveText: 'Not',
    contextFieldTitle: 'Context Information'
  },
  views: {
    browser: 'Smart Browser',
    smartBrowser: 'Smart Browser',
    process: 'Process',
    window: 'Window',
    report: 'Report',
    workflow: 'Workflow',
    task: 'Task',
    form: 'Form',
    noProcess: 'Not process running',
    logs: 'Summary',
    log: 'Summary',
    seeReport: 'See Report',
    summary: 'Summary',
    viewsHelp: 'Help',
    searchCriteria: 'Search Criteria',
    unsupportedSorry: 'Sorry',
    unsupportedHeadline: 'This view is currently unavailable',
    unsupportedInfo: 'Please check that the view is supported in this version, or click the button below to return to the homepage.',
    unsupportedButton: 'Back to dashboard',
    reportView: 'Report Views',
    printFormat: 'Print Formats',
    drillTable: 'Drill Down'
  },
  report: {
    ExportXlsx: '(xlsx) Excel File Extension',
    ExportXls: '(xls) Excel File',
    ExporXml: '(xml) Extensible Markup Language File',
    ExporCsv: '(csv) Archivo separado por coma',
    ExportTxt: '(txt) Tab Delimited Text File',
    ExportHtml: '(html) Hypertext Markup Language'
  },
  table: {
    ProcessActivity: {
      name: 'Name',
      zoomIn: 'Zoom in',
      description: 'Description',
      actions: 'Action',
      status: 'Status',
      Logs: 'Summary',
      summary: 'Summary',
      Help: 'Help',
      FileName: 'FileName',
      Output: 'Output'
    },
    dataTable: {
      search: 'Search',
      records: 'Records',
      selected: 'Selected',
      deleteSelection: 'Delete Selected Records',
      advancedQuery: 'Advanced Query',
      showOnlyMandatoryColumns: 'Show Only Mandatory Columns',
      showAllAvailableColumns: 'Show All Available Columns',
      exportRecordTable: 'Export Selected Records',
      showTotal: 'Show Totals',
      hiddenTotal: 'Hidden Totals'
    },
    recentItems: {
      search: 'Filter by name, description or date',
      date: 'Date',
      name: 'Name',
      description: 'Description'
    }
  },
  example: {
    warning: 'Creating and editing pages cannot be cached by keep-alive because keep-alive include does not currently support caching based on routes, so it is currently cached based on component name. If you want to achieve a similar caching effect, you can use a browser caching scheme such as localStorage. Or do not use keep-alive include to cache all pages directly. See details'
  },
  errorLog: {
    tips: 'Please click the bug icon in the upper right corner',
    description: 'Now the management system are basically the form of the spa, it enhances the user experience, but it also increases the possibility of page problems, a small negligence may lead to the entire page deadlock. Fortunately Vue provides a way to catch handling exceptions, where you can handle errors or report exceptions.',
    documentation: 'Document introduction'
  },
  excel: {
    export: 'Export',
    selectedExport: 'Export Selected Items',
    placeholder: 'Please enter the file name (default excel-list)'
  },
  zip: {
    export: 'Export',
    placeholder: 'Please enter the file name (default file)'
  },
  pdf: {
    tips: 'Here we use window.print() to implement the feature of downloading PDF.'
  },
  theme: {
    change: 'Change Theme',
    documentation: 'Theme documentation',
    tips: 'Tips: It is different from the theme-pick on the navbar is two different skinning methods, each with different application scenarios. Refer to the documentation for details.'
  },
  tagsView: {
    refresh: 'Refresh',
    close: 'Close',
    closeOthers: 'Close Others',
    closeAll: 'Close All',
    newRecord: 'New Record',
    seeRecord: 'See Record',
    advancedQuery: 'Advanced Query'
  },
  settings: {
    title: 'Page style setting',
    theme: 'Theme Color',
    tagsView: 'Open Tags-View',
    fixedHeader: 'Fixed Header',
    sidebarLogo: 'Sidebar Logo'
  },
  profile: {
    aboutMe: 'About Me',
    recentItems: 'Recent Items',
    favorites: 'Favorites',
    PendingDocuments: 'Pending Documents',
    recentItemsName: 'Name Recent Items',
    role: 'Role',
    availableRoles: 'Available roles',
    currentRole: 'Current role',
    clientName: 'Client name',
    description: 'Description',
    changeRole: 'Change role',
    changeLanguage: 'Change language',
    changeLanguagePlaceholder: 'Choose a language'
  },
  window: {
    newRecord: 'New Record',
    deleteRecord: 'Delete Record',
    undoNew: 'Undo New Record'
  },
  data: {
    emtpyTableName: 'Error: Table Name is not defined',
    errorGetData: 'Error getting data records',
    createRecordSuccessful: 'New record created successfully',
    createNewRecord: 'Mode New record',
    createRecordError: 'Error creating new record',
    deleteRecordSuccessful: 'Record deleted successfully',
    deleteRecordError: 'Error deleting record',
    selectionRequired: 'You must select a record',
    undo: 'Undo',
    lockRecord: 'Lock Record',
    unlockRecord: 'Unlock Record'
  },
  sequence: {
    available: 'Available',
    sequence: 'Sequence'
  }
}

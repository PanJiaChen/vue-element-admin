export default {
  language: 'Idioma',
  route: {
    dashboard: 'Panel de control',
    documentation: 'Documentación',
    calendar: 'Calendario',
    forgotPassword: '¿Olvidó su Contraseña?',
    userEnrollment: 'Registrarse',
    guide: 'Guía',
    page401: '401',
    page404: '404',
    profile: 'Perfil',
    ProcessActivity: 'Histórico Procesos',
    withoutLog: 'No se Encontró Registro de Error ',
    ProductInfo: 'Información de Producto',
    role: 'Rol',
    organization: 'Organización',
    warehouse: 'Almacén',
    reportViewer: 'Visor de Reportes',
    PriceChecking: 'Consulta del precio'
  },
  notifications: {
    // simplex
    completed: 'Completado',
    loading: 'Cargando',
    succesful: ' Exitoso ',
    error: ' Error ',
    opened: 'Abierto',
    totalProcess: 'Total de Registros Procesador ',
    // search
    searching: 'Buscando registros en el servidor',
    succcessSearch: 'La búsqueda se ha realizado',
    searchWithOutRecords: 'La búsqueda finalizo sin resultados',
    errorSearch: 'La búsqueda no se ha completado.',
    // process
    processing: 'Procesando',
    processExecuted: 'Ejecutado, ver histórico de procesos',
    processError: 'No fue ejecutado',
    //
    emptyValues: 'Parametro(s) con valores vacios',
    fieldCannotBeEmpty: 'El valor del campo no puede estar vacío.',
    fieldMandatory: 'El campo es obligatorio',
    requestError: 'Error al ejecutar la petición',
    successChangeRole: 'El rol se ha cambiado',
    errorChangeRole: 'El rol no se ha cambiado',
    copySuccessful: 'Copiado',
    copyUnsuccessful: 'Error, no se puede copiar',
    mandatoryFieldMissing: 'Falta completar los campos ',
    updateFields: 'Se actualiza el registro con el campo ',
    updateSuccessfully: 'Cambios realizados exitosamente',
    invalidEmailFormat: 'Formato de correo electronico invalido',
    recordLocked: 'Este registro ha sido bloqueado',
    recordUnlocked: 'Este registro ha sido desbloqueado',
    noRoleAccess: 'Con su rol y configuración actuales, no puede ver esta información.',
    errorPointOfSale: 'Sin punto de venta seleccionado'
  },
  navbar: {
    badge: {
      Notifications: 'Notificaciones',
      activity: 'Flujos de Trabajos por Aprobar',
      link: 'Ir a Histórico de Procesos'
    },
    logOut: 'Salir',
    dashboard: 'Panel de control',
    github: 'Github',
    theme: 'Tema',
    size: 'Tamaño global',
    profile: 'Perfil'
  },
  login: {
    noValidUser: 'Por favor ingrese el nombre de usuario correcto',
    noValidPassword: 'La contraseña no puede estar vacía',
    invalidLogin: 'ID de usuario o contraseña no válida',
    unexpectedError: 'Se ha producido un error inesperado, intente nuevamente',
    capsLock: 'Bloqueo de mayúsculas activado',
    title: 'Formulario de acceso',
    submit: 'Enviar',
    logIn: 'Acceso',
    name: 'Nombre',
    lastName: 'Apellido',
    eMail: 'Correo electronico',
    userName: 'Usuario',
    userNameOrEmail: 'Usuario o Correo',
    userEnrollment: 'Registrar usuario',
    userEnrollmentSuccessful: 'Registro de usuario exitoso, verifique su correo electronico',
    passwordResetSendLink: 'El enlace para reiniciar la contraseña se envio al correo ',
    password: 'Contraseña',
    passwordNew: 'Nueva contraseña',
    passwordConfirm: 'Confirmar contraseña',
    passwordConfirmNew: 'Confirmación de nueva contraseña',
    any: 'nada',
    thirdparty: 'Conectar con',
    thirdpartyTips: 'No se puede simular en local, así que combine su propia simulación de negocios.',
    invalidToken: 'El token utilizado es inválido.',
    passwordReset: 'Reiniciar contraseña',
    createPassword: 'Crear contraseña',
    passwordResetSuccessful: 'El reinicio de contraseña se realizo correctamente',
    passwordAndConfirmNotMatch: 'La contraseña nueva y su confirmación no coinciden.'
  },
  documentation: {
    documentation: 'Documentación',
    github: 'Repositorio Github',
    releases: 'Liberaciones',
    branches: 'Ramas',
    code: 'Código',
    issues: 'Asuntos',
    downloadZip: 'descargar  Zip',
    releaseNotes: 'Nota de Liberaciones',
    goRepository: 'Ir al Repositorio',
    seeDocumentation: 'Ver Documentación'
  },
  permission: {
    addRole: 'Nuevo rol',
    editPermission: 'Permiso de edición',
    roles: 'Tus permisos',
    switchRoles: 'Cambiar permisos',
    tips: 'En algunos casos, no es adecuado usar v-permission, como el componente Element Tab o el-table-column y otros casos de dom de representación asíncrona que solo se pueden lograr configurando manualmente v-if.',
    delete: 'Borrar',
    confirm: 'Confirmar',
    cancel: 'Cancelar'
  },
  guide: {
    description: 'La página de guía es útil para algunas personas que ingresaron al proyecto por primera vez. Puede introducir brevemente las características del proyecto. Demo se basa en ',
    button: 'Ver guía'
  },
  components: {
    date: {
      Today: 'Hoy',
      Yesterday: 'Ayer',
      Week: 'La semana pasada',
      LastMonth: 'El mes pasado',
      CurrentMonth: 'El mes actual'
    },
    documentation: 'Documentación',
    binaryButton: 'Subir archivo',
    binaryTip: 'Solo archivos con un tamaño menor a 500kb',
    imageError: 'La imagen excede los 2MB y no cumple con los formato validos!',
    contextMenuRelations: 'Relaciones',
    contextMenuActions: 'Acciones',
    contextMenuReferences: 'Referencias',
    withOutReferences: 'Sin referencias para el registro',
    contextMenuDownload: 'Descargar',
    contextMenuShareLink: 'Compartir Link',
    contextMenuRefresh: 'Actualizar',
    contextMennuExport: 'Exportar Smart Browser',
    contextMenuPrintFormatSetup: 'Configurar Formato de Impresión',
    RunProcess: 'Ejecutar',
    ChangeParameters: 'Cambiar Parametros',
    RunProcessAs: 'Ejecutar como',
    ExportTo: 'Exportar a',
    dateStartPlaceholder: 'Fecha inicial',
    dateEndPlaceholder: 'Fecha final',
    timePlaceholder: 'Seleccione tiempo',
    dialogCancelButton: 'Cancelar',
    dialogConfirmButton: 'Confirmar',
    filterableItems: 'Columnas Opcionales',
    fixedleItems: 'Columnas Fijas',
    resetAllFilters: 'Reiniciar todos los filtros',
    switchActiveText: 'Si',
    switchInactiveText: 'No',
    contextFieldTitle: 'Información de Contexto',
    preference: {
      title: 'Valor de Preferencia',
      attribute: 'Atributo',
      code: 'Codigo',
      yes: 'Si',
      no: 'No',
      defaultMessage: 'Aplica para Esta ',
      defaultMessageUser: 'Aplica para Este ',
      preferenceIsOk: 'Preferencia guardada',
      preferenceRemoved: 'Preferencia Eliminada',
      for: 'Para ',
      clientAndOrganization: 'esta Compañía y Organización',
      allOrganizationOfClient: 'todas las Organizaciones de esta Compañía',
      entireSystem: 'todo el Sistema',
      thisUser: ', este Usuario',
      allUsers: ', todos los Usuarios',
      thisWindow: ' y esta Ventana',
      allWindows: ' y todas las Ventanas'
    }
  },
  grid: {
    recordAccess: {
      accessGranted: 'Acceso otorgado a los roles'
    }
  },
  views: {
    browser: 'Consulta Inteligente',
    smartBrowser: 'Consulta Inteligente',
    process: 'Proceso',
    window: 'Ventana',
    report: 'Reporte',
    workflow: 'Flujo de Trabajo',
    task: 'Tarea',
    form: 'Formulario',
    noProcess: 'No hay procesos en ejecución',
    logs: 'Resumen',
    log: 'Bitacora',
    seeReport: 'Ver Reporte',
    summary: 'Resumen',
    viewsHelp: 'Ayuda',
    searchCriteria: 'Criterio de Búsqueda',
    unsupportedSorry: 'Lo sentimos',
    unsupportedHeadline: 'Esta vista no está disponible actualmente',
    unsupportedInfo: 'Verifique que la vista sea compatible con esta versión, o haga clic en el botón a continuación para volver a la página de inicio.',
    unsupportedButton: 'Volver al Panel de control',
    reportView: 'Vistas de Reporte',
    printFormat: 'Formatos de Impresión',
    drillTable: 'Entrar en Detalle'
  },
  report: {
    ExportXlsx: '(xlsx) Extencion de Archivo Excel',
    ExportXls: '(xls) Archivo Excel',
    ExporXml: '(xml) Archivo Lenguaje de marcas Extensible',
    ExporCsv: '(csv) Archivo Separado por Coma',
    ExportTxt: '(txt) Archivo de Texto Delimitado por Tabuladores',
    ExportHtml: '(html) Lenguaje de Marcas de Hipertexto'
  },
  table: {
    ProcessActivity: {
      Name: 'Nombre',
      zoomIn: 'Acercar',
      Description: 'Descripción',
      FileName: 'Nombre de Archivo',
      Output: 'Salida',
      Action: 'Acción',
      Status: 'Estado',
      Logs: 'Resumen',
      Summary: 'Resumen',
      Help: 'Ayuda'
    },
    dataTable: {
      search: 'Buscar',
      selected: 'Seleccionados',
      deleteSelection: 'Eliminar Registros Seleccionados',
      advancedQuery: 'Consulta Avanzada',
      exportZip: 'Exportar Zip',
      showOnlyMandatoryColumns: 'Mostrar Solo Columnas Obligatorias',
      showAllAvailableColumns: 'Mostrar Todas Columnas Disponibles',
      exportRecordTable: 'Exportar Registros Seleccionados',
      showTotal: 'Mostrar Totales',
      hiddenTotal: 'Ocultar Totales'
    },
    recentItems: {
      search: 'Filtrar por nombre, descripción o fecha',
      date: 'Fecha',
      name: 'Nombre',
      description: 'Descripción'
    }
  },
  tagsView: {
    refresh: 'Actualizar',
    close: 'Cerrar',
    closeOthers: 'Cerrar otros',
    closeAll: 'Cerrar todos',
    newRecord: 'Nuevo Registro',
    seeRecord: 'Ver Registro',
    advancedQuery: 'Consulta Avanzada'
  },
  settings: {
    title: 'Configuración',
    theme: 'Color del tema',
    tagsView: 'Habilitar Tags-View',
    fixedHeader: 'Encabezado fijo',
    sidebarLogo: 'Logotipo de la barra lateral',
    showContextMenu: 'Mostrar Menu de Contexto',
    isShowTitle: 'Mostrar Título',
    isShowMenu: 'Mostrar Menu'
  },
  profile: {
    aboutMe: 'Sobre Mi',
    recentItems: 'Artículos Recientes',
    favorites: 'Favoritos',
    PendingDocuments: 'Documentos Pendientes',
    recentItemsName: 'Nombre Ítems Recientes',
    role: 'Rol',
    availableRoles: 'Roles disponibles',
    currentRole: 'Rol actual',
    clientName: 'Nombre del cliente',
    description: 'Descripción',
    changeRole: 'Cambiar Rol',
    changeLanguage: 'Cambiar idioma',
    changeLanguagePlaceholder: 'Elija un idioma'
  },
  window: {
    newRecord: 'Nuevo Registro',
    deleteRecord: 'Eliminar Registro',
    undoNew: 'Descartar Nuevo Registro',
    containerInfo: {
      attachment: 'Anexo',
      notes: 'Listado de Notas',
      changeLog: 'Actividad',
      workflowLog: 'Histórico de Flujo de Trabajo',
      changeDetail: 'Detalle del cambio',
      logWorkflow: {
        message: 'Mensaje',
        responsible: 'Responsable',
        workflowName: 'Nombre de estado del flujo de trabajo',
        timeElapsed: 'Tiempo transcurrido',
        addNote: 'Agregar Nota'
      }
    },
    documentStatus: 'Estatus del Documento',
    callout: {
      error: 'Error En Callout'
    }
  },
  field: {
    field: 'Campo',
    info: 'Información',
    calculator: 'Calculadora',
    preference: 'Preferencia',
    codeTranslation: 'Traduccion de ',
    logsField: 'Bitácora de Cambios',
    contextInfo: 'Información del Contexto',
    logsFieldEmpty: 'El campo no tiene cambios aún',
    container: {
      help: 'Ayuda',
      description: 'Descripción'
    }
  },
  data: {
    createRecordSuccessful: 'Nuevo registro creado con exito',
    createNewRecord: 'Modo nuevo registro',
    createRecordError: 'Error al crear nuevo registro',
    deleteRecordSuccessful: 'Registro eliminado exitosamente',
    deleteRecordError: 'Error al eliminar el regitro',
    exportRecord: 'Exportar Registro',
    lockRecord: 'Registro Bloqueado',
    noDescription: 'Sin Descripción',
    recordAccess: {
      modeMobile: {
        accessRoles: 'Roles con Acceso',
        accessRolesIsReadonly: 'Roles con Acceso y Solo lectura',
        lockedRoles: 'Roles Bloqueados',
        lockedRolesIsDependentEntities: 'Roles Bloqueados con Entidades Dependientes'
      },
      actions: 'Acceso a Registros',
      availableRoles: 'Roles Disponibles',
      configRoles: 'Roles Configurados',
      isReadonly: 'Solo  Lectura',
      isDependentEntities: 'Entidades Dependientes',
      isLock: 'Bloquear',
      isUnlock: 'Desbloquear',
      isError: 'Error al '
    },
    selectionRequired: 'Debe seleccionar un registro',
    undo: 'Deshacer',
    notification: {
      lockRecord: 'El Registro fue Bloqueado',
      unlockRecord: 'El Registro fue Desbloqueado'
    },
    addNote: 'Agregar Nota',
    emptyNote: 'Este registro no posee ninguna nota',
    descriptionNote: 'Agregar Nota o Comentario al Registro',
    unlockRecord: 'Desbloquear Registro'
  },
  sequence: {
    available: 'Disponibles',
    sequence: 'Secuencia'
  },
  operators: {
    compareSearch: 'Comparar la Búsqueda',
    operator: 'Operador de comparación',
    EQUAL: 'Igual a "="',
    NOT_EQUAL: 'Diferente a "<>"',
    LIKE: 'Contiene "~"',
    NOT_LIKE: 'No contiene "!~"',
    GREATER: 'Mayor que ">"',
    GREATER_EQUAL: 'Mayor o igual que ">="',
    LESS: 'Menor que "<"',
    LESS_EQUAL: 'Menor o igual que "<="',
    BETWEEN: 'Entre ">-<"',
    NULL: 'No tiene valor',
    NOT_NULL: 'Tiene un valor',
    IN: 'Incluye "()"',
    NOT_IN: 'No incluye "!()"'
  },
  quickAccess: {
    newRecord: 'Acceso Rápido para Crear Registro Nuevo',
    listRecords: 'Acceso Rápido para Listar los Registros',
    searchWithEnter: 'Pulse enter para realizar la busqueda'
  },
  businessPartner: {
    notFound: 'Socio de negocio no encontrado.'
  },
  form: {
    pos: {
      title: 'Punto de Venta',
      priceList: 'Lista de Precio',
      optionsPoinSales: {
        title: 'Opciones Rápidas del Punto de Ventas',
        salesOrder: {
          title: 'Orden de Venta',
          newOrder: 'Nueva Orden',
          ordersHistory: 'Histórico de Órdenes ',
          generateImmediateInvoice: 'Generar Factura Inmediata',
          completePreparedOrder: 'Completar Orden Preparada',
          cancelSaleTransaction: 'Anular Transacción de Venta',
          createPos: 'Crear Retiro de Punto de Venta',
          print: 'Imprimir Documento',
          cancelOrder: 'Cancelar Orden',
          orderRemoved: 'Orden Borrada',
          copyOrder: 'Copiar Orden'
        },
        cashManagement: {
          title: 'Gestión de Caja',
          cashOpening: 'Apertura de Caja',
          cashwithdrawal: 'Retiro de Efectivo',
          closeBox: 'Cierre de Caja'
        },
        generalOptions: {
          title: 'Opciones Generales',
          changePos: 'Cambiar Punto de Venta',
          listProducts: 'Lista de Productos y Precios',
          changeWarehouseList: 'Cambiar de Almacén',
          changePriceList: 'Cambiar Lista de Precio'
        }
      },
      tableProduct: {
        product: 'Producto',
        quantity: 'Cantidad',
        options: 'Opciones',
        editQuantities: 'Editar Cantidades',
        pin: 'Ingrese Pin',
        remove: 'Eliminar',
        empty: 'Ingrese el nombre del producto, código o UPC'
      },
      order: {
        order: 'Orden',
        seller: 'Vendedor',
        date: 'Fecha',
        subTotal: 'Sub-Total',
        type: 'Tipo',
        discount: 'Descuento',
        tax: 'Impuesto',
        total: 'Total',
        itemQuantity: 'Cantidad de Árticulo',
        numberLines: 'Numero de Lineas',
        pointSale: 'Punto de Venta',
        collect: 'Cobrar',
        collections: 'Cobros',
        BusinessPartnerCreate: {
          businessPartner: 'Socio de Negocios',
          successfullyCreated: 'Socio de Negocio Creado Exitosamente',
          taxId: 'Identificación Fiscal'
        }
      },
      collect: {
        orderTotal: 'Total de Orden',
        pending: 'Pendiente',
        payment: 'Pago',
        change: 'Cambio',
        totalInvoiced: 'Total Facturado',
        convertAmount: 'Convertir Cantidad',
        convertedAmount: 'Monto Convertido',
        fullPayment: 'Cobro Completo',
        Currency: 'Moneda',
        dayRate: 'Tasa del Día',
        noDayRate: 'No se a generado una tasa del día para la moneda',
        TenderType: {
          directDeposit: 'Depósito Directo',
          creditCard: 'Tarjeta de Crédito',
          directDebit: 'Débito Directo',
          check: 'Cheque',
          creditNote: 'Nota de crédito',
          mobilePayment: 'Pago Móvil Interbancario',
          account: 'Cuenta',
          cash: 'Efectivo',
          zelle: 'Zelle'
        },
        overdrawnInvoice: {
          title: 'Factura Sobregirada',
          below: 'Factura quedará con un saldo abierto',
          above: 'Datos del Cliente',
          returned: 'Su vuelto es',
          coupon: 'Generar una Tarjeta de Regalo o Vale',
          returnMoney: 'Devolver dinero en otra forma de pago',
          adjustDocument: 'Desea Ajustar Documento',
          dailyLimit: 'Limite Diario',
          customerLimit: 'Limite Order',
          available: 'Disponible',
          emptyPayment: 'Método de pago no soportado'
        }
      },
      keyLayout: {
        noProducto: 'No hay producto disponible Regresar al Principio'
      },
      pinMessage: {
        pin: 'Ingrese pin para ',
        documentType: 'cambiar tipo de documento',
        warehouse: 'cambiar almacen',
        price: 'cambiar precio',
        qtyEntered: 'cambiar cantidad',
        priceList: 'cambiar lista de precio',
        discount: 'agregar descuento',
        delete: 'eliminar producto',
        addProduct: 'agregar producto',
        invoiceOpen: 'generar factura con un saldo abierto'
      }
    },
    priceChecking: {
      productNotFound: 'Producto No Disponible',
      basePrice: 'Precio Base'
    },
    byInvoice: {
      title: 'Pedidos Vendedor de Pasillo por Facturar',
      label: 'Por Facturar',
      salesRepresentative: 'Agente Comercial',
      businessPartner: 'Socio de Negocio',
      documentNo: 'Nro. Documento'
    },
    productInfo: {
      product: 'Producto',
      codeProduct: 'Código de Producto',
      productInformation: 'Información de Producto',
      code: 'Código',
      name: 'Nombre',
      id: 'ID',
      lastName: 'Nombre2',
      description: 'Descripción',
      quantityOnHand: 'Existencia',
      price: 'Precio',
      taxAmount: 'Monto de Impuesto',
      grandTotal: 'Total General',
      grandTotalConverted: 'Gran Total Convertido',
      quantityAvailable: 'Cantidad Disponible',
      upc: 'Código de Barras'
    },
    guideSteps: {
      productValue: {
        description: 'Busca el producto segun su Codigo, Nombre o UPC'
      },
      businessPartner: {
        description: 'Mostrar Informacion del Socio de Negocios'
      },
      linesTable: {
        title: 'Lineas de la Orden',
        description: 'Listado de los Producto de la orden'
      },
      buttonPanelLeftPos: {
        title: 'Mostrar Panel Izquierdo',
        description: 'Despliega el panel de Opciones del Punto de Venta'
      },
      point: {
        description: 'Informacion del punto de venta actual'
      },
      buttonPanelRightPos: {
        title: 'Mostrar Panel Derecho',
        description: 'Despliega el panel de catalogo'
      },
      fieldListCollection: {
        title: 'Campos de la Cobranza',
        description: 'Grupo de Campo el cual posee. Monto, Moneda, Tipo de pago, Banco, Nro Referencia y Fecha'
      },
      buttonCollection: {
        title: 'Herramientas de la Cobranza',
        description: 'Compuesta por un conjunto de botonera que posee agregar, eliminar y porcesar'
      },
      cardCollection: {
        title: 'Panel de Pago',
        description: 'En este panel aparece un listado con las tarjeta de los pagos agregados'
      },
      infoInvoce: {
        title: 'Detalle de la Factura',
        description: 'Informacion de la Factura con el monto total, pendiente, cambio'
      },
      toolsPoint: {
        title: 'Herramientas del Punto de Venta'
      }
    },
    activity: {
      title: 'Sus Actividades de Flujo de Trabajo',
      filtersSearch: {
        history: 'Registros históricos',
        forward: 'Re-enviar'
      },
      table: {
        priority: 'Prioridad',
        node: 'Nodo'
      },
      guide: {
        table: {
          title: 'Lista de Flujos de trabajos por aprobar',
          description: 'Seleccione al menos uno para ver el detalle y responsable de aprobación. De igual manera puede decidir si aprueba, rechaza o redirecciona el mismo'
        },
        workflow: {
          title: 'Flujo de Trabajo',
          description: 'Diagrama del ciclo de vida del flijo de trabajo. El Nodo resaltado es el que se encuentra actualmente a la espera de verificación.'
        },
        workflowLogs: {
          title: 'Bitacora de Cambios',
          description: 'Linea de tiempo del flujo de trabajo'
        }
      }
    },
    match: {
      title: {
        invoice: 'Factura',
        deliveryReceipt: 'Entrega / Recibo'
      },
      description: {
        searchCriteria: 'Seleccione un Socio de Negocio para verificar los documentos pendientes por asignar',
        invoice: 'Seleccione una Factura para asignar las Entrega/Recibo correspondiente',
        deliveryReceipt: 'Seleccione al menos una Entrega/Recibo a la cual requiere asignar la factura seleccionada'
      },
      field: {
        toAssigned: 'Para ser Asignadas',
        assigning: 'Asignando',
        difference: 'Diferencia'
      },
      filtersSearch: {
        sameBusinessPartner: 'Mismo Socio del Negocio',
        sameProduct: 'Mismo Producto ',
        sameQuantity: 'Misma Cantidad '
      },
      table: {
        nrDocument: 'Nr Docuemnto'
      }
    },
    weight: 'Peso'
  }
}

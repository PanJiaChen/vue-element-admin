# Acceso a Registros

Permite configurar el acceso que tendra cada rol a un registro o una vista en específico a partir de los siguientes parámetros:

  - **Roles Disponibles**: Se encuentran todos los roles creados en ADempiere,que no tienen alguna configuración del registro el cual se encuentra posicionado
  - **Roles Configurados**: Se encuentran los roles los cuales van a tener una configuración de acceso o bloqueo a un registro en específico, estos acceos o
  bloqueos depende de las siguientes opciones:
    - Bloquear: Al tildar esta opción se bloquea al rol el acceso y la visualización del registro, al tener activo esta opción se hablita la siguiente opción:
      - Entidades Dependientes: Al tildar esta opción deja activo solo un registros y los demas registros dependientes de esto los bloquea
    - Desbloquear: Al tildar esta pción se habilita o activa la visualización del registros, al tener activo esta opción se hablitan las siguientes opcines:
      - Solo Lectura: Puede visualizar en modo lectura (No puede editar o crear) los registros que esten asociados al rol 
      - Editable: Puede visualiar en modo lectura y escritura (puede editar o crear)

## Versión ADempiere-ZK

<img :src="$withBase('/images/components/record-access/ad-zk-window-record-access.png')" alt="Acceso a Registro Versión de Escritorio ZK" width="800px">

## Versión ADempiere-Vue

<img :src="$withBase('/images/components/record-access/ad-vue-window-record-access.png')" alt="Acceso a Registro ADempiere-Vue de Escritorio" width="800px">

Al usuar esta configuración por registros se esta personalizando la visualización y el acceso que tendra cada rol en ADempiere,donde se puede activar la visualización de un registros, bloquear o simplemente excluir, cuando el rol se encuentre en el apartado "Roles Disponibles" indicaría que no tiene alguna configurción sobre ese registro, si se desea activar alguna configuración ya sea de activar o bloquear, se tendría que pasar el rol al apartado "Roles Configurado" y aplicar la opción que se desea con ese rol sobre ese registro en específico.

Cabe destacar, que este acción en ADempiere aplica solo registros por registro y por rol; un caso práctico para las funciones del "Acceso a Registro" es el siguiente:

  Se requiere dar acceso a dos tipos de documentos uno lectura y escritura, otro solo lectura y bloquear la vista de otro tipo de documento
  
  - Para el acceso al documento lectura y escritura: Se debe ubicar en ADempiere el tipo de documento, ir a la acción "Acceso a Registro", ubicar el rol y pasar al apartado "Roles Configurados" se tilda la opción "Desbloquear" y "Editable"
  
  - Para el acceso al documento solo lectura: Se debe ubicar en ADempiere el tipo de documento ir a la acción "Acceso a Registro", ubicar el rol y pasar al apartado "Roles Configurados" se tilda la opción "Desbloquear" y "Solo Lectura"
  - Para el bloqueo de un dcumento: Se debe ubicar ADempiere el tipo de documento ir a la acción "Acceso a Registro", ubicar el rol y pasar al apartado "Roles Configurados" se tilda la opción "Bloquear"

## ¿Dónde se ubica?

Esta acción se ubica aquellas ventanas que tengan en el menú de acciones

<img :src="$withBase('/images/components/record-access/ad-vue-location-record-access.png')" alt="Acceso a Registro ADempiere-Vue Escritorio" width="800px">


## ¿Para qué sirve?

Sirve para conigurar los accesos y bloqueos de un rol en un registro en específico

## Funciones u Observaciones
- Función: Configuración de roles para dar acceso o bloquear un regitro
- Obseración: Solo se aplica por regitros y por roles, es decir que si se desea configurar por uno o ma registros estos deben hacer uno por uno.


## ¿Cómo se utiliza en la versión de Escritorio?

En la versión escritorió este componente se utiliza de la siguiente forma:

- Primero que nada se debe ubiccar el botón menú de acciones, luego tildar la opción "Acceso a Registro"

- Al tildar esta opción se desplegará una ventana donde muestra que el listado de roles los cuales se le configurará los accesos o bloqueos del registro en el que se cuentra posicionado.


## ¿Cómo se utiliza en la versión móvil?

En la versión movil este componente se utiliza de la siguiente forma:

- Primero que nada se debe ubiccar el botón menú de acciones, luego tildar la opción "Acceso a Registro"

- Al tildar esta opción se desplegará  una ventana del lado derecho  donde muestra listado de roles los cuales se le configurará los accesos o bloqueos del registro en el que se cuentra posicionado.


## Opciones para el Desarrollador

El diálogo de **Acceso a Registros** se encuentra en la siguiente ruta:

```bash
└── src                             # Código fuente principal
    └── components                  # Componentes globales
        └── ADempiere               # Componentes específicos de ADempiere
            └── RecordAccess        # Directorio principal de Acceso a Registros

```
Aquí puede ver un [Demo](https://demo-ui.erpya.com/#/7aa4242a-93c0-42d8-92be-8250002d3e3c/d97027fd-4cd5-445e-8fd8-ef5d3f7959b4/window/147?tabParent=0&tabChild=0&action=43adbe9d-04a7-4cf6-9582-895c1e40da0b&typeAction=recordAccess)

El llamado al consumo de servicio de  **Acceso a Registros** se encuentra en la siguiente ruta:
```bash
└─ src                            # Código fuente principal
    └─ api                        # Servicios globales
      └─ ADempiere                # Servicios específicos de ADempiere
            └─ actions            # Acciones
                └─ record-access  # Directorio principal de los servicio Acceso a Registros

```


Los servicios llamados del componente son <br>
[GET /api/user-interface/component/record-access/record-access](https://adempiere.github.io/proxy-adempiere-api/guide/default-modules/adempiere-api/user-interface.html#get-api-user-interface-component-record-access-record-access)<br>
[POST /api/user-interface/component/record-access/record-access](https://adempiere.github.io/proxy-adempiere-api/guide/default-modules/adempiere-api/user-interface.html#get-api-user-interface-component-record-access-record-access)

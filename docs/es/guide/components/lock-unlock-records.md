# Bloquear/Desbloquear Registros

Permite bloquear un registro para que se visualizados solamente por el usuario que lo bloquea. Cuando el registro se encuentra bloqueado, se selecciona el mismo icono de candado para desbloquear el registro y pueda ser visualizado por todos los usuarios.

## Versión ADempiere-ZK

<img :src="$withBase('/images/components/lock-unlock-records/zk-desktop-version-lock-unlock-records.png')" alt="Bloquear/Desbloquear Registros en Versión de Escritorio ZK" width="800px">

## Versión ADempiere-Vue

<img :src="$withBase('/images/components/lock-unlock-records/ui-version-lock-unlock-records.png')" alt="Bloquear/Desbloquear Registros en Versión Móvil y de Escritorio" width="800px">

## ¿Dónde se ubica?

Se ubica del lado izquierdo del nombre de la pestaña donde se encuentra ubicado el usuario.

## ¿Para qué sirve?

Sirve para bloquear y desbloquear un determinado registro.

## Funciones u Observaciones

::: tip
Al bloquear el registro, el nombre de la pestaña cambiar de azul a rojo.
:::

## ¿Cómo se utiliza en la versión de Escritorio?

En la versión de escritorio, se ubica la pestaña donde se encuentra el registro y finalmente se selecciona el icono de candado ubicado del lado izquierdo del nombre de la pestaña. Para desbloquear el registro, se realiza el mismo procedimiento.

<img :src="$withBase('/images/components/lock-unlock-records/how-to-use-it-in-the-desktop-version.gif')" />

## ¿Cómo se utiliza en la versión móvil?

En la versión móvil, se ubica la pestaña donde se encuentra el registro y finalmente se selecciona el icono de candado ubicado del lado izquierdo del nombre de la pestaña. Para desbloquear el registro, se realiza el mismo procedimiento.

<img :src="$withBase('/images/components/lock-unlock-records/how-to-use-it-in-the-mobile-version.gif')" />

## Opciones para el Desarrollador

El boton de **Bloquear/Desbloquear Registros** se encuentra en la siguiente ruta:

```bash
└── src                         # Código fuente principal
    └── components              # Componentes globales
        └── ADempiere           # Componentes específicos de ADempiere
            └── Tab             # Directorio principal donde se encuentra el boton de Bloquear/Desbloquear Registros
```

Aquí puede ver un [Demo](https://demo-ui.erpya.com/#/7aa4242a-93c0-42d8-92be-8250002d3e3c/d97027fd-4cd5-445e-8fd8-ef5d3f7959b4/window/53418?tabParent=0&action=fa50908e-40f1-11e9-91a1-0242ac140002)

El llamado al consumo de servicio de **Lock/Unlock Records** se encuentra en la siguiente ruta:

```bash
└─ src                                 # Código fuente principal
    └─ api                             # Servicios globales
      └─ ADempiere                     # Servicios específicos de ADempiere
            └─ actions                 # Directorio principal de los servicio de las acciones de registro
                └─ private-access      # Directorio principal de los servicio Bloquear/Desbloquear Registros
```

Los servicios llamados del componente son:

[POST /api/user-interface/component/private-access/unlock-private-access](https://adempiere.github.io/proxy-adempiere-api/guide/es/default-modules/adempiere-api/user-interface.html#post-api-user-interface-component-private-access-unlock-private-access)

[POST /api/user-interface/component/private-access/lock-private-access](https://adempiere.github.io/proxy-adempiere-api/guide/es/default-modules/adempiere-api/user-interface.html#post-api-user-interface-component-private-access-lock-private-access)

[GET /api/user-interface/component/private-access/private-access](https://adempiere.github.io/proxy-adempiere-api/guide/es/default-modules/adempiere-api/user-interface.html#get-api-user-interface-component-private-access-private-access)


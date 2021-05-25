# Cambiar de Rol

Permite cambiar de rol sin necesidad de cerrar sesión. Para ello, se debe seleccionar el icono de ADempiere ubicado en la parte superior derecha de la ventana, para luego seleccionar en el campo "**Rol**", el rol para el cual requiere cambiar.

## Versión ADempiere-ZK

<img :src="$withBase('/images/components/change-role/zk-desktop-version-change-role.png')" alt="Cambiar de Rol en Versión de Escritorio ZK" width="800px">

## Versión ADempiere-Vue

<img :src="$withBase('/images/components/change-role/ui-version-change-role.png')" alt="Cambiar de Rol en Versión Móvil y de Escritorio" width="800px">

## ¿Dónde se ubica?

Se ubica en el campo "**Rol**" del menú que se despliega al seleccionar el icono de ADempiere que se encuentra ubicado en la parte superior derecha de la ventana.

## ¿Para qué sirve?

Sirve para cambiar de rol de manera rápida y sincella, sin tener que cerrar sesión para iniciar nuevamente seleccionando el rol requerido.

## Funciones u Observaciones

::: tip
ADempiere realiza el cambio de rol de manera automática, actualizando la vista para que sean visualizadas solamente las ventanas, procesos y reportes a los que tiene acceso el rol seleccionado previamente. El usuario puede realizar el cambio de un rol para cualquier otro, siempre que el mismo tenga asignados los diferentes roles requeridos.
:::

## ¿Cómo se utiliza en la versión de Escritorio?

En la versión de escritorio se hace clic sobre el icono de ADempiere "**AD**", ubicado en la parte superior derecha de la ventana, para visualizar el menú que es desplegado por el mismo y seleccionar el rol en el campo "**Rol**".

<img :src="$withBase('/images/components/change-role/how-to-use-it-in-the-desktop-version.gif')" />

## ¿Cómo se utiliza en la versión móvil?

En la versión móvil se hace clic sobre el icono de ADempiere "**AD**", ubicado en la parte superior derecha de la ventana, para visualizar el menú que es desplegado por el mismo y seleccionar el rol en el campo "**Rol**".

<img :src="$withBase('/images/components/change-role/how-to-use-it-in-the-mobile-version.gif')" />

## Opciones para el Desarrollador

El panel de **Cambiar Rol** se encuentra en el icono a la derecha en la barra de navegacion.

```bash
└── src                                 # Código fuente principal
    └── views                           # Vistas
        └── profile                     # Perfil
                └── components          # Componente
                    └── RolesNavbar     # Barra de navegación de los Roles
```

Aquí puede ver un [Demo](https://demo-ui.erpya.com/#/7aa4242a-93c0-42d8-92be-8250002d3e3c/d97027fd-4cd5-445e-8fd8-ef5d3f7959b4/window/53418?tabParent=0&action=fa50908e-40f1-11e9-91a1-0242ac140002)

El llamado al consumo de servicio de **Cambiar Rol** se encuentra en la siguiente ruta:

```bash
└─ src                            # Código fuente principal
    └─ api                        # Servicios globales
        └─ role                   # Directorio principal de los servicios de roles
```

Los servicios llamados del componente son <br>
[GET /api/user/roles](https://adempiere.github.io/proxy-adempiere-api/guide/es/default-modules/adempiere-api/user.html#get-api-user-roles)<br>
[POST /api/user/change-role](https://adempiere.github.io/proxy-adempiere-api/guide/es/default-modules/adempiere-api/user.html#post-api-user-change-role)<br>

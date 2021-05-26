# Actividad

El componente "**Actividad**", es una bitácora de cambios que guarda todos los cambios realizados en los registros de las ventanas, indicando el socio del negocio que realizó el cambio, el campo que fue modificado con su valor anterior y su valor actual, la fecha y la hora exacta en la que el mismo fue realizado.

## Versión ADempiere-ZK

<img :src="$withBase('/images/components/activity/zk-desktop-version-activity.png')" alt="Bitácora de Cambios en Versión de Escritorio ZK" width="800px">

## Versión ADempiere-Vue

<img :src="$withBase('/images/components/activity/ui-version-activity.png')" alt="Actividad en Versión Móvil y de Escritorio" width="800px">

## ¿Dónde se ubica?

Se ubica en la segunda pestaña de la ventana desplegada por el icono "**i**", ubicado en la parte central derecha de las ventanas de ADempiere.

## ¿Para qué sirve?

Sirve para consultar la información detallada de las actualizaciones que son realizadas a los registros de las ventanas de ADempiere.

## Funciones u Observaciones

::: tip
La información detallada de los cambios es visualizada por fecha y hora según usuario.
:::

## ¿Cómo se utiliza en la versión de Escritorio?

En la versión de escritorio se hace clic sobre el icono "**i**", ubicado en la parte central derecha de las ventanas de ADempiere, para visualizar la ventana desplegada por el mismo y finalmente seleccionar la pestaña "**Actividad**", para acceder a todos los cambios efectuados en el registro de la ventana.

<img :src="$withBase('/images/components/activity/how-to-use-it-in-the-desktop-version.gif')" />

## ¿Cómo se utiliza en la versión móvil?

En la versión móvil se debe posicionar en la parte inferior de la ventana para visualizar las pestañas "**Notas**" y "**Actividad**", luego se selecciona la pestaña "**Actividad**", para acceder a todos los cambios efectuados en el registro de la ventana.

<img :src="$withBase('/images/components/activity/how-to-use-it-in-the-mobile-version.gif')" />

## Opciones para el Desarrollador

El panel de **Actividad** se encuentra en el icono a la derecha en la barra de navegacion.

```bash
    └─ src                              # Código fuente principal
        └── components                  # Componentes globales
                └─ADempiere             # Componentes específicos de ADempiere
                    └── containerInfo   # Contenedor de informacion del registro
                        └── recordLogs  # Registro de Actividades
```

Aquí puede ver un [Demo](https://demo-ui.erpya.com/#/7aa4242a-93c0-42d8-92be-8250002d3e3c/d97027fd-4cd5-445e-8fd8-ef5d3f7959b4/window/53418?tabParent=0&action=fa50908e-40f1-11e9-91a1-0242ac140002)

El llamado al consumo de servicio de **Actividad** se encuentra en la siguiente ruta:

```bash
└─ src                            # Código fuente principal
    └─ api                        # Servicios globales
        └─ ADempiere              # Directorio principal de los servicios de roles
            └─ windows            # Directorio principal de los servicios de roles
```

Los servicios llamados del componente son <br>
[POST /adempiere-api/logs/list-entity-logs](https://adempiere.github.io/proxy-adempiere-api/guide/default-modules/adempiere-api/user-log.html#post-adempiere-api-logs-list-entity-logs)<br>

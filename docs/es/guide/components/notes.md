# Notas

En la versión ADempiere-UI, las notas representan el icono "**Comentarios**" de la versión ADempiere-ZK. La misma permite establecer notas o comentarios a los registros de las ventanas de ADempiere.

## Versión ADempiere-ZK

<img :src="$withBase('/images/components/notes/zk-desktop-version-notes.png')" alt="Comentarios en Versión de Escritorio ZK" width="800px">

## Versión ADempiere-Vue

<img :src="$withBase('/images/components/notes/notes-desktop-mobile.png')" alt="Notas en Versión UI Móvil y de Escritorio" width="800px">

Al agregar una nota o comentario a un registro de una ventana, el mismo estara disponible para todos los usuarios que tengan acceso a dicho registro.

De igual manera, el registro de la nota o comentario puede ser eliminado.

## ¿Dónde se ubica?

Se ubica en la parte central del lado derecho de las ventanas, representado por el icono "**i**".

## ¿Para qué sirve?

Sirve para agregar notas o comentarios a un registro.

## Funciones u Observaciones

::: tip
Permite agregar imágenes e información a las notas, aplicando formato "**Markdown**" al texto de la misma.
:::

## ¿Cómo se utiliza en la versión de Escritorio?

En la versión de escritorio se hace clic sobre el icono "**i**" para visualizar el menú desplegado por el mismo, luego se ingresa la información en el recuadro que se encuentra del lado izquierdo. De manera automática, la información ingresada en el recuadro del lado izquierdo se visualiza en el recuadro del lado derecho, con el formato aplicado.

### Crear Notas

<img :src="$withBase('/images/components/notes/create-notes-in-desktop-version.gif')" />

## ¿Cómo se utiliza en la versión móvil?

En la versión móvil se debe posicionar en la parte inferior de la ventana para visualizar las opciones "**Notas**" y "**Actividad**", luego se ingresa la información en el recuadro que se encuentra del lado izquierdo. De manera automática, la información ingresada en el recuadro del lado izquierdo se visualiza en el recuadro del lado derecho, con el formato aplicado.

### Crear Notas

<img :src="$withBase('/images/components/notes/create-notes-in-the-mobile-version.gif')" />

## Opciones para el Desarrollador

El panel de **Notas** se encuentra en la siguiente ruta:

```bash
└── src                             # Código fuente principal
    └── components                  # Componentes globales
        └── ADempiere               # Componentes específicos de ADempiere
            └── ChatEntries         # Directorio principal del componente Notas
```

Aquí puede ver un [Demo](https://demo-ui.erpya.com/#/7aa4242a-93c0-42d8-92be-8250002d3e3c/d97027fd-4cd5-445e-8fd8-ef5d3f7959b4/window/53418?tabParent=0&action=fa50908e-40f1-11e9-91a1-0242ac140002)

El llamado al consumo de servicio de **Notas** se encuentra en la siguiente ruta:

```bash
└─ src                            # Código fuente principal
    └─ api                        # Servicios globales
      └─ ADempiere                # Servicios específicos de ADempiere
            └─ window             # Directorio principal de los servicio Notas
```

Los servicios llamados del componente son <br>
[POST /adempiere-api/logs/list-chat-entries](https://adempiere.github.io/proxy-adempiere-api/guide/es/default-modules/adempiere-api/user-log.html#post-adempiere-api-logs-list-chat-entries)<br>
[POST /api/user-interface/component/notes/create-chat-entry](https://adempiere.github.io/proxy-adempiere-api/guide/es/default-modules/adempiere-api/user-interface.html#post-api-user-interface-component-notes-create-chat-entry)<br>
[POST /adempiere-api/logs/list-entity-chats](https://adempiere.github.io/proxy-adempiere-api/guide/es/default-modules/adempiere-api/user-log.html#post-adempiere-api-logs-list-entity-chats)

# Preferencia

Permite establecer el valor de un registro de manera predeterminada, el mismo se puede realizar a partir de lo siguiente:

  - **Check Compañía**: Establece el valor para todas las compañías
  - **Check Organización**: Establece el valor para todas las organizaciones
  - **Check Usuario**: Establece el valor para todos los usuarios
  - **Check Ventana**: Establece el valor para todas las ventanas

## Versión ADempiere-ZK

<img :src="$withBase('/images/components/preference/zk-desktop-version-preference.png')" alt="Preferencia en Versión de Escritorio ZK" width="800px">

## Versión ADempiere-Vue

<img :src="$withBase('/images/components/preference/preference-desktop-mobile.png')" alt="Preferencia en Versión Móvil y de Escritorio" width="800px">

Al destildar alguno de los check indicados anteriormente, el comportamiento del componente consta en establecer dicho valor cuando se crea un registro nuevo. Ejemplo:

  Al destildar el check **Ventana** y guardar el cambio se establece el valor del campo como predeterminado para todas las ventanas que contengan dicho campo. El comportamiento se puede visualizar al crear un registro nuevo en esa o cualquier ventana de ADempiere, por defecto se crea el registro nuevo con la información del campo previamente cargada, donde fue ejecutado el cambio del componente "**Preferencia**".

De igual manera, se comportan los check **Compañía**, **Organización** y **Usuario**. El registro del componente puede ser cancelado, guardado o eliminado.

## ¿Dónde se ubica?

Se ubica en los diferentes campos que contienen las ventanas de ADempiere.

## ¿Para qué sirve?

Sirve para establecer valores de manera predeterminada en base a la compañía, organización, usuario y ventana.

## Funciones u Observaciones

::: tip
Por defecto, el campo contiene de la configuración de preferencia 

  - **Para todas las Organizaciones de esta Compañía, este Usuario y esta Ventana**
:::

## ¿Cómo se utiliza en la versión de Escritorio?

En la versión de escritorio se hace clic sobre el campo para visualizar el menú desplegado por el mismo, luego se selecciona la opción "**Preferencia**", para establecer el valor de preferencia requerido.

## ¿Cómo se utiliza en la versión móvil?

En la versión móvil se hace clic sobre el campo para visualizar el menú desplegado por el mismo, luego se selecciona la opción "**Preferencia**", para establecer el valor de preferencia requerido.

## Opciones para el Desarrollador

El diálogo de **Preferencia** se encuentra en la siguiente ruta:

```bash
└── src                             # código fuente principal
    └── components                  # componentes globales
        └── ADempiere               # componentes específicos de ADempiere
            └── field               # Campos
                └── contextMenu     # Menú de Contexto para todos los campos
                    └── preference  # directorio principal de preferencias

```
Aquí puede ver un [Demo](https://demo-ui.erpya.com/#/7aa4242a-93c0-42d8-92be-8250002d3e3c/d97027fd-4cd5-445e-8fd8-ef5d3f7959b4/window/53418?tabParent=0&action=fa50908e-40f1-11e9-91a1-0242ac140002)

El llamado al consumo de servicio de  **Preferencia** se encuentra en la siguiente ruta:
```bash
└─ src                            # Código fuente principal
    └─ api                        # Servicios globales
      └─ ADempiere                # Servicios específicos de ADempiere
            └─ field              # Campos
                └─ preference     # Directorio principal de los servicio preferencia

```


Los servicios llamados del componente son <br>
[POST /api/user-interface/component/preference/set-preference](https://adempiere.github.io/proxy-adempiere-api/guide/default-modules/adempiere-api/user-interface.html#preferencias)<br>
[POST /api/user-interface/component/preference/delete-preference](https://adempiere.github.io/proxy-adempiere-api/user-interface.html#post-api-user-interface-component-preference-delete-preference)

### Por hacer

En la versión ADempiere-UI, las preferencias de campo no están configuradas. Por tanto, se requiere que se corrija el problema para que se puedan establecer estas preferencias.

Este problema se informó en el issues [814](https://github.com/adempiere/adempiere-vue/issues/814)
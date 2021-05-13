# Traducción

Permite agregar la traducción en español del valor ingresado en un campo determinado.

## Versión ADempiere-ZK

<img :src="$withBase('/images/components/translation/zk-desktop-version-translation.png')" alt="Preferencia en Versión de Escritorio ZK" width="800px">

## Versión ADempiere-Vue

<img :src="$withBase('/images/components/translation/translation-desktop-mobile.png')" alt="Preferencia en Versión Móvil y de Escritorio" width="800px">

## ¿Dónde se ubica?

Se ubica en los campos de las ventanas que contienen la pestaña "**Traducción**".

## ¿Para qué sirve?

Sirve para establecer la traducción del valor ingresado en un campo determinado.

## Funciones u Observaciones

::: tip
Este componente reemplaza la pestaña "**Traducción**" que contienen algunas ventanas de ADempiere-ZK.
:::

## ¿Cómo se utiliza en la versión de Escritorio?

En la versión de escritorio se hace clic sobre el campo para visualizar el menú desplegado por el mismo, luego se selecciona la opción "**Idioma**", para visualizar la información del campo con su respectiva traducción.

<img :src="$withBase('/images/components/translation/how-to-use-it-in-the-desktop-version.gif')" />

## ¿Cómo se utiliza en la versión móvil?

En la versión de escritorio se hace clic sobre el campo para visualizar el menú desplegado por el mismo, luego se selecciona la opción "**Idioma**", para visualizar la información del campo con su respectiva traducción.

<img :src="$withBase('/images/components/translation/how-to-use-it-in-the-mobile-version.gif')" />

## Opciones para el Desarrollador

El diálogo de **Traducción** se encuentra en la siguiente ruta:

```bash
└── src                             # código fuente principal
    └── components                  # componentes globales
        └── ADempiere               # componentes específicos de ADempiere
            └── field               # Campos
                └── contextMenu     # Menú de Contexto para todos los campos
                    └── translated  # directorio principal de Traducción

```
Aquí puede ver un [Demo](https://demo-ui.erpya.com/#/7aa4242a-93c0-42d8-92be-8250002d3e3c/d97027fd-4cd5-445e-8fd8-ef5d3f7959b4/window/53418?tabParent=0&action=fa50908e-40f1-11e9-91a1-0242ac140002)

El llamado al consumo de servicio de  **Traducción** se encuentra en la siguiente ruta:
```bash
└─ src                            # Código fuente principal
    └─ api                        # Servicios globales
      └─ ADempiere                # Servicios específicos de ADempiere
            └─ persistence        # Directorio principal de los servicio Traducción

```


Los servicios llamados del componente son <br>
[GET adempiere-api/ui/getTranslations]()<br>

# Preferencia

Permite establecer el valor de un registro de manera predeterminada, el mismo se puede realizar a partir de lo siguiente:

  - **Check Compañía**: Establece el valor para todas las compañías
  - **Check Organización**: Establece el valor para todas las organizaciones
  - **Check Usuario**: Establece el valor para todos los usuarios
  - **Check Ventana**: Establece el valor para todas las ventanas

## Versión ADempiere-ZK

![Preferencia en Versión de Escritorio ZK](resources/zk-desktop-version-preference.png "Preferencia en Versión de Escritorio ZK")

## Versión ADempiere-Vue

![Preferencia en Versión Móvil y de Escritorio](resources/preference-desktop-mobile.png "Preferencia en Versión Móvil y de Escritorio")

Al destildar alguno de los check indicados anteriormente, el comportamiento del componente consta en establecer dicho valor cuando se crea un registro nuevo. Ejemplo:

  Al destildar el check **Ventana** y guardar el cambio se establece el valor del campo como predeterminado para todas las ventanas que contengan dicho campo. El comportamiento se puede visualizar al crear un registro nuevo en esa o cualquier ventana de ADempiere, por defecto se crea el registro nuevo con la información del campo previamente cargada, donde fue ejecutado el cambio del componente "**Preferencia**".

De igual manera, se comportan los check **Compañía**, **Organización** y **Usuario**. El registro del componente puede ser cancelado, guardado o eliminado.

## ¿Dónde se ubica?

Se ubica en los diferentes campos que contienen las ventanas de ADempiere.

## ¿Para qué sirve?

Sirve para establecer valores de manera predeterminada en base a la compañía, organización, usuario y ventana.

## Funciones u Observaciones

Por defecto, el campo contiene de la configuración de preferencia 

  - **Para todas las Organizaciones de esta Compañía, este Usuario y esta Ventana**

## ¿Cómo se utiliza en la versión de Escritorio?

En la versión de escritorio se hace clic sobre el campo para visualizar el menú desplegado por el mismo, luego se selecciona la opción "**Preferencia**", para establecer el valor de preferencia requerido.

## ¿Cómo se utiliza en la versión móvil?

En la versión móvil se hace clic sobre el campo para visualizar el menú desplegado por el mismo, luego se selecciona la opción "**Preferencia**", para establecer el valor de preferencia requerido.

## Datos Técnicos

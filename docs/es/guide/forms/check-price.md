# Consultar Precio

ADempiere permite que sea realizada una búsqueda de precios de productos a través del código de barra del mismo, en la ventana "**Consultar Precio**". Para ello, fue realizada la creación y configuración del usuario "**Visor**", con la finalidad de que el mismo pueda realizar una consulta rápida de los productos con sus respectivos precios.

El visor de precios se puede configurar en moneda "**VES**", para reflejar el precio del producto en bolívares y su monto convertido en dólares, según la tasa de cambio del día. También puede ser configurado con moneda "**USD**", para reflejar el precio del producto en dólares y su monto convertido en bolívares, según la tasa de cambio del día.

<img :src="$withBase('/images/forms/check-price/ui-version-check-price.png')" alt="Consultar Precio en Versión Móvil y de Escritorio" width="800px">

## ¿Dónde se ubica?

Se ubica en la posición número cinco (5), en el menú de ADempiere. Adicional a ello, también se puede acceder al visor, seleccionando la carpeta "**Órdenes de Venta**" y por último, seleccionando el formulario "**Check Price**".

## ¿Para qué sirve?

Sirve para consultar los precios de los productos en una moneda determinada y su precio convertido en otra moneda, dependiendo de la configuración que tenga el servicio.

## Funciones u Observaciones

::: tip
El visor de precios se puede configurar en moneda "**VES**", para reflejar el precio del producto en bolívares y su monto convertido en dólares, según la tasa de cambio del día. También puede ser configurado con moneda "**USD**", para reflejar el precio del producto en dólares y su monto convertido en bolívares, según la tasa de cambio del día.
:::

## ¿Cómo se utiliza en la versión de Escritorio?

### Activar Consultor de Precios

Seleccione en el menú de ADempiere, el formulario "**Check Price**". Luego podrá visualizar la ventana del formulario donde se debe cargar el código de barras, esta información se carga al formulario con ayuda del lector. Finalmente, podrá visualizar a información del producto de la siguiente manera, donde se detallan los siguientes campos:

    - Nombre
    - Descripción
    - Precio Base
    - Impuesto
    - Monto Total
    - Monto Total Convertido

<img :src="$withBase('/images/forms/check-price/activate-price-consultant-in-desktop-version.gif')" />

### Desactivar Consultor de Precios

Para desactivar el modo "**Visor de Precios**" se debe seleccionar el icono de ADempiere, el mismo se encuentra ubicado en la parte superior derecha de la ventana. Posteriormente, se debe acceder al perfil del usuario seleccionando el nombre de la compañía. Una vez ubicado en la ventana "**Perfil**", se debe seleccionar la pestaña "**Configuración**" y activar los check "**Habilitar Tags-View**", y "**Mostrar Menu**".

<img :src="$withBase('/images/forms/check-price/disable-price-consultant-in-desktop-version.gif')" />

## ¿Cómo se utiliza en la versión móvil?

### Activar Consultor de Precios

Seleccione en el menú de ADempiere, el formulario "**Check Price**". Luego podrá visualizar la ventana del formulario donde se debe cargar el código de barras, esta información se carga al formulario con ayuda del lector. Finalmente, podrá visualizar a información del producto de la siguiente manera, donde se detallan los siguientes campos:

    - Nombre
    - Descripción
    - Precio Base
    - Impuesto
    - Monto Total
    - Monto Total Convertido

<img :src="$withBase('/images/forms/check-price/activate-price-consultant-in-the-mobile-version.gif')" />

### Desactivar Consultor de Precios

Para desactivar el modo "**Visor de Precios**" se debe seleccionar el icono de ADempiere, el mismo se encuentra ubicado en la parte superior derecha de la ventana. Posteriormente, se debe acceder al perfil del usuario seleccionando el nombre de la compañía. Una vez ubicado en la ventana "**Perfil**", se debe seleccionar la pestaña "**Configuración**" y activar los check "**Habilitar Tags-View**", y "**Mostrar Menu**".

<img :src="$withBase('/images/forms/check-price/disable-price-consultant-in-mobile-version.gif')" />

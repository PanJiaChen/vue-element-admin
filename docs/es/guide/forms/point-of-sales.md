# Punto de Venta

El formulario del punto de venta le permite a los vendedores tomar los pedidos de los clientes de manera rápida y eficiente. Durante el proceso, se puede visualizar el monto total de la orden, convertido en las diferentes monedas con las que trabaje la organización, para ello debe existir obligatoriamente una tasa de cambio previamente creada.

## Crear Nueva Orden

Se puede crear un nuevo registro de orden de venta al agregar un producto al formulario.

<img :src="$withBase('/images/forms/point-of-sales/create-new-order.gif')" />

De igual manera, se puede crear un nuevo registro seleccionando la opción "**Nueva Orden**", ubicada del lado derecho del campo "**Socio del Negocio**". Dicha opción se habilita cuando el usuario se encuentra posicionado en un registro de orden de venta, en el formulario "**Punto de Venta**".

<img :src="$withBase('/images/forms/point-of-sales/option-create-new-order.png')" alt="Opción Crear Nueva Orden" width="800px">

## Agregar Cliente a una Orden

Para agregar un cliente a una orden de venta, se debe ingresar los datos del mismo en el campo "**Socio del Negocio**".

<img :src="$withBase('/images/forms/point-of-sales/add-business-partner.gif')" />

Adicionalmente, se puede crear un nuevo registro de un socio del negocio cliente, seleccionando el icono "**+**", ubicado en la parte superior del campo "**Socio del Negocio**".

<img :src="$withBase('/images/forms/point-of-sales/create-business-partner.png')" alt="Crear Socio del Negocio" width="800px">

## Agregar Producto a una Orden

Los productos de la orden de venta, se pueden agregar a la misma de la siguiente manera:

- Ingresando el código o nombre del producto en el campo "**Código de Producto**". Al ingresar un valor en dicho campo, ADempiere realiza la búsqueda de manera automática, mostrando los resultados debajo del campo.

<img :src="$withBase('/images/forms/point-of-sales/add-product-with-code-or-name.gif')" />

- Seleccionando los productos en el catálogo de productos que se visualiza al seleccionar el icono "**<**", ubicado en la parte central derecha de la ventana del formulario "**Punto de Venta**".

<img :src="$withBase('/images/forms/point-of-sales/add-product-with-catalog.gif')" />

- Adicional a ello, se pueden agregar los productos con ayuda del lector de código de barras.

<img :src="$withBase('/images/forms/point-of-sales/add-product-with-code-reader.gif')" />

## Líneas de la Orden

<img :src="$withBase('/images/forms/point-of-sales/sales-order-lines.png')" alt="Líneas de la Orden de Venta" width="800px">

La sección de las líneas de la orden contiene las siguientes seis (6) columnas que representan los campos principales del producto:

- **Producto**: Nombre del producto cargado a la orden de venta.

- **Precio**: Precio unitario del producto cargado a la orden de venta.

- **Cantidad**: La cantidad del producto cargado a la orden de venta.

- **% Descuento**: El porcentaje de descuento aplicado al precio del producto cargado a la orden de venta.

- **Total**: El total de la línea del producto, según la cantidad ingresa.

- **Opciones**: La columna se compone de tres (3) opciones que permiten al usuario realizar ciertas acciones

  - La primera opción de izquierda a derecha, permite visualizar la infomación del producto

  - La segunda opción de izquierda a derecha, permite modificar la cantidad, el precio y el porcentaje de descuento del producto.

  - La tercera opción de izquierda a derecha, permite eliminar el registro de la línea de la orden de venta.

    <img :src="$withBase('/images/forms/point-of-sales/sales-order-lines.gif')" />

## Información de la Orden

La información de la orden de venta se encuentra ubicada en la parte inferior derecha del formulario. La misma se compone de los siguientes campos:

- **Orden**: Indica el número de documento de la orden de venta.

- **Vendedor**: Indica el nombre del agente comercial (vendedor) que se encuentra realizando la orden de venta.

- **Fecha**: Indica la fecha de la orden de venta.

- **Sub-Total**: Indica el monto total de la orden sin impuestos.

- **Tipo**: Indica el tipo de documento con el cual se esta generando la orden de venta.

- **Descuento**: Indica el monto total del descuento aplicado a la orden.

- **Cantidad de Árticulo**: Indica la cantidad total de los árticulos que posee la orden de venta.

- **Impuesto**: Indica el monto total del impuesto aplicado a la orden.

- **Cantidad de Líneas**: Indica la cantidad total de líneas de productos que posee la orden de venta.

- **Total**: Indica el monto total de la orden con descuento e impuestos.

<img :src="$withBase('/images/forms/point-of-sales/sales-order-information.png')" alt="Información de la Orden de Venta" width="800px">

## Opciones del Punto de Venta

Para posicionarse en cualquier línea de producto de la orden que se encuentra realizando, puede hacer clic sobre la misma o seleccionar los iconos de "**Posicionamiento**" ubicados en la parte inferior izquierda del formulario "**Punto de Venta**". Donde el primer icono permite posicionarse en el "**Registro Anterior**", y el segundo icono permite posicionarse en el "**Registro Siguiente**".

<img :src="$withBase('/images/forms/point-of-sales/position-yourself-on-the-order-lines.gif')" />

De igual manera, puede eliminar el registro del producto donde se encuentra posicionado, seleccionando el icono "**Eliminar**" ubicado en la parte inferior izquierda del formulario "**Punto de Venta**".

<img :src="$withBase('/images/forms/point-of-sales/remove-the-order-line.gif')" />

Seleccione el icono "**Cobrar**", para realizar el cobro de la orden de venta que se encuentra realizando.

<img :src="$withBase('/images/forms/point-of-sales/collect-the-order.gif')" />

Para cambiar de terminal PDV en el formulario del punto de venta, seleccione la opción "**Punto de Venta**" ubicada en la parte inferior izquierda del formulario. Luego, seleccione el terminal PDV con el que requiere realizar las operaciones de venta.

<img :src="$withBase('/images/forms/point-of-sales/change-point-of-sale-terminal.gif')" />

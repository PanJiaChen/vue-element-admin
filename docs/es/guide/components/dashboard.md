# Panel de Control

El panel de control, muestra diferentes gráficas que representan la información económica y financiera más importante de la empresa. Además de ciertos accesos directos e histórico de consultas realizadas a las ventanas, reportes, procesos y demás.

## Versión ADempiere-ZK

<img :src="$withBase('/images/components/dashboard/zk-desktop-version-dashboard.png')" alt="Panel de Control en Versión de Escritorio ZK" width="800px">

## Versión ADempiere-Vue

<img :src="$withBase('/images/components/dashboard/dashboard-desktop-mobile.png')" alt="Panel de Control en Versión Móvil y de Escritorio" width="800px">

Dicho panel de control de manera predeterminada, cuenta principalmente con las siguientes carpetas:

- **Artículos Recientes**: Muestra los artículos recientemente abiertos y modificados, puede hacer clic en cualquiera de los elementos para abrirlos. El listado de esta sección se actualiza periódicamente.

- **Favoritos (Usuario/System)**: Los favoritos sirven para guardar de una manera rápida y sencilla, los documentos que son visitados frecuentemente. Muestra las ventanas, procesos, reportes y smart browser establecidas como favoritos por el usuario.

- **Tareas Pendientes**: Muestra todos los procesos o documentos que el usuario tiene pendientes por finalizar.

- **Actividades**: Indica los documentos que se encuentran en estado pendiente, es decir un documento que se ha realizado pero que por algún motivo no ha podido ser completado.

- **Vistas**: Se visualizan las diferentes ventanas de información para consultas rápidas que posee ADempiere.

- **Indicadores de Desempeño**: Señalará la cantidad de documentos (según su estado) que existen a través de gráficos.

  - Facturas Pendientes
  - Ingreso Neto Facturado
  - Ingreso Facturado
  - Cantidad de Facturas Pagadas
  - Margen de Ventas Facturado
  - Número de Clientes

- **Calendario**: Se visualiza el calendario con intervalos de días, meses y años.

## Donde se Ubica

Al iniciar sesión, se ubica en la pestaña "**Panel de Control**" de la vista principal de ADempiere.

## ¿Para qué sirve?

Para obtener de manera rápida cierta información de ADempiere, o acceder a ventanas, procesos y reportes del mismo.

## Funciones u Observaciones

::: tip
Por defecto, el panel de control contiene la configuración de predeterminada indicada anteriormente.
:::

## ¿Cómo se utiliza en la versión de Escritorio?

En la versión de escritorio se hace clic sobre la pestaña "**Panel de Control**" para acceder a las diferentes carpetas que contiene el mismo. De igual manera, se pueden minimizar dichas carpetas y ocultar su contenido al seleccionar el icono (v), y maximizar nuevamente las carpetas al seleccionar el icono (>) para visualizar su contenido.

<img :src="$withBase('/images/components/dashboard/how-to-use-it-in-the-desktop-version.gif')" />

## ¿Cómo se utiliza en la versión móvil?

En la versión de escritorio se hace clic sobre la pestaña "**Panel de Control**" para acceder a las diferentes carpetas que contiene el mismo. De igual manera, se pueden minimizar dichas carpetas y ocultar su contenido al seleccionar el icono (v), y maximizar nuevamente las carpetas al seleccionar el icono (>) para visualizar su contenido.

<img :src="$withBase('/images/components/dashboard/how-to-use-it-in-the-mobile-version.gif')" />

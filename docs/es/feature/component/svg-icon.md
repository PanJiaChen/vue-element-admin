---
sidebarDepth: 3
---

# Icono Svg

Componente global de icono: Icono Svg.

Por defecto, el componente Icono Svg está registrado en [@/icons](https://github.com/adempiere/adempiere-vue/blob/master/src/icons/index.js#L6), y puede usarse en cualquier parte del proyecto. Todos los iconos se pueden encontrar en [@/icons/svg](https://github.com/adempiere/adempiere-vue/tree/master/src/icons/svg). Puedes agregar o eliminar el icono por ti mismo, y el icono se importará automáticamente sin operación manual.

## Uso

```html
  <!-- usa icon-class para configurar el nombre; usa `class-name` para personalizar la clase -->
  <svg-icon icon-class="password" class-name='custom-class' />
```

## Cambiar color

Por defecto, `svg-icon` lee su color primario `fill: currentColor;`

Puedes cambiar el `color` del padre o directamente el color de relleno `fill`.

## Importar desde url <Badge text="v4.2.0+"/>

Soporte de importación `svg` desde url externa. P.ej:

`<svg-icon icon-class="https://xxxx.svg />`

## Tamaño

Si estás descargando un icono de [iconfont](https://www.iconfont.cn/), recuerda usar una herramienta como Sketch para especificar el tamaño del icono. De lo contrario, el tamaño de los iconos en el proyecto puede no ser uniforme.

Todos los iconos utilizados en este proyecto tienen especificaciones de tamaño 128\*128.

:::tip
Si encuentras el color incorrecto del icono, puedes consultar el [issue](https://github.com/adempiere/adempiere-vue/issues/330) para modificarlo
:::

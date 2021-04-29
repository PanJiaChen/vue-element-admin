# Svgo <Badge text="v3.9.0+"/>

Este proyecto proporciona optimización de procesamiento de compresión svg. Basada en [svgo](https://github.com/svg/svgo).

```bash
npm run svgo
```

Muchas descargas en línea o svg exportados por `Sketch` tendrán una gran cantidad de información redundante e inútil, aumentando considerablemente el tamaño del svg. Podemos optimizarlo con `svgo`. Por ejemplo, la siguiente figura es un svg exportado por `Sketch`

![](https://adempiere-vue.gitee.io/gitee-cdn/adempiere-vue-site/333edb6b-4b95-42f8-aa60-b8f42e516b52.jpg)

Podemos ejecutar `npm run svgo`

![](https://adempiere-vue.gitee.io/gitee-cdn/adempiere-vue-site/e7b1324e-cd67-4306-aebf-f659bcc433cf.jpg)

![](https://adempiere-vue.gitee.io/gitee-cdn/adempiere-vue-site/006c4bb5-b2d1-447d-a1c9-a912cf5dee47.jpg)

Se procesa información inútil.

Se puede utilizar una configuración más detallada en `/scr/icons/svgo.yml`.

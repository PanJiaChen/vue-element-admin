<p align="center">
  <img width="320" src="https://upload.wikimedia.org/wikipedia/commons/b/b1/Adempiere-logo.png">
</p>

<p align="center">
  <a href="https://github.com/vuejs/vue">
    <img src="https://img.shields.io/badge/vue-2.6.10-brightgreen.svg" alt="vue">
  </a>
  <a href="https://github.com/ElemeFE/element">
    <img src="https://img.shields.io/badge/element--ui-2.7.0-brightgreen.svg" alt="element-ui">
  </a>
  <a href="https://travis-ci.org/adempiere/adempiere-vue" rel="nofollow">
    <img src="https://travis-ci.org/adempiere/adempiere=vue.svg?branch=develop" alt="Build Status">
  </a>
  <a href="https://github.com/adempiere/adempiere-vue/blob/master/LICENSE">
    <img src="https://img.shields.io/badge/license-GNU/GPL%20(v3)-blue" alt="license">
  </a>
  <a href="https://github.com/adempiere/adempiere-vue/releases">
    <img src="https://img.shields.io/github/release/adempiere/adempiere-vue.svg" alt="GitHub release">
  </a>
  <a href="https://gitter.im/adempiere/adempiere-vue">
    <img src="https://badges.gitter.im/Join%20Chat.svg" alt="gitter">
  </a>
</p>

Español | [Inglés](./README.md)

## Introducción

[adempiere-vue](https://github.com/adempiere/adempiere-vue) es una nueva UI para [ADempiere ERP, CRM & SCM](https://github.com/adempiere/adempiere)]. Se basa en [vue](https://github.com/vuejs/vue) y usa el conjunto de herraminentas de UI [element-ui](https://github.com/ElemeFE/element).

Este es una gran UI para [ADempiere ERP, CRM & SCM](https://github.com/adempiere/adempiere)] basada en lo último desarrollado por vue, construido con i18n para manejo multi-idioma, plantillas para aplicaciones de negocio y muchas características asombrosas. Este proyecto es derivado de [Vue-Element-Admin](https://github.com/PanJiaChen/vue-element-admin) originalmente escrito por [PanJiaChen / 花裤衩](https://github.com/PanJiaChen) sobre [licencia MIT](https://github.com/PanJiaChen/vue-element-admin/blob/master/LICENSE) y cambiado a [licencia GNU/GPL v3](https://github.com/adempiere/adempiere-vue/blob/master/LICENSE) por [Yamel Senih](https://github.com/yamelsenih) después de derivar el proyecto y con permisos del autor original [PanJiaChen / 花裤衩](https://github.com/PanJiaChen) en el reporte ["Extend as GNU/Gpl v3 License #1434"](https://github.com/PanJiaChen/vue-element-admin/issues/1434).

[adempiere-vue](https://github.com/adempiere/adempiere-vue) usa como RPC (Llamado a Procedimientos Remostos)[gRPC](https://grpc.io/) como [server](https://github.com/erpcya/adempiere-gRPC-Server).

- [Vista Prévia](http://adempiere-ui.erpya.com:9526/)

- [Documentación](https://panjiachen.github.io/vue-element-admin-site/)

- [Gitter](https://gitter.im/adempiere/adempiere-vue)

- [Donar](https://www.paypal.me/?)

- [Wikipedia](http://wiki.adempiere.net/ADempiere_ERP)

- [Derivado De](https://github.com/PanJiaChen/vue-element-admin)

**La versión actual `v1.0+` está construida en `vue-cli`. Si encuentra algún problema, por favor escriba un [reporte de error](https://github.com/adempiere/adempiere-vue/issues/new).**

**Este proyecto no soporta versiones bajas de los navegadores (e.g. IE).**

## Preparación

Necesita instalar [node](https://nodejs.org/) y [git](https://git-scm.com/) localmente. El proyecto está basado en [ES2015+](https://es6.ruanyifeng.com/), [vue](https://cn.vuejs.org/index.html), [vuex](https://vuex.vuejs.org/zh-cn/), [vue-router](https://router.vuejs.org/zh-cn/), [vue-cli](https://github.com/vuejs/vue-cli) , [gRPC](https://grpc.io/) y [element-ui](https://github.com/ElemeFE/element).
Entendiendo y aprendiendo acerca de lo anterior le ayudará a conocer el proyecto.

<p align="center">
  <img width="900" src="https://wpimg.wallstcn.com/a5894c1b-f6af-456e-82df-1151da0839bf.png">
</p>

## Patrocinantes

<a href="http://erpya.com/"><img width="250px" src="https://i0.wp.com/spin-suite.com/erpya/wp-content/uploads/sites/28/2017/11/ERP-logotipo-H-color.png" /></a>
<a href="http://www.e-evolution.com/"><img width="250px" src="https://i0.wp.com/mysmart.business/evolution/wp-content/uploads/sites/29/2017/10/e-evolution-logo-v2.png?fit=150%2C92" /></a>
<a href="http://westfalia-it.com/"><img width="150px" src="https://i1.wp.com/spin-suite.com/westfalia/wp-content/uploads/sites/30/2017/12/logo_copy.jpg?fit=265%2C357" /></a>
<a href="http://erpya.com/"><img width="250px" src="https://i0.wp.com/spin-suite.com/openupsolutions/wp-content/uploads/sites/32/2017/05/Openup-Solutions-Logo-2017-80x200px.png" /></a>

Sea un patrocinante y coloque su logo en nuestro LEEME en GitHub con un link a su sitio web. [Sea un Patrocinante](https://www.paypal.me/?)

## Características

```
- Iniciar / Cerrar Sesión

- Permisos de Authentication
  - Permisos basado en ADempiere
  - Página de Permisos
  - Directivas de permisos
  - Página de configuración de permisos
  - Autenticación por dos pasos

- Construcción Multi-entorno
  - dev sit stage  producción

- Características Globales
  - I18n
  - Temas dinámicos
  - Dynamic sidebar (soporte a rutas multi-nivel)
  - Barra de rutas dinámica
  - Tags-view (Tab page Support right-click operation)
  - Svg Sprite
  - Datos de simulación con Mock
  - Pantalla completa
  - Responsive Sidebar

- Editor
  - Editor de Texto Enriquecido
  - Editor Markdown
  - Editor JSON

- Excel
  - Exportación a Excel
  - Carga de Excel
  - Visualización de Excel
  - Exportación como zip

- Tabla
  - Tabla Dinámica
  - Tabla con Arrastrar y Soltar
  - Tabla de edición en línea

- Páginas de Error
  - 401
  - 404

- Componentes
  - Carga de Avatar
  - Botón para subir al inicio
  - Arrastrar y Soltar (Diaglogo)
  - Arrastrar y Soltar (Seleccionar)
  - Arrastrar y Soltar (Kanban)
  - Arrastrar y Soltar (Lista)
  - Panel de división
  - Componente para soltar archivos
  - Adhesión de objetos
  - Contador hasta
- Soporte a ADempiere
    - Ventan
    - Proceso
    - Reporte
    - Visor Inteligente

- Ejemplo Avanzado
- Registro de Errores
- Tablero de indicadores
- Página de Guías
- ECharts (Gráficos)
- Portapapeles
- Convertidor de Markdown a html
```

## Iniciando

Use [gRPC ADempiere Server](https://github.com/erpcya/adempiere-gRPC-Server) como proveedor de gRPC.

```bash
# clone el proyecto
git clone -b develop git@github.com:adempiere/vue-element-admin.git

# vaya al directorio clonado
cd adempiere-vue

# instale las dependencias
npm install

# corra el proyecto como desarrollador
npm run dev
```

Automáticamente se abrirá el siguiente enlace en su navegador http://localhost:9527

## Construcción

```bash
# Construcción para entornos de prueba
npm run build:stage

# Construcción para entornos de producción
npm run build:prod
```

## Avanzado

```bash
# Vista previa con efectos de entorno
npm run preview

# Vista previa  con efectos + análisis de recursos estáticos
npm run preview -- --report

# Chequeo de formato de código
npm run lint

# Chequeo de formato de código y auto-corrección
npm run lint -- --fix
```

Vaya a [Documentation](https://panjiachen.github.io/vue-element-admin-site/guide/essentials/deploy.html) para mayor información.

## Registro de Cambios

Los cambios detallados por cada liberación se encuentran en [notas de liberación](https://github.com/adempiere/adempiere-vue/releases).

## Demostración en línea

[Preview](http://adempiere-ui.erpya.com:9526/)

## Donación

Si este proyecto es de mucha ayuda para ti, puedes ayudar a hacer una mejor UI

[Dona por Paypal](https://www.paypal.me/?)

## Navegadores Soportados

Navegadores modernos e Internet Explorer 10+.

| [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/edge/edge_48x48.png" alt="IE / Edge" width="24px" height="24px" />](https://godban.github.io/browsers-support-badges/)</br>IE / Edge | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png" alt="Firefox" width="24px" height="24px" />](https://godban.github.io/browsers-support-badges/)</br>Firefox | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png" alt="Chrome" width="24px" height="24px" />](https://godban.github.io/browsers-support-badges/)</br>Chrome | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/safari/safari_48x48.png" alt="Safari" width="24px" height="24px" />](https://godban.github.io/browsers-support-badges/)</br>Safari |
| --------- | --------- | --------- | --------- |
| IE10, IE11, Edge| last 2 versions| last 2 versions| last 2 versions

## Licencia

[GNU/GPL v3](https://github.com/adempiere/adempiere-vue/blob/master/LICENSE)

## Licencia Prévia
[MIT](./PREVIOUS-LICENSE)

## Contribuidores Iniciales

- [Yamel Senih](https://github.com/yamelsenih)
- [Raúl Muñoz](https://github.com/Raul-mz)
- [Edwin Betancourt](https://github.com/EdwinBetanc0urt)
- [Leonel Matos](https://github.com/leonel1524)
- [Elsio Sanchez](https://github.com/elsiosanchez)

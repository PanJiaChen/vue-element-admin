---
pageClass: getting-started
---

# Introducción

**Nota: Esta documentación fue forkeada del proyecto original de [PanJiaChen](https://github.com/PanJiaChen/vue-element-admin-site). El crédito es para él puesto que fue el que inició este gran proyecto. Cualquier cambio después de forkeado será hecho por el [equipo de ADempiere](https://github.com/adempiere/adempiere)**

[![vue](https://img.shields.io/badge/vue-2.6.10-brightgreen.svg)](https://github.com/vuejs/vue)
[![element-ui](https://img.shields.io/badge/element--ui-2.7.0-brightgreen.svg)](https://github.com/ElemeFE/element)
[![Build Status](https://travis-ci.org/adempiere/adempiere-vue.svg?branch=master)](https://travis-ci.org/adempiere/adempiere-vue)
[![license](https://img.shields.io/github/license/mashape/apistatus.svg)](https://github.com/adempiere/adempiere-vue/blob/master/LICENSE)
[![GitHub release](https://img.shields.io/github/release/PanJiaChen/adempiere-vue.svg)](https://github.com/adempiere/adempiere-vue/releases)
[![donate](https://img.shields.io/badge/%24-donate-ff69b4.svg)](https://adempiere-vue.gitee.io/adempiere-vue-site/zh/donate)
[![GitHub stars](https://img.shields.io/github/stars/adempiere/adempiere-vue.svg?style=social&label=Stars)](https://github.com/adempiere/adempiere-vue)

[adempiere-vue](http://adempiere.github.io/adempiere-vue) es una solución front-end lista para producción para interfaces de administración. Se basa en [vue](https://github.com/vuejs/vue) y utiliza el kit de interfaz de usuario [element-ui](https://github.com/ElemeFE/element).

Es un administrador vue mágico basado en el nuevo conjunto de desarrollo de vue, solución i18n incorporada, plantillas típicas para aplicaciones empresariales, muchas características increíbles. Te ayuda a construir grandes aplicaciones complejas de una sola página. Creo que sean cuales sean tus necesidades, este proyecto te ayudará.

:::tip
Este proyecto integra muchas características que no puedes usar, causará mucha redundancia de código. Si tu proyecto no presta atención a este problema, también puedes desarrollarlo directamente basándote en él.
De lo contrario, puedes usar [vue-admin-template](https://github.com/adempiere/vue-admin-template).

- Solución integrada: [adempiere-vue](https://github.com/adempiere/adempiere-vue)
- Plantilla Básica: [vue-admin-template](https://github.com/adempiere/vue-admin-template)
- Desktop: [electron-vue-admin](https://github.com/PanJiaChen/electron-vue-admin)
- Typescript: [vue-typescript-admin-template](https://github.com/Armour/vue-typescript-admin-template) (Créditos: [@Armour](https://github.com/Armour))
- Otros: [awesome-project](https://github.com/adempiere/adempiere-vue/issues/2312)
  :::

<br/>

## Características

```
- Iniciar sesión / Cerrar sesión

- Autenticación de Permisos
  - Permiso de la página
  - Permiso directivo
  - Página de configuración de permisos
  - Inicio de sesión en dos pasos

- Construcción multi-ambiente
  - dev sit stage prod

- Características Globales
  - I18n
  - Múltiples temas dinámicos
  - Barra lateral dinámica (admite enrutamiento multinivel)
  - Breadcrumb dinámicos
  - Etiquetas-vista (Página de pestaña Soporte de operación del clic derecho)
  - Svg Sprite
  - Datos simulados
  - Pantalla completa
  - Barra lateral responsiva

- Editor
  - Editor de texto enriquecido
  - Editor de Markdown
  - Editor de JSON

- Excel
  - Exportar Excel
  - Subir Excel
  - Visualización de Excel
  - Exportar zip

- Tabla
  - Tabla dinámica
  - Arrastrar y soltar tabla
  - Tabla de edición en línea

- Página de error
  - 401
  - 404

- Componentes
  - Subir Avatar
  - Volver Arriba
  - Arrastrar Diálogo
  - Arrastrar Seleccionar
  - Drag Kanban
  - Arrastrar Lista
  - Panel Dividido
  - Dropzone
  - Sticky
  - CountTo

- Ejemplo avanzado
- Registro de errores
- Tablero
- Guía de la página
- ECharts
- Portapapeles
- Markdown a html
```

<br/>

## Preparación

Necesitas instalar [node](http://nodejs.org/) y [git](https://git-scm.com/) locamente. El proyecto se basa en [ES2015+](http://es6.ruanyifeng.com/), [vue](https://cn.vuejs.org/index.html), [vuex](https://vuex.vuejs.org/zh-cn/), [vue-router](https://router.vuejs.org/zh-cn/), [vue-cli](https://github.com/vuejs/vue-cli), [axios](https://github.com/axios/axios) y [element-ui](https://github.com/ElemeFE/element), todos los datos de solicitud se simulan utilizando [Mock.js](https://github.com/nuysoft/Mock).
Comprender y aprender este conocimiento de antemano te será de gran ayuda para el uso de este proyecto.

Al mismo tiempo, apoyando una serie de artículos tutoriales, cómo construir un proyecto de fondo completo desde cero, te sugerimos que leas estos artículos y luego vengas a practicar este proyecto. Pero todavía no hay una versión en inglés.

- [Las manos tocan tu mano, usa tu vue 撸 Backstage Series 1 (Basic)](https://juejin.im/post/59097cd7a22b9d0065fb61d2)
- [Las manos tocan tu mano, usa tu vue 撸 Backstage Series 2 (Permisos de inicio de sesión)](https://juejin.im/post/591aa14f570c35006961acac)
- [Las manos tocan tu mano, usa tu vue 撸 Backstage Series III (combate real)](https://juejin.im/post/593121aa0ce4630057f70d35)
- [Toque de mano, llévese con vue 撸 Backstage Series 4 (vueAdmin, una plantilla de fondo minimalista)](https://juejin.im/post/595b4d776fb9a06bbe7dba56)
- [Toque con la mano, lo llevará a envolver un componente de vue](https://segmentfault.com/a/1190000009090836)
- [Manos y manos, traiga el icono de uso elegante](https://juejin.im/post/59bb864b5188257e7a427c09)
- [Las manos tocan tu mano, te usan con una postura razonable usando webpack4 (activado)](https://juejin.im/post/5b56909a518825195f499806)
- [Las manos tocan tu mano, te usan con una postura razonable usando webpack4 (abajo)](https://juejin.im/post/5b5d6d6f6fb9a04fea58aabc)

::: tip
**Este proyecto no es compatible con navegadores de bajo nivel (como IE). Si lo necesitas, agrega polyfills tu mismo.**
:::

## Estructura del proyecto

Este proyecto ha incorporado las siguientes plantillas, y han construido un andamiaje basado en Vue, que debería ayudarte a crear prototipos de interfaces de administración listas para producción. Cubre casi todo lo que necesitas.

```bash
├── build                      # construir archivos de configuración
├── mock                       # datos simulados
├── plop-templates             # plantilla básica
├── public                     # activos estáticos puros (directamente copiados)
│   │── favicon.ico            # favicon
│   └── index.html             # plantilla index.html
├── src                        # código fuente principal
│   ├── api                    # servicio de api
│   ├── assets                 # activos del módulo como fuentes, imágenes (procesadas por webpack).
│   ├── components             # componentes globales
│   ├── directive              # directiva global
│   ├── filters                # filtro global
│   ├── icons                  # iconos svg
│   ├── lang                   # idioma i18n
│   ├── layout                 # diseño global
│   ├── router                 # enrutador
│   ├── store                  # almacén
│   ├── styles                 # css global
│   ├── utils                  # utiles globales
│   ├── vendor                 # vendor
│   ├── views                  # vistas
│   ├── App.vue                # componente principal de la aplicación
│   ├── main.js                # archivo de entrada de la aplicación
│   └── permission.js          # autenticación de permisos
├── tests                      # pruebas
├── .env.xxx                   # configuración de variables env
├── .eslintrc.js               # configuración eslint
├── .babelrc                   # configuración babel
├── .travis.yml                # configuración automatizada de CI
├── vue.config.js              # configuración vue-cli
├── postcss.config.js          # configuración postcss
└── package.json               # package.json
```

## Empezando

```bash
# clonar el proyecto
git clone https://github.com/adempiere/adempiere-vue.git

# entrar en el directorio del proyecto
cd adempiere-vue

# instalar dependencias
npm install

# develop
npm run dev
```

<br/>

Esto se abrirá automáticamente [http://localhost:9527](http://localhost:9527).

Si ves la siguiente página, entonces has tenido éxito.

![](https://adempiere-vue.gitee.io/gitee-cdn/adempiere-vue-site/1bc334a6-32a8-4f29-a037-ac3f5ce32588.png)

Tenemos modelos integrados, componentes estándar, datos simulados, recarga módulos hot, administración de estado, i18n, enrutador global, etc. Puedes continuar explorando otros documentos para obtener más detalles sobre esos temas.

<br/>

::: tip
**Sugerencia:** Puedes usar `adempiere-vue` como una caja de herramientas o como un repositorio de solución de integración, se recomienda hacer un desarrollo secundario sobre la base de `vue-admin-template`, si necesitas alguna característica adicional, la puedes copiar desde `adempiere-vue`.
:::

## Contribución

El repositorio de documentación es [adempiere-vue-site](https://github.com/erpcya/adempiere-vue-site) basado en el desarrollo [vuepress](https://github.com/vuejs/vuepress).

Puede haber algunos errores ortográficos o de traducción al escribir este documento. Eres bienvenido a señalar por issue o por pr.

[adempiere-vue](https://github.com/adempiere/adempiere-vue) también continúa iterando, resumiendo y resumiendo más funciones, y resume las mejores prácticas de los escenarios de productos templates/components/business de negocio en el medio y de back office. Este proyecto también espera tu participación y [comentarios](https://github.com/adempiere/adempiere-vue/issues).

## Donar

Si encuentras útil este proyecto, puedes comprar un vaso de jugo para el autor :heart:
[Donar](/donate/)

## Soporte de navegadores

Navegadores modernos e Internet Explorer 10+.

<!-- prettier-ignore -->
| [<img class="no-margin" src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/edge/edge_48x48.png" alt="IE / Edge" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>IE / Edge | [<img class="no-margin" src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png" alt="Firefox" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Firefox | [<img class="no-margin" src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png" alt="Chrome" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Chrome | [<img class="no-margin" src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/safari/safari_48x48.png" alt="Safari" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Safari |
| --------- | --------- | --------- | --------- |
| IE10, IE11, Edge| últimas 2 versiones | últimas 2 versiones | últimas 2 versiones

## Ecosistema Vue

**En primer lugar, comprender las cosas en estos ecosistemas vue te ayudará a comenzar con este proyecto.**

1. [Vue Router](https://router.vuejs.org/) Vue Router es el enrutador oficial de Vue.js. Se integra profundamente con el núcleo de Vue.js para facilitar la creación de Aplicaciones de una sola página con Vue.js.

2. [Vuex](https://vuex.vuejs.org/) Vuex es un patrón de gestión de estado + biblioteca para aplicaciones Vue.js. Sirve como un almacén centralizado para todos los componentes de una aplicación, con reglas que aseguran que el estado solo pueda mutarse de manera predecible.

3. [Vue Loader](https://vue-loader.vuejs.org) Vue-loader es un cargador para webpack que permite crear componentes de Vue en un formato llamado Componentes de un solo archivo (SFCs). La combinación de webpack y vue-loader brinda un flujo de trabajo front-end moderno, flexible y extremadamente potente para la creación de aplicaciones Vue.js.

4. [Vue Server Renderer](https://ssr.vuejs.org/) Vue-server-renderer facilita la creación de aplicaciones JavaScript isomorfas o universales que se ejecutan tanto en el lado del servidor como del cliente, donde la mayoría del código de la aplicación se comparte y se reutiliza.

5. [Vue Test Utils](https://vue-test-utils.vuejs.org/) Vue Test Utils es la biblioteca de utilidad de prueba de unidad oficial para Vue.js.

6. [Vue Dev-Tools](https://github.com/vuejs/vue-devtools) Extensión de navegador devtools para depurar aplicaciones Vue.js.

7. [Vue CLI](https://cli.vuejs.org/) Vue CLI es un sistema completo para el rápido desarrollo de Vue.js. Su objetivo es ser la línea base de herramientas estándar para el ecosistema Vue. Asegura que las diversas herramientas de compilación funcionen sin problemas junto con valores predeterminados razonables para que pueda concentrarse en escribir tu aplicación en lugar de pasar días discutiendo con las configuraciones.

8. [Vetur](https://github.com/vuejs/vetur) Herramientas Vue para VS Code. Escribe vue essential plugins en VS Code.

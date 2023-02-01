<p align="center">
  <img width="320" src="https://wpimg.wallstcn.com/ecc53a42-d79b-42e2-8852-5126b810a4c8.svg">
</p>

<p align="center">
  <a href="https://github.com/vuejs/vue">
    <img src="https://img.shields.io/badge/vue-2.6.10-brightgreen.svg" alt="vue">
  </a>
  <a href="https://github.com/ElemeFE/element">
    <img src="https://img.shields.io/badge/element--ui-2.7.0-brightgreen.svg" alt="element-ui">
  </a>
  <a href="https://travis-ci.org/PanJiaChen/vue-element-admin" rel="nofollow">
    <img src="https://travis-ci.org/PanJiaChen/vue-element-admin.svg?branch=master" alt="Estado de Construcción">
  </a>
  <a href="https://github.com/PanJiaChen/vue-element-admin/blob/master/LICENSE">
    <img src="https://img.shields.io/github/license/mashape/apistatus.svg" alt="Licencia">
  </a>
  <a href="https://github.com/PanJiaChen/vue-element-admin/releases">
    <img src="https://img.shields.io/github/release/PanJiaChen/vue-element-admin.svg" alt="Liberación Github">
  </a>
  <a href="https://gitter.im/vue-element-admin/discuss">
    <img src="https://badges.gitter.im/Join%20Chat.svg" alt="Gitter">
  </a>
  <a href="https://panjiachen.github.io/vue-element-admin-site/donate">
    <img src="https://img.shields.io/badge/%24-donate-ff69b4.svg" alt="Donación">
  </a>
</p>

Español | [English](./README.md) | [简体中文](./README.zh-CN.md) | [日本語](./README.ja.md)

## Introducción

[vue-element-admin](https://panjiachen.github.io/vue-element-admin) es una interfáz de administración preparada para producción. Está basada en [vue](https://github.com/vuejs/vue) y usa [element-ui](https://github.com/ElemeFE/element) como conjunto de herramientas de interfáz de usuario.

Vue Element Admin es una solución práctica basada en la nueva plataforma de desarrollo de vue, construida con soporte a i18 para el manejo de múltiples lenguajes, plantillas estándares para aplicaciones de negocio y un conjunto de asombrosas características. Esta herramienta ayuda a construir largas y complejas Aplicacones de una sola página (SPA). Creo que lo que necesites hacer, este proyecto te ayudará.

- [Vista Prévia de la Aplicación](https://panjiachen.github.io/vue-element-admin)

- [Documentación](https://panjiachen.github.io/vue-element-admin-site/)

- [Canal de Gitter](https://gitter.im/vue-element-admin/discuss)

- [Para Donaciones](https://panjiachen.github.io/vue-element-admin-site/donate/)

- [Enlace de Wiki](https://github.com/PanJiaChen/vue-element-admin/wiki)

- [Canal de Gitee](https://panjiachen.gitee.io/vue-element-admin/)

- Plantilla base recomendada para usar: [vue-admin-template](https://github.com/PanJiaChen/vue-admin-template)
- Aplicación de Escritorio: [electron-vue-admin](https://github.com/PanJiaChen/electron-vue-admin)
- Plantilla de Typescript: [vue-typescript-admin-template](https://github.com/Armour/vue-typescript-admin-template) (Créditos: [@Armour](https://github.com/Armour))
- [awesome-project](https://github.com/PanJiaChen/vue-element-admin/issues/2312)

**Después de la versión `v4.1.0+`, la rama por defecto master no tendrá soporte para i18n. Por favor utilice la rama [i18n](https://github.com/PanJiaChen/vue-element-admin/tree/i18n), los cambios serán incluidos en la rama master**

**la versión actual es `v4.0+` construida con `vue-cli`. Si encuentra algún problema, por favor coloque un [issue](https://github.com/PanJiaChen/vue-element-admin/issues/new). Si desea usar la versión anterior, puede cambiar de rama a [tag/3.11.0](https://github.com/PanJiaChen/vue-element-admin/tree/tag/3.11.0), no relacionado con `vue-cli`**

**Este proyecto no está soportado para versiones antigüas de navegadores (ej. IE).**

## Preparación

Necesita instalar [node](https://nodejs.org/) y [git](https://git-scm.com/) localmente. El proyecto es basado en [ES2015+](https://es6.ruanyifeng.com/), [vue](https://cn.vuejs.org/index.html), [vuex](https://vuex.vuejs.org/zh-cn/), [vue-router](https://router.vuejs.org/zh-cn/), [vue-cli](https://github.com/vuejs/vue-cli) , [axios](https://github.com/axios/axios) and [element-ui](https://github.com/ElemeFE/element), toda la solicitud de datos simulada se realiza a través de [Mock.js](https://github.com/nuysoft/Mock).
Entendiendo y aprendiendo esto pudiera ayudarle con su proyecto.

[![Edit on CodeSandbox](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/github/PanJiaChen/vue-element-admin/tree/CodeSandbox)

<p align="center">
  <img width="900" src="https://wpimg.wallstcn.com/a5894c1b-f6af-456e-82df-1151da0839bf.png">
</p>

## Patrocinantes

Sea un patrocinante y coloque su logo en nuestro LEEME en GitHub con un enlace directo a su sitio web. [[Se un Patrocinante]](https://www.patreon.com/panjiachen)

### Akveo
<a href="https://store.akveo.com/products/vue-java-admin-dashboard-spring?utm_campaign=akveo_store-Vue-Vue_demo%2Fgithub&utm_source=vue_admin&utm_medium=referral&utm_content=github_banner"><img width="500px" src="https://raw.githubusercontent.com/PanJiaChen/vue-element-admin-site/master/docs/.vuepress/public/images/vue-java-banner.png" /></a><p>Get Java backend for Vue admin with 20% discount for 39$ use coupon code SWB0RAZPZR1M
</p>

### Flatlogic

<a href="https://flatlogic.com/admin-dashboards?from=vue-element-admin"><img width="150px" src="https://wpimg.wallstcn.com/9c0b719b-5551-4c1e-b776-63994632d94a.png" /></a><p>Admin Dashboard Templates made with Vue, React and Angular.</p>

## Características

```
- Iniciar / Cerrar Sesión

- Permisos de Autenticación
  - Página de Permisos
  - Directivas de permisos
  - Página de configuración de permisos
  - Autenticación por dos pasos

- Construcción Multi-entorno
  - Desarrollo (dev)
  - sit
  - Escenario de pruebas (stage),
  - Producción (prod)

- Características Globales
  - I18n
  - Temas dinámicos
  - Menu lateral dinámico (soporte a rutas multi-nivel)
  - Barra de rutas dinámica
  - Tags-view (Pestañas de página, Soporta operación de clic derecho)
  - Svg Sprite
  - Datos de simulación con Mock
  - Pantalla completa
  - Menu lateral responsivo

- Editor
  - Editor de Texto Enriquecido
  - Editor Markdown
  - Editor JSON

- Excel
  - Exportación a Excel
  - Carga de Excel
  - Visualización de Excel
  - Exportación como ZIP

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

- Ejemplo Avanzado
- Registro de Errores
- Tablero de indicadores
- Página de Guías
- ECharts (Gráficos)
- Portapapeles
- Convertidor de Markdown a HTML
```

## Iniciando

```bash
# clone el proyecto
git clone https://github.com/PanJiaChen/vue-element-admin.git

# vaya al directorio clonado
cd vue-element-admin

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

Vaya a [Documentación](https://panjiachen.github.io/vue-element-admin-site/guide/essentials/deploy.html) para mayor información

## Registro de Cambios

Los cambios detallados por cada liberación se encuentran en [notas de liberación](https://github.com/PanJiaChen/vue-element-admin/releases).

## Demostración en línea

[Vista Prévia de la Aplicación](https://panjiachen.github.io/vue-element-admin)

## Donación

Si este proyecto es de mucha ayuda para ti, puedes comprarle al autor un vaso de jugo :tropical_drink:

![Donar](https://wpimg.wallstcn.com/bd273f0d-83a0-4ef2-92e1-9ac8ed3746b9.png)

[dona por Paypal](https://www.paypal.me/panfree23)

[Comprame un Café](https://www.buymeacoffee.com/Pan)

## Navegadores Soportados

Navegadores modernos e Internet Explorer 10+.

| [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/edge/edge_48x48.png" alt="IE / Edge" width="24px" height="24px" />](https://godban.github.io/browsers-support-badges/)</br>IE / Edge | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png" alt="Firefox" width="24px" height="24px" />](https://godban.github.io/browsers-support-badges/)</br>Firefox | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png" alt="Chrome" width="24px" height="24px" />](https://godban.github.io/browsers-support-badges/)</br>Chrome | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/safari/safari_48x48.png" alt="Safari" width="24px" height="24px" />](https://godban.github.io/browsers-support-badges/)</br>Safari |
| --------- | --------- | --------- | --------- |
| IE10, IE11, Edge | últimas 2 versiones | últimas 2 versiones | últimas 2 versiones |

## Licencia

[MIT](https://github.com/PanJiaChen/vue-element-admin/blob/master/LICENSE)

Copyright (c) 2017-presente PanJiaChen

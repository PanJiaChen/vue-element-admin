# New <Badge text="v4.0.0+"/>

In daily work, the most common is to write modules and business components. When you open a new `view` or `component` every time you need to manually create a new `.vue`, create a `<template>`, `<script>`, `<style>`, or some problem.

So in the new version, based on [plop](https://github.com/amwmedia/plop), several basic templates are provided to facilitate the creation of the new `view` or`component`.

Execute the following command:

```bash
npm run new
```

![plop](https://adempiere-vue.gitee.io/gitee-cdn/adempiere-vue-site/5f8ea239-aaa5-4e91-9d09-ed56b33a110d.gif)

As shown in the previous gif, it is easy to generate the basic code snippet I want by simply pressing Enter several times. This is just a demonstration, you can customize the template according to your needs.

For additional template requirements, you can create a custom template by following the `plop` documentation and going to the `plop-templates` directory.

In fact, this feature is similar to what snippets do. If you think the configuration is too complicated, you can install a code fragment based on VSCode such as [Vue 2 Snippets](https://marketplace.visualstudio.com/items?itemName=hollowtree.vue-snippets).

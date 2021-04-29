## Style Guide

The style guide for this project is mainly based on the official [style guide](https://vuejs.org/v2/style-guide/index.html) . It is recommended to read the guide before you start using the project, which will help you write more standardized and unified code. Most of these rules are also configured in [eslint-plugin-vue](https://github.com/vuejs/eslint-plugin-vue). When the rules are not followed, will throw an error. For details, see [eslint](./eslint.md) section.

Of course, there are some special specifications that cannot be verified by eslint. You need to pay attention to yourself and follow. The most important thing is the naming rules for files. Take the example of `adempiere-vue` here.

## Component

All `Component` files start with uppercase (PascalCase), which is also official [recommended](https://vuejs.org/v2/style-guide/index.html#Single-file-component-filename-casing-strongly-recommended)。

But except for `index.vue`.

Example:

- `@/components/BackToTop/index.vue`
- `@/components/Charts/Line.vue`
- `@/views/example/components/Button.vue`

## JS files

All `.js` files follow `kebab-case`.

Example:

- `@/utils/open-window.js`
- `@/views/svg-icons/require-icons.js`
- `@/components/MarkdownEditor/default-options.js`

## Views

Under the `views` file, the `.vue` files representing the routes path all use `kebab-case`, and the same rules are used for folders.

Example:

- `@/views/svg-icons/index.vue`
- `@/views/svg-icons/require-icons.js`

The use of a kebab-case to name `views` is mainly due to the following considerations.

- `kebab-case` is also one of the officially recommended naming conventions [Document](https://vuejs.org/v2/style-guide/index.html#Single-file-component-filename-casing-strongly-recommended)
- The `.vue` file under `views` represents a route, so it needs to be distinguished from `component` (components are `PascalCase`)
- The `url` of the page is follow `kebab-case` , such as `https://www.xxx.admin/export-excel`. So the `view` corresponding to the route should be kept uniform.
- No case sensitive issues

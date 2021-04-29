# ESLint

Whether it's a multi-person collaboration or personal projects, code specifications are important. It can not only avoids basic syntax errors, but also ensures the readability of the code.

## Config

All configuration files are in [.eslintrc.js](https://github.com/adempiere/adempiere-vue/blob/master/.eslintrc.js).
The basic eslint rules of this project is based on the official eslint rules of vue [eslint-config-vue](https://github.com/vuejs/eslint-config-vue) but made minor changes. You can customize your configuration according to your needs.

Such as: my personal or project team is accustomed to using two spaces, but you may feel that the four spaces are more pleasing, and you can make the following changes.

Enter the project of `.eslintrc.js`, find `indent`,and then set it to `4` 。There are a variety of configuration information, see details [ESLint Document](https://eslint.org/docs/rules/)。

After [v3.8.1](https://github.com/adempiere/adempiere-vue/releases/tag/v3.8.1), [eslint-plugin-vue](https://github.Com/vuejs/eslint-plugin-vue) has been added to better verify vue related code.

By default, the most restrictive config `plugin:vue/recommended` is used to verify the code. If you think it is too strict, you can modify it yourself.

```js
// https://github.com/adempiere/adempiere-vue/blob/master/.eslintrc.js

module.exports = {
  extends: ['plugin:vue/recommended', 'eslint:recommended']
  //You can change it to  extends: ['plugin:vue/essential', 'eslint:recommended']
}
```

## Cancel ESLint

If you don't want to use ESLint (not recommended for cancellation), just find the [vue.config.js](https://github.com/adempiere/adempiere-vue/blob/master/vue.config.js) file.
Make the following settings `lintOnSave: false`.

## Configure ESLint in vscode

Sharp tools make good work! Personally recommend eslint+vscode to write VUE, there is definitely a very cool
![eslintGif.gif](https://adempiere-vue.gitee.io/gitee-cdn/adempiere-vue-site/e94a76df-6dc0-4c15-9785-28b553a163e9.png)

<br/>

Every time you save your code, vscode will be able to mark red areas that do not conform to the eslint rules, and make some simple self-fixes at the same time. The installation steps are as follows:

First install the eslint plugin
![eslint1.png](https://adempiere-vue.gitee.io/gitee-cdn/adempiere-vue-site/72f126cb-09eb-4b27-b02e-65e79eb76220.png)

After we have installed ESLint, we back to VSCode to set up . Go to `Code` > `Preferences` > `Settings` and add the following configuration.

```json
{
  "files.autoSave": "off",
  "eslint.validate": [
    "javascript",
    "javascriptreact",
    "vue-html",
    {
      "language": "vue",
      "autoFix": true
    }
  ],
  "eslint.run": "onSave",
  "eslint.autoFixOnSave": true
}
```

Everyone and the team have their own code specification, unification is good, to create their own eslint rules and upload it to the npm will be fun. Such as ElemeFE [config](https://www.npmjs.com/package/eslint-config-elemefe) or Vue official [config](https://github.com/vuejs/eslint-config-vue).

[vscode plugin and configuration recommendations](https://github.com/varHarrie/Dawn-Blossoms/issues/10)

## More configuration

Since this project is built based on `vue-cli`, more configuration can be found in the official [documentation](https://cli.vuejs.org/en/config/#lintonsave)

## Auto fix

```bash
npm run lint -- --fix
```

Running the above command, eslint will automatically fix some simple errors.

## 环境变量

`adempiere-vue` 4.0 之后是基于 `vue-cli`来进行构建，所以所有的环境变量配置都是基于`vue-cli`来实现和控制的。

[官方文档](https://cli.vuejs.org/zh/guide/mode-and-env.html)

```
.env                # 在所有的环境中被载入
.env.[mode]         # 只在指定的模式中被载入
```

一个环境文件只包含环境变量的“键=值”对：

```
FOO=bar
VUE_APP_SECRET=secret
```

::: tip 注意！！！
环境变量必须以`VUE_APP_`为开头。如:`VUE_APP_API`、`VUE_APP_TITLE`

你在代码中可以通过如下方式获取:

```js
console.log(process.env.VUE_APP_xxxx)
```

:::

除了 `VUE_APP_*` 变量之外，在你的应用代码中始终可用的还有两个特殊的变量：

- `NODE_ENV` - 会是 "development"、"production" 或 "test" 中的一个。具体的值取决于应用运行的模式。
- `BASE_URL` - 会和 `vue.config.js` 中的 `publicPath` 选项相符，即你的应用会部署到的基础路径。

### 构建相关

除了一些写在`.env`的环境变量之外，还有一些构建和部署相关的变量都是需要在`vue.config.js`中配置的。

你可以通过`process.env.NODE_ENV`来执行判断环境，来设置不同的参数。

具体代码可借鉴[vue.config.js](https://github.com/adempiere/adempiere-vue/blob/master/vue.config.js)

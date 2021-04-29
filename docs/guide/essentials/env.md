## Environment Variables

`adempiere-vue` 4.0+ is built o `vue-cli`, so all environment variables are controlled based on `vue-cli`.

[Official document](https://cli.vuejs.org/guide/mode-and-env.html)

```
.env                # loaded in all cases
.env.[mode]         # only loaded in specified mode
```

An env file simply contains key=value pairs of environment variables:

```
FOO=bar
VUE_APP_SECRET=secret
```

::: tip note! ! !
Environment variables must start with `VUE_APP_`. Such as: `VUE_APP_API`, `VUE_APP_TITLE`

You can access them in your application code:

```js
console.log(process.env.VUE_APP_xxxx)
```

:::

In addition to `VUE_APP_*` variables, there are also two special variables that will always be available in your app code:

- `NODE_ENV` - this will be one of "development"、"production" or "test" depending on the mode the app is running in.
- `BASE_URL` - this corresponds to the `publicPath` option in `vue.config.js` and is the base path your app is deployed at.

### Build related

In addition to some environment variables written in `.env`, there are some build and deployment related variables that need to be configured in `vue.config.js`.

You can set the different parameters by executing the judgment environment with `process.env.NODE_ENV`.

Specific code can learn from [vue.config.js](https://github.com/adempiere/adempiere-vue/blob/master/vue.config.js)

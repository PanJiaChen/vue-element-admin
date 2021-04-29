# Svgo <Badge text="v3.9.0+"/>

This project provides svg compression processing optimization. Based on [svgo](https://github.com/svg/svgo).

```bash
npm run svgo
```

Many online downloads or svg exported by `Sketch` will have a lot of redundant and useless information, greatly increasing the size of svg. We can optimize it with `svgo`. For example, the following figure is an svg exported by `Sketch`
![](https://adempiere-vue.gitee.io/gitee-cdn/adempiere-vue-site/333edb6b-4b95-42f8-aa60-b8f42e516b52.jpg)

We can execute `npm run svgo`

![](https://adempiere-vue.gitee.io/gitee-cdn/adempiere-vue-site/e7b1324e-cd67-4306-aebf-f659bcc433cf.jpg)

![](https://adempiere-vue.gitee.io/gitee-cdn/adempiere-vue-site/006c4bb5-b2d1-447d-a1c9-a912cf5dee47.jpg)

Useless information is processed.

More detailed configuration can be configured in `/src/icons/svgo.yml`.

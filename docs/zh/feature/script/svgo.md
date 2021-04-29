# Svgo <Badge text="v3.9.0+"/>

本项目提供了 svg 压缩处理优化功能。基于 [svgo](https://github.com/svg/svgo)实现。

```bash
npm run svgo
```

我们很多网上下载或者 `Sketch` 导出的 svg 会有很多冗余无用的信息，大大的增加了 svg 的尺寸，我们可以使用 `svgo` 对它进行优化。比如下图是用 `Sketch` 导出的一个 svg

![](https://adempiere-vue.gitee.io/gitee-cdn/adempiere-vue-site/333edb6b-4b95-42f8-aa60-b8f42e516b52.jpg)

我们可以执行`npm run svgo`

![](https://adempiere-vue.gitee.io/gitee-cdn/adempiere-vue-site/e7b1324e-cd67-4306-aebf-f659bcc433cf.jpg)

![](https://adempiere-vue.gitee.io/gitee-cdn/adempiere-vue-site/006c4bb5-b2d1-447d-a1c9-a912cf5dee47.jpg)

无用的信息都被处理掉了。

更多详细的配置 可以在 `/src/icons/svgo.yml`中进行配置。

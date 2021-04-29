# Node Sass to Dart Sass

在 `v4.3.0`之前本项目都是基于`node-sass`进行构建的，但`node-sass`底层依赖 [libsass](https://github.com/sass/libsass)，导致很多用户安装的特别的困难，尤其是 windows 用户，它强制用户在`windows`环境中必须安装`python2`和`Visual Studio`才能编译成功。

所以为了解决这个问题，本项目在 [v4.3.0](https://github.com/adempiere/adempiere-vue/pull/3040)修改为`dart-sass`进行构建，它能在保证性能的前提下大大简化用户的安装成本。通过这个 [issue](https://github.com/adempiere/adempiere-vue/issues?q=is%3Aissue+is%3Aopen+sort%3Aupdated-desc)下面相关的评论就可以知道，安装 `node-sass` 是多么麻烦的一件事。

这里选择使用`dart-sass`还有一个更主要的原因，`sass`官方已经将`dart-sass`作为未来主要的的开发方向了，有任何新功能它都是会优先支持的，而且它已经在社区里稳定运行了很长的一段时间，基本没有什么坑了。`dart-sass`之所以容易安装，主要是因为它会被编译成纯 js，这样就可以直接在的 node 环境中使用。虽然这样它的运行速度会比基于 [libsass](https://github.com/sass/libsass)的慢一些些，但这些速度的差异几乎可以忽略不计。整个社区现在都在拥抱`dart-sass`，我们没有理由拒绝！而且它的确大大简化了用户的安装成本。

目前`vue-cli`在选择`sass`预处理的时候也会默认优先使用`dart-scss`，相关 [pr](https://github.com/vuejs/vue-cli/pull/3321)

相关的说明可以见该篇文章： [Announcing Dart Sass](https://sass-lang.com/blog/announcing-dart-sass)

具体 `dart-sass`性能评测可见：[Perf Report](https://github.com/sass/dart-sass/blob/master/perf.md)

## 升级方案

升级也非常的简单，只需要两个步骤

```bash
npm uninstall node-sass

npm install sass -S -D
```

具体可见该： [Pull Request](https://github.com/adempiere/adempiere-vue/pull/3040)

## 不兼容

替换 `node-sass` 之后有一个地方需要注意，就是它不再支持之前 `sass` 的那种 `/deep/` 写法，需要统一改为 `::v-deep` 的写法。相关： [issue](https://github.com/vuejs/vue-cli/issues/3399)

具体 demo：

```css
.a {
  /deep/ {
    .b {
      color: red;
    }
  }
}

/* 修改为 */
.a {
  ::v-deep {
    .b {
      color: red;
    }
  }
}
```

不管你是否使用`dart-sass`，我都是建议你使用`::v-deep`的写法，它不仅兼容了 css 的`>>>`写法，还兼容了 sass `/deep/`的写法。而且它还是 [vue 3.0 RFC](https://github.com/vuejs/rfcs/blob/scoped-styles-changes/active-rfcs/0023-scoped-styles-changes.md) 中指定的写法。

而且原本 `/deep/` 的写法也本身就被 Chrome 所废弃，你现在经常能在控制台中发现 Chrome 提示你不要使用`/deep/`的警告。

更多： [scope css 写法](https://vue-loader.vuejs.org/zh/guide/scoped-css.html#%E6%B7%B7%E7%94%A8%E6%9C%AC%E5%9C%B0%E5%92%8C%E5%85%A8%E5%B1%80%E6%A0%B7%E5%BC%8F)

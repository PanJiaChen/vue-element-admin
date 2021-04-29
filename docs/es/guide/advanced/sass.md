# Node Sass to Dart Sass

Before `v4.3.0`, this project was built based on `node-sass`, but `node-sass` low-level dependencies [libsass](https://github.com/sass/libsass), resulting in many users installing Especially difficult for Windows users, it forces users to install `python2` and `Visual Studio` in the `windows` environment to compile successfully.

So in order to solve this problem, this project was modified to build `dart-sass` in [v4.3.0](https://github.com/adempiere/adempiere-vue/pull/3040), it can guarantee performance Under the premise of greatly simplifying the user's installation costs. Through this [issue](https://github.com/adempiere/adempiere-vue/issues?q=is%3Aissue+is%3Aopen+sort%3Aupdated-desc) the relevant comments below can be known, install` Node-sass is such a troublesome thing.

There is a more important reason for choosing to use dart-sass here. Officially, `sass` has taken dart-sass as the main development direction in the future. Any new features will be supported first, and it It has been running steadily in the community for a long time, and there are basically no pits. The main reason why dart-sass is easy to install is because it will be compiled into pure js, so that it can be used directly in the node environment. Although its running speed will be slower than that based on [libsass](https://github.com/sass/libsass), the difference in these speeds is almost negligible. The entire community is now embracing `dart-sass`, and we have no reason to refuse! And it does greatly simplify the user's installation costs.

Currently, `vue-cli` will also prefer to use `dart-scss` by default when selecting `sass` preprocessing, related: [pr](https://github.com/vuejs/vue-cli/pull/3321)

Related instructions can be found in this article: [Announcing Dart Sass](https://sass-lang.com/blog/announcing-dart-sass)

Specific `dart-sass` performance evaluation can be seen: [Perf Report](https://github.com/sass/dart-sass/blob/master/perf.md)

## Upgrade plan

The upgrade is also very simple, requiring only two steps

```bash
npm uninstall node-sass

npm install sass -S -D
```

The upgrade can also be seen in detail: [Pull Request](https://github.com/adempiere/adempiere-vue/pull/3040) is simple and only requires two steps

## Not compatible

One thing to note after replacing `node-sass` is that it no longer supports the `/deep/` writing style of `sass` before, and it needs to be changed to the writing style of `::v-deep`. Related: [issue](https://github.com/vuejs/vue-cli/issues/3399)

Concrete demo:

```css
.a {
  /deep/ {
    .b {
      color: red;
    }
  }
}

/* change into */
.a {
  ::v-deep {
    .b {
      color: red;
    }
  }
}
```

Regardless of whether you use `dart-sass` or not, I suggest you use `::v-deep` notation, which is not only compatible with the css `>>>` notation, but also compatible with sass `/deep/` . And it's the way of writing specified in [vue 3.0 RFC](https://github.com/vuejs/rfcs/blob/scoped-styles-changes/active-rfcs/0023-scoped-styles-changes.md).

And the original writing of `/deep/` itself was abandoned by Chrome. You can often find a warning in the console that Chrome reminds you not to use `/deep/`.

More: [scope css writing](https://vue-loader.vuejs.org/guide/scoped-css.html)

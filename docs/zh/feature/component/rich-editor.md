# 富文本

富文本是管理后台一个核心的功能，但同时又是一个有很多坑的地方。在选择富文本的过程中我也走了不少的弯路，市面上常见的富文本都基本用过了，最终权衡了一下选择了[Tinymce](https://github.com/tinymce/tinymce)。

这里在简述一下推荐使用 tinymce 的原因：tinymce 是一家老牌做富文本的公司(这里也推荐 ckeditor，也是一家一直做富文本的公司，新版本很不错)，它的产品经受了市场的认可，不管是文档还是配置的自由度都很好。在使用富文本的时候有一点也很关键就是复制格式化，之前在用一款韩国人做的富文本 summernote 被它的格式化坑的死去活来，但 tinymce 的去格式化相当的好，它还有一些增值服务(付费插件)，最好用的就是`powerpaste`，非常的强大，支持从 word 里面复制各种东西，而且还帮你顺带格式化了。富文本还有一点也很关键，就是拓展性。楼主用 tinymce 写了好几个插件，学习成本和容易度都不错，很方便拓展。最后一点就是文档很完善，基本你想得到的配置项，它都有。tinymce 也支持按需加载，你可以通过它官方的 build 页定制自己需要的 plugins。

## 常见富文本

我再来分析一下市面上其它的一些富文本：

- **[summernote](https://github.com/summernote/summernote)** 先来说一个我绝对不推荐的富文本。这是一个韩国人开源的富文本(当然不推荐的理由不是因为这个)，它对很多富文本业界公认的默认行为理解是反其道而行的，而且只为用了一个 dialog 的功能，引入了 bootstrap，一堆人抗议就是不改。格式化也是差劲。。反正不要用！不要用！不要用！

- **[ckeditor](https://github.com/galetahub/ckeditor)** ckeditor 也是一家老牌做富文本的公司，楼主旧版后台用的就是这个，今年也出了 5.0 版本，ui 也变美观了不少，相当的不错，而且它号称是插件最丰富的富文本了。推荐大家也可以试用一下。

- **[quill](https://github.com/quilljs/quill)** 也是一个非常火的富文本，长相很不错。基于它写插件也很简单，api 设计也很简单。楼主不选择它的原因是它对图片的各种操作不友善，而且很难改。如果对图片没什么操作的用户，推荐使用。

- **[medium-_editor_](https://github.com/yabwe/medium-editor)** 大名鼎鼎的 medium 的富文本(非官方出品)，但完成度还是很不错，拓展性也不错。不过我觉得大部分用户还是会不习惯 medium 这种写作方式的。

- **[squire](https://github.com/neilj/Squire)** 一个比较轻量的富文本，压缩完才 11.5kb，相对于其它的富文本来说是非常的小了，推荐功能不复杂的建议使用。

- **[wangEditor](https://github.com/wangfupeng1988/wangEditor)** 一个国人写的富文本，用过感觉还是不错的。不过毕竟是个人的，不像专门公司做富文本的，配置型和丰富性不足。前端几大禁忌就有富文本 [为什么都说富文本编辑器是天坑?](https://www.zhihu.com/question/38699645)，不过个人能做成这样子很不容易了。

- **[百度 UEditor](http://ueditor.baidu.com/website/index.html)** 没有深入使用过，只在一个 angular1X 的项目简单用过，不过说着的 ui 真的不好看，不符合当今审美了，官方也已经很久没更新过了。

- **[slate](https://github.com/ianstormtaylor/slate)** 是一个 完全 可定制的富文本编辑框架。通过 Slate，你可以构建出类似 Medium、Dropbox Paper 或者 Canvas 这样使用直观、富交互、体验业已成为 Web 应用标杆的编辑器。同时，你也无需担心在代码实现上陷入复杂度的泥潭之中。看起来很酷，以后有机会我会在项目中实践试用一下。

楼主列举了很多富文本但并没有列举任何 vue 相关的富文本，主要是因为富文本真的比想象中复杂，在前面的文章里也说过了，其实用 vue 封装组件很方便的，没必要去用人家封装的东西。什么 vue-quill vue-editor 这种都只是简单包了一层，没什么难度的。还不如自己来封装，灵活性可控性更强一点。还有一点基于 vue 真没什么好的富文本，不像 react 有 facebook 出的 [draft-js](https://github.com/facebook/draft-js)，ory 出的 [editor](https://github.com/ory/editor)，这种大厂出的产品。

当然你也可以选择一些付费的富文本编辑器，作者自己公司里面有一个项目就使用了 [froala-editor](https://www.froala.com/wysiwyg-editor) 这款编辑器。不管是美观和易用性都是不错的，公司买的是专业版，一年也就 `$349` ，价格也是很合理的，但其实省去的程序员开发成本可能远不止这个价钱。

## Tinymce

这里来简单讲一下在自己项目中使用 `Tinymce` 的方法。

:::warning 已废弃
目前采用全局引用的方式。代码地址：`static/tinymce` (static 目录下的文件不会被打包), 在 `index.html` 中引入。并确保它的引入顺序在你的`app.js`之前！
:::

<Badge text="v4.2.0+"/> 之后改用了异步加载 CDN 的引入方式。

如果想修改 cdn 地址或者 tinymce 的版本只需在 [@/components/Tinymce](https://github.com/adempiere/adempiere-vue/blob/master/src/components/Tinymce/index.vue) 中找到 tinymce 的 cdn 地址进行修改就可以了。它会通过`dynamicLoadScript`自动注入的 `index.html` 中。

> 由于目前使用 npm 安装 `Tinymce` 方法比较复杂而且还有一些问题(日后可能会采用该模式)且会大大增加编译的时间所以暂时不准备采用。:space_invader:

**使用:**
由于富文本不适合双向数据流，所以只会 watch 传入富文本的内容一次变化，之后传入内容的变化就不会再监听了，如果之后还有改变富文本内容的需求。

可以通过 `this.refs.xxx.setContent()` 手动来设置。

源码也很简单，有任何别的需求都可以在 [@/components/Tinymce](https://github.com/adempiere/adempiere-vue/blob/master/src/components/Tinymce) 中自行修改。

```html
<tinymce :height="300" v-model="content" id='tinymce'></tinymce>
```

目前提供了如下几个属性，有需求可自行添加，或者提 issue。

| Property |         Description         |      Type      |                 Default                  |
| :------: | :-------------------------: | :------------: | :--------------------------------------: |
|    id    | Component unique identifier |     String     | Default to help you generate a unique id |
|  value   |      Rich text content      |     String     |        Only monitor changes once         |
| toolbar  |      Rich text toolbar      |     Array      |                    []                    |
| menubar  |      Rich text menubar      |     String     |   'file edit insert view format table'   |
|  height  |      Rich text height       |     Number     |                   360                    |
|  width   |       Rich text width       | Number, String |                    /                     |

## tinymce-vue

tinymce 官方也在之前发布了 vue 版本的[tinymce-vue](https://github.com/tinymce/tinymce-vue)，帮你封装好了很多东西，但同时也相对的减少了灵活性，有兴趣的可以自行研究一下。

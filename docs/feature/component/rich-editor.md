# Rich text editor

Rich text editor is a core part of management system, but at the same time is a place with lots of problems. In the process of selecting rich texts, I also walked a lot of detours. The common rich text editors in the market are basically used, and the finally chose [Tinymce](https://github.com/tinymce/tinymce).

Here is a brief introduction to the reasons why `tinymce` is recommended: `tinymce` is a veteran to do rich text company(Here also recommended `ckeditor`, is also a company that has been doing rich text, the new version is very good), its products have stood the test of the market, and it has detailed documentation and rich configuration. One of the keys to using rich text is to copy formatting. Before using a Korean text rich `summernote`, It wasted me a lot of time, very unfriendly. But `tinymce`'s formatting is pretty good. It also has a value-added feature is powerpaste, it is extremely powerful, support for copying everything from word or any other place. Extensibility is also critical for rich text. I use `tinymce` to write several plug-ins, learning costs and ease of study are good, and very easy to expand. The last point is that the documentation is very good, basically you want to get the configuration item, it has. Tinymce also supports on-demand loading, you can customize plugins through its official build page.

Let me analyze some of the other rich texts on the market:

- **[summernote](https://github.com/summernote/summernote)** Let me start with a rich text that I definitely would not recommend.It is inconsistent with many recognized default behaviors between others. And only for the use of a dialog feature, they import the bootstrap, A bunch of people protest. Formatting is also very bad. Do not use anyway! Do not use it! Do not use it!

- **[ckeditor](https://github.com/galetahub/ckeditor)** Ckeditor is also a veteran company to do rich text,
  I used to use it in company project.This year, the 5.0 version of the UI has also become more beautiful, quite good, and it has the richest plugins. It's recommended that you try it.

- **[quill](https://github.com/quilljs/quill)** Is also a very hot rich text, the skin is very elegant. Writing a plug-in based on it is also very simple. The API design is very cool. The reason I did not choose it was because it was not good for operation picture and was hard to change. If there is no operation of the picture of the user, it is recommended.

- **[medium-_editor_](https://github.com/yabwe/medium-editor)** The famous medium rich text (unofficial produced), but the degree of completion is still not very good, scalability is not bad. However, I think most users still will not be used medium this way of writing.

- **[Squire](https://github.com/neilj/Squire)** A relatively light, rich text, compressed only 11.5kb, relative to other rich text is very small, recommended features is not complicated suggestion.

- **[UEditor](http://ueditor.baidu.com/website/index.html)** Not used in depth, only a simple project used in the angular1X, but ui really ugly, does not meet the aesthetic today, the official has also been a long time did not go with the new.

- **[slate](https://github.com/ianstormtaylor/slate)** A completely customizable framework for building rich text editors. Slate lets you build rich, intuitive editors like those in Medium, Dropbox Paper or Google Docs—which are becoming table stakes for applications on the web—without your codebase getting mired in complexity. Looks cool, after a chance I will practice in the project try it.

I listed a lot of rich text, but I didn't list any rich text related to vue, mainly because rich text is really more complex than thought. Also said in the previous article, in fact, encapsulation vue components is very convenient, there is no need to use someone else's package of things.
What kind of vue-quill vue-editor is just a simple package, no difficulty. You might as well encapsulate it yourself, and be a little more flexible and controllable. In addition vue really doesn't have any good rich text, unlike react has [draft](https://github.com/facebook/draft-js) produced by facebook, [editor](https://github.com/ory/editor) produced by ory. Vue doesn't have this product from a big company.

Of course, you can also choose some paid rich text editor, the author's own company has a project in the use of the [froala-editor](https://www.froala.com/wysiwyg-editor). Whether it is beautiful and easy to use are good, the company bought a professional version, $ 349 a year, the price is also very reasonable, but in fact save the cost of developer development may go far beyond the price.

## Tinymce

Here to briefly talk about the use of Tinymce in you own projects.

:::warning Deprecated
The current method of using the global reference. Code in: `static/tinymce` (The files in the static directory will not be build by webpack), import in index.html .And make sure it's in the order before your `app.js`!
:::

After <Badge text="v4.2.0+"/> will dynamic import tinymce by `CDN` .

If you want to change the cdn address or the version of tinymce, just find tinymce cdn in [@/components/Tinymce](https://github.com/adempiere/adempiere-vue/blob/master/src/components/Tinymce/index.vue) then modified it. It will be automatically injected into `index.html` via `dynamicLoadScript`.

> The current use of the npm installation 'Tinymce' method is more complex and has some problems (which may be used in the future). :space_invader:

**Usage**
Because rich text is not suitable for two-way data, so only watch the content changes once, and then will not be watch again. If later you need to change the rich text content.Can be set by `this.refs.xxx.setContent ()`.

The source code is also very simple, any other needs can be modified in `@/components/Tinymce/index.vue`.

```html
<tinymce :height="300" v-model="content" id='tinymce'></tinymce>
```

At present, the following attributes are provided, and there are requirements that can be added by themselves or an issue.

| Property |         Description         |     Type      |                 Default                  |
| :------: | :-------------------------: | :-----------: | :--------------------------------------: |
|    id    | Component unique identifier |    String     | Default to help you generate a unique id |
|  value   |      Rich text content      |    String     |        Only monitor changes once         |
| toolbar  |      Rich text toolbar      |     Array     |                    []                    |
| menubar  |      Rich text menubar      |    String     |   'file edit insert view format table'   |
|  height  |      Rich text height       |    Number     |                   360                    |
|  width   |       Rich text width       | Number String |                    /                     |

## tinymce-vue

The tinymce official also released the vue version of [tinymce-vue](https://github.com/tinymce/tinymce-vue), which has helped you package a lot of things, but at the same time it has reduced flexibility. If you are interested, you can study it by yourself.

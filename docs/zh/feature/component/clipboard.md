# Clipboard

这里的复制粘贴使用了 [clipboard](https://github.com/zenorocha/clipboard.js)

本项目提供了两种使用方式

## 直接使用

```html
<el-button @click='handleCopy(inputData,$event)'>copy</el-button>
```

```js
import clip from '@/utils/clipboard' // use clipboard directly

methods: {
  handleCopy(text, event) {
    clip(text, event)
  }
}
```

首先引入封装好的 `clipboard` ,设置 `click` function。

`clip()` 函数第一个参数为复制的内容，第二个参数为 `event` 事件。两个参数均为必填项。

<br/>
<br/>

## 指令形式使用

本项目同时也封装了一个通过 `directives` 的方式来使用 `clipboard`。

```html
 <el-button v-clipboard:copy='inputData' v-clipboard:success='clipboardSuccess'>copy</el-button>
```

```js
import clipboard from '@/directive/clipboard/index.js' // use clipboard by v-directive

directives: {
  clipboard
},
methods: {
  clipboardSuccess() {
    this.$message({
      message: '复制成功',
      type: 'success',
      duration: 1500
    })
  }
}
```

`v-clipboard:copy` 为复制的内容，`v-clipboard:success` 为成功之后的回调。

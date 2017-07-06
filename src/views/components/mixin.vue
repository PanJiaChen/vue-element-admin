<template>
  <div class="components-container">
    <div class='component-item'>
      <md-input name="name" v-model="title" required :maxlength="100">
        标题
      </md-input>
      <code class='code-part'>Material Design 的input</code>
    </div>

    <div class='component-item'>
      <pan-thumb image='https://wpimg.wallstcn.com/577965b9-bb9e-4e02-9f0c-095b41417191'>
        上海花裤衩
      </pan-thumb>
      <code class='code-part'>图片hover效果</code>
    </div>

    <div class='component-item'>
      <el-button v-waves type="primary">水波纹效果</el-button>
      <code class='code-part'>水波纹 v-directive</code>
    </div>
  </div>
</template>

<script>
  import MdInput from 'components/MDinput';
  import PanThumb from 'components/PanThumb';

  export default {
    components: { MdInput, PanThumb },
    data() {
      return {
        title: ''
      }
    }
  };
</script>

<style scoped>
.component-item{
  margin-top: 100px;
}
.code-part{
  margin-top: 20px;
}
</style>

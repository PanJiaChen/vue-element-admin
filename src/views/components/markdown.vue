<template>
  <div class="components-container">
    <code>公司做的后台主要是一个cms系统，公司也是以自媒体为核心的，所以富文本是后台很核心的功能。在选择富文本的过程中也走了不少的弯路，市面上常见的富文本都基本用过了，最终选择了tinymce</code>
    <div class="editor-container">
      <MdEditor  id='contentEditor' ref="contentEditor" v-model='content' :height="300" :zIndex='20'></MdEditor>
    </div>
    <el-button @click='markdown2Html' style="margin-top:80px;" type="primary">转为HTML<i class="el-icon-document el-icon--right"></i></el-button>
    <div v-html="html"></div>
  </div>
</template>
<script>
    import MdEditor from 'components/MdEditor';

    export default {
      components: { MdEditor },
      data() {
        return {
          content: 'Simplemde',
          html: ''
        }
      },
      methods: {
        markdown2Html() {
          import('showdown').then(showdown => {
            const converter = new showdown.Converter();
            this.html = converter.makeHtml(this.content)
          })
        }
      }
    };
</script>



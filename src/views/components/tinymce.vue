<template>
  <div class="components-container">
    <code>公司做的后台主要是一个cms系统，公司也是已自媒体为核心的，所以富文本是后台很核心的功能。在选择富文本的过程中也走了不少的弯路，市面上常见的富文本都基本用过了，最终选择了tinymce</code>
    <div class="editor-container">
      <Tinymce :height=200 ref="editor" v-model="content"></Tinymce>
    </div>
    <!--<div class='editor-content'>
{{content}}
    </div>-->
  </div>
</template>
<script>
    import Tinymce from 'components/Tinymce';

    export default {
      components: { Tinymce },
      data() {
        return {
          content: 'Tinymce'
        }
      },
      methods: {

      }
    };
</script>



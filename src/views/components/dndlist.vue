<template>
  <div class="components-container">
    <code>公司做的后台主要是一个cms系统，公司也是已自媒体为核心的，所以富文本是后台很核心的功能。在选择富文本的过程中也走了不少的弯路，市面上常见的富文本都基本用过了，最终选择了tinymce</code>
    <div class="editor-container">
       <TwoDndList :list1="list1" :list2="list2" :list1Title="头条列表" list2Title="文章池"></TwoDndList>
    </div>
    <!--<div class='editor-content'>
{{content}}
    </div>-->
  </div>
</template>
<script>
    import DndList from 'components/twoDndList'

    export default {
      components: { DndList },
      data() {
        return {
          list1: [],
          list2: []
        }
      },
      methods: {

      }
    };
</script>



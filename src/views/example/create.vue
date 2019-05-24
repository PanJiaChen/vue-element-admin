<template>
  <article-detail :is-edit="false" />
</template>

<script>
import ArticleDetail from './components/ArticleDetail'

export default {
  name: 'CreateForm',
  components: { ArticleDetail }
}
</script>


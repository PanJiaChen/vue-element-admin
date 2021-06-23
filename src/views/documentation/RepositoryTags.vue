<template>
  <div>
    <a href="https://github.com/vuejs/vue">
      <img src="https://img.shields.io/badge/vue-2.6.10-brightgreen.svg" alt="vue">
    </a>
    <a href="https://github.com/ElemeFE/element">
      <img src="https://img.shields.io/badge/element--ui-2.7.0-brightgreen.svg" alt="element-ui">
    </a>
    <a :href="'https://github.com/adempiere/' + repository + '/releases'">
      <img :src="'https://img.shields.io/github/release/adempiere/' + repository + '.svg'" alt="GitHub release">
    </a>
    <a :href="'https://github.com/adempiere/' + repository + '/blob/master/LICENSE'">
      <img src="https://img.shields.io/badge/license-GNU/GPL%20(v3)-blue" alt="license">
    </a>
    <a href="https://gitter.im/adempiere/adempiere-vue">
      <img src="https://badges.gitter.im/Join%20Chat.svg" alt="gitter">
    </a>
  </div>
</template>

<script>
export default {
  name: 'RepositoryTags',

  props: {
    repository: {
      type: String,
      required: true
    }
  }
}
</script>

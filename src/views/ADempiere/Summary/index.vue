<template>
  <div v-if="isIndex" key="sumary" class="app-container">
    <el-popover
      v-if="!isEmptyValue($route.meta.description)"
      ref="routeDescription"
      placement="top"
      width="400"
      trigger="hover"
      :content="$route.meta.description"
    />
    <h3 v-popover:routeDescription class="description">{{ $route.meta.title }}</h3>
    <el-row :gutter="10">
      <template v-if="!isEmptyValue(optionList.children)">
        <template v-for="(item, key) in optionList.children">
          <dropdown-menu
            v-if="$route.name !== item.name"
            :key="key"
            :items="item"
            :title="item.meta.title"
          />
        </template>
      </template>
      <template v-else>
        <template v-for="(item, key) in optionList">
          <dropdown-menu
            v-if="$route.name !== item.name"
            :key="key"
            :items="item"
            :title="item.meta.title"
          />
        </template>
      </template>
    </el-row>
  </div>
  <div v-else key="view">
    <router-view />
  </div>
</template>

<script>
import DropdownMenu from '@/components/ADempiere/DropdownMenu'

export default {
  name: 'SummaryView',
  components: {
    DropdownMenu
  },
  data() {
    return {
      routes: this.$store.state.permission.addRoutes,
      parentUuid: this.$route.meta.parentUuid,
      optionList: []
    }
  },
  computed: {
    isIndex() {
      return this.$route.meta.isIndex
    }
  },
  beforeMount() {
    this.generateRoutesPool()
  },
  methods: {
    generateRoutesPool() {
      if (this.$route.meta && this.$route.meta.childs.length) {
        this.optionList = this.$route.meta.childs
      }
    }
  }
}
</script>

<style>
  .description {
    text-align: center;
    cursor: default;
  }
</style>

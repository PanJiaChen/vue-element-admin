<template>
  <div v-if="!item.hidden">
    <template v-if="hasOneShowingChild(item.children,item) && (!onlyOneChild.children||onlyOneChild.noShowingChildren)&&!item.alwaysShow">
      <app-link v-if="onlyOneChild.meta" :to="onlyOneChild">
        <el-menu-item
          :index="resolvePath(onlyOneChild.path)"
          :route="item"
          :class="{'submenu-title-noDropdown':!isNest}"
          @click="openItemMenu"
        >
          <item
            :icon="onlyOneChild.meta.icon || (item.meta && item.meta.icon)"
            :title="generateTitle(onlyOneChild.meta.title)"
          />
        </el-menu-item>
      </app-link>
    </template>

    <el-submenu v-else ref="subMenu" :index="resolvePath(item.path)" popper-append-to-body>
      <template slot="title">
        <item v-if="item.meta" :icon="item.meta && item.meta.icon" :title="generateTitle(item.meta.title)" />
      </template>
      <sidebar-item
        v-for="child in item.children"
        :key="child.path"
        :is-nest="true"
        :item="child"
        :base-path="resolvePath(child.path)"
        class="nest-menu"
      />
    </el-submenu>
  </div>
</template>

<script>
import path from 'path'
import { generateTitle } from '@/utils/i18n'
import { isExternal } from '@/utils/validate'
import Item from './Item'
import AppLink from './Link'
import FixiOSBug from './FixiOSBug'
import { mapGetters } from 'vuex'

export default {
  name: 'SidebarItem',
  components: { Item, AppLink },
  mixins: [FixiOSBug],
  props: {
    // route object
    item: {
      type: Object,
      required: true
    },
    isNest: {
      type: Boolean,
      default: false
    },
    basePath: {
      type: String,
      default: ''
    }
  },
  data() {
    // To fix https://github.com/PanJiaChen/vue-admin-template/issues/237
    // TODO: refactor with render function
    this.onlyOneChild = null
    return {}
  },
  computed: {
    ...mapGetters([
      'sidebar'
    ]),
    isCollapse() {
      if (this.sidebar.opened) {
        return 'right'
      }
      return 'top'
    }
  },
  methods: {
    hasOneShowingChild(children = [], parent) {
      const showingChildren = children.filter(item => {
        if (item.hidden) {
          return false
        } else {
          // Temp set(will be used if only has one showing child)
          this.onlyOneChild = item
          return true
        }
      })

      // When there is only one child router, the child router is displayed by default
      if (showingChildren.length === 1) {
        return true
      }

      // Show parent if there are no child router to display
      if (showingChildren.length === 0) {
        this.onlyOneChild = { ... parent, path: '', noShowingChildren: true }
        return true
      }

      return false
    },
    /**
     * Clear field values, and set default values with open
     * @param view router item with meta attributes
     */
    openItemMenu(menuItem) {
      const view = menuItem._props.route

      if (view.meta && view.meta.uuid && view.meta.type) {
        const {
          parentUuid,
          uuid: containerUuid,
          type: panelType
        } = view.meta

        if (panelType !== 'window') {
          this.$store.dispatch('setDefaultValues', {
            parentUuid,
            containerUuid,
            panelType,
            isNewRecord: false
          })

          if (['browser'].includes(panelType)) {
            this.$store.dispatch('deleteRecordContainer', {
              viewUuid: containerUuid
            })
          }
        }
      }
    },
    resolvePath(routePath) {
      if (isExternal(routePath)) {
        return routePath
      }
      if (isExternal(this.basePath)) {
        return this.basePath
      }
      return path.resolve(this.basePath, routePath)
    },

    generateTitle
  }
}
</script>

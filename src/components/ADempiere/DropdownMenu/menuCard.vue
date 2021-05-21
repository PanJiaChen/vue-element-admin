<template>
  <div class="card-wrapper">
    <el-card
      shadow="never"
      class="custom-card"
      :body-style="{ padding: '10px', height: '100px' }"
      @click.native="redirect(items)"
    >
      <div class="icon-wrapper">
        <svg-icon :icon-class="items.meta.icon" />
      </div>
      <div class="text-wrapper">
        <div :class="titleClass"><b>{{ items.meta.title }}</b></div>
        <div :class="[mediumSize ? 'description-medium': '']">{{ items.meta.description }}</div>
      </div>
    </el-card>
  </div>
</template>

<script>
import { isEmptyValue } from '@/utils/ADempiere'
export default {
  props: {
    items: {
      type: Object,
      default: () => {
        return {}
      }
    },
    size: {
      type: String,
      default: 'medium'
    }
  },
  computed: {
    mediumSize() {
      return this.size === 'medium'
    },
    titleClass() {
      if (!isEmptyValue(this.items.meta.description)) {
        return ''
      }
      return this.mediumSize ? 'title-medium' : 'title-small'
    }
  },
  methods: {
    redirect(item) {
      console.log(item)
      this.openItemMenu(item)

      let tabParent
      if (item.meta && item.meta.type === 'window') {
        tabParent = 0
      }

      this.$router.push({
        name: item.name,
        query: {
          ...this.$router.query,
          tabParent
        },
        params: {
          ...this.$router.params,
          childs: item.children
        }
      }, () => {})
    },
    /**
     * Clear field values, and set default values with open
     * @param view router item with meta attributes
     */
    openItemMenu(view) {
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
    }
  }
}
</script>

<style lang="scss">
.card-wrapper {
    height: 120px;
}

  .custom-card {
    margin: 10px;
    cursor: pointer;
  }

  .icon-wrapper {
    height: 100%;
    width: 20%;
    float: left;
    font-size: 30px;
    line-height: 65px;
    padding: 6px;
    transition: all 0.38s ease-out;
    border-radius: 6px;
    text-align: center;
    color: #36a3f7;
  }
  .custom-card:hover {
    background-color: #eaf5fe;
    border: 1px solid #36a3f7;
  }
  .text-wrapper {
    margin: 6px 0 0 50px;
    padding-left: 15px;
    vertical-align: middle;
    height: 100%;
    font-size: 13px;
  }

  .description-medium {
      margin-top: 14px;
  }

  .title-small {
          margin-top: 28px;
  }

  .title-medium {
          margin-top: 33px;
  }
</style>

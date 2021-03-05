<template>
  <el-container style="height: 100% !important;">
    <el-main style="padding-right: 0px;padding-bottom: 0px;">

      <Split :gutter-size="isShowedPOSOptions ? 10 : 0" @onDrag="onDragOption">
        <SplitArea :size="isShowedPOSOptions ? 20 : 1" :min-size="400">
          <el-container style="height: 100% !important;">
            <el-aside :width="isShowedPOSOptions ? '100%' : '0%'" style="background: white; padding: 0px !important; margin-bottom: 0px">
              <options
                :metadata="metadata"
              />
            </el-aside>
            <div style="width: 36px;padding-top: 30vh; z-index: 100;">
              <el-button
                :circle="true"
                type="primary"
                :icon="isShowedPOSOptions ? 'el-icon-arrow-left' : 'el-icon-arrow-right'"
                :style="isShowedPOSOptions ? 'position: absolute;': 'position: absolute;left: 0.8%;'"
                @click="isShowedPOSOptions = !isShowedPOSOptions"
              />
            </div>
          </el-container>
        </SplitArea>

        <SplitArea :size="isShowedPOSOptions ? 80 : 99" :min-size="990">
          <Split :gutter-size="isShowedPOSKeyLaout ? 10 : 0" @onDrag="onDragKeyLayout">
            <SplitArea :size="isShowedPOSKeyLaout ? 69 : 99" :min-size="900" style="overflow: hidden">
              <order
                :metadata="metadata"
              />
            </SplitArea>
            <SplitArea
              v-show="isShowedPOSKeyLaout"
              :size="isShowedPOSKeyLaout ? 31: 1"
              :min-size="300"
              style="overflow: auto"
            >
              <key-layout
                v-if="!showCollection"
                key="layout-component"
              />
              <collection
                v-else
                key="collection-component"
              />
            </SplitArea>
          </Split>
        </SplitArea>
      </Split>
    </el-main>
  </el-container>
</template>

<script>
import Order from '@/components/ADempiere/Form/VPOS/Order'
import KeyLayout from '@/components/ADempiere/Form/VPOS/KeyLayout'
import Options from '@/components/ADempiere/Form/VPOS/Options'
import Collection from '@/components/ADempiere/Form/VPOS/Collection'

export default {
  name: 'VPOS',
  components: {
    Order,
    KeyLayout,
    Options,
    Collection
  },
  props: {
    metadata: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      unsubscribePOSList: () => {}
    }
  },
  computed: {
    // options to POS, panel left
    isShowedPOSOptions: {
      get() {
        return this.$store.getters.getIsShowPOSOptions
      },
      set(val) {
        this.$store.commit('setShowPOSOptions', val)
      }
    },
    isShowedPOSKeyLaout() {
      return this.$store.getters.getShowPOSKeyLayout
    },
    showCollection() {
      return this.$store.getters.getShowCollectionPos
    },
    pointOfSalesId() {
      const currentPOS = this.$store.getters.getCurrentPOS
      if (currentPOS && !this.isEmptyValue(currentPOS.id)) {
        return currentPOS.id
      }
      return undefined
    }
  },
  watch: {
    isShowedPOSOptions(value) {
      if (value) {
        if (this.isShowedPOSKeyLaout) {
          this.$store.dispatch('changeWidthRight', 3)
        }
      } else {
        this.$store.dispatch('changeWidthRight', 3)
      }
    }
  },
  created() {
    // load pont of sales list
    if (this.isEmptyValue(this.$store.getters.getSellingPointsList)) {
      let posToSet
      // set pos id with query path
      this.$store.dispatch('listPointOfSalesFromServer', posToSet)
    }

    this.unsubscribePOSList = this.posListWithOrganization()
  },
  mounted() {
    if (this.isEmptyValue(this.$route.query) || this.isEmptyValue(this.$route.query.pos)) {
      this.$router.push({
        params: {
          ...this.$route.params
        },
        query: {
          ...this.$route.query,
          pos: this.pointOfSalesId
        }
      }, () => {})
    }
  },
  beforeDestroy() {
    this.unsubscribePOSList()
  },
  methods: {
    posListWithOrganization() {
      return this.$store.subscribe((mutation, state) => {
        if (mutation.type === 'user/SET_ORGANIZATION') {
          this.$store.dispatch('listPointOfSalesFromServer')
        }
      })
    },
    onDragKeyLayout(size) {
      const sizeWidthRight = size[1] / 10
      this.$store.dispatch('changeWidthRight', Math.trunc(sizeWidthRight))
    },
    onDragOption(size) {
      const sizeWidthLeft = size[0] / 10
      this.$store.dispatch('changeWidthLeft', Math.trunc(sizeWidthLeft))
    }
  }
}
</script>

<style scoped>
  .split {
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    overflow-y: hidden;
    overflow-x: hidden;
    height: 100%;
    width: 100%;
  }
  .el-card__body {
    padding-top: 0px !important;
    padding-right: 0px!important;
    padding-bottom: 20px;
    padding-left: 10px!important;
    height: 100%!important;
  }

  /* Style of Table */
  .el-table {
    position: relative;
    overflow: hidden;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    -webkit-box-flex: 1;
    -ms-flex: 1;
    flex: 1;
    width: 100%;
    max-width: 100%;
    height: 100%;
    background-color: #FFFFFF;
    font-size: 14px;
    color: #606266;
  }
  .el-card__header {
    padding: 0px 20px;
    border-bottom: 1px solid #e6ebf5;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
  }
  .time {
    font-size: 13px;
    color: #999;
  }

  .bottom {
    margin-top: 13px;
    line-height: 12px;
  }

  .button {
    padding: 0;
    float: right;
  }

  .image {
    width: 100%;
    display: block;
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }

  .clearfix:after {
    clear: both
  }
  .el-header {
    background: 'white';
    color: #333;
    line-height: 10px;
  }

  .el-aside {
    color: #333;
  }
  .el-row {
    margin: 0px!important;
  }
  .el-col {
    border-radius: 4px;
  }
  .bg-purple-dark {
    background: #99a9bf;
  }
  .bg-purple {
    background: #d3dce6;
  }
  .bg-purple-light {
    background: #e5e9f2;
  }
  .grid-content {
    border-radius: 4px;
    min-height: 36px;
  }
  .row-bg {
    padding: 10px 0;
    background-color: #f9fafc;
  }
  .order-header {
    padding-left: 10px;
    font-size: 13px;
  }
</style>

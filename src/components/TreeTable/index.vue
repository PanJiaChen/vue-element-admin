<template>
  <el-table :data="res" :row-style="isShowRow" v-bind="$attrs">
    <!--通过插槽支持element-ui原生的表格复选框 http://element-cn.eleme.io/#/zh-CN/component/table#duo-xuan -->
    <slot name="__selection"/>
    <!--通过插槽支持element-ui原生的表格展开行 http://element-cn.eleme.io/#/zh-CN/component/table#zhan-kai-xing -->
    <slot name="__expand"/>
    <el-table-column
      v-for="item in columns"
      :label="item.label"
      :key="item.key"
      :width="item.width"
      align="center"
    >
      <template slot-scope="scope">
        <slot :scope="scope" :name="item.key">
          <template v-if="item.key==='__sperad'">
            <span
              v-show="isShowSperadIcon(scope.row)"
              class="tree-ctrl"
              @click="toggleExpanded(scope.$index)"
            >
              <i
                v-if="!scope.row.__expand"
                :style="{'padding-left':+scope.row.__level*spreadOffset + 'px'} "
                class="el-icon-plus"
              />
              <i
                v-else
                :style="{'padding-left':+scope.row.__level*spreadOffset + 'px'} "
                class="el-icon-minus"
              />
            </span>
          </template>
          <template v-if="item.key==='__checkbox'">
            <el-checkbox
              v-if="scope.row[defaultChildren]&&scope.row[defaultChildren].length>0"
              :style="{'padding-left':+scope.row.__level*checkboxOffset + 'px'} "
              :indeterminate="scope.row.__select"
              v-model="scope.row.__select"
              @change="handleCheckAllChange(scope.row)"
            />
            <el-checkbox
              v-else
              :style="{'padding-left':+scope.row.__level*checkboxOffset + 'px'} "
              v-model="scope.row.__select"
              @change="handleCheckAllChange(scope.row)"
            />
          </template>
          {{ scope.row[item.key] }}
        </slot>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import treeToArray, { addAttrs } from './eval.js'

export default {
  name: 'TreeTable',
  props: {
    data: {
      type: [Array, Object],
      required: true
    },
    columns: {
      type: Array,
      default: () => []
    },
    /* eslint-disable */
    renderContent: {
      type: Function
    },
    /* eslint-enable */
    defaultExpandAll: {
      type: Boolean,
      default: false
    },
    defaultChildren: {
      type: String,
      default: 'children'
    },
    spreadOffset: {
      type: Number,
      default: 50
    },
    checkboxOffset: {
      type: Number,
      default: 50
    }
  },
  data() {
    return {
      res: [],
      guard: 1
    }
  },
  computed: {
    children() {
      return this.defaultChildren
    }
  },
  watch: {
    data: {
      // deep watch，监听树表的数据的增删，如果仅仅是展示，可以不用deep watch
      handler(val) {
        if (Array.isArray(val) && val.length === 0) {
          this.res = []
          return
        }
        let tmp = ''
        if (!Array.isArray(val)) {
          tmp = [val]
        } else {
          tmp = val
        }
        const func = this.renderContent || treeToArray
        if (this.guard > 0) {
          addAttrs(tmp, {
            expand: this.defaultExpandAll,
            children: this.defaultChildren
          })
          this.guard--
        }

        const retval = func(tmp, this.defaultChildren)
        this.res = retval
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    isShowRow: function(row) {
      const parent = row.row.__parent
      const show = parent ? parent.__expand && parent.__show : true
      row.row.__show = show
      return show
        ? 'animation:treeTableShow 1s;-webkit-animation:treeTableShow 1s;'
        : 'display:none;'
    },
    isShowSperadIcon(record) {
      return record[this.children] && record[this.children].length > 0
    },
    toggleExpanded(trIndex) {
      const record = this.res[trIndex]
      const expand = !record.__expand
      record.__expand = expand
    },
    handleCheckAllChange(row) {
      this.selcetRecursion(row, row.__select, this.defaultChildren)
      this.isIndeterminate = row.__select
    },
    selcetRecursion(row, select, children = 'children') {
      if (select) {
        this.$set(row, '__expand', true)
        this.$set(row, '__show', true)
      }
      const sub_item = row[children]
      if (sub_item && sub_item.length > 0) {
        sub_item.map(child => {
          child.__select = select
          this.selcetRecursion(child, select, children)
        })
      }
    }
  }
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
@keyframes treeTableShow {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
@-webkit-keyframes treeTableShow {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
$color-blue: #2196f3;
$space-width: 18px;
.ms-tree-space {
  position: relative;
  top: 1px;
  display: inline-block;
  font-style: normal;
  font-weight: 400;
  line-height: 1;
  width: $space-width;
  height: 14px;
  &::before {
    content: "";
  }
}

.tree-ctrl {
  position: relative;
  cursor: pointer;
  color: $color-blue;
}
</style>

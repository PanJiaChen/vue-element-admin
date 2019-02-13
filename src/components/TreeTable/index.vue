<template>
  <el-table :data="res" :row-style="isShowRow" border style="width: 100%">
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
                :style="{'padding-left':+scope.row.__leavel*50 + 'px'} "
                class="el-icon-plus"
              />
              <i v-else :style="{'padding-left':+scope.row.__leavel*50 + 'px'} " class="el-icon-minus"/>
            </span>
          </template>
          {{ scope.row[item.key] }}
        </slot>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import treeToArray from './eval.js'

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
    evalFunc: {
      type: Function
    },
    evalArgs: Object
    /* eslint-enable */
  },
  computed: {
    // 格式化数据源
    res() {
      let tmp
      if (!Array.isArray(this.data)) {
        tmp = [this.data]
      } else {
        tmp = this.data
      }
      const func = this.evalFunc || treeToArray
      const args = { ...this.evalArgs }
      return func(tmp, args)
    },

    // 自定义的children字段
    children() {
      return this.evalArgs && this.evalArgs.children || 'children'
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
      // 收起是全部收起，展开是一级一级展开
      // if (!expand) {
      //   this.expandRecursion(record, expand)
      // }
    },
    expandRecursion(row, expand) {
      const children = row[this.children]
      if (children && children.length > 0) {
        children.map(child => {
          child.__expand = expand
          this.expandRecursion(child, expand)
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

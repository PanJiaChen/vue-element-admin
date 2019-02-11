<template>
  <el-table :data="res" :row-style="isShowRow" border style="width: 100%">
    <el-table-column
      v-for="(item,idx) in columns"
      :label="item.label"
      :key="item.key"
      :width="item.width"
      align="center"
    >
      <template slot-scope="scope">
        <span
          v-if="isNotLastChild(idx,scope.row)"
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
        <slot :scope="scope" :name="item.key">{{ scope.row[item.key] }}</slot>
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
    evalArgs: Array
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
    }
  },
  methods: {
    isShowRow: function(row) {
      const show = row.row.__parent ? row.row.__parent.__expand : true
      return show
        ? 'animation:treeTableShow 1s;-webkit-animation:treeTableShow 1s;'
        : 'display:none;'
    },
    isNotLastChild(index, record) {
      return index === 0 && record.children && record.children.length > 0
    },
    toggleExpanded(trIndex) {
      const record = this.res[trIndex]
      const expand = !record.__expand
      record.__expand = expand
      // 默认收起是全部收起，展开是一级一级展开
      if (!expand) {
        this.expandRecursion(record, expand)
      }
    },
    expandRecursion(row, expand) {
      if (row.children && row.children.length > 0) {
        row.children.map(child => {
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

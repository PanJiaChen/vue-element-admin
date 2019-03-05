<template>
  <el-table :data="tableData" :row-style="showRow" v-bind="$attrs" v-on="$listeners" >
    <slot name="selection" />
    <slot name="pre-column" />
    <el-table-column
      v-for="item in columns"
      :label="item.label"
      :key="item.key"
      :width="item.width"
      :align="item.align||'center'"
      :header-align="item.headerAlign">
      <template slot-scope="scope">
        <slot :scope="scope" :name="item.key">
          <template v-if="item.expand">
            <span :style="{'padding-left':+scope.row._level*indent + 'px'} "/>
            <span v-show="showSperadIcon(scope.row)" class="tree-ctrl" @click="toggleExpanded(scope.$index)">
              <i v-if="!scope.row._expand" class="el-icon-plus" />
              <i v-else class="el-icon-minus" />
            </span>
          </template>
          <template v-if="item.checkbox">
            <el-checkbox
              v-if="scope.row[defaultChildren]&&scope.row[defaultChildren].length>0"
              :style="{'padding-left':+scope.row._level*indent + 'px'} "
              :indeterminate="scope.row._select"
              v-model="scope.row._select"
              @change="handleCheckAllChange(scope.row)" />
            <el-checkbox
              v-else
              :style="{'padding-left':+scope.row._level*indent + 'px'} "
              v-model="scope.row._select"
              @change="handleCheckAllChange(scope.row)" />
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
      type: Array,
      required: true,
      default: () => []
    },
    columns: {
      type: Array,
      default: () => []
    },
    defaultExpandAll: {
      type: Boolean,
      default: false
    },
    defaultChildren: {
      type: String,
      default: 'children'
    },
    indent: {
      type: Number,
      default: 50
    }
  },
  data() {
    return {
      tableData: [],
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
      handler(newVal, oldVal) {
        const val = JSON.parse(JSON.stringify(newVal))
        if (val.length === 0) {
          this.tableData = []
          return
        }
        console.log('render')
        // if (this.guard > 0) {
        addAttrs(val, {
          expand: this.defaultExpandAll,
          children: this.defaultChildren
        })
        this.guard--
        // }

        const retval = treeToArray(val, this.defaultChildren)
        this.tableData = retval
        console.log(retval)
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    addBrother(row, data) {
      if (row._parent) {
        row._parent.children.push(data)
      } else {
        this.data.push(data)
      }
    },
    addChild(row, data) {
      if (!row.children) {
        this.$set(row, 'children', [])
      }
      row.children.push(data)
    },
    delete(row) {
      const { _index, _parent } = row
      if (_parent) {
        _parent.children.splice(_index, 1)
      } else {
        this.data.splice(_index, 1)
      }
    },
    getData() {
      return this.tableData
    },
    showRow: function({ row }) {
      const parent = row._parent
      const show = parent ? parent._expand && parent._show : true
      row._show = show
      return show
        ? 'animation:treeTableShow 1s;-webkit-animation:treeTableShow 1s;'
        : 'display:none;'
    },
    showSperadIcon(record) {
      return record[this.children] && record[this.children].length > 0
    },
    toggleExpanded(trIndex) {
      const record = this.tableData[trIndex]
      const expand = !record._expand
      record._expand = expand
    },
    handleCheckAllChange(row) {
      this.selcetRecursion(row, row._select, this.defaultChildren)
      this.isIndeterminate = row._select
    },
    selcetRecursion(row, select, children = 'children') {
      if (select) {
        this.$set(row, '_expand', true)
        this.$set(row, '_show', true)
      }
      const sub_item = row[children]
      if (sub_item && sub_item.length > 0) {
        sub_item.map(child => {
          child._select = select
          this.selcetRecursion(child, select, children)
        })
      }
    }
  }
}
</script>

<style>
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
</style>

<style lang="scss" rel="stylesheet/scss" scoped>
$color-blue: #2196f3;

.tree-ctrl {
  position: relative;
  cursor: pointer;
  color: $color-blue;
}
</style>

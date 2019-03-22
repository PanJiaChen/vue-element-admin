<template>
  <el-table :data="tableData" :row-style="showRow" v-bind="$attrs" v-on="$listeners">
    <slot name="selection" />
    <slot name="pre-column" />
    <el-table-column
      v-for="item in columns"
      :key="item.key"
      :label="item.label"
      :width="item.width"
      :align="item.align||'center'"
      :header-align="item.headerAlign"
    >
      <template slot-scope="scope">
        <slot :scope="scope" :name="item.key">
          <template v-if="item.expand">
            <span :style="{'padding-left':+scope.row._level*indent + 'px'} " />
            <span v-show="showSperadIcon(scope.row)" class="tree-ctrl" @click="toggleExpanded(scope.$index)">
              <i v-if="!scope.row._expand" class="el-icon-plus" />
              <i v-else class="el-icon-minus" />
            </span>
          </template>
          <template v-if="item.checkbox">
            <el-checkbox
              v-if="scope.row[defaultChildren]&&scope.row[defaultChildren].length>0"
              v-model="scope.row._select"
              :style="{'padding-left':+scope.row._level*indent + 'px'} "
              :indeterminate="scope.row._isIndeterminate"
              @change="(val) => handleCheckAllChange(val, scope.row)"
            />
            <el-checkbox
              v-else
              v-model="scope.row._select"
              :style="{'padding-left':+scope.row._level*indent + 'px'} "
              @change="(val) => handleCheckAllChange(val, scope.row)"
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
      guard: 1
    }
  },
  computed: {
    children() {
      return this.defaultChildren
    },
    tableData() {
      const data = this.data
      if (this.data.length === 0) {
        return []
      }
      addAttrs(data, {
        expand: this.defaultExpandAll,
        children: this.defaultChildren
      })

      const retval = treeToArray(data, this.defaultChildren)
      return retval
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
    handleCheckAllChange(val, row) {
      row._select = val;
      row._isIndeterminate = false;
      this.selcetRecursion(row, val, this.defaultChildren);
      this.handleParentData(row, '_parent', 'children', '_select', '_isIndeterminate')
    },
    /**
     * @param {Object} obj 表行数据
     * @param {String} parent 父级数据键值对键名
     * @param {String} children 子级数据键值对键名
     * @param {String} select 是否勾选择值对键名
     * @param {String} isIndeterminate 是否非全选状态键值对键名
     */
    handleParentData(obj, parent, children, select, isIndeterminate) {
        if(obj.hasOwnProperty(parent) && obj[parent]) {
          if(obj[parent].hasOwnProperty(children) && obj[parent][children] && obj[parent][children].length >0) {
            this.changeCheckStatus(obj[parent], select, isIndeterminate, children)
            if(obj[parent].hasOwnProperty(parent) && obj[parent][parent]) {
              this.handleParentData(obj[parent], parent, children, select, isIndeterminate)
            }
          }
        }
    },
    /**
     * @param {Object} obj 表行数据
     * @param {String} children 子级数据键值对键名
     * @param {String} select 是否勾选择值对键名
     * @param {String} isIndeterminate 是否非全选状态键值对键名
     */
    changeCheckStatus(obj, select, isIndeterminate, children) {
        let isSelectAll = obj[children].every(item => {
            return item[select];
        });
        let isSelect = obj[children].some(item => {
            return item[select];
        });
        if (isSelectAll) {
            obj[isIndeterminate] = false;
            obj[select] = true;
        } else if (!isSelectAll && isSelect) {
            obj[isIndeterminate] = true;
            obj[select] = false;
        } else if (!isSelect) {
            obj[isIndeterminate] = false;
            obj[select] = false;
        }
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
    },
    updateTreeNode(item) {
      return new Promise(resolve => {
        const { _id, _parent } = item
        const index = _id.split('-').slice(-1)[0] // get last index
        if (_parent) {
          _parent.children.splice(index, 1, item)
          resolve(this.data)
        } else {
          this.data.splice(index, 1, item)
          resolve(this.data)
        }
      })
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

.tree-ctrl {
  position: relative;
  cursor: pointer;
  color: #2196f3;
}
</style>

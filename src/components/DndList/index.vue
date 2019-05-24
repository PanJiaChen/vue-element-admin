<template>
  <div class="dndList">
    <div :style="{width:width1}" class="dndList-list">
      <h3>{{ list1Title }}</h3>
      <draggable :set-data="setData" :list="list1" group="article" class="dragArea">
        <div v-for="element in list1" :key="element.id" class="list-complete-item">
          <div class="list-complete-item-handle">
            {{ element.id }}[{{ element.author }}] {{ element.title }}
          </div>
          <div style="position:absolute;right:0px;">
            <span style="float: right ;margin-top: -20px;margin-right:5px;" @click="deleteEle(element)">
              <i style="color:#ff4949" class="el-icon-delete" />
            </span>
          </div>
        </div>
      </draggable>
    </div>
    <div :style="{width:width2}" class="dndList-list">
      <h3>{{ list2Title }}</h3>
      <draggable :list="list2" group="article" class="dragArea">
        <div v-for="element in list2" :key="element.id" class="list-complete-item">
          <div class="list-complete-item-handle2" @click="pushEle(element)">
            {{ element.id }} [{{ element.author }}] {{ element.title }}
          </div>
        </div>
      </draggable>
    </div>
  </div>
</template>

<script>
import draggable from 'vuedraggable'

export default {
  name: 'DndList',
  components: { draggable },
  props: {
    list1: {
      type: Array,
      default() {
        return []
      }
    },
    list2: {
      type: Array,
      default() {
        return []
      }
    },
    list1Title: {
      type: String,
      default: 'list1'
    },
    list2Title: {
      type: String,
      default: 'list2'
    },
    width1: {
      type: String,
      default: '48%'
    },
    width2: {
      type: String,
      default: '48%'
    }
  },
  methods: {
    isNotInList1(v) {
      return this.list1.every(k => v.id !== k.id)
    },
    isNotInList2(v) {
      return this.list2.every(k => v.id !== k.id)
    },
    deleteEle(ele) {
      for (const item of this.list1) {
        if (item.id === ele.id) {
          const index = this.list1.indexOf(item)
          this.list1.splice(index, 1)
          break
        }
      }
      if (this.isNotInList2(ele)) {
        this.list2.unshift(ele)
      }
    },
    pushEle(ele) {
      for (const item of this.list2) {
        if (item.id === ele.id) {
          const index = this.list2.indexOf(item)
          this.list2.splice(index, 1)
          break
        }
      }
      if (this.isNotInList1(ele)) {
        this.list1.push(ele)
      }
    },
    setData(dataTransfer) {
      // to avoid Firefox bug
      // Detail see : https://github.com/RubaXa/Sortable/issues/1012
      dataTransfer.setData('Text', '')
    }
  }
}
</script>

<style lang="scss" scoped>
.dndList {
  background: #fff;
  padding-bottom: 40px;
  &:after {
    content: "";
    display: table;
    clear: both;
  }
  .dndList-list {
    float: left;
    padding-bottom: 30px;
    &:first-of-type {
      margin-right: 2%;
    }
    .dragArea {
      margin-top: 15px;
      min-height: 50px;
      padding-bottom: 30px;
    }
  }
}

.list-complete-item {
  cursor: pointer;
  position: relative;
  font-size: 14px;
  padding: 5px 12px;
  margin-top: 4px;
  border: 1px solid #bfcbd9;
  transition: all 1s;
}

.list-complete-item-handle {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-right: 50px;
}

.list-complete-item-handle2 {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-right: 20px;
}

.list-complete-item.sortable-chosen {
  background: #4AB7BD;
}

.list-complete-item.sortable-ghost {
  background: #30B08F;
}

.list-complete-enter,
.list-complete-leave-active {
  opacity: 0;
}
</style>

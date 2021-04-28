<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>
          {{ $t('data.recordAccess.actions') }}
        </span>
      </div>
      <div style="margin-bottom: 10%;">
        <span style="margin-bottom: 10%;">
          {{ $t('data.recordAccess.hideRecord') }} ({{ labelListExcludo.length }})
        </span>
        <br>
        <el-select
          v-model="labelListExcludo"
          multiple
          style="margin-top: 5%;"
          filterable
          placeholder="Select"
          collapse-tags
          @change="addListExclude"
        >
          <el-option
            v-for="item in includedList"
            :key="item.roleUuid"
            :label="item.roleName"
            :value="item.roleName"
          />
        </el-select>
      </div>
      <div
        style="margin-bottom: 10%;"
      >
        <span
          style="margin-bottom: 10%;"
        >
          {{ $t('data.recordAccess.recordDisplay') }} ({{ labelListInclude.length }})
        </span>
        <br>
        <el-select
          v-model="labelListInclude"
          multiple
          style="margin-top: 5%;"
          placeholder="Select"
          filterable
          collapse-tags
          @change="addListInclude"
        >
          <el-option
            v-for="item in excludedList"
            :key="item.roleUuid"
            :label="item.roleName"
            :value="item.roleName"
          />
        </el-select>
      </div>
      <el-form
        label-position="top"
        size="small"
        class="create-bp"
      >
        <el-scrollbar wrap-class="scroll-panel-right-mode-mobile" style="max-height: 200px;">
          <el-row :gutter="24">
            <div style="margin-left: 5%;">
              <p>
                {{ $t('data.recordAccess.isReadonly') }} <el-switch v-model="isReadonly" />
              </p>
              <p>
                {{ $t('data.recordAccess.isDependentEntities') }} <el-switch v-model="isDependentEntities" />
              </p>
            </div>
          </el-row>
        </el-scrollbar>
      </el-form>
    </el-card>
    <span style="float: right;padding-top: 1%;">
      <el-button
        type="danger"
        icon="el-icon-close"
        @click="close"
      />
      <el-button
        type="primary"
        icon="el-icon-check"
        @click="SendRecorAccess(includedList)"
      />
    </span>
  </div>
</template>

<script>
import recordAccessMixin from './recordAccess.js'

export default {
  name: 'RecordAccessMobile',
  mixins: [recordAccessMixin],
  props: {
    parentUuid: {
      type: String,
      default: undefined
    },
    containerUuid: {
      type: String,
      default: undefined
    },
    order: {
      type: String,
      default: undefined
    },
    included: {
      type: String,
      default: undefined
    },
    keyColumn: {
      type: String,
      default: undefined
    },
    identifiersList: {
      type: Array,
      default: undefined
    }
  },
  data() {
    return {
      group: 'sequence',
      isReadonly: false,
      isDependentEntities: false,
      labelListInclude: [],
      labelListExcludo: []
    }
  },
  computed: {
    listExclude() {
      return this.excludedList.map(element => {
        return element.roleName
      })
    },
    listInclude() {
      return this.includedList.map(element => {
        return element.roleName
      })
    }
  },
  watch: {
    listInclude(value) {
      this.labelListInclude = value
    },
    listExclude(value) {
      this.labelListExcludo = value
    }
  },
  methods: {
    addListInclude(element) {
      const index = this.recordAccess.roles.findIndex(item => {
        if (element[element.length - 1] === item.roleName) {
          return item
        }
      })
      if (index >= 0) {
        this.addItem({
          index,
          element: this.recordAccess.roles[index]
        })
      }
    },
    addListExclude(element) {
      const index = this.recordAccess.roles.findIndex(item => {
        if (element[element.length - 1] === item.roleName) {
          return item
        }
      })
      if (index >= 0) {
        this.deleteItem({
          index,
          element: this.recordAccess.roles[index]
        })
      }
    },
    SendRecorAccess(list) {
      list.forEach(element => {
        element.isReadOnly = this.isReadonly
        element.isDependentEntities = this.isDependentEntities
      })
      this.saveRecordAccess(list)
    }
  }
}
</script>

<style lang="scss" scoped>
  .board-column {
    min-width: 250px;
    min-height: 70px;
    height: auto;
    overflow: hidden;
    background: #f0f0f0;
    border-radius: 3px;

    .board-column-header {
      height: 50px;
      line-height: 50px;
      overflow: hidden;
      padding: 0 20px;
      text-align: center;
      background: #333;
      color: #fff;
      border-radius: 3px 3px 0 0;
    }

    .board-column-content {
      height: auto;
      overflow: hidden;
      border: 10px solid transparent;
      min-height: 60px;
      display: flex;
      justify-content: flex-start;
      flex-direction: column;
      align-items: center;

      .board-item {
        cursor: pointer;
        width: 100%;
        height: 30px;
        margin: 5px 0;
        background-color: #fff;
        text-align: left;
        line-height: 30px;
        padding: 0px 10px;
        box-sizing: border-box;
        box-shadow: 0px 1px 3px 0 rgba(0, 0, 0, 0.2);
      }
    }
  }
</style>
<style lang="scss">
  .scroll-panel-right-mode-mobile {
    max-height: 200px;
    overflow-y: auto;
    overflow-x: hidden;
  }
  .el-scrollbar__bar.is-vertical > div {
    width: 100%;
    transform: translateY(998%);
  }
  .board {
    width: 100%;
    margin-left: 20px;
    display: flex;
    justify-content: space-around;
    flex-direction: row;
    align-items: flex-start;
  }
  .kanban {
    &.todo {
      .board-column-header {
        background: #f9944a;
      }
    }
    &.working {
      .board-column-header {
        background: #4A9FF9;
      }
    }
  }
</style>

<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix" style="padding-bottom: 2%;">
        <span>
          {{ $t('data.recordAccess.actions') }}
        </span>
      </div>
      <div style="margin-bottom: 5%;">
        <span style="margin-bottom: 5%;">
          {{ $t('data.recordAccess.availableRoles') }} ({{ labelListExcludo.length }})
        </span>
        <br>
        <el-select
          v-model="labelListExcludo"
          multiple
          style="margin-top: 2.5%;"
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
      <div>
        <span
          style="margin-bottom: 5%;"
        >
          {{ $t('data.recordAccess.modeMobile.accessRoles') }} ({{ labelListInclude.length }})
        </span>
        <br>
        <el-select
          v-model="labelListInclude"
          multiple
          placeholder="Select"
          filterable
          collapse-tags
          style="margin-top: 2.5%;"
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
      <!-- Roles with Access and Read Only -->
      <div
        style="padding-top: 9%;"
      >
        <span
          style="margin-bottom: 5%;"
        >
          {{ $t('data.recordAccess.modeMobile.accessRolesIsReadonly') }} ({{ listRolesLockReadOnly.length }})
        </span>
        <br>
        <el-select
          v-model="listRolesLockReadOnly"
          multiple
          placeholder="Select"
          filterable
          collapse-tags
          style="margin-top: 2.5%;"
          @change="addRolesLockReadOnly"
        >
          <el-option
            v-for="item in includedList.filter(element => element.isExclude)"
            :key="item.roleUuid"
            :label="item.roleName"
            :value="item.roleName"
          />
        </el-select>
      </div>
      <!-- Locked Roles -->
      <div
        style="padding-top: 9%;"
      >
        <span
          style="margin-bottom: 5%;"
        >
          {{ $t('data.recordAccess.modeMobile.lockedRoles') }} ({{ listRolesLock.length }})
        </span>
        <br>
        <el-select
          v-model="listRolesLock"
          multiple
          placeholder="Select"
          filterable
          collapse-tags
          style="margin-top: 2.5%;"
          @change="addRolesLock"
        >
          <el-option
            v-for="item in includedList"
            :key="item.roleUuid"
            :label="item.roleName"
            :value="item.roleName"
          />
        </el-select>
      </div>
      <!-- Locked Roles with Dependent Entities -->
      <div
        style="padding-top: 9%;"
      >
        <span
          style="margin-bottom: 5%;"
        >
          {{ $t('data.recordAccess.modeMobile.lockedRolesIsDependentEntities') }} ({{ listRolesUnLock.length }})
        </span>
        <br>
        <el-select
          v-model="listRolesUnLock"
          multiple
          placeholder="Select"
          filterable
          collapse-tags
          style="margin-top: 2.5%;"
          @change="addlockedRolesIsDependentEntities"
        >
          <el-option
            v-for="item in includedList.filter(element => !element.isExclude)"
            :key="item.roleUuid"
            :label="item.roleName"
            :value="item.roleName"
          />
        </el-select>
      </div>
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
    },
    listRolesLock: {
      get() {
        const list = this.includedList.filter(element => {
          return !element.isExclude
        })
        if (list) {
          return list.map(element => {
            return element.roleName
          })
        }
        return []
      },
      set(value) {
      }
    },
    listRolesLockReadOnly: {
      get() {
        const list = this.includedList.filter(element => {
          if (element.isExclude && element.isReadOnly) {
            return element
          }
        })
        if (list) {
          return list.map(element => {
            return element.roleName
          })
        }
        return []
      },
      set(value) {
      }
    },
    listLabelRolesLockReadOnly: {
      get() {
        const list = this.includedList.filter(element => {
          if (!element.isExclude && element.isReadOnly) {
            return element
          }
        })
        if (list) {
          return list.map(element => {
            return element.roleName
          })
        }
        return []
      },
      set(value) {
      }
    },
    listRolesUnLock: {
      get() {
        const list = this.includedList.filter(element => {
          if (!element.isExclude && element.isDependentEntities) {
            return element
          }
        })
        if (list) {
          return list.map(element => {
            return element.roleName
          })
        }
        return []
      },
      set(value) {
      }
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
    addRolesLock(element) {
      const index = this.recordAccess.roles.findIndex(item => {
        if (element[element.length - 1] === item.roleName) {
          return item
        }
      })

      if (index >= 0) {
        this.recordAccess.roles[index].isExclude = !this.recordAccess.roles[index].isExclude
      }
    },
    addRolesLockReadOnly(element) {
      const index = this.recordAccess.roles.find(item => {
        if (element[element.length - 1] === item.roleName) {
          return item
        }
      })
      if (index) {
        index.isReadOnly = !index.isReadOnly
      } else {
        const undo = this.recordAccess.roles.find(item => {
          if (this.listRolesLockReadOnly[0] === item.roleName) {
            return item
          }
        })
        undo.isReadOnly = !undo.isReadOnly
      }
    },
    addlockedRolesIsDependentEntities(element) {
      const index = this.recordAccess.roles.find(item => {
        if (element[element.length - 1] === item.roleName) {
          return item
        }
      })
      if (index) {
        index.isDependentEntities = !index.isDependentEntities
      } else {
        const undo = this.recordAccess.roles.find(item => {
          if (this.listRolesUnLock[0] === item.roleName) {
            return item
          }
        })
        undo.isDependentEntities = !undo.isDependentEntities
      }
    },
    SendRecorAccess(list) {
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
  .el-card__header {
    background: rgba(245, 247, 250, 0.75);
    padding-top: 18px;
    padding-right: 20px;
    padding-bottom: 1%;
    padding-left: 20px;
    border-bottom: 1px solid #f5f7fa;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
  }
  .el-card__body {
    padding-top: 2.5%;
  }
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

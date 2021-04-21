<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>
        {{ $t('data.recordAccess.actions') }}
      </span>
    </div>
    <div style="margin-bottom: 10%;">
      <span style="margin-bottom: 10%;">
        {{ $t('data.recordAccess.hideRecord') }}
      </span>
      <br>
      <el-select
        v-model="getterListExclude"
        multiple
        style="margin-top: 5%;"
        placeholder="Select"
        clearable
        @change="addListExclude"
      >
        <el-option
          v-for="item in getterDataRecords"
          :key="item.clientId"
          :label="item.name"
          :value="item.uuid"
        />
      </el-select>
    </div>
    <div
      style="margin-bottom: 10%;"
    >
      <span
        style="margin-bottom: 10%;"
      >
        {{ $t('data.recordAccess.recordDisplay') }}
      </span>
      <br>
      <el-select
        v-model="getterListInclude"
        multiple
        style="margin-top: 5%;"
        placeholder="Select"
        @change="addListInclude"
      >
        <el-option
          v-for="item in getterDataRecords"
          :key="item.clientId"
          :label="item.name"
          :value="item.uuid"
        />
      </el-select>
    </div>
    <el-form
      label-position="top"
      size="small"
      class="create-bp"
    >
      <el-row :gutter="24">
        <template
          v-for="(record, index) in getterListInclude"
        >
          <div :key="index" style="margin-left: 5%;">
            <el-tag>
              {{ record }}
            </el-tag>
            <p>
              {{ $t('data.recordAccess.isReadonly') }}
              <el-checkbox v-model="isReadonly" />
            </p>
            <p>
              {{ $t('data.recordAccess.isDependentEntities') }} <el-checkbox v-model="isDependentEntities" />
            </p>
          </div>
        </template>
      </el-row>
    </el-form>
  </el-card>
</template>

<script>

export default {
  name: 'RecordAccessMobile',
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
      isDependentEntities: true,
      getterDataRecords: this.$store.getters['user/getRoles']
    }
  },
  computed: {
    getterListExclude() {
      const list = this.getterDataRecords.filter(item => item.isPersonalLock === false)
      return list.map(element => {
        return element.name
      })
    },
    getterListInclude() {
      const list = this.getterDataRecords.filter(item => item.isPersonalLock === true)
      return list.map(element => {
        return element.name
      })
    },
    getIdentifiersList() {
      return this.identifiersList
        .filter(item => item.componentPath !== 'FieldSelect')
    }
  },
  created() {
    const record = this.getterDataRecords.map(record => {
      return {
        id: record.id,
        uuid: record.uuid,
        IsExclude: record.isPersonalLock,
        isDependentEntities: this.isDependentEntities,
        isReadonly: this.isReadonly
      }
    })
    this.$store.dispatch('changeList', record)
  },
  methods: {
    handleChange(value) {
      const action = Object.keys(value)[0] // get property
      const element = value.[action].element
      const index = this.getterDataRecords.findIndex(role => role.id === element.id)
      switch (action) {
        case 'added':
          this.addItem({
            index,
            element
          })
          break
        case 'removed':
          this.deleteItem({
            index,
            element
          })
          break
      }
    },
    addListInclude(element) {
      const index = this.getterDataRecords.findIndex(item => element[element.length - 1] === item.uuid)
      this.getterDataRecords[index].isPersonalLock = true
    },
    addListExclude(element) {
      const index = this.getterDataRecords.findIndex(item => element[element.length - 1] === item.uuid)
      this.getterDataRecords[index].isPersonalLock = false
    },
    /**
     * @param {number} index: the index of the added element
     * @param {object} element: the added element
     */
    addItem({
      index,
      element
    }) {
      this.getterDataRecords[index].isPersonalLock = !element.isPersonalLock
    },
    /**
     * @param {number} index: the index of the element before remove
     * @param {object} element: the removed element
     */
    deleteItem({
      index,
      element
    }) {
      this.getterDataRecords[index].isPersonalLock = !element.isPersonalLock
      const record = this.getterDataRecords.map(record => {
        return {
          id: record.id,
          uuid: record.uuid,
          IsExclude: record.isPersonalLock,
          isDependentEntities: this.isDependentEntities,
          isReadonly: this.isReadonly
        }
      })
      this.$store.dispatch('changeList', record)
    },
    getOrder(arrayToSort, orderBy = this.order) {
      return arrayToSort.sort((itemA, itemB) => {
        return itemA[orderBy] - itemB[orderBy]
      })
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

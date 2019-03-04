<template>
  <div>
    <div class="app-container">
      <el-tag style="margin-bottom:20px;">
        <a
          href="https://github.com/PanJiaChen/vue-element-admin/tree/master/src/components/TreeTable"
          target="_blank"
        >Documentation</a>
      </el-tag>
      <TreeTable
        :data="menus"
        :default-expand-all="true"
        :columns="columns"
        border
        default-children="sub_button"
      >
        <template slot="__selection">
          <el-table-column type="selection" width="55"/>
        </template>
        <template slot="__expand">
          <el-table-column type="expand" width="55">
            <template>
              <el-tag type="info">
                支持element-ui 的扩展和多选框事件哦
              </el-tag>
            </template>
          </el-table-column>
        </template>
        <template slot="name" slot-scope="{scope}">
          <span :style="{'padding-left':+scope.row.__level*50 + 'px'} ">
            <a
              v-if="scope.row.type === 'view'"
              :href="scope.row.url"
              class="link-type"
            >{{ scope.row.name }}</a>
            <span v-else>{{ scope.row.name }}</span>
          </span>
        </template>
        <template slot="__opt_parent" slot-scope="{scope}">
          <el-button
            v-if="scope.row.__level === 0"
            size="mini"
            type="primary"
            @click="addMenuItem(defaultMenu,1,scope.row.__index)"
          >添加子菜单</el-button>
        </template>
        <template slot="__opt" slot-scope="{scope}">
          <el-button size="mini" type="primary" @click="editMenuItem(scope.row,'update')">编辑</el-button>
          <el-button size="mini" type="danger" @click="deleteMenuItem(scope.row)">删除</el-button>
        </template>
      </TreeTable>
    </div>
    <el-dialog :visible.sync="dialogFormVisible" title="编辑菜单">
      <el-form ref="menuForm" :model="menu" :rules="rules" label-width="100px" style="width:600px">
        <el-form-item label="type">
          <el-select v-model="menu.type" clearable placeholder="请选择">
            <el-option label="view" value="view"/>
            <el-option label="click" value="click"/>
            <el-option label="miniprogram" value="miniprogram"/>
          </el-select>
        </el-form-item>
        <template v-if="menu.type==='click'">
          <el-form-item label="key">
            <el-input v-model.trim="menu.key" placeholder="请输入key"/>
          </el-form-item>
        </template>
        <template v-else>
          <el-form-item label="url">
            <el-input v-model.trim="menu.url" placeholder="请输入url"/>
          </el-form-item>
        </template>
        <el-form-item label="名称">
          <el-input v-model.trim="menu.name" placeholder="请输入name"/>
        </el-form-item>
        <el-form-item label="appid">
          <el-input v-model.trim="menu.appid" placeholder="请输入appid"/>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="clickToUpsertMenuItem('menuForm')">确定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
const defaultMenu = {
  name: undefined,
  appid: Math.random() * 10000,
  key: undefined,
  page_path: undefined,
  type: undefined,
  url: undefined
}

import TreeTable from '@/components/TreeTable'
import { data } from './data.js'
export default {
  components: {
    TreeTable
  },
  data() {
    return {
      defaultMenu,
      menus: [],
      menu: { ...defaultMenu },
      rules: {},
      dialogFormVisible: false,
      columns: [
        {
          label: '',
          key: '__sperad'
        },
        {
          label: 'name',
          key: 'name'
        },
        {
          label: 'type',
          key: 'type'
        },
        {
          label: 'appid',
          key: 'appid'
        },
        {
          label: 'key',
          key: 'key'
        },
        {
          label: '操作',
          key: '__opt_parent'
        },
        {
          label: '操作',
          key: '__opt',
          width: '160px'
        }
      ]
    }
  },
  computed: {
    canAddMenuItem() {
      return this.menus.length < 3
    }
  },
  created() {
    this.getWechatMenu()
  },
  methods: {
    getWechatMenu() {
      this.menus = data.button
    },
    // 如果你想对原来的数据进行更新的化
    updateMenu() {
      const button = JSON.parse(
        JSON.stringify(this.menus, [
          'name',
          'type',
          'appid',
          'url',
          'key',
          'media_id',
          'page_path',
          'sub_button'
        ])
      )
      // 更新数据
      console.log('button', button)
      // upsertWechatMenu({ button }).then(() => {
      //   this.$message.success('更新成功')
      // })
    },
    clickToUpsertMenuItem(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.updateMenuItem(this.menu)
          this.dialogFormVisible = false
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    editMenuItem(menuItem) {
      this.dialogFormVisible = true
      this.menu = { ...menuItem }
    },
    // 增加单条数据，需要将其属性也手动添加上
    // 都是纯手动添加，后续会添加个方法
    addMenuItem(menuItem, level, index) {
      if (level === 0) {
        this.menus.push({
          ...menuItem,
          sub_button: [],
          __level: 0,
          __expand: true,
          __parent: null,
          __show: true,
          __select: false
        })
      }
      if (level === 1) {
        this.menus[index]['sub_button'].push({
          ...menuItem,
          __level: 1,
          __expand: true,
          __parent: this.menus[index],
          __show: true,
          __select: false
        })
      }
    },
    deleteMenuItem(menuItem) {
      if (menuItem.__level === 0) {
        this.menus.splice(menuItem.__index, 1)
      }
      if (menuItem.__level === 1) {
        this.menus[menuItem.__parent.__index]['sub_button'].splice(
          menuItem.__index,
          1
        )
      }
    },
    updateMenuItem(menuItem) {
      if (menuItem.type === 'view') {
        if (!menuItem.url) {
          this.$message.error('请输入url')
          return
        }
      }
      if (menuItem.type === 'click') {
        if (!menuItem.key) {
          this.$message.error('请输入key')
          return
        }
      }
      if (menuItem.__level === 0) {
        this.menus.splice(menuItem.__index, 1, menuItem)
      }
      if (menuItem.__level === 1) {
        this.menus[menuItem.__parent.__index]['sub_button'].splice(
          menuItem.__index,
          1,
          menuItem
        )
      }
    }
  }
}
</script>

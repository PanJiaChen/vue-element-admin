<template>
    <el-menu mode="vertical" theme="dark" :default-active="$route.path">
        <template v-for="item in permissionRoutes" v-if="!item.hidden">
            <el-submenu :index="item.name" v-if="!item.noDropdown">
                <template slot="title">
                    <wscn-icon-svg :icon-class="item.icon||'wenzhang1'"/>
                    {{item.name}}
                </template>
                <router-link v-for="child in item.children" :key="child.path" v-if="!child.hidden"
                             class="title-link" :to="item.path+'/'+child.path + '#'+ +new Date()">
                    <el-menu-item :index="item.path+'/'+child.path">
                        {{child.name}}
                    </el-menu-item>
                </router-link>
            </el-submenu>
            <router-link v-if="item.noDropdown&&item.children.length>0" class="title-link"
                         :to="item.path+'/'+item.children[0].path">
                <el-menu-item
                        :index="item.path+'/'+item.children[0].path +'#'+ +new Date()">
                    <wscn-icon-svg :icon-class="item.icon||'geren1'"/>
                    {{item.children[0].name}}
                </el-menu-item>
            </router-link>
        </template>
    </el-menu>
</template>

<script>
    import permissionRoutes from 'store/permission';

    export default {
      name: 'Sidebar',
      data() {
        return {
          permissionRoutes: permissionRoutes.get()
        }
      }
    }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
    .el-menu {
        min-height: 100%;
    }
    .wscn-icon {
        margin-right: 10px;
    }
</style>

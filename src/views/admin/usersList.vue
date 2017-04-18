<template>
  <div class="app-container adminUsers-list-container">
    <div class="filter-container">
      <el-input @keyup.enter.native="handleFilter" style="width:135px;" class="filter-item" placeholder="ID" type="number" v-model="listQuery.uid">
      </el-input>

      <el-input style="width:135px;" class="filter-item" placeholder="Name" @keyup.enter.native="handleFilter" v-model="listQuery.display_name">
      </el-input>

      <el-input class="filter-item" style="width:300px;display: inline-table" placeholder="email" @keyup.enter.native="handleFilter"
        v-model="listQuery.email">
        <template slot="append">@wallstreetcn.com</template>
      </el-input>
      </el-input>

      <el-select style="width: 250px" class="filter-item" v-model="listQuery.role" clearable placeholder="权限">
        <el-option v-for="item in roleOptions" :key="item.value" :label="item.label" :value="item.value">
        </el-option>
      </el-select>

      <el-button class="filter-item" type="primary" icon="search" @click="handleFilter">
        搜索
      </el-button>
      <el-button class="filter-item" type="danger" @click="resetFilter">重置筛选项</el-button>
    </div>

    <el-table :data="list" v-loading.body="listLoading" border fit highlight-current-row>
      <el-table-column label="ID" width="130">
        <template scope="scope">
          <span>{{scope.row.uid}}</span>
        </template>
      </el-table-column>

      <el-table-column label="Name">
        <template scope="scope">
          <span>{{scope.row.display_name}}</span>
        </template>
      </el-table-column>

      <el-table-column label="Email">
        <template scope="scope">
          <span>{{scope.row.email}}</span>
        </template>
      </el-table-column>

      <el-table-column label="Role">
        <template scope="scope">
          <el-tag style="margin-right: 5px;" v-for='item in scope.row.roles' :key='item+scope.row.uid' type="primary">
            {{item}}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column label="操作" width="170">
        <template scope="scope">
          <el-button size="small" type="success" @click="handleEdit(scope.row)">编辑权限</el-button>
          <el-button size="small" v-if='scope.row.roles.indexOf("virtual_editor")>=0||hasRoleEdit' type="primary" @click="handleInfo(scope.row)">修改</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div v-show="!listLoading" class="pagination-container">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.page" :page-sizes="[10,20,30, 50]"
        :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

    <el-dialog title="编辑" v-model="dialogFormVisible" size='small'>
      <el-form :model="tempForm" label-position="left" label-width="70px">
        <el-form-item label="权限">
          <el-select style="width: 100%" v-model="tempForm.roles" multiple placeholder="请选择">
            <el-option v-for="item in roleOptions" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateUser">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="编辑简介" v-model="dialogInfoVisible">
      <el-form :model="infoForm">
        <el-form-item label="昵称">
          <el-input v-model="infoForm.display_name"></el-input>
        </el-form-item>
        <el-form-item label="简介">
          <el-input type="textarea" :autosize="{ minRows: 2}" v-model="infoForm.introduction"></el-input>
        </el-form-item>
        <el-form-item label="头像">

        </el-form-item>
        <div style='width:200px;height:200px;'>
          <singleImageUpload2 v-model="infoForm.image"></singleImageUpload2>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogInfoVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitInfo">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>


<script>
    import { mapGetters } from 'vuex';
    import { getRoleList, updateInfo } from 'api/adminUser';
    import { getUserList } from 'api/remoteSearch';
    import { objectMerge } from 'utils';
    import singleImageUpload2 from 'components/Upload/singleImage2';

    export default {
      name: 'adminUsersList',
      components: { singleImageUpload2 },
      data() {
        return {
          list: null,
          total: null,
          listLoading: true,
          listQuery: {
            page: 1,
            limit: 20,
            role: '',
            uid: undefined,
            display_name: ''
          },
          roleOptions: [],
          dialogFormVisible: false,
          tempForm: {
            uid: null,
            roles: []
          },
          dialogInfoVisible: false,
          infoForm: {
            uid: null,
            image: '',
            display_name: '',
            introduction: ''
          }
        }
      },
      computed: {
        ...mapGetters([
          'roles'
        ]),
        hasRoleEdit() {
          if (this.roles.indexOf('admin') >= 0) {
            return true;
          } else {
            return false;
          }
        }
      },
      created() {
        this.getList();
        this.getAdminRoleList();
      },
      methods: {
        getList() {
          getUserList(this.listQuery).then(response => {
            const data = response.data;
            this.list = data.items;
            this.total = data.count;
            this.listLoading = false;
          })
        },
        resetFilter() {
          this.listQuery = {
            page: 1,
            limit: 20,
            role: '',
            uid: undefined,
            display_name: ''
          }
          this.getList();
        },
        handleSizeChange(val) {
          this.listQuery.limit = val;
          this.getList();
        },
        handleCurrentChange(val) {
          this.listQuery.page = val;
          this.getList();
        },
        handleFilter() {
          this.getList();
        },
        getAdminRoleList() {
          getRoleList().then(response => {
            const roleMap = response.data.role_map;
            const keyArr = Object.keys(roleMap);
            this.roleOptions = keyArr.map(v => ({ value: v, label: roleMap[v] }));
          })
        },
        handleEdit(row) {
          this.dialogFormVisible = true;
          objectMerge(this.tempForm, row);
        },
        updateUser() {
          updateInfo(this.tempForm).then(() => {
            this.$notify({
              title: '成功',
              message: '修改成功',
              type: 'success'
            });
            for (const item of this.list) {
              if (item.uid === this.tempForm.uid) {
                const index = this.list.indexOf(item);
                this.list[index] = objectMerge(this.list[index], this.tempForm);
                break
              }
            }
            this.dialogFormVisible = false;
          });
        },
        handleInfo(row) {
          this.dialogInfoVisible = true;
          objectMerge(this.infoForm, row);
        },
        submitInfo() {
          updateInfo(this.infoForm).then(() => {
            this.$notify({
              title: '成功',
              message: '修改成功',
              type: 'success'
            });
            for (const item of this.list) {
              if (item.uid === this.infoForm.uid) {
                const index = this.list.indexOf(item);
                this.list[index] = objectMerge(this.list[index], this.infoForm);
                break
              }
            }
            this.dialogInfoVisible = false;
          });
        }
      }
    }
</script>

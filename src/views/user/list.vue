<template>
    <div class="app-container topic-list-container">
        <div class="filter-container">
            <el-input
                    style="width:200px"
                    @keyup.enter.native="handleFilter"
                    class="filter-item"
                    placeholder="display_name"
                    v-model="display_name">
            </el-input>
            <el-input
                    style="width:200px"
                    @keyup.enter.native="handleFilter"
                    class="filter-item"
                    placeholder="username"
                    v-model="username">
            </el-input>
            <el-select v-model="status" placeholder="状态" >
              <el-option
                v-for="item in statusOptions"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
            <el-button class="filter-item" style="margin-left: 30px;" type="primary" icon="search"
                       @click="handleFilter">搜索
            </el-button>
        </div>
        <el-table :data="list" v-loading.body="listLoading" border fit highlight-current-row>
            <el-table-column header prop="id" label="uid" width="160">
                <template scope="scope">
                    <span style="margin-left: 10px">{{scope.row.uid}}</span>
                </template>
            </el-table-column>

            <el-table-column label="display_name" show-overflow-tooltip>
                <template scope="scope">
                    <router-link class="link-type" :to="'/user/'+scope.row.uid">
                        {{scope.row.display_name}}
                    </router-link>
                </template>
            </el-table-column>

            <el-table-column label="username" show-overflow-tooltip>
                <template scope="scope">
                    <router-link class="link-type" :to="'/user/'+scope.row.uid">
                        {{scope.row.username}}
                    </router-link>
                </template>
            </el-table-column>

            <el-table-column label="手机号" width="150">
                <template scope="scope">
                    <span>{{scope.row.mobile}}</span>
                </template>
            </el-table-column>

             <el-table-column label="操作" width="120" align='center'>
                <template scope="scope">
                    <el-button v-if='condition.status==""' size="small" type="warning" @click="handleModifyUserStatus('frozen',scope.row)">
                    注销用户
                  </el-button>
                   <el-button v-else type="info" size="small" @click="handleModifyUserStatus('',scope.row)">解禁用户
                   </el-button>
                </template>
            </el-table-column>
        </el-table>

        <div v-show="!listLoading" class="pagination-container">
            <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="listQuery.page"
                    :page-sizes="[10,20,30, 50]"
                    :page-size="listQuery.limit"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total">
            </el-pagination>
        </div>
    </div>

</template>

<script>
    import { usersList, modifyStatus } from 'api/user';
    export default {
      name: 'fedUserList',
      data() {
        return {
          list: null,
          total: null,
          listLoading: true,
          listQuery: {
            page: 1,
            limit: 20,
            app_type: 'wscn',
            condition: ''
          },
          display_name: undefined,
          username: undefined,
          status: '',
          statusOptions: [{ label: '正常', value: '' }, { label: '已删除', value: 'frozen' }],
          condition: {
            status: ''
          }
        }
      },
      created() {
        this.fetchList();
      },
      watch: {
        display_name(value) {
          if (!value) return;
          this.condition = {
            display_name: value
          };
          this.username = '';
        },
        username(value) {
          if (!value) return;
          this.condition = {
            username: value
          };
          this.display_name = '';
        }
      },
      methods: {
        fetchList() {
          this.condition.status = this.status;
          this.listQuery.condition = JSON.stringify(this.condition);
          usersList(this.listQuery).then(response => {
            const data = response.data;
            this.list = data.items;
            this.total = data.total_count;
            this.listLoading = false;
          })
        },
        handleSizeChange(val) {
          this.listQuery.limit = val;
          this.fetchList();
        },
        handleCurrentChange(val) {
          this.listQuery.page = val;
          this.fetchList();
        },
        handleFilter() {
          this.fetchList();
        },
        handleModifyUserStatus(status, row) {
          const msg = status === 'frozen' ? '注销' : '恢复';
          this.$confirm('是否确' + msg + '用户:' + row.display_name || row.username, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            beforeClose: (action, instance, done) => {
              if (action === 'confirm') {
                modifyStatus(status, [row.uid]).then(() => {
                  this.$notify({
                    title: '成功',
                    message: msg + '成功',
                    type: 'success',
                    duration: 1600
                  });
                  for (const i of this.list) {
                    if (i.uid === row.uid) {
                      const index = this.list.indexOf(i);
                      this.list.splice(index, 1);
                      break;
                    }
                  }
                  done();
                }).catch(() => {
                  done();
                });
              } else {
                done();
              }
            }
          })
        }
      }
    }
</script>

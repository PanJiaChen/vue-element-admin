<template>
    <div>
        <el-badge :is-dot="true" style="line-height: 30px;" @click.native="dialogTableVisible=true">
            <el-button size="small" type="primary">
                <wscn-icon-svg icon-class="bug" class="meta-item__icon"/>
            </el-button>
        </el-badge>
        <el-dialog title="bug日志" v-model="dialogTableVisible">
            <el-table :data="logsList">
                <el-table-column label="message">
                    <template scope="scope">
                        <div>msg:{{ scope.row.err.message }}</div>
                        <br/>
                        <div>url: {{scope.row.url}}</div>
                    </template>
                </el-table-column>
                <el-table-column label="stack">
                    <template scope="scope">
                        {{ scope.row.err.stack}}
                    </template>
                </el-table-column>

            </el-table>
        </el-dialog>
    </div>
</template>

<script>
    export default {
      name: 'errLog',
      props: {
        logsList: {
          type: Array
        }
      },
      data() {
        return {
          dialogTableVisible: false
        }
      },
      methods: {}
    }
</script>

<template>
  <div class="app-container">
    <el-button type="primary" @click="handleAddClass">New Class</el-button>

    <el-table :data="classList" style="width: 100%;margin-top:30px;" border>
      <el-table-column align="center" label="ID" width="120">
        <template slot-scope="scope">
          {{ scope.row.id }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="Name" width="180">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="Description">
        <template slot-scope="scope">
          {{ scope.row.description }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="Operations">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="handleEdit(scope)">Edit</el-button>
          <el-button type="danger" size="small" @click="handleDelete(scope)">Delete</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :visible.sync="dialogVisible" :title="dialogType==='edit'?'Edit Class':'New Class'">
      <el-form :model="classItem" label-width="80px" label-position="left">
        <el-form-item label="Name">
          <el-input v-model="classItem.name" placeholder="Class Name" />
        </el-form-item>
        <el-form-item label="Description">
          <el-input
            v-model="classItem.description"
            :autosize="{ minRows: 2, maxRows: 4}"
            type="textarea"
            placeholder="Class Description"
          />
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="dialogVisible=false">Cancel</el-button>
        <el-button type="primary" @click="confirmClass">Confirm</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
const defaultClass = {
  id: 0,
  name: '',
  description: ''
}

export default {
  data() {
    return {
      classItem: Object.assign({}, defaultClass),
      classList: [
        { id: 1, name: 'Class 1', description: 'First class description' },
        { id: 2, name: 'Class 2', description: 'Second class description' },
        { id: 3, name: 'Class 3', description: 'Third class description' }
      ],
      dialogVisible: false,
      dialogType: 'new'
    }
  },
  methods: {
    handleAddClass() {
      this.classItem = Object.assign({}, defaultClass)
      this.dialogType = 'new'
      this.dialogVisible = true
    },
    handleEdit(scope) {
      this.classItem = Object.assign({}, scope.row)
      this.dialogType = 'edit'
      this.dialogVisible = true
    },
    handleDelete(scope) {
      this.$confirm('Are you sure to delete this class?', 'Warning', {
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
        type: 'warning'
      }).then(() => {
        const index = this.classList.findIndex(item => item.id === scope.row.id)
        this.classList.splice(index, 1)
        this.$message({
          type: 'success',
          message: 'Deleted successfully!'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: 'Delete canceled'
        })
      })
    },
    confirmClass() {
      if (this.dialogType === 'new') {
        // Generate a new ID
        const maxId = Math.max(...this.classList.map(item => item.id))
        this.classItem.id = maxId + 1
        // Add to list
        this.classList.push(Object.assign({}, this.classItem))
      } else {
        // Update existing class
        const index = this.classList.findIndex(item => item.id === this.classItem.id)
        if (index !== -1) {
          this.classList.splice(index, 1, Object.assign({}, this.classItem))
        }
      }
      this.dialogVisible = false
      this.$message({
        type: 'success',
        message: this.dialogType === 'new' ? 'Created successfully!' : 'Updated successfully!'
      })
    }
  }
}
</script>

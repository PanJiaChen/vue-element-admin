<template>
  <div class="app-container">
    <el-button type="primary" @click="handleAddUser">New User</el-button>

    <el-table :data="userList" style="width: 100%;margin-top:30px;" border>
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
      <el-table-column align="center" label="Email">
        <template slot-scope="scope">
          {{ scope.row.email }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="Class">
        <template slot-scope="scope">
          {{ scope.row.className }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="Operations">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="handleEdit(scope)">Edit</el-button>
          <el-button type="danger" size="small" @click="handleDelete(scope)">Delete</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :visible.sync="dialogVisible" :title="dialogType==='edit'?'Edit User':'New User'">
      <el-form :model="user" label-width="80px" label-position="left">
        <el-form-item label="Name">
          <el-input v-model="user.name" placeholder="User Name" />
        </el-form-item>
        <el-form-item label="Email">
          <el-input v-model="user.email" placeholder="User Email" />
        </el-form-item>
        <el-form-item label="Class">
          <el-select v-model="user.classId" placeholder="Select Class">
            <el-option
              v-for="cls in classList"
              :key="cls.id"
              :label="cls.name"
              :value="cls.id"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="dialogVisible=false">Cancel</el-button>
        <el-button type="primary" @click="confirmUser">Confirm</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
const defaultUser = {
  id: 0,
  name: '',
  email: '',
  classId: 0,
  className: ''
}

export default {
  data() {
    return {
      user: Object.assign({}, defaultUser),
      userList: [
        { id: 1, name: 'John Doe', email: 'john@example.com', classId: 1, className: 'Class 1' },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com', classId: 2, className: 'Class 2' },
        { id: 3, name: 'Bob Johnson', email: 'bob@example.com', classId: 3, className: 'Class 3' }
      ],
      classList: [
        { id: 1, name: 'Class 1' },
        { id: 2, name: 'Class 2' },
        { id: 3, name: 'Class 3' }
      ],
      dialogVisible: false,
      dialogType: 'new'
    }
  },
  methods: {
    handleAddUser() {
      this.user = Object.assign({}, defaultUser)
      this.dialogType = 'new'
      this.dialogVisible = true
    },
    handleEdit(scope) {
      this.user = Object.assign({}, scope.row)
      this.dialogType = 'edit'
      this.dialogVisible = true
    },
    handleDelete(scope) {
      this.$confirm('Are you sure to delete this user?', 'Warning', {
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
        type: 'warning'
      }).then(() => {
        const index = this.userList.findIndex(item => item.id === scope.row.id)
        this.userList.splice(index, 1)
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
    confirmUser() {
      if (this.dialogType === 'new') {
        // Generate a new ID
        const maxId = Math.max(...this.userList.map(item => item.id))
        this.user.id = maxId + 1
        // Get class name
        const selectedClass = this.classList.find(cls => cls.id === this.user.classId)
        this.user.className = selectedClass ? selectedClass.name : ''
        // Add to list
        this.userList.push(Object.assign({}, this.user))
      } else {
        // Update existing user
        const index = this.userList.findIndex(item => item.id === this.user.id)
        if (index !== -1) {
          // Get class name
          const selectedClass = this.classList.find(cls => cls.id === this.user.classId)
          this.user.className = selectedClass ? selectedClass.name : ''
          // Update the user
          this.userList.splice(index, 1, Object.assign({}, this.user))
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


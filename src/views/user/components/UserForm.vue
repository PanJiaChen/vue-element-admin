<template>
  <el-form ref="userForm" :model="user" label-width="100px" label-position="left">
    <el-form-item label="Name" prop="name" :rules="[{ required: true, message: 'Please input user name', trigger: 'blur' }]">
      <el-input v-model="user.name" placeholder="User Name" />
    </el-form-item>
    <el-form-item label="Email" prop="email" :rules="[{ required: true, message: 'Please input user email', trigger: 'blur' }, { type: 'email', message: 'Please enter a valid email address', trigger: 'blur' }]">
      <el-input v-model="user.email" placeholder="User Email" />
    </el-form-item>
    <el-form-item label="Class" prop="classId" :rules="[{ required: true, message: 'Please select a class', trigger: 'change' }]">
      <el-select v-model="user.classId" placeholder="Select Class">
        <el-option
          v-for="cls in classList"
          :key="cls.id"
          :label="cls.name"
          :value="cls.id"
        />
      </el-select>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submitForm">Confirm</el-button>
      <el-button @click="cancel">Cancel</el-button>
    </el-form-item>
  </el-form>
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
  name: 'UserForm',
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      user: Object.assign({}, defaultUser),
      classList: [
        { id: 1, name: 'Class 1' },
        { id: 2, name: 'Class 2' },
        { id: 3, name: 'Class 3' }
      ]
    }
  },
  created() {
    if (this.isEdit) {
      // In a real application, you would fetch the user data from an API
      // For this demo, we'll use mock data
      const userId = parseInt(this.$route.params.id)
      this.user = {
        id: userId,
        name: `User ${userId}`,
        email: `user${userId}@example.com`,
        classId: Math.floor(Math.random() * 3) + 1,
        className: `Class ${Math.floor(Math.random() * 3) + 1}`
      }
    }
  },
  methods: {
    submitForm() {
      this.$refs['userForm'].validate((valid) => {
        if (valid) {
          // In a real application, you would send the data to an API
          // For this demo, we'll just show a success message
          this.$message({
            type: 'success',
            message: this.isEdit ? 'User updated successfully!' : 'User created successfully!'
          })
          // Redirect to user list page
          this.$router.push('/user/list')
        } else {
          return false
        }
      })
    },
    cancel() {
      this.$router.push('/user/list')
    }
  }
}
</script>

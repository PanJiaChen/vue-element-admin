<template>
  <el-form ref="classForm" :model="classItem" label-width="100px" label-position="left">
    <el-form-item label="Name" prop="name" :rules="[{ required: true, message: 'Please input class name', trigger: 'blur' }]">
      <el-input v-model="classItem.name" placeholder="Class Name" />
    </el-form-item>
    <el-form-item label="Description" prop="description" :rules="[{ required: true, message: 'Please input class description', trigger: 'blur' }]">
      <el-input
        v-model="classItem.description"
        :autosize="{ minRows: 2, maxRows: 4}"
        type="textarea"
        placeholder="Class Description"
      />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submitForm">Confirm</el-button>
      <el-button @click="cancel">Cancel</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
const defaultClass = {
  id: 0,
  name: '',
  description: ''
}

export default {
  name: 'ClassForm',
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      classItem: Object.assign({}, defaultClass)
    }
  },
  created() {
    if (this.isEdit) {
      // In a real application, you would fetch the class data from an API
      // For this demo, we'll use mock data
      const classId = parseInt(this.$route.params.id)
      this.classItem = {
        id: classId,
        name: `Class ${classId}`,
        description: `Description for Class ${classId}`
      }
    }
  },
  methods: {
    submitForm() {
      this.$refs['classForm'].validate((valid) => {
        if (valid) {
          // In a real application, you would send the data to an API
          // For this demo, we'll just show a success message
          this.$message({
            type: 'success',
            message: this.isEdit ? 'Class updated successfully!' : 'Class created successfully!'
          })
          // Redirect to class list page
          this.$router.push('/class/list')
        } else {
          return false
        }
      })
    },
    cancel() {
      this.$router.push('/class/list')
    }
  }
}
</script>

<template>
  <div class="components-container">
    <aside>FormCreate is base on <a href="http://www.form-create.com/" target="_blank">form-create</a>.</aside>
    <div>
      <FromCreate />
    </div>
  </div>
</template>

<script>
import FromCreate from '../../components/FormCreate/index'
export default {
  name: 'CreateForm',
  components: { FromCreate }
}
</script>

<style scoped>

</style>

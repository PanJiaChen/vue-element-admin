<template>
  <div>
    <ClassForm :is-edit="false" />
  </div>
</template>

<script>
import ClassForm from './components/ClassForm'

export default {
  name: 'ClassCreate',
  components: {
    ClassForm
  }
}
</script>

<template>
  <div>
    <ClassForm :is-edit="true" />
  </div>
</template>

<script>
import ClassForm from './components/ClassForm'

export default {
  name: 'ClassEdit',
  components: {
    ClassForm
  }
}
</script>

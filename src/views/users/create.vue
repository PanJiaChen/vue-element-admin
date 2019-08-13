<template>
  <user-detail :is-edit="false" />
</template>

<script>
import UserDetail from './components/UserDetail'

export default {
  name: 'CreateForm',
  components: { UserDetail }
}
</script>


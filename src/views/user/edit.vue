<template>
  <div>
    <UserForm :is-edit="true" />
  </div>
</template>

<script>
import UserForm from './components/UserForm'

export default {
  name: 'EditUser',
  components: { UserForm }
}
</script>


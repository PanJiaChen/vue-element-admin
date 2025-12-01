<template>
  <div class="app-container">
    <user-form :is-edit="false" />
  </div>
</template>

<script>
import UserForm from './components/UserForm'

export default {
  name: 'CreateUser',
  components: { UserForm }
}
</script>

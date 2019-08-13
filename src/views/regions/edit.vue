<template>
  <account-detail :is-edit="true" />
</template>

<script>
import AccountDetail from './components/AccountDetail'

export default {
  name: 'EditForm',
  components: { AccountDetail }
}
</script>


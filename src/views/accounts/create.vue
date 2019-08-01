<template>
  <account-detail :is-edit="false" />
</template>

<script>
import AccountDetail from './components/AccountDetail'

export default {
  name: 'CreateForm',
  components: { AccountDetail }
}
</script>


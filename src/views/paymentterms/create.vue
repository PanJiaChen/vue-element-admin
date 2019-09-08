<template>
  <payment-terms-details :is-edit="false" />
</template>

<script>
import PaymentTermsDetails from './components/PaymentTermsDetails'

export default {
  name: 'CreateForm',
  components: { PaymentTermsDetails }
}
</script>


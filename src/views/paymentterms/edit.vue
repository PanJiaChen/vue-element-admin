<template>
  <payment-terms-details :is-edit="true" />
</template>

<script>
import PaymentTermsDetails from './components/PaymentTermsDetails'

export default {
  name: 'EditForm',
  components: { PaymentTermsDetails }
}
</script>


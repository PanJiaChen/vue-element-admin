<template>
  <lifting-period-detail :is-edit="true" />
</template>

<script>
import LiftingPeriodDetail from './components/LiftingPeriodDetail'

export default {
  name: 'EditForm',
  components: { LiftingPeriodDetail }
}
</script>


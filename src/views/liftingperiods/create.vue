<template>
  <lifting-period-detail :is-edit="false" />
</template>

<script>
import LiftingPeriodDetail from './components/LiftingPeriodDetail'

export default {
  name: 'CreateForm',
  components: { LiftingPeriodDetail }
}
</script>


<template>
  <div class="app-container">
    <div style="margin:0 0 5px 20px">
      Fixed header, sorted by header order,
    </div>
    <fixed-thead />

    <div style="margin:30px 0 5px 20px">
      Not fixed header, sorted by click order
    </div>
    <unfixed-thead />
  </div>
</template>

<script>
import fixedThead from './fixedThead'
import unfixedThead from './unfixedThead'

export default {
  name: 'DynamicTable',
  components: { fixedThead, unfixedThead }
}
</script>


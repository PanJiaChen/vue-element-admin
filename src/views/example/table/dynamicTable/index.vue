<template>
  <div class="app-container">
    <div style='margin:0 0 5px 20px'>{{$t('table.dynamicTips1')}}</div>
    <fixed-thead></fixed-thead>

    <div style='margin:30px 0 5px 20px'>{{$t('table.dynamicTips2')}}</div>
    <unfixed-thead></unfixed-thead>
  </div>
</template>

<script>
import fixedThead from './fixedThead'
import unfixedThead from './unfixedThead'

export default {
  name: 'dynamicTable',
  components: { fixedThead, unfixedThead }
}
</script>


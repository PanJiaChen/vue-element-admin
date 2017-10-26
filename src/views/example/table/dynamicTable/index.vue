<template>
  <div class="app-container">
    <div style='margin:0 0 5px 20px'>固定表头 按照表头顺序排序</div>
    <fixed-thead></fixed-thead>

    <div style='margin:30px 0 5px 20px'>不固定表头 按照点击顺序排序</div>
    <unfixed-thead></unfixed-thead>
  </div>
</template>

<script>
import fixedThead from './fixedThead'
import unfixedThead from './unfixedThead'

export default {
  components: { fixedThead, unfixedThead }
}
</script>


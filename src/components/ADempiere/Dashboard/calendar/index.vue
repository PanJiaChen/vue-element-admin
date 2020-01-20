<template>
  <el-collapse v-model="activeCalendar" accordion>
    <el-collapse-item name="calendar">
      <template slot="title">
        <i class="el-icon-date" style="margin-right: 4px;margin-left: 10px;" />
        {{ $t('route.calendar') }}
      </template>
      <el-calendar>
        <!-- Use 2.5 slot syntax. If you use Vue 2.6, please use new slot syntax-->
        <template
          slot="dateCell"
          slot-scope="{date, data}"
        >
          <p :class="data.isSelected ? 'is-selected' : ''">
            {{ data.day.split('-').slice(2).join('-') }} {{ data.isSelected ? '✔️' : '' }}
          </p>
        </template>
      </el-calendar>
    </el-collapse-item>
  </el-collapse>
</template>

<script>
export default {
  name: 'Calendar',
  data() {
    return {
      activeCalendar: 'calendar',
      value: new Date()
    }
  }
}
</script>

<style>
  .is-selected {
    color: #1989FA;
  }
</style>

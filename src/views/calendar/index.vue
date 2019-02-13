<template>
  <div class="app-container">
    <div>
      <el-button @click="getAllSchedules">Get All Schedules</el-button>
      <el-select v-model="selectedView">
        <el-option v-for="option in viewModeOptions" :key="option" :value="option">
          {{ option }}
        </el-option>
      </el-select>
      <el-button @click="moveDate('prev')">prev</el-button>
      <el-button @click="moveDate('today')">today</el-button>
      <el-button @click="moveDate('next')">next</el-button>
      <span>{{ dateRange }}</span>
    </div>
    <div class="calendar">
      <tui-calendar
        ref="tuiCal"
        :view="selectedView"
        :default-schedules="scheduleList"
        :calendars="calendarList"
        :task-view="taskView"
        :schedule-view="scheduleView"
        :use-detail-popup="useDetailPopup"
        :use-creation-popup="useCreationPopup"
        :disable-dbl-click="disableDblClick"
        :readonly="readonly"
        :month="month"
        :week="week"
        :timezones="timezones"
        :template="templates"
        :theme="theme"
        :on-create-schedule="onCreateSchedule"
        :on-update-schedule="onUpdateSchedule"
        :on-delete-schedule="onDeleteSchedule"
        @clickSchedule="onClickSchedule"
        @afterRenderSchedule="onAfterRenderSchedule"
        @clickTimezonesCollapseBtn="onClickTimezonesCollapseBtn"
        @clickDayname="onClickDayname"
        @clickMore="onClickMore"
      />
    </div>
  </div>
</template>

<script>
import TuiCalendar from './components/TuiCalendar'
import dayjs from 'dayjs'
import theme from './components/theme'
import 'tui-time-picker/dist/tui-time-picker.css'
import 'tui-date-picker/dist/tui-date-picker.css'
import 'tui-calendar/dist/tui-calendar.css'

export default {
  name: 'CalendarDemo',
  components: {
    TuiCalendar
  },
  data() {
    const scheduleList = [
      {
        id: '1',
        calendarId: '0',
        title: 'TOAST UI Calendar',
        category: 'time',
        dueDateClass: '',
        start: dayjs().toDate(),
        end: dayjs().add(3, 'hour').toDate()
      },
      {
        id: '2',
        calendarId: '1',
        title: 'Practice',
        category: 'milestone',
        dueDateClass: '',
        start: dayjs().add(1, 'day').toDate(),
        end: dayjs().add(1, 'day').toDate(),
        isReadOnly: true
      },
      {
        id: '3',
        calendarId: '1',
        title: 'FE Workshop',
        category: 'allday',
        dueDateClass: '',
        start: dayjs().subtract(2, 'day').toDate(),
        end: dayjs().subtract(1, 'day').toDate(),
        isReadOnly: true
      },
      {
        id: '4',
        calendarId: '1',
        title: 'Report',
        category: 'time',
        dueDateClass: '',
        start: dayjs().toDate(),
        end: dayjs().add(1, 'hour').toDate()
      }
    ]
    const calendarList = [
      {
        id: '0',
        name: 'Private',
        bgColor: '#9e5fff',
        borderColor: '#9e5fff'
      },
      {
        id: '1',
        name: 'Company',
        bgColor: '#00a9ff',
        borderColor: '#00a9ff'
      }
    ]
    const templates = {
      milestone(schedule) {
        return `<span style="color:#fff;background-color: ${schedule.bgColor};">${schedule.title}</span>`
      },
      milestoneTitle() {
        return 'Milestone'
      },
      allday(schedule) {
        return `${schedule.title}<i class="fa fa-refresh"></i>`
      },
      alldayTitle() {
        return 'All Day'
      }
    }

    const timezones = [{
      timezoneOffset: 480,
      displayLabel: 'GMT+08:00',
      tooltip: 'China'
    }, {
      timezoneOffset: -420,
      displayLabel: 'GMT-08:00',
      tooltip: 'Los Angeles'
    }]

    return {
      dateRange: '',
      selectedView: 'month',
      viewModeOptions: ['month', 'week', 'day'],
      month: {
        startDayOfWeek: 0
      },
      week: {
        showTimezoneCollapseButton: true,
        timezonesCollapsed: true
      },
      timezones,
      scheduleList,
      calendarList,
      templates,
      taskView: true,
      scheduleView: true,
      useDetailPopup: true,
      useCreationPopup: true,
      disableDblClick: true,
      readonly: false,
      theme
    }
  },
  watch: {
    selectedView() {
      this.refreshRangeText()
    }
  },
  created() {
    document.querySelector('.app-main').style.overflow = 'visible'
  },
  mounted() {
    this.refreshRangeText()
  },
  beforeDestroy() {
    document.querySelector('.app-main').style.overflow = null
  },
  methods: {
    getAllSchedules() {
      console.log(this.$refs.tuiCal.getAllSchedules())
    },
    refreshRangeText() {
      this.$nextTick(() => {
        const { invoke } = this.$refs.tuiCal
        const view = invoke('getViewName')

        if (view === 'month') {
          const calDate = invoke('getDate')
          this.dateRange = dayjs(calDate).format('YYYY-MM')
        } else if (view === 'week') {
          const rangeStart = invoke('getDateRangeStart')
          const rangeEnd = invoke('getDateRangeEnd')
          const start = dayjs(rangeStart).format('YYYY-MM-DD')
          const end = dayjs(rangeEnd).format('YYYY-MM-DD')
          this.dateRange = `${start} ~ ${end}`
        } else {
          const calDate = invoke('getDate')
          this.dateRange = dayjs(calDate).format('YYYY-MM-DD')
        }
      })
    },
    onAfterRenderSchedule(payload) {
      console.group('onAfterRenderSchedule')
      console.log('Schedule Info: ', payload.schedule)
      console.groupEnd()
    },
    onClickSchedule(payload) {
      console.group('onClickSchedule')
      console.log('MouseEvent: ', payload.event)
      console.log('Calendar Info: ', payload.calendar)
      console.log('Schedule Info: ', payload.schedule)
      console.groupEnd()
    },
    onClickDayname(payload) {
      console.group('onClickSchedule')
      console.log('Date: ', payload.date)
      console.groupEnd()
    },
    onClickMore(payload) {
      console.group('onClickSchedule')
      console.log('target: ', payload.target)
      console.log('date: ', payload.date)
      console.groupEnd()
    },
    onClickTimezonesCollapseBtn(timezonesCollapsed) {
      console.group('onClickTimezonesCollapseBtn')
      console.log('Is Collapsed Timezone? ', timezonesCollapsed)
      console.groupEnd()

      if (timezonesCollapsed) {
        this.theme['week.timegridLeft.width'] = '100px'
        this.theme['week.daygridLeft.width'] = '100px'
      } else {
        this.theme['week.timegridLeft.width'] = '50px'
        this.theme['week.daygridLeft.width'] = '50px'
      }
    },
    onCreateSchedule(schedule) {
      console.group('onCreateSchedule')
      console.log('schedule', schedule)
      console.groupEnd()

      schedule.id = String(Date.now()).slice(-3)
    },
    onUpdateSchedule(payload) {
      console.group('onUpdateSchedule')
      console.log('calendar', payload.calendar)
      console.log('schedule', payload.schedule)
      console.groupEnd()
    },
    onDeleteSchedule({ schedule }) {
      console.group('onDeleteSchedule')
      console.log('schedule', schedule)
      console.groupEnd()
    },
    moveDate(action) {
      this.$refs.tuiCal.invoke(action)
      this.refreshRangeText()
    }
  }
}
</script>

<style scoped>
  .calendar {
    margin-top: 20px;
  }
</style>

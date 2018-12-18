<template>
  <div :style="{height}"/>
</template>
<script>
import TuiCalendar from 'tui-calendar'

const calendarEvents = [
  'afterRenderSchedule',
  'clickDayname',
  'clickMore',
  'clickSchedule',
  'clickTimezonesCollapseBtn'
]

const scheduleNeedProps = ['start', 'category']

function cloneObj(obj) {
  return JSON.parse(JSON.stringify(obj))
}

export default {
  name: 'ToastUICalendar',
  props: {
    tag: {
      type: String,
      default: 'div'
    },
    calendars: {
      type: Array,
      default() { return [] }
    },
    defaultSchedules: {
      type: Array,
      default() { return [] },
      validator(val) {
        if (val) {
          return val.every(schedule => scheduleNeedProps.every(prop => schedule.hasOwnProperty(prop)))
        }
        return true
      }
    },
    view: {
      type: String,
      default: 'month'
    },
    taskView: {
      type: [Boolean, Array],
      default: true
    },
    scheduleView: {
      type: [Boolean, Array],
      default: true
    },
    theme: {
      type: Object,
      default() { return {} }
    },
    template: {
      type: Object,
      default() { return {} }
    },
    week: {
      type: Object,
      default() { return {} }
    },
    month: {
      type: Object,
      default() { return {} }
    },
    timezones: {
      type: Array,
      default() { return [] }
    },
    useCreationPopup: {
      type: Boolean,
      default: true
    },
    useDetailPopup: {
      type: Boolean,
      default: true
    },
    disableDblClick: {
      type: Boolean,
      default: false
    },
    readonly: {
      type: Boolean,
      default: false
    },
    onUpdateSchedule: {
      type: Function,
      default: () => { return true }
    },
    onCreateSchedule: {
      type: Function,
      default: () => { return true }
    },
    onDeleteSchedule: {
      type: Function,
      default: () => { return true }
    },
    height: {
      type: String,
      default: '800px'
    }
  },
  data() {
    return {
      calendar: null,
      scheduleIds: []
    }
  },
  watch: {
    calendars(val) {
      this.calendar.setCalendars(val)
    },
    defaultSchedules() {
      this.reflectSchedules()
    },
    view(val) {
      this.calendar.changeView(val, true)
    },
    taskView(val) {
      this.calendar.setOptions({ taskView: val })
    },
    scheduleView(val) {
      this.calendar.setOptions({ scheduleView: val })
    },
    theme: {
      deep: true,
      handler(val) {
        this.calendar.setTheme(cloneObj(val))
      }
    },
    week: {
      deep: true,
      handler(val) {
        const silent = this.view !== 'week' && this.view !== 'day'
        this.calendar.setOptions({ week: cloneObj(val) }, silent)
      }
    },
    month: {
      deep: true,
      handler(val) {
        const silent = this.view !== 'month'
        this.calendar.setOptions({ month: cloneObj(val) }, silent)
      }
    },
    timezones(val) {
      this.calendar.setOptions({ timezones: val })
    },
    disableDblClick(val) {
      this.calendar.setOptions({ disableDblClick: val })
    },
    readonly(val) {
      this.calendar.setOptions({ isReadOnly: val })
    }
  },
  mounted() {
    this.calendar = new TuiCalendar(this.$el, {
      defaultView: this.view,
      taskView: this.taskView,
      scheduleView: this.scheduleView,
      theme: this.theme,
      template: this.template,
      week: this.week,
      month: this.month,
      calendars: this.calendars,
      timezones: this.timezones,
      useCreationPopup: this.useCreationPopup,
      useDetailPopup: this.useDetailPopup,
      disableDblClick: this.disableDblClick,
      isReadOnly: this.readonly
    })
    this.registerEvents()
    this.reflectSchedules()
  },
  beforeDestroy() {
    calendarEvents.forEach(event => {
      this.calendar.off(event)
    })
    this.calendar.destroy()
  },
  methods: {
    registerEvents() {
      calendarEvents.forEach(event => {
        this.calendar.on(event, (...args) => {
          this.$emit(event, ...args)
          return true
        })
      })
      this.calendar.on('beforeCreateSchedule', this.beforeCreateSchedule)
      this.calendar.on('beforeUpdateSchedule', this.beforeUpdateSchedule)
      this.calendar.on('beforeDeleteSchedule', this.beforeDeleteSchedule)
    },
    reflectSchedules() {
      this.calendar.clear(true)
      if (this.defaultSchedules) {
        this.calendar.createSchedules(this.defaultSchedules, true)
        this.scheduleIds = this.defaultSchedules.map(t => ({
          scheduleId: t.id,
          calendarId: t.calendarId
        }))
      }
      this.calendar.render()
    },
    invoke(methodName, ...args) {
      if (this.calendar[methodName]) {
        return this.calendar[methodName](...args)
      }
      console.error(`method ${methodName} not found in tui-calendar instance`)
    },
    beforeCreateSchedule(payload) {
      const result = this.onCreateSchedule(payload)
      if (result === false) {
        return
      }

      const schedule = this.saveNewSchedule(payload)
      this.scheduleIds.push({
        scheduleId: schedule.id,
        calendarId: schedule.calendarId
      })
      this.$emit('change', { type: 'create', schedule })
    },
    beforeUpdateSchedule(payload) {
      const result = this.onUpdateSchedule(payload)
      if (result === false) {
        return
      }

      const { schedule, start, end } = payload
      schedule.start = start
      schedule.end = end

      this.calendar.updateSchedule(schedule.id, schedule.calendarId, schedule)
      this.$emit('change', { type: 'update', schedule })
    },
    beforeDeleteSchedule(payload) {
      const result = this.onDeleteSchedule(payload)
      if (result === false) {
        return
      }

      const { schedule } = payload

      this.calendar.deleteSchedule(schedule.id, schedule.calendarId)
      const index = this.scheduleIds.findIndex(t => t.scheduleId === schedule.id && t.calendarId === schedule.calendarId)
      this.scheduleIds.splice(index, 1)
      this.$emit('change', { type: 'delete', schedule })
    },
    saveNewSchedule(scheduleData) {
      const calendar = scheduleData.calendar || this.findCalendar(scheduleData.calendarId)
      const schedule = {
        id: scheduleData.id || String(Date.now()),
        title: scheduleData.title,
        isAllDay: scheduleData.isAllDay,
        start: scheduleData.start,
        end: scheduleData.end,
        category: scheduleData.isAllDay ? 'allday' : 'time',
        dueDateClass: '',
        location: scheduleData.location,
        raw: {
          class: scheduleData.raw['class']
        },
        state: scheduleData.state
      }
      if (calendar) {
        schedule.calendarId = calendar.id
        schedule.color = calendar.color
        schedule.bgColor = calendar.bgColor
        schedule.dragBgColor = calendar.bgColor
        schedule.borderColor = calendar.borderColor
      }

      this.calendar.createSchedules([schedule])
      return schedule
    },
    findCalendar(id) {
      if (this.calendars) {
        return this.calendars.find(t => t.id === id)
      }
      return null
    },
    getAllSchedules() {
      return this.scheduleIds.map(item => this.calendar.getSchedule(item.scheduleId, item.calendarId))
    }
  }
}
</script>

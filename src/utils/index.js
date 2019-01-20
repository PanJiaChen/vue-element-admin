/**
 * Created by jiachenpan on 16/11/18.
 */

export function parseTime(time, cFormat) {
  if (arguments.length === 0 || time == null) {
    return null
  }
  if (typeof time === 'string') {
    return time
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if (('' + time).length === 10) time = parseInt(time) * 1000
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
    let value = formatObj[key]
    // Note: getDay() returns 0 on Sunday
    if (key === 'a') { return ['日', '一', '二', '三', '四', '五', '六'][value ] }
    if (result.length > 0 && value < 10) {
      value = '0' + value
    }
    return value || 0
  })
  return time_str
}

export function formatTime(time, option) {
  time = +time * 1000
  const d = new Date(time)
  const now = Date.now()

  const diff = (now - d) / 1000

  if (diff < 30) {
    return '刚刚'
  } else if (diff < 3600) {
    // less 1 hour
    return Math.ceil(diff / 60) + '分钟前'
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + '小时前'
  } else if (diff < 3600 * 24 * 2) {
    return '1天前'
  }
  if (option) {
    return parseTime(time, option)
  } else {
    return (
      d.getMonth() +
      1 +
      '月' +
      d.getDate() +
      '日' +
      d.getHours() +
      '时' +
      d.getMinutes() +
      '分'
    )
  }
}

// 格式化时间
export function getQueryObject(url) {
  url = url == null ? window.location.href : url
  const search = url.substring(url.lastIndexOf('?') + 1)
  const obj = {}
  const reg = /([^?&=]+)=([^?&=]*)/g
  search.replace(reg, (rs, $1, $2) => {
    const name = decodeURIComponent($1)
    let val = decodeURIComponent($2)
    val = String(val)
    obj[name] = val
    return rs
  })
  return obj
}

/**
 *get getByteLen
 * @param {Sting} val input value
 * @returns {number} output value
 */
export function getByteLen(val) {
  let len = 0
  for (let i = 0; i < val.length; i++) {
    if (val[i].match(/[^\x00-\xff]/gi) != null) {
      len += 1
    } else {
      len += 0.5
    }
  }
  return Math.floor(len)
}

export function cleanArray(actual) {
  const newArray = []
  for (let i = 0; i < actual.length; i++) {
    if (actual[i]) {
      newArray.push(actual[i])
    }
  }
  return newArray
}

export function param(json) {
  if (!json) return ''
  return cleanArray(
    Object.keys(json).map(key => {
      if (json[key] === undefined) return ''
      return encodeURIComponent(key) + '=' + encodeURIComponent(json[key])
    })
  ).join('&')
}

export function param2Obj(url) {
  const search = url.split('?')[1]
  if (!search) {
    return {}
  }
  return JSON.parse(
    '{"' +
      decodeURIComponent(search)
        .replace(/"/g, '\\"')
        .replace(/&/g, '","')
        .replace(/=/g, '":"') +
      '"}'
  )
}

export function html2Text(val) {
  const div = document.createElement('div')
  div.innerHTML = val
  return div.textContent || div.innerText
}

export function objectMerge(target, source) {
  /* Merges two  objects,
     giving the last one precedence */

  if (typeof target !== 'object') {
    target = {}
  }
  if (Array.isArray(source)) {
    return source.slice()
  }
  Object.keys(source).forEach(property => {
    const sourceProperty = source[property]
    if (typeof sourceProperty === 'object') {
      target[property] = objectMerge(target[property], sourceProperty)
    } else {
      target[property] = sourceProperty
    }
  })
  return target
}

export function scrollTo(element, to, duration) {
  if (duration <= 0) return
  const difference = to - element.scrollTop
  const perTick = (difference / duration) * 10
  setTimeout(() => {
    element.scrollTop = element.scrollTop + perTick
    if (element.scrollTop === to) return
    scrollTo(element, to, duration - 10)
  }, 10)
}

export function toggleClass(element, className) {
  if (!element || !className) {
    return
  }
  let classString = element.className
  const nameIndex = classString.indexOf(className)
  if (nameIndex === -1) {
    classString += '' + className
  } else {
    classString =
      classString.substr(0, nameIndex) +
      classString.substr(nameIndex + className.length)
  }
  element.className = classString
}

export const pickerOptions = [
  {
    text: '今天',
    onClick(picker) {
      const end = new Date()
      const start = new Date(new Date().toDateString())
      end.setTime(start.getTime())
      picker.$emit('pick', [start, end])
    }
  },
  {
    text: '最近一周',
    onClick(picker) {
      const end = new Date(new Date().toDateString())
      const start = new Date()
      start.setTime(end.getTime() - 3600 * 1000 * 24 * 7)
      picker.$emit('pick', [start, end])
    }
  },
  {
    text: '最近一个月',
    onClick(picker) {
      const end = new Date(new Date().toDateString())
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
      picker.$emit('pick', [start, end])
    }
  },
  {
    text: '最近三个月',
    onClick(picker) {
      const end = new Date(new Date().toDateString())
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
      picker.$emit('pick', [start, end])
    }
  }
]

export function getTime(type) {
  if (type === 'start') {
    return new Date().getTime() - 3600 * 1000 * 24 * 90
  } else {
    return new Date(new Date().toDateString())
  }
}

export function debounce(func, wait, immediate) {
  let timeout, args, context, timestamp, result

  const later = function() {
    // 据上一次触发时间间隔
    const last = +new Date() - timestamp

    // 上次被包装函数被调用时间间隔last小于设定时间间隔wait
    if (last < wait && last > 0) {
      timeout = setTimeout(later, wait - last)
    } else {
      timeout = null
      // 如果设定为immediate===true，因为开始边界已经调用过了此处无需调用
      if (!immediate) {
        result = func.apply(context, args)
        if (!timeout) context = args = null
      }
    }
  }

  return function(...args) {
    context = this
    timestamp = +new Date()
    const callNow = immediate && !timeout
    // 如果延时不存在，重新设定延时
    if (!timeout) timeout = setTimeout(later, wait)
    if (callNow) {
      result = func.apply(context, args)
      context = args = null
    }

    return result
  }
}

/**
 * This is just a simple version of deep copy
 * Has a lot of edge cases bug
 * If you want to use a perfect deep copy, use lodash's _.cloneDeep
 */
export function deepClone(source) {
  if (!source && typeof source !== 'object') {
    throw new Error('error arguments', 'shallowClone')
  }
  const targetObj = source.constructor === Array ? [] : {}
  Object.keys(source).forEach(keys => {
    if (source[keys] && typeof source[keys] === 'object') {
      targetObj[keys] = deepClone(source[keys])
    } else {
      targetObj[keys] = source[keys]
    }
  })
  return targetObj
}

export function uniqueArr(arr) {
  return Array.from(new Set(arr))
}

export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

// 获取d当前时间多少天后的日期和对应星期
export function getDates(days) {
  // todate默认参数是当前日期，可以传入对应时间
  var dateArry = []
  for (var i = 0; i < days; i++) {
    var dateObj = dateLater(getCurrentMonthFirst(), i)
    dateArry.push(dateObj)
  }
  return dateArry
}
/** * 传入时间后几天 * param：传入时间：dates:"2018-04-02",later:往后多少天 */
export function dateLater(dates, later) {
  var dateObj = {}
  var show_day = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
  var date = new Date(dates)
  date.setDate(date.getDate() + later)
  var day = date.getDay()
  dateObj.year = date.getFullYear()
  dateObj.month = ((date.getMonth() + 1) < 10 ? ('0' + (date.getMonth() + 1)) : date.getMonth() + 1)
  dateObj.day = (date.getDate() < 10 ? ('0' + date.getDate()) : date.getDate())
  dateObj.week = show_day[day]
  return dateObj
}

// 获取当前时间
export function getCurrentMonthFirst() {
  var date = new Date()
  var todate = date.getFullYear() + '-' + ((date.getMonth() + 1) < 10 ? ('0' + (date.getMonth() + 1)) : date.getMonth() + 1) + '-' + (date.getDate() < 10 ? ('0' + date.getDate()) : date.getDate())

  return todate
}

export function getDays() {
  var data = new Date()
  var setData = ''
  var weeks = dateLater(data, 0).week
  switch (weeks) {
    case '周一':
      setData = [
        dateLater(data, 0).day,
        dateLater(data, 1).day,
        dateLater(data, 2).day,
        dateLater(data, 3).day,
        dateLater(data, 4).day,
        dateLater(data, 5).day,
        dateLater(data, 6).day
      ]
      break
    case '周二':
      setData = [
        dateLater(data, -1).day,
        dateLater(data, 0).day,
        dateLater(data, 1).day,
        dateLater(data, 2).day,
        dateLater(data, 3).day,
        dateLater(data, 4).day,
        dateLater(data, 5).day
      ]
      break
    case '周三':
      setData = [
        dateLater(data, -2).day,
        dateLater(data, -1).day,
        dateLater(data, 0).day,
        dateLater(data, 1).day,
        dateLater(data, 2).day,
        dateLater(data, 3).day,
        dateLater(data, 4).day
      ]
      break
    case '周四':
      setData = [
        dateLater(data, -3).day,
        dateLater(data, -2).day,
        dateLater(data, -1).day,
        dateLater(data, 0).day,
        dateLater(data, 1).day,
        dateLater(data, 2).day,
        dateLater(data, 3).day
      ]
      break
    case '周五':
      setData = [
        dateLater(data, -4).day,
        dateLater(data, -3).day,
        dateLater(data, -2).day,
        dateLater(data, -1).day,
        dateLater(data, 0).day,
        dateLater(data, 1).day,
        dateLater(data, 2).day
      ]
      break
    case '周六':
      setData = [
        dateLater(data, -5).day,
        dateLater(data, -4).day,
        dateLater(data, -3).day,
        dateLater(data, -2).day,
        dateLater(data, -1).day,
        dateLater(data, 0).day,
        dateLater(data, 1).day
      ]
      break
    case '周日':
      setData = [
        dateLater(data, -6).day,
        dateLater(data, -5).day,
        dateLater(data, -4).day,
        dateLater(data, -3).day,
        dateLater(data, -2).day,
        dateLater(data, -1).day,
        dateLater(data, 0).day
      ]
      break
    default:
      break
  }
  if (setData !== '') {
    return setData
  } else {
    return ''
  }
}

export function getYear() {
  var Year = new Date().getFullYear()
  var setData = [Year - 1, Year, Year - 2, Year - 3]
  return setData
}

export function formatMonth() {
  var date = new Date()
  var month = date.getMonth() + 1
  return month
}

export function formatDay(time) {
  var date = new Date()
  var day = date.getDate()
  if (time === day) return true
  return false
}

export function getWeeks(week) {
  var data = new Date()
  var weeks = dateLater(data, 0).week
  if (weeks === week) return true
  return false
}

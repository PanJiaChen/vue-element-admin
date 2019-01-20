import request from '@/utils/request'

export function fetchTeacherList(query) {
  return request({
    url: '/teacher/list',
    method: 'get',
    params: query
  })
}

export function fetchStuList(query) {
  return request({
    url: '/student/list',
    method: 'get',
    params: query
  })
}

export function fetchGroupList(query) {
  return request({
    url: '/group/list',
    method: 'get',
    params: query
  })
}

export function updateTeacher(data) {
  return request({
    url: '/teacher/update',
    method: 'post',
    data
  })
}

export function deleteTeacher(query) {
  return request({
    url: '/teacher/delete',
    method: 'get',
    params: query
  })
}

export function fetchList(query) {
  return request({
    url: '/user/list',
    method: 'get',
    params: query
  })
}

export function fetchArticle(id) {
  return request({
    url: '/article/detail',
    method: 'get',
    params: { id }
  })
}

export function fetchPv(pv) {
  return request({
    url: '/article/pv',
    method: 'get',
    params: { pv }
  })
}

export function createStudent(data) {
  return request({
    url: '/student/update',
    method: 'post',
    data
  })
}

export function saveArticle(data) {
  return request({
    url: '/ueditor/save',
    method: 'post',
    data
  })
}

export function fetchGradeList(query) {
  return request({
    url: '/grade/list',
    method: 'get',
    params: query
  })
}

export function fetchClassList(query) {
  return request({
    url: '/class/list',
    method: 'get',
    params: query
  })
}

export function updateStudent(data) {
  return request({
    url: '/student/update',
    method: 'post',
    data
  })
}

export function updateGrade(data) {
  return request({
    url: '/grade/update',
    method: 'post',
    data
  })
}

export function fetchUploadUserList(query) {
  return request({
    url: '/ueditor/getUploadUserList',
    method: 'get',
    params: query
  })
}

export function downloadFile(url, name) {
  var data = window.UEDITOR_HOME_URL + 'ueditor/download?url=' + url + '&name=' + name
  window.location.href = data
}

export function downloadZip(articleId, name) {
  var data = window.UEDITOR_HOME_URL + 'ueditor/downloadZip?articleId=' + articleId + '&name=' + name
  window.location.href = data
}

export function deleteAttachment(query) {
  return request({
    url: '/ueditor/deleteAttachment',
    method: 'get',
    params: query
  })
}

export function fetchCourseList(query) {
  return request({
    url: '/course/list',
    method: 'get',
    params: query
  })
}

export function deleteStudent(data) {
  return request({
    url: '/student/del',
    method: 'post',
    data
  })
}

// 删除年级
export function deleteGrade(id) {
  return request({
    url: '/grade/del/' + id,
    method: 'get'
  })
}

export function fetchScheduleList(query) {
  return request({
    url: '/course/schedule',
    method: 'get',
    params: query
  })
}

export function fetchCourseByClassId(classId) {
  return request({
    url: '/course/' + classId,
    method: 'get'
  })
}

export function updateSchedule(data) {
  return request({
    url: '/course/update',
    method: 'post',
    data
  })
}

// 根据fid，获取xy_school学校表信息
export function fetchSchool(query) {
  return request({
    url: '/system/school',
    method: 'get',
    params: query
  })
}

// 更新学校消息
export function updateSchool(data) {
  return request({
    url: '/system/update',
    method: 'post',
    data
  })
}

// 获取微信模板列表
export function fetchTemplateList(query) {
  return request({
    url: '/system/templateList',
    method: 'get',
    params: query
  })
}

// 为班级添加课程
export function addCourseClass(data) {
  return request({
    url: '/teacher/addCourseClass',
    method: 'post',
    data
  })
}

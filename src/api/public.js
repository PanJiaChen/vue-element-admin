import request from '@/utils/request'
import store from '@/store/modules/user'

var roles = store.state.roles.replace(/;/g, '')

export default {
  getButtons(funid) {
    return request({
      url: `/commonAction.do`,
      method: 'post',
      data: `funid=queryevent&eventcode=query_loadtb&selpfunid=&selfunid=${funid}&selpagetype=editgrid&user_id=${roles}&dataType=json&query_type=0&has_page=0`
    }).then(response => response.data)
  },
  getFormBtn(funid) {
    return request({
      url: `/commonAction.do`,
      method: 'post',
      data: `funid=queryevent&eventcode=query_loadtb&selpfunid=&selfunid=${funid}&selpagetype=form&user_id=${roles}&dataType=json&query_type=0&has_page=0`
    }).then(response => response.data)
  },
  getTypeSel(funid) {
    return request({
      url: `/commonAction.do?eventcode=query_data&funid=queryevent&pagetype=editgrid&query_funid=sys_control&user_id=${roles}`,
      method: 'post',
      data: `start=0&limit=50&where_sql=(funall_control.control_code = ? )&where_value=${funid}&where_type=string&is_query=1&query_type=0&sort=funall_control__control_code`
    }).then(response => response.data)
  }
}

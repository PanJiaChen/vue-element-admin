import request from '@/utils/request'
import store from '@/store/modules/user'

var roles = store.state.roles.replace(/;/g, '')

export default {
  getDate(pageSize, pageNo, whereSql) {
    return request({
      url: `commonAction.do?eventcode=query_data&funid=queryevent&pagetype=grid&query_funid=hidden_review&user_id=${roles}`,
      method: 'post',
      data: `start=${pageNo}&limit=${pageSize}&${whereSql}&is_query=1&query_type=0`
    }).then(response => response.data)
  },
  getDeptTree() {
    return request({
      url: `/commonAction.do?eventcode=query_data&funid=queryevent&pagetype=editgrid&query_funid=sys_dept&user_id=${roles}`,
      method: 'post',
      data: `start=0&limit=10000&where_sql=&where_value=&where_type=&is_query=1&query_type=0`
    }).then(response => response.data)
  },
  Crerte(data) {
    return request({
      url: `/commonAction.do`,
      method: 'post',
      data: `funid=hidden_review&keyid=${data.hidden_danger__hidden_danger_id}&hidden_danger__hidden_code=${data.hidden_danger__hidden_code}&hidden_danger__hidden_state=${data.hidden_danger__hidden_state}&hidden_danger__check_man=${data.hidden_danger__check_man}&hidden_danger__check_dept=${data.hidden_danger__check_dept}&hidden_danger__check_date=${data.hidden_danger__check_date}&hidden_danger__check_location=${data.hidden_danger__check_location}&hidden_danger__check_content=${data.hidden_danger__check_content}&hidden_danger__check_problem=${data.hidden_danger__check_problem}&hidden_danger__org_id=${data.hidden_danger__org_id}&hidden_danger__insp_det_id=${data.hidden_danger__insp_det_id}&hidden_danger__dept_id=${data.hidden_danger__dept_id}&hidden_danger__hidden_danger_id=${data.hidden_danger__hidden_danger_id}&hidden_danger__reform_man=${data.hidden_danger__reform_man}&hidden_danger__reform_dept=${data.hidden_danger__reform_dept}&hidden_danger__reform_limit=${data.hidden_danger__reform_limit}&hidden_danger__check_photo=${data.hidden_danger__check_photo}&hidden_danger__more_flag=${data.hidden_danger__more_flag}&hidden_danger__check_man_id=${data.hidden_danger__check_man_id}&hidden_danger__check_dept_id=${data.hidden_danger__check_dept_id}&hidden_danger__reform_dept_id=${data.hidden_danger__reform_dept_id}&hidden_danger__reform_man_id=${data.hidden_danger__reform_man_id}&hidden_danger__safe_insp_id=${data.hidden_danger__safe_insp_id}&pagetype=form&eventcode=create&fkValue=&user_id=${roles}&dataType=json`
    }).then(response => response.data)
  },
  Save(data) {
    return request({
      url: `/commonAction.do`,
      method: 'post',
      data: `funid=hidden_review&keyid=${data.hidden_danger__hidden_danger_id}&hidden_danger__hidden_danger_id=${data.hidden_danger__hidden_danger_id}&hidden_danger__review_date=${data.hidden_danger__review_date}&hidden_danger__review_man=${data.hidden_danger__review_man}&hidden_danger__review_man_id=${data.hidden_danger__review_man_id}&hidden_danger__review_desc=${data.hidden_danger__review_desc}&pagetype=form&eventcode=save&dirtyfields=hidden_danger.review_date;hidden_danger.review_man;hidden_danger.review_man_id;hidden_danger.review_desc&fkValue=&user_id=${roles}&dataType=json`
    }).then(response => response.data)
  },
  auditSave(data) {
    return request({
      url: `/commonAction.do`,
      method: 'post',
      data: `${data}`
    }).then(response => response.data)
  },
  Delete(ids) {
    let keys = ''
    ids.forEach(d => {
      keys += 'keyid=' + d + '&'
    })
    return request({
      url: `/commonAction.do`,
      method: 'post',
      data: `funid=hidden_review&${keys}pagetype=editgrid&eventcode=delete&user_id=${roles}&dataType=json`
    }).then(response => response.data)
  },
  getFormDate(id) {
    return request({
      url: `/commonAction.do?eventcode=query_data&funid=queryevent&pagetype=grid&query_funid=hidden_review&user_id=${roles}`,
      method: 'post',
      data: `start=0&limit=10&where_sql=hidden_danger.hidden_danger_id = ?&where_value=${id}&where_type=string&is_query=1&query_type=0`
    }).then(response => response.data)
  },
  queryAttach(keyids) {
    return request({
      url: `/commonAction.do`,
      method: 'post',
      data: `funid=queryevent&pagetype=grid&eventcode=query_attach&tablename=hidden_danger&keyids=${keyids}&is_queryrelat=0&user_id=${roles}&dataType=json&query_type=0&has_page=0`
    }).then(response => response.data)
  }
}

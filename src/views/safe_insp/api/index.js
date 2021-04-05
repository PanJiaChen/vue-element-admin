import request from '@/utils/request'
import store from '@/store/modules/user'

var roles = store.state.roles.replace(/;/g, '')

export default {
  getDate(pageSize, pageNo, whereSql) {
    return request({
      url: `commonAction.do?eventcode=query_data&funid=queryevent&pagetype=grid&query_funid=safe_insp&user_id=${roles}`,
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
      data: `funid=safe_insp&keyid=${data.safe_insp__safe_insp_id}&safe_insp__insp_code=${data.safe_insp__insp_code}&safe_insp__insp_name=${data.safe_insp__insp_name}&safe_insp__insp_man=${data.safe_insp__insp_man}&safe_insp__insp_times=${data.safe_insp__insp_times}&safe_insp__insp_name_id=${data.safe_insp__insp_name_id}&safe_insp__org_id=${data.safe_insp__org_id}&safe_insp__insp_state=${data.safe_insp__insp_state}&safe_insp__insp_date=${data.safe_insp__insp_date}&safe_insp__insp_memo=${data.safe_insp__insp_memo}&safe_insp__safe_insp_id=${data.safe_insp__safe_insp_id}&safe_insp__dept_id=${data.safe_insp__dept_id}&safe_insp__insp_man_id=${data.safe_insp__insp_man_id}&safe_insp__insp_ed=&safe_insp__insp_ing=${data.safe_insp__insp_ing}&safe_insp__insp_non=&pagetype=form&eventcode=create&dirtyfields=safe_insp.insp_man;safe_insp.insp_times;safe_insp.insp_date;safe_insp.insp_memo;safe_insp.insp_man_id;safe_insp.insp_name;safe_insp.insp_name_id;&fkValue=&user_id=${roles}&dataType=json`
    }).then(response => response.data)
  },
  Save(data) {
    return request({
      url: `/commonAction.do`,
      method: 'post',
      data: `funid=safe_insp&keyid=${data.safe_insp__safe_insp_id}&safe_insp__insp_code=${data.safe_insp__insp_code}&safe_insp__insp_name=${data.safe_insp__insp_name}&safe_insp__insp_man=${data.safe_insp__insp_man}&safe_insp__insp_times=${data.safe_insp__insp_times}&safe_insp__insp_name_id=${data.safe_insp__insp_name_id}&safe_insp__org_id=${data.safe_insp__org_id}&safe_insp__insp_state=${data.safe_insp__insp_state}&safe_insp__insp_date=${data.safe_insp__insp_date}&safe_insp__insp_memo=${data.safe_insp__insp_memo}&safe_insp__safe_insp_id=${data.safe_insp__safe_insp_id}&safe_insp__dept_id=${data.safe_insp__dept_id}&safe_insp__insp_man_id=${data.safe_insp__insp_man_id}&safe_insp__insp_ed=&safe_insp__insp_ing=${data.safe_insp__insp_ing}&safe_insp__insp_non=&pagetype=form&eventcode=save&dirtyfields=safe_insp.insp_man;safe_insp.insp_times;safe_insp.insp_date;safe_insp.insp_memo;safe_insp.insp_man_id;safe_insp.insp_name;safe_insp.insp_name_id;&fkValue=&user_id=${roles}&dataType=json`
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
      data: `funid=sys_dept&${keys}pagetype=editgrid&eventcode=delete_eg&user_id=${roles}&dataType=json`
    }).then(response => response.data)
  },
  getFormDate(id) {
    return request({
      url: `/commonAction.do?eventcode=query_data&funid=queryevent&pagetype=grid&query_funid=safe_insp&user_id=${roles}`,
      method: 'post',
      data: `start=0&limit=10&where_sql=safe_insp.safe_insp_id = ?&where_value=${id}&where_type=string&is_query=1&query_type=0`
    }).then(response => response.data)
  }
}

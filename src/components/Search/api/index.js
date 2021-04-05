import request from '@/utils/request'
import store from '@/store/modules/user'

var roles = store.state.roles.replace(/;/g, '')

export default {
  getDate(pageSize, pageNo, data_id, table_name) {
    return request({
      url: `/commonAction.do?eventcode=query_data&funid=queryevent&pagetype=editgrid&query_funid=sys_attach&user_id=${roles}`,
      method: 'post',
      data: `start=${pageNo}&limit=${pageSize}&where_sql=sys_attach.data_id = ? and sys_attach.table_name = ?&where_type=string;string&where_value=${data_id};${table_name}`
    }).then(response => response.data)
  },
  getFunCol(funId) {
    return request({
      url: `/commonAction.do?eventcode=query_data&funid=queryevent&pagetype=subeditgrid&query_funid=sys_fun_col&user_id=${roles}`,
      method: 'post',
      data: `start=0&limit=50&where_sql=fun_col.fun_id = ?&where_value=${funId}&where_type=string`
    }).then(response => response.data)
  },
  getSelect(control_code) {
    return request({
      url: `/commonAction.do?eventcode=query_data&funid=queryevent&pagetype=editgrid&query_funid=sys_control&user_id=${roles}`,
      method: 'post',
      data: `start=0&limit=50&where_sql=(funall_control.control_code = ? )&where_value=${control_code}&where_type=string&is_query=1&query_type=0`
    }).then(response => response.data)
  }
}

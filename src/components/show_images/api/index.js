import request from '@/utils/request'
import store from '@/store/modules/user'

var roles = store.state.roles.replace(/;/g, '')

export default {
  getDate(pageSize, pageNo, data_id, table_name) {
    return request({
      url: `/commonAction.do?eventcode=query_data&funid=queryevent&pagetype=editgrid&query_funid=sys_attach&user_id=${roles}`,
      method: 'post',
      data: `start=${pageNo}&limit=${pageSize}&where_sql=sys_attach.data_id = ? and sys_attach.fun_id = ?&where_type=string;string&where_value=${data_id};${table_name}`
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
      data: `funid=sys_attach&${keys}pagetype=editgrid&eventcode=delete&user_id=${roles}&dataType=json`
    }).then(response => response.data)
  },
  getFormDate(id) {
    return request({
      url: `/commonAction.do?eventcode=query_data&funid=queryevent&pagetype=grid&query_funid=safe_insp&user_id=${roles}`,
      method: 'post',
      data: `start=0&limit=10&where_sql=safe_insp.safe_insp_id = ?&where_value=${id}&where_type=string&is_query=1&query_type=0`
    }).then(response => response.data)
  },
  downLoad(keys) {
    const timestamp = new Date().getTime()
    return request({
      url: `fileAction.do?funid=sys_attach&keyid=${keys}&pagetype=editgrid&eventcode=down&user_id=${roles}&dataType=byte&_dc=${timestamp}`,
      method: 'get'
      // data: `funid=sys_attach&keyid=${keys}&pagetype=editgrid&eventcode=down&user_id=${roles}&dataType=byte&_dc=${timestamp}`
    })
  }
}

import request from '@/utils/request'

export default {
  getDate(id, pageSize, pageNo, isWhereSql, whereValue) {
    let whereSql = ''
    let whereType = ''
    if (isWhereSql) {
      whereSql = `dept_id like ?`
      whereType = 'string'
    }
    return request({
      url: `/commonAction.do?eventcode=query_data&funid=queryevent&pagetype=subeditgrid&query_funid=insp_item&user_id=administrator`,
      method: 'post',
      data: `start=${pageNo}&limit=${pageSize}&where_sql=(insp_item.insp_name_id = ?)${whereSql}&where_value=${id}${whereValue}&where_type=string${whereType}&is_query=1&query_type=0`
    }).then(response => response.data)
  },
  Crerte(data) {
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
      data: `funid=insp_item&${keys}pagetype=editgrid&eventcode=delete_eg&user_id=administrator&dataType=json`
    }).then(response => response.data)
  }
}

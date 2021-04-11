import request from '@/utils/request'

export default {
  getDate(id, pageSize, pageNo, whereSql, isWhereSql) {
    console.log(isWhereSql, 'isWhereSql')
    if (!isWhereSql) {
      whereSql = `where_sql=insp_item.insp_name_id = ?&where_value=${id}&where_type=string`
    }
    return request({
      url: `/commonAction.do?eventcode=query_data&funid=queryevent&pagetype=subeditgrid&query_funid=insp_item&user_id=administrator`,
      method: 'post',
      data: `start=${pageNo}&limit=${pageSize}&${whereSql}&is_query=1&query_type=0`
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

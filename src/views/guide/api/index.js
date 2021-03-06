import request from '@/utils/request'

export default {
  getDept() {
    return request({
      url: `/commonAction.do?eventcode=query_data&funid=queryevent&pagetype=editgrid&query_funid=sys_dept&user_id=administrator`,
      method: 'post',
      data: `start=0&limit=50&where_sql=&where_value=&where_type=&is_query=1&query_type=0`
    }).then(response => response.data)
  }
}

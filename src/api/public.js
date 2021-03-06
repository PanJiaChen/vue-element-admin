import request from '@/utils/request'

export default {
  getButtons(funid) {
    return request({
      url: `/commonAction.do`,
      method: 'post',
      data: `funid=queryevent&eventcode=query_loadtb&selpfunid=&selfunid=${funid}&selpagetype=editgrid&user_id=administrator&dataType=json&query_type=0&has_page=0`
    }).then(response => response.data)
  }
}

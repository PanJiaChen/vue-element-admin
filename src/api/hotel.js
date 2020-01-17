import request from '@/utils/request'

export function findHotelListFromApi() {
  return request({
    url: '/producer-helloworld/hotel/hotelList',
    method: 'get'
  })
}

/* 
包含spu管理相关接口请求函数
*/
import request from '@/utils/request'

export default {
  /* 
  GET /admin/product/{page}/{limit}
    query参数: category3Id
  */
  getList (page, limit, category3Id) {
    // return request.get(`/admin/product/${page}/${limit}`, {params: {category3Id}})
    return request({
      url: `/admin/product/${page}/${limit}`,
      method: 'GET',
      params: {category3Id}
    })
  }
}
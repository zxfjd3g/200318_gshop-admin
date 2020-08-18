<template>
  <div>
    <el-button type="primary" icon="el-icon-plus">添加</el-button>
    <!-- 
      id:245
      logoUrl:"http://182.92.128.115:8080/group1/M00/00/30/rBFUDF8kx1GAOsZdAAAi2MfQvMY181.jpg"
      tmName:"华为"
     -->
    <el-table
      style="margin: 20px 0"
      border
      :data="trademarks"
    >
      <el-table-column
        align="center"
        label="序号"
        type="index"
        width="80"/>

      <el-table-column
        prop="tmName"
        label="品牌名称"/>

      <el-table-column
        label="品牌LOGO">
        <!-- 当前列不是显示对象的某个属性值, 而标签结构数据 -->
        <template slot-scope="scope">
          <img :src="scope.row.logoUrl" alt="" style="width: 100px; height: 80px">
        </template>
      </el-table-column>

       <el-table-column
          label="操作">
          <template slot-scope="scope">
            <el-button type="warning" icon="el-icon-edit" size="small">修改</el-button>
            <el-button type="danger" icon="el-icon-delete" size="small">删除</el-button>
          </template>
        </el-table-column>
    </el-table>

    <el-pagination
      style="text-align: center"
      :current-page="page"
      :page-sizes="[3, 6, 9, 12]"
      :page-size="limit"
      layout="prev, pager, next, jumper, ->, sizes, total"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="getTrademarks">
    </el-pagination>
  </div>
</template>

<script>
export default {
  name: 'TrademarkList',

  data () {
    return {
      page: 1, // 当前页码
      limit: 3, // 每页数量
      trademarks: [], // 当前页的列表数据
      total: 0, // 总数量
    }
  },

  async mounted () {
    this.getTrademarks(1)
  },

  methods: {
    /* 
    异步获取指定页码的分页数据显示
    */
    async getTrademarks (page) {
      this.page = page
      const result = await this.$API.trademark.getPageList(page, this.limit)
      if (result.code===200) {
        const {records, total} = result.data
        this.trademarks = records
        this.total = total
      }
    },

    /* 
    每页数量发生改变的监听回调
    pageSize: 最新的每页数量
    */
    handleSizeChange (pageSize) {
      // 更新每页数量
      this.limit = pageSize
      // 获取第一页显示
      this.getTrademarks(1)
    }
  }
}
</script>

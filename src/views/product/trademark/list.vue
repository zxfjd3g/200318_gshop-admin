<template>
  <div>
    <el-button type="primary" icon="el-icon-plus" @click="showAdd">添加</el-button>
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
          <template v-slot="{row, $index}">
            <el-button type="warning" icon="el-icon-edit" size="small" @click="showUpdate(row)">修改</el-button>
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

    <el-dialog :title="form.id ? '修改' : '添加'" :visible.sync="dialogFormVisible">
      <el-form :model="form" style="width: 80%">
        <el-form-item label="品牌名称" label-width="120px">
          <el-input v-model="form.tmName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="品牌LOGO" label-width="120px">
          <!-- 
            action: 处理上传图片的接口地址
            on-success: 指定上传成功的回调函数
            before-upload: 指定准备上传前的回调, 如果返回false不发请求
           -->
          <el-upload
            class="avatar-uploader"
            :action="$BASE_API + '/admin/product/fileUpload'"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload">
            <img v-if="form.logoUrl" :src="form.logoUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer"> <!-- 使用命名插槽 -->
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addOrUpdate">确 定</el-button>
      </div>
    </el-dialog>
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
      dialogFormVisible: false, // 对话框是否显示
      form: { // 收集品牌对象数据
        tmName: '',
        logoUrl: '',
      },
    }
  },

  async mounted () {
    this.getTrademarks(1)
  },

  methods: {
    /* 
    添加或更新品牌
    */
    async addOrUpdate () {

      // 准备数据
      const trademark = this.form
      // 提交ajax请求
      await this.$API.trademark.save(trademark)
      // 成功了, ....
      // 关闭对话
      this.dialogFormVisible = false
      // 提示成功
      this.$message.success(`${trademark.id?'修改':'添加'}成功`)
      // 获取列表显示
        // 修改显示当前页, 添加显示第1页
      this.getTrademarks(trademark.id ? this.page : 1)
    },
    
    /* 
    on-success: 指定上传成功的回调函数
    res: 响应体对象
    */
    handleAvatarSuccess(res, file) {
      console.log('handleAvatarSuccess', res)
      // 保存上传成功的图片url
      this.form.logoUrl = res.data
    },
            
    /* 
    before-upload: 指定准备上传前的回调, 如果返回false不发请求
    限制图片类型和大小
    */
    beforeAvatarUpload(file) {
      const isJPGOrPNG = file.type === 'image/jpeg' || file.type === 'image/png';
      const isLt50KB = file.size / 1024 / 1024 < 10;

      if (!isJPGOrPNG) {
        this.$message.error('上传头像图片只能是 JPG/PNG 格式!');
      }
      if (!isLt50KB) {
        this.$message.error('上传头像图片大小不能超过 50KB!');
      }
      return isJPGOrPNG && isLt50KB; // 只有2个条件都满足才返回true, 提交上传的请求
    },

    /* 
    显示修改界面
    */
    showUpdate (trademark) {

      // 保存trademark
      // this.form = trademark  // 2个引用变量指向同一个对象的问题
      this.form = {...trademark} // 生成一个拷贝对象给form
      // 显示dialog
      this.dialogFormVisible = true
    },

    /* 
    显示添加界面
    */
    showAdd () {
      // 重置数据
      this.form = {
        tmName: '',
        logoUrl: '',
      }
      // 显示dialog
      this.dialogFormVisible = true
    },

    /* 
    异步获取指定页码的分页数据显示
    */
    async getTrademarks (page) {
      this.page = page
      try {
        const result = await this.$API.trademark.getPageList(page, this.limit)
        const {records, total} = result.data
        this.trademarks = records
        this.total = total
      } catch (error) {
        // 做错误提示之外的工作
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

<style>
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
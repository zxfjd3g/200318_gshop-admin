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

    <el-dialog title="添加" :visible.sync="dialogFormVisible">
      <el-form :model="form" style="width: 80%">
        <el-form-item label="品牌名称" label-width="120px">
          <el-input v-model="form.tmName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="品牌LOGO" label-width="120px">
          <el-upload
            class="avatar-uploader"
            action="https://jsonplaceholder.typicode.com/posts/"
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
        <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
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

    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw);
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg';
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!');
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!');
      }
      return isJPG && isLt2M;
    },

    /* 
    显示修改界面
    */
    showUpdate (trademark) {

      // 保存trademark
      this.form = trademark
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
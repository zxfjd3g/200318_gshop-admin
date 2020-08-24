<template>
  <div>
    <el-card style="margin-bottom: 20px">
      <CategorySelector @categoryChange="handleCategoryChange"></CategorySelector>
    </el-card>

    <el-card>

      <div v-show="!isShowSpuForm">
        <el-button type="primary" icon="el-icon-plus" :disabled="!category3Id" @click="showSpuAdd">添加SPU</el-button>

        <el-table border :data="spuList" style="margin: 20px 0">
          <el-table-column label="序号" type="index" width="80" align="center"></el-table-column>
          <el-table-column label="SPU名称" prop="spuName"></el-table-column>
          <el-table-column label="SPU描述" prop="description"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="{row, $index}">
              <hint-button title="添加SKU" type="primary" icon="el-icon-plus" size="mini" />
              <hint-button title="修改SPU" type="primary" icon="el-icon-edit" size="mini" @click="showSpuUpdate(row)"/>
              <hint-button title="查看所有SKU" type="info" icon="el-icon-info" size="mini" />
              <el-popconfirm
                :title="`确定删除 ${row.spuName} 吗?`">
                <hint-button slot="reference" title="删除SPU" type="danger" icon="el-icon-delete" size="mini" />
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>

        <el-pagination 
          style="text-align: center" 
          :current-page="page" 
          :page-sizes="[5, 10, 15]" 
          :page-size="limit"
          :total="total" 
          layout="prev, pager, next, jumper, ->, sizes, total" 
          @current-change="getSpuList"
          @size-change="handleSizeChange" />

      </div>

      <!-- 方式一: 使用 v-show + $parent -->
      <!-- <SpuForm v-show="isShowSpuForm"></SpuForm> -->
      <!-- 方式二: sync -->
      <SpuForm :visible.sync="isShowSpuForm" ref="spuForm"></SpuForm>
      <!-- <SpuForm :visible="isShowSpuForm" @update:visible="isShowSpuForm=$event"></SpuForm> -->


    </el-card>
  </div>
</template>

<script>
import SpuForm from '../components/SpuForm'
export default {
  name: 'SpuList',

  data () {
    return {
      category1Id: '',
      category2Id: '',
      category3Id: '',
      spuList: [], // 当前页的spu数组
      total: 0, // 总数量
      page: 1, // 当前页码
      limit: 5, // 每页数量
      isShowSpuForm: false, // 是否显示SpuForm组件界面
    }
  },

  async mounted () {
    // 为了方便测试
    this.category1Id = 2
    this.category2Id = 13
    this.category3Id = 61
    this.getSpuList()
  },

  methods: {

    /* 
    显示SPU修改界面
    */
    showSpuUpdate (spu) {
      // 显示form界面
      this.isShowSpuForm = true
      // 让form组件加载显示更新界面需要的数据
      this.$refs.spuForm.initLoadUpdateData(spu.id)
    },

    /* 
    显示SPU添加
    */
    showSpuAdd () {
      this.isShowSpuForm = true
      // 让form组件加载显示添加界面需要的数据
      this.$refs.spuForm.initLoadAddData(this.category3Id)
    },

    /* 
    处理分类发生改变的回调
    */
    handleCategoryChange ({categoryId, level}) {
      if (level===1) {
        // 重置数据(二/三级/列表数据)
        this.category2Id = ''
        this.category3Id = ''
        this.spuList = []
        this.total = 0
        // 保存到对应的分类ID上
        this.category1Id = categoryId
      } else if (level===2) {
        // 重置数据(三级/列表数据)
        this.category3Id = ''
        this.spuList = []
        this.total = 0
        // 保存到对应的分类ID上
        this.category2Id = categoryId
      } else {
        // 保存到对应的分类ID上
        this.category3Id = categoryId
        // 发请求获取SPU列表显示
        this.getSpuList(1)
      }
    },

    /* 
    异步获取指定页码SPU列表显示
    */
    async getSpuList (page=1) {
      this.page = page
      const result = await this.$API.spu.getList(page, this.limit, this.category3Id)
      const {records, total} = result.data
      this.spuList = records
      this.total = total
    },

    /* 
    每页数量改变的监听回调
    */
    handleSizeChange (limit) {
      this.limit = limit
      this.getSpuList()
    } 
  },

  components: {
    SpuForm
  }
}
</script>

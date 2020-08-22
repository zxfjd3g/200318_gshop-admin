<template>
  <el-form label-width="80px" v-show="visible">
    <el-form-item label="SPU名称">
      <el-input placeholder="SPU名称" v-model="spuInfo.spuName"></el-input>
    </el-form-item>
    <el-form-item label="品牌">
      <el-select v-model="spuInfo.tmId">
        <el-option :label="tm.tmName" :value="tm.id" v-for="tm in trademarkList" :key="tm.id"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="SPU描述">
      <el-input type="textarea" placeholder="SPU描述" rows="4" v-model="spuInfo.description"></el-input>
    </el-form-item>
    <el-form-item label="SPU图片">
      <!-- 
        action: 处理图片上传的地址
        list-type: 已上传图片列表的样式风格
        on-preview: 用于处理大图预览的回调函数
        on-remove: 用于删除图片的回调函数
        on-success: 上传图片成功的回调函数
       -->
      <el-upload
        :action="$BASE_API + '/admin/product/fileUpload'"
        list-type="picture-card"
        :on-preview="handlePictureCardPreview"
        :on-remove="handleRemove"
        :file-list="spuImageList">
        <i class="el-icon-plus"></i>
      </el-upload>
      <el-dialog :visible.sync="dialogVisible">
        <img width="100%" :src="dialogImageUrl" alt="">
      </el-dialog>
    </el-form-item>
    <el-form-item label="销售属性">
      <el-select value="">
        <el-option label="A" value="1"></el-option>
        <el-option label="B" value="2"></el-option>
      </el-select>
      <el-button type="primary" icon="el-icon-plus">添加销售属性值</el-button>

      <el-table border style="margin: 20px 0" :data="spuInfo.spuSaleAttrList">
        <el-table-column label="序号" type="index" width="80" align="center"></el-table-column>
        <el-table-column label="属性名" prop="saleAttrName" width="120"></el-table-column>
        <el-table-column label="属性值名称列表">
          <template v-slot="{row, $index}">
            <el-tag
              :key="value.saleAttrValueName"
              v-for="value in row.spuSaleAttrValueList"
              closable
              :disable-transitions="false"
              > <!-- @close="handleClose(tag)" -->
              {{value.saleAttrValueName}}
            </el-tag>
            <el-input
              class="input-new-tag"
              v-if="row.edit"
              :ref="$index"
              size="small"
            > 
            <!-- 
               @keyup.enter.native="handleInputConfirm"
              @blur="handleInputConfirm"
             -->
            </el-input>
            <el-button v-else class="button-new-tag" size="small">+ 添加</el-button>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120">
          <template slot-scope="{row, $index}">
            <hint-button title="删除SPU" type="danger" icon="el-icon-delete" size="mini" />
          </template>
        </el-table-column>
      </el-table>

    </el-form-item>

    <el-form-item>
      <el-button type="primary">保存</el-button>
      <el-button @click="cancel">取消</el-button>
    </el-form-item>

  </el-form>
</template>

<script>
export default {
  name: 'SpuForm',

  props: {
    visible: Boolean
  },

  data() {
    return {
      dialogImageUrl: '',
      dialogVisible: false,
      spuId: '', // SPU的ID
      spuInfo: {
        spuName: '',
        description: '',
        category3Id: '',
        tmId: '',
        spuSaleAttrList: []
      }, // spu详情信息对象
      spuImageList: [], // spu图片列表
      trademarkList: [], // 所有品牌列表
      saleAttrList: [], // 销售属性列表
    };
  },
  methods: {

    /* 
    用于初始化异步加载更新界面需要的数据
    1) 根据spuId请求获取spuInfo  spu.get(spuId)
		2) 根据spuId请求获取spuImageList  sku.getSpuImageList (spuId)
		3) 获取所有品牌的列表trademarkList trademark.getList()
		4) 获取所有销售属性的列表saleAttrList spu.getSaleAttrList()
    */
    initLoadUpdateData (spuId) {
      this.spuId = spuId
      this.getSpuInfo()
      this.getSpuImageList()
      this.getTrademarkList()
      this.getSaleAttrList()
    },

    /* 
    用于初始化异步加载添加界面需要的数据
    1) 获取所有品牌的列表trademarkList trademark.getList()
		2) 获取所有销售属性的列表saleAttrList spu.getSaleAttrList()
    */
    initLoadAddData () {
      this.getTrademarkList()
      this.getSaleAttrList()
    },

    /* 
    1) 根据spuId请求获取spuInfo  spu.get(spuId)
    */
    async getSpuInfo () {
      const result = await this.$API.spu.get(this.spuId)
      const spuInfo = result.data
      this.spuInfo = spuInfo
    },

    /* 
		2) 根据spuId请求获取spuImageList  sku.getSpuImageList (spuId)
    */
    async getSpuImageList () {
      const result = await this.$API.sku.getSpuImageList(this.spuId)
      const spuImageList = result.data

      // 给spuImageList中的每个图片对象添加name和url属性, 值为对应的imgName和imgUrl的值
      spuImageList.forEach(img => {
        img.name = img.imgName
        img.url = img.imgUrl
      })

      this.spuImageList = spuImageList
    },

    /* 
		4) 获取所有销售属性的列表saleAttrList spu.getSaleAttrList()
    */
    async getSaleAttrList () {
      const result = await this.$API.spu.getSaleAttrList()
      const saleAttrList = result.data
      this.saleAttrList = saleAttrList
    },

    /* 
		3) 获取所有品牌的列表trademarkList trademark.getList()
    */
    async getTrademarkList () {
      const result = await this.$API.trademark.getList()
      const trademarkList = result.data
      this.trademarkList = trademarkList
    },

    cancel () {
      // this.$parent.$parent.isShowSpuForm = false
      this.$emit('update:visible', false)
    },

    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    }
  }
}
</script>

<style>
  .el-tag + .el-tag {
    margin-left: 10px;
  }
  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }
</style>
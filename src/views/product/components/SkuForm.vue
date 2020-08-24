<template>
  <el-form label-width="100px">
    <el-form-item label="SPU 名称">
      <span>{{spu.spuName}}</span>
    </el-form-item>

    <el-form-item label="SKU 名称">
      <el-input type="text" placeholder="SKU 名称" v-model="skuInfo.skuName"></el-input>
    </el-form-item>
    
    <el-form-item label="价格(元)">
      <el-input type="number" placeholder="SKU 价格" v-model="skuInfo.price"></el-input>
    </el-form-item>

    <el-form-item label="重量(千克)">
      <el-input type="number" placeholder="SKU 重量" v-model="skuInfo.weight"></el-input>
    </el-form-item>

    <el-form-item label="规格描述">
      <el-input type="textarea" placeholder="SKU 规格描述" rows="4" v-model="skuInfo.skuDesc"></el-input>
    </el-form-item>

    <el-form-item label="平台属性">
      <el-form inline label-width="100px">
        <el-form-item :label="attr.attrName" style="margin: 5px 0" v-for="attr in attrList">
          <el-select placeholder="请输入" v-model="attr.attrIdValueId">
            <el-option :label="value.valueName" :value="attr.id + ':' + value.id" v-for="value in attr.attrValueList" :key="value.id"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-form-item>

    <el-form-item label="销售属性">
      <el-form inline label-width="100px">
        <el-form-item :label="attr.saleAttrName" style="margin: 5px 0" v-for="attr in spuSaleAttrList" :key="attr.id">
          <el-select placeholder="请输入" v-model="attr.saleAttrValueId">
            <el-option :label="value.saleAttrValueName" :value="value.id" v-for="value in attr.spuSaleAttrValueList" :key="value.id"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-form-item>

    <el-form-item label="图片列表">
      <el-table border :data="spuImageList"  @selection-change="handleSelectionChange">
        <!-- 可以多选的 -->
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column label="图片">
          <template v-slot="{row}">
            <img :src="row.imgUrl" alt="" style="width:100px; height:100px;">
          </template>
        </el-table-column>
        <el-table-column label="名称" prop="imgName"></el-table-column>
        <el-table-column label="操作">
          <template v-slot="{row}">
            <el-tag type="success" v-if="row.isDefault==='1'">默认</el-tag>
            <el-button type="primary" size="small" v-else @click="setDefault(row)">设为默认</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-form-item>

    <el-form-item>
      <el-button type="primary">保存</el-button>
      <el-button>取消</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  name: 'SkuForm',

  data () {
    return {
      spu: {},
      skuInfo: {
        // 从父组件传入
        category3Id: null,
        spuId: null,
        tmId: null,
        // 用户输入 v-model
        skuName: null,
        skuDesc: null,
        price: null,
        weight: null,

        skuDefaultImg: null,  // 默认图片url
        skuAttrValueList: [], // sku平台属性值列表
        skuSaleAttrValueList: [], // sku销售属性值列表
        skuImageList: [], // sku图片列表
      },

      attrList: [], // 平台属性列表
      spuSaleAttrList: [], // spu销售属性列表
      spuImageList: [], // spu图片列表
      // selectedSpuImageList: []
    }
  },

  methods: {

    /* 
    val: 所有选中的行数据对象的数组
    */
    handleSelectionChange(val) {
      console.log(val)
      // this.selectedSpuImageList = val;
      // 保存选中的图片列表
      this.skuInfo.skuImageList = val
    },

    /* 
    设置默认图片
    */
    setDefault (spuImage) {
      // 将原本默认的变为非默认(都指定为非默认的)
      this.spuImageList.forEach(image => image.isDefault = '0')
      // 将当前变为默认的
      spuImage.isDefault = '1'

      // 保存当前图片url为sku默认的图片url
      this.skuInfo.skuDefaultImg = spuImage.imgUrl
    },

    /* 
    请求加载添加界面初始显示需要的数据
    */
    initLoadAddData (spu) {
      this.spu = spu
      this.skuInfo.category3Id = spu.category3Id
      this.skuInfo.spuId = spu.id
      this.skuInfo.tmId = spu.tmId

      this.getAddData()
    },

    /* 
    根据3个级别的分类ID获取所有平台属性列表: attr.getList (category1Id, category2Id, category3Id) 
		根据spuId获取SPU图片列表: sku.getSpuImageList(spuId)
		根据spuId获取spu销售属性列表: sku.getSpuSaleAttrList(spuId)
    */
    async getAddData () {
      const {category1Id, category2Id, category3Id, id} = this.spu
      // 批量发送3个请求
      const p1 = this.$API.attr.getAttrList(category1Id, category2Id, category3Id)
      const p2 = this.$API.sku.getSpuImageList(id)
      const p3 = this.$API.sku.getSpuSaleAttrList(id)
      // 只有都成功了, 才显示
      const results = await Promise.all([p1, p2, p3])   // [result1, result2, result3]
      this.attrList = results[0].data
      this.spuImageList = results[1].data.map(item => ({...item, isDefault: '0'}))
      this.spuSaleAttrList = results[2].data
    }
  }
}
</script>

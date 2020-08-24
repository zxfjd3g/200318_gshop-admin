<template>
  <el-form label-width="100px">
    <el-form-item label="SPU 名称">
      <span>AAA</span>
    </el-form-item>

    <el-form-item label="SKU 名称">
      <el-input type="text" placeholder="SKU 名称"></el-input>
    </el-form-item>
    
    <el-form-item label="价格(元)">
      <el-input type="number" placeholder="SKU 价格"></el-input>
    </el-form-item>

    <el-form-item label="重量(千克)">
      <el-input type="number" placeholder="SKU 重量"></el-input>
    </el-form-item>

    <el-form-item label="规格描述">
      <el-input type="textarea" placeholder="SKU 规格描述" rows="4"></el-input>
    </el-form-item>

    <el-form-item label="平台属性">
      <el-form inline label-width="100px">
        <el-form-item label="属性一" style="margin: 5px 0">
          <el-select placeholder="请输入" value="">
            <el-option label="AA" :value="1"></el-option>
            <el-option label="BB" :value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="属性二" style="margin: 5px 0">
          <el-select placeholder="请输入" value="">
            <el-option label="AA" :value="1"></el-option>
            <el-option label="BB" :value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="属性三" style="margin: 5px 0">
          <el-select placeholder="请输入" value="">
            <el-option label="AA" :value="1"></el-option>
            <el-option label="BB" :value="2"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-form-item>

    <el-form-item label="销售属性">
      <el-form inline label-width="100px">
        <el-form-item label="属性一" style="margin: 5px 0">
          <el-select placeholder="请输入" value="">
            <el-option label="AA" :value="1"></el-option>
            <el-option label="BB" :value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="属性二" style="margin: 5px 0">
          <el-select placeholder="请输入" value="">
            <el-option label="AA" :value="1"></el-option>
            <el-option label="BB" :value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="属性三" style="margin: 5px 0">
          <el-select placeholder="请输入" value="">
            <el-option label="AA" :value="1"></el-option>
            <el-option label="BB" :value="2"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-form-item>

    <el-form-item label="图片列表">
      <el-table border>
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column label="图片"></el-table-column>
        <el-table-column label="名称" prop="imgName"></el-table-column>
        <el-table-column label="操作"></el-table-column>
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
    }
  },

  methods: {
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
      this.spuImageList = results[1].data
      this.spuSaleAttrList = results[2].data
    }
  }
}
</script>

<template>
  <div>
    <el-card style="margin-bottom:20px">
      <category-selector @categoryChange="handleCategoryChange"></category-selector>
    </el-card>
    <el-card>BBB</el-card>
  </div>
</template>

<script>
export default {
  name: 'AttrList',

  data () {
    return {
      category1Id: '', // 一级分类id
      category2Id: '', // 二级分类id
      category3Id: '', // 三级分类id
      attrs: [], // 属性列表
    }
  },

  async mounted () {
    // 为了方便测试
    this.category1Id = 2
    this.category2Id = 13
    this.category3Id = 61
    this.getAttrs()
  },

  methods: {
    handleCategoryChange ({categoryId, level}) {
      if (level===1) {
        this.category1Id = categoryId
      } else if (level===2) { 
        this.category2Id = categoryId
      } else { // level=3
        this.category3Id = categoryId
        // 异步获取属性列表
        this.getAttrs()
      }
    },

    /* 
    异步获取属性列表
    */
    async getAttrs () {
      const { category1Id, category2Id, category3Id } = this
      const result = await this.$API.attr.getAttrList(category1Id, category2Id, category3Id)
      const attrs = result.data
      this.attrs = attrs
      console.log('----', attrs)
    }
  }
}
</script>

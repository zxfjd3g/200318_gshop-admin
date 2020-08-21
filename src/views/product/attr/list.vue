<template>
  <div>
    <el-card style="margin-bottom:20px">
      <category-selector @categoryChange="handleCategoryChange"></category-selector>
    </el-card>
    <el-card>
      <el-button type="primary" icon="el-icon-plus">添加属性</el-button>
      <el-table
        v-loading="loading"
        style="margin-top: 20px"
        border
        :data="attrs"
      >
        <el-table-column type="index" label="序号" width="80" align="center"/>
        <el-table-column label="属性名称" width="150" prop="attrName"/>
        <el-table-column label="属性值列表">
          <template v-slot="{row, $index}">
            <el-tag v-for="(value, index) in row.attrValueList" :key="value.id" >{{value.valueName}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template v-slot="{row, $index}">
            <hint-button title="修改属性" type="warning" size="small" icon="el-icon-edit"/>
            <hint-button title="删除属性" type="danger" size="small" icon="el-icon-delete"/>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
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
      loading: false,
    }
  },

  async mounted () {
    // 为了方便测试
    // this.category1Id = 2
    // this.category2Id = 13
    // this.category3Id = 61
    // this.getAttrs()
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
      this.loading = true
      const result = await this.$API.attr.getAttrList(category1Id, category2Id, category3Id)
      this.loading = false
      const attrs = result.data
      this.attrs = attrs
    }
  }
}
</script>

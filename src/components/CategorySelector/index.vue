<template>
  <el-form inline>
    <el-form-item label="一级分类">
      <el-select v-model="cateory1Id" placeholder="请选择">
        <el-option :label="c1.name" :value="c1.id" v-for="c1 in category1List" :key="c1.id"></el-option>
      </el-select>
    </el-form-item>
    
  </el-form>
</template>

<script>
export default {
  name: 'CategorySelector',

  data () {
    return {
      cateory1Id: '', // 选择的一级分类ID
      category1List: [], // 一级分类列表
      category2List: [], // 二级分类列表
      category3List: [], // 三级分类列表
    }
  },

  async mounted () {
    const result = await this.$API.category.getCategorys1()
    this.category1List = result.data
  }
}
</script>

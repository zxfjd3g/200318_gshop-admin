<template>
  <div>
    <el-card style="margin-bottom:20px">
      <category-selector @categoryChange="handleCategoryChange"></category-selector>
    </el-card>
    <el-card>
      <div v-show="isShowList">
        <el-button type="primary" icon="el-icon-plus" @click="showAdd">添加属性</el-button>
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
              <hint-button title="修改属性" type="warning" size="small" icon="el-icon-edit" @click="showUpdate(row)"/>
              <hint-button title="删除属性" type="danger" size="small" icon="el-icon-delete"/>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <div v-show="!isShowList">
        <el-form inline>
          <el-form-item label="属性名">
            <el-input placeholder="请输入属性名称" v-model="attr.attrName"></el-input>
          </el-form-item>
        </el-form>

        <el-button type="primary" icon="el-icon-plus" @click="addAttrValue">添加属性值</el-button>
        <el-button>取消</el-button>

        <el-table border style="margin: 20px 0" :data="attr.attrValueList">
          <el-table-column type="index" label="序号" width="80" align="center"></el-table-column>
          <el-table-column label="属性值名称">
            <template v-slot="{row, $index}">  <!-- row: 当前行的属性值对象 -->
              <el-input v-if="row.edit" v-model="row.valueName" @blur="toList(row)" @keyup.enter.native="toList(row)"></el-input>
              <span v-else @click="toEdit(row)">{{row.valueName}}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template v-slot="{row, $index}">
              <hint-button title="删除" icon="el-icon-delete" size="mini" type="danger"></hint-button>
            </template>
          </el-table-column>
        </el-table>

        <el-button type="primary">保存</el-button>
        <el-button @click="isShowList = true">取消</el-button>

      </div>
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
      isShowList: true, // 是否显示列表界面
      attr: {
        attrName: '',
        attrValueList: []
      }, // 当前操作(修改/添加)的属性对象
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

    /* 
    从编程模式 ==> 查看模式
    */
    toList (attrValue) {
      if (!attrValue.edit) return  // 避免2个事件重复处理
      const valueName = attrValue.valueName
      // 1. 如果输入的是空串, 还是编辑模式
      if (valueName==='') {
        this.$message.warning('必须输入')
        return
      } 
      // 2. 如果与其它重复了, 还是编辑模式
      const isRepeat = this.attr.attrValueList.filter(value => value.valueName===valueName).length===2
      if (isRepeat) {
        this.$message.warning('不能与其它名称重复')
        return
      }

      console.log('toList')
      attrValue.edit = false
    }, 

    /* 
    添加属性值
    */
    addAttrValue () {
      // 给属性值列表添加一个属性值对象
      this.attr.attrValueList.push({
        attrId: this.attr.id,
        valueName: '',
        edit: true
      })
    },

    /* 
    从查看模式==>编程模式
    */
    toEdit (attrValue) {
      if (attrValue.hasOwnProperty('edit')) { // 对象自身上是否有edit属性
        attrValue.edit = true
      } else {
        this.$set(attrValue, 'edit', true)  // 此时不能用.来添加, 否则不是响应式的
      }
    },

    /* 
    显示修改界面
    */
    showUpdate (attr) {
      // 保存当前属性对象
      this.attr = attr
      // 显示修改界面
      this.isShowList = false
    },

    /* 
    显示添加界面
    */
    showAdd () {
      // 重置attr
      this.attr = {
        attrName: '',
        attrValueList: []
      }
      // 显示添加界面
      this.isShowList = false
    },

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

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
        multiple
        :action="$BASE_API + '/admin/product/fileUpload'"
        list-type="picture-card"
        :on-preview="handlePictureCardPreview"
        :on-remove="handleRemove"
        :on-success="handleSuccess"
        :file-list="spuInfo.spuImageList">
        <i class="el-icon-plus"></i>
      </el-upload>
      <el-dialog :visible.sync="dialogVisible">
        <img width="100%" :src="dialogImageUrl" alt="">
      </el-dialog>
    </el-form-item>
    <el-form-item label="销售属性">
      <el-select v-model="attrIdAttrName" :placeholder="saleAttrPlaceHolder">
        <el-option :label="attr.name" :value="attr.id+'-'+attr.name" v-for="attr in unUsedSaleAttrList" 
          :key="attr.id"></el-option>
      </el-select>
      <el-button type="primary" icon="el-icon-plus" @click="addSaleAttr">添加销售属性值</el-button>

      <el-table border style="margin: 20px 0" :data="spuInfo.spuSaleAttrList">
        <el-table-column label="序号" type="index" width="80" align="center"></el-table-column>
        <el-table-column label="属性名" prop="saleAttrName" width="120"></el-table-column>
        <el-table-column label="属性值名称列表">
          <template v-slot="{row, $index}">
            <el-tag
              :key="value.saleAttrValueName"
              v-for="(value, index) in row.spuSaleAttrValueList"
              closable
              :disable-transitions="false"
              @close="row.spuSaleAttrValueList.splice(index, 1)"
              > 
              {{value.saleAttrValueName}}
            </el-tag>
            <el-input
              class="input-new-tag"
              v-if="row.edit"
              :ref="$index"
              size="small"
              v-model="row.saleAttrValueName"
              @keyup.enter.native="handleInputConfirm(row, $event)"
              @blur="handleInputConfirm(row, $event)"
            > 
            </el-input>
            <el-button v-else class="button-new-tag" size="small" @click="showInput(row, $index)">+ 添加</el-button>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120">
          <template slot-scope="{row, $index}">
            <hint-button title="删除SPU" type="danger" icon="el-icon-delete" size="mini" 
              @click="spuInfo.spuSaleAttrList.splice($index, 1)"/>
          </template>
        </el-table-column>
      </el-table>

    </el-form-item>

    <el-form-item>
      <el-button type="primary" @click="save">保存</el-button>
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
      dialogImageUrl: '',  // 要预览图片的url
      dialogVisible: false, // 大图预览是否显示
      spuId: '', // SPU的ID
      spuInfo: {
        spuName: '',
        description: '',
        category3Id: '',
        tmId: '',
        spuSaleAttrList: [],
        spuImageList: [],
      }, // spu详情信息对象
      // spuImageList: [], // spu图片列表
      trademarkList: [], // 所有品牌列表
      saleAttrList: [], // 销售属性列表
      attrIdAttrName: '', // 用于收集销售属性id与属性名  id-name
    };
  },

  computed: {

    /* 
    销售属性的提示文本
    */
    saleAttrPlaceHolder () {
      const {unUsedSaleAttrList} = this
      return unUsedSaleAttrList.length===0 ? '没有啦!' : `还没${unUsedSaleAttrList.length}个未使用`
    },
    /* 
    还没有在spu销售属性中存在销售属性列表
    */
    unUsedSaleAttrList () {
      const {saleAttrList, spuInfo: {spuSaleAttrList}} = this
      // 返回过滤后的数组
      return saleAttrList.filter(attr => {
        // 判断当前attr是否已经使用了
        const used = spuSaleAttrList.some(spuAttr => spuAttr.saleAttrName===attr.name)

        return !used  // 只有还没有使用, 才留下来
      })
    },
  },

  methods: {

    /* 
    添加或更新SPU
    */
    async save () {
      // 准备数据
      const {spuInfo} = this

      /* 
      整理1: SPU图片列表 spuImageList
        {
            "imgName": "下载 (1).jpg",
            "imgUrl": "http://47.93.148.192:8080/xxx.jpg"
        }

        从后台获取的图片文件对象的结构
          {
              "id": 333,
              "spuId": 26,
              "imgName": "rBHu8l6UcKyAfzDsAAAPN5YrVxw870.jpg",
              "imgUrl": "http://47.93.148.192:8080/xxx.jpg",
              // 后加的
              "name": "rBHu8l6UcKyAfzDsAAAPN5YrVxw870.jpg",
              "url":  "http://47.93.148.192:8080/xxx.jpg"
          }
        新上传的图片文件对象的结构
          {
            name: "e814ec6fd86c5a8c.jpg"
            response: {
              data: "http://182.92.128.115:8080/group1/xxx.jpg"
            }
            url: "blob:http://localhost:9529/a5199d82-0811-442d-9ec2-dafae83d9ed9"
			    }
      */
      spuInfo.spuImageList = spuInfo.spuImageList.map(item => ({
        imgName: item.name,
        imgUrl: item.response ? item.response.data : item.url
      }))

      // this.spuInfo.spuImageList = this.spuInfo.spuImageList.reduce((pre, item) => {
      //   pre.push({
      //     imgName: item.name,
      //     imgUrl: item.response ? item.response.data : item.url
      //   })
      //   return pre
      // }, [])

     /* 
     	整理2: SPU销售属性列表 spuSaleAttrList
      	过滤掉没有属性值的属性对象
      	删除一些不必要的属性数据(为了界面显示而添加: saleAttrValueName/edit)
     */
      spuInfo.spuSaleAttrList = spuInfo.spuSaleAttrList.filter(attr => {
        // 过滤掉没有属性值的属性
        if (attr.spuSaleAttrValueList.length===0) return false
        // 删除属性对象上的saleAttrValueName/edit
        delete attr.saleAttrValueName
        delete attr.edit

        return true
      })
    

      // 发送添加/更新SPU的请求
      await this.$API.spu.addUpdate(spuInfo)
      // 成功后处理...
      this.$message.success('保存属性成功!!!')
    },

    /* 
    确定添加属性值
    */
    handleInputConfirm (spuSaleAttr, event) {

      // 取出数据
      const {saleAttrValueName, baseSaleAttrId, spuSaleAttrValueList} = spuSaleAttr
      // 只有输入了值才去添加
      if (saleAttrValueName) {

        // 不能重复
        const isRepeat = spuSaleAttrValueList.some(value => value.saleAttrValueName===saleAttrValueName)
        if (isRepeat) {
          this.$message.warning('不能重复')  // 提示
          event.target.focus() // 自动获得焦点
          return
        }

        // 向属性值数组中添加一个属性值对象
        spuSaleAttrValueList.push({
          saleAttrValueName,
          baseSaleAttrId
        })
      }
      
      // 变为查看模式
      spuSaleAttr.edit = false
      // 清除输入收集的数据
      spuSaleAttr.saleAttrValueName = ''

    },

    /* 
    显示输入框
    */
    showInput (attr, index) {
      // 显示输入框
      if (attr.hasOwnProperty('edit')) {
        attr.edit = true
      } else {
        this.$set(attr, 'edit', true)
      }
      // 自动获取焦点
      this.$nextTick(() => this.$refs[index].focus())
    },

    /* 
    添加销售属性
    */
    addSaleAttr () {

      // 根据attrIdAttrName得到销售属性id和销售属性name
      const [baseSaleAttrId, saleAttrName] = this.attrIdAttrName.split('-')
      // 创建一个spu销售属性对象
      const spuSaleAttr =  {
        baseSaleAttrId,  // 销售属性id
        saleAttrName, //销售属性name
        spuSaleAttrValueList: [] // 销售属性值数组
      }
      // 添加到spu销售属性数组中
      this.spuInfo.spuSaleAttrList.push(spuSaleAttr)

      // 清除收集的id和name数据
      this.attrIdAttrName = ''

    },

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
    initLoadAddData (category3Id) {
      this.spuInfo.category3Id = category3Id
      this.getTrademarkList()
      this.getSaleAttrList()
    },

    /* 
    1) 根据spuId请求获取spuInfo  spu.get(spuId)
    */
    async getSpuInfo () {
      const result = await this.$API.spu.get(this.spuId)
      const spuInfo = result.data
      spuInfo.spuImageList = []   // 默认是null  ==> Upload组件出错
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

      this.spuInfo.spuImageList = spuImageList
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

    /* 
    文件上传成功时的钩子
    response: 上传请求返回的响应体对象
      {"code":200,"message":"成功","data":"http://182.92.128.115:8080/group1/M00/00/3B/rBFUDF9Ay3-AKicGAAATlhsOuNM712.jpg","ok":true}
    file: 上传成功的图片相关信息的对象: 图片对象
    fileList: 所有已上传的图片文件对象的数组(包含原本有的和新上传的)
    */
    handleSuccess (response, file, fileList) {
      console.log('handleSuccess', fileList)
      this.spuInfo.spuImageList = fileList
    },

    /* 
    文件列表移除文件时的钩子
    file: 被移除的图片文本对象 
    fileList: 剩下的已上传的文件对象的数组
    */
    handleRemove(file, fileList) {
      console.log('handleRemove', fileList);
      this.spuInfo.spuImageList = fileList
      // 在此处可以发送删除对应图片的请求(没有对应的接口)
    },
    
    /* 
    点击文件列表中已上传的文件时的钩子
    用来预览图片
    */
    handlePictureCardPreview(file) {
      // 指定预览图片的url
      this.dialogImageUrl = file.url;
      // 显示
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
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
}
</script>

<template>
  <div>
    <!-- 源头 -->
    <el-upload action="http://localhost:8888/doUploadFile" list-type="picture-card"
      :on-preview="handlePictureCardPreview" :on-remove="handleRemove" :on-success="handleSuccess">
      <i class="el-icon-plus"></i>
    </el-upload>
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
    <img v-if="imgurl"  :src="imgurl">
  </div>
</template>
  
<script>
export default {
  name: 'Source',
  data() {
    return {
      dialogImageUrl: '',
      dialogVisible: false,
      imgurl: ''

    }
  },
  methods: {
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    handleSuccess(file, fileList) {
      this.imgurl = file.data.imgUrl
      console.log(file, fileList)
    }
  }
}
</script>
  
  <!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
  
/**
 * 系统管理 菜单管理
 */
<template>
  <div>
    <el-row>
      <!-- title -->
      <div class="modt-box">材料申报</div>
      <el-form ref="form" :model="form" label-width="80px" :rules="rules">
        <el-form-item label="车号" prop="aid">
        </el-form-item>
        <el-form-item label="提料班组" prop="name">
          <el-input size="small" v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="提料人姓名" prop="name">
          <el-input size="small" v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="提料人电话" prop="name">
          <el-input size="small" v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="物料编码（指物资系统内路局编码）" prop="name">
          <el-input size="small" v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="物料名称" prop="name">
          <el-input size="small" v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="规格型号（至四方和长客使用的物料编码）" prop="name">
          <el-input size="small" v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="部件描述" prop="name">
          <el-input size="small" v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="供应商名称（指主机厂的供货商）" prop="name">
          <el-input size="small" v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="供应商物料代码" prop="name">
          <el-input size="small" v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="远景图" prop="newsURL">
          <el-upload class="avatar-uploader"
            action="" :show-file-list="false"
            :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
            <img v-if="form.newsURL" src="" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="近景图" prop="newsURL">
          <el-upload class="avatar-uploader"
            action="" :show-file-list="false"
            :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
            <img v-if="form.newsURL" src="" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="补充照片" prop="newsURL">
          <el-upload class="avatar-uploader"
            action="" :show-file-list="false"
            :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
            <img v-if="form.newsURL" src="" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="提料原因" prop="name">
          <el-input size="small" v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="name">
          <el-input size="small" v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button size="small" type="primary" @click="saveModule('form')">申报</el-button>
        </el-form-item>
      </el-form>
    </el-row>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'addMaterial',

  data() {
    return {
      showdelete: false,
      treeData: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      form: {
        newsURL: '',
        introduce: '介绍'
      },
      // rules表单验证
      rules: {
        aid: [
          { required: true, message: '请选择社团', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '请输入新闻名称', trigger: 'blur' }
        ],
        time: [
          { required: true, message: '请选择新闻截止时间', trigger: 'blur' }
        ],
        level: [
          { required: true, message: '请输入级别', trigger: 'blur' }
        ],
        // introduce: [
        //   { required: true, message: '请输入新闻内容', trigger: 'blur' }
        // ]
      },
      fmenu: []

    }
  },
  /**
   * 创建完毕
   */

  created() {
    this.getAID()
    // if (this.$store.state.user.role == 2) {
    //   this.form.aid = this.$store.state.user.aid
    // }
  },

  /**
   * 里面的方法只有被调用才会执行
   */
  methods: {
    getAID() {
      // let token = sessionStorage.getItem('token');
      // axios({
      //   // url: 'http://localhost:8888/htdocs/association/public/index.php/associate/index/indexall',
      //   headers: {
      //     token
      //   }
      // })
      //   .then(res => {
      //     if (res.data.code === 200) {
      //       this.fmenu = res.data.data
      //     }
      //   })
      //   .catch(err => {
      //     this.$message.error('请稍后再试！')
      //   })
    },
    selectASSO(val) {
      console.log(1);
      console.log(val);
    },
    // 表单重置
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    // 保存菜单
    saveModule(form) {
      // this.$refs[form].validate(valid => {
      //   if (valid) {
      //     let token = sessionStorage.getItem('token');
      //     axios({
      //       // url: 'http://localhost:8888/htdocs/association/public/index.php/news/index/add',
      //       headers: {
      //         token
      //       },
      //       method: 'POST',
      //       data: this.form
      //     })
      //       .then(res => {
      //         if (res.data.code == 200) {
      //           this.$message.success(res.data.msg)
      //           this.resetForm(form)
      //         }
      //       })
      //       .catch(err => {
      //         this.$message.error('保存失败，请稍后再试！')
      //       })
      //   } else {
      //     return false
      //   }
      // })
    },
    handleAvatarSuccess(res, file) {
      if (res.code === 200) {
        this.form.newsURL = res.imgpath;
      }
    },
    beforeAvatarUpload(file) {
      let { size, type } = file;
      let uploadMAxSize = 200 * 1024;
      let uploadType = ['image/jpg', 'image/png', 'image/webp', 'image/jpeg'];
      let flagSize = true;
      let flagType = true;
      flagSize = size < uploadMAxSize;
      flagType = uploadType.some(ele => ele == type);
      if (!flagType) {
        this.$message.error('上传图片只能是 JPG/PNG/WEBP/JPEG 格式!');
      }
      if (!flagSize) {
        this.$message.error('上传图片大小不能超过 2MB!');
      }
      return flagSize && flagType;
    },
    setfield(formfield, val) {
      this.form[formfield] = val;
    },
  }
}
</script>

<style>
.user-search {
  margin-top: 20px !important;
}

.user-search td {
  margin-top: 20px !important;
}

.userRole {
  width: 100%;
}

.el-table__expanded-cell {
  padding: 0px !important;
  margin: 0px !important;
}

.modt-box {
  width: 100%;
  height: 60px;
  line-height: 60px;
  background-color: #f0f2f5;
  text-align: center;
  color: #334157;
  margin-top: 20px;
  margin-bottom: 20px;
  font-size: 24px;
}

.mod-btnbox {
  margin-bottom: 20px;
}

.treeclass {
  border: 1px solid #f3f3f3;
  padding-top: 20px;
  padding-bottom: 20px;
}

.selectw {
  width: 100%;
}

.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}

.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
 

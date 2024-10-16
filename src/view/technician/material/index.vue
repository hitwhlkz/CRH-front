<template>
  <div>
    <el-button type="warning" size="small" icon="el-icon-star-on">导入</el-button>
    <!-- 筛选 -->
    <el-form :inline="true" :model="pageparm" class="user-search">
      <el-form-item label="提报日期">
        <el-col :span="11">
          <el-date-picker v-model="pageparm.time" type="daterange" range-separator="至" start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </el-col>
      </el-form-item>
      <el-form-item label="审核状态：">
        <el-select v-model="pageparm.state" placeholder="请选择处理结果">
          <el-option label="已审核" value="已审核"></el-option>
          <el-option label="未审核" value="未审核"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button size="small" type="primary" icon="el-icon-search" @click="search">搜索</el-button>
        <el-button size="small" type="primary" icon="el-icon-star-off">导出</el-button>
      </el-form-item>
    </el-form>

    <!-- 表格 -->
    <el-table :data="tableData" style="width: 100%" border>
      <el-table-column prop="date" label="提报日期" width="180"></el-table-column>
      <el-table-column prop="name" label="车号" width="180"></el-table-column>
      <el-table-column prop="address" label="提料班组"></el-table-column>
      <el-table-column prop="date" label="提料人姓名" width="180"></el-table-column>
      <el-table-column prop="name" label="提料人电话" width="180"></el-table-column>
      <el-table-column prop="address" label="物料编码（指物资系统内路局编码）"></el-table-column>
      <el-table-column prop="date" label="物料名称" width="180"></el-table-column>
      <el-table-column prop="name" label="规格型号（至四方和长客使用的物料编码）" width="180"></el-table-column>
      <el-table-column prop="address" label="部件描述"></el-table-column>
      <el-table-column prop="date" label="供应商名称（指主机厂的供货商）" width="180"></el-table-column>
      <el-table-column prop="name" label="供应商物料代码" width="180"></el-table-column>
      <el-table-column prop="address" label="远景图"></el-table-column>
      <el-table-column prop="date" label="近景图" width="180"></el-table-column>
      <el-table-column prop="name" label="补充照片" width="180"></el-table-column>
      <el-table-column prop="address" label="提料原因"></el-table-column>
      <el-table-column prop="address" label="备注"></el-table-column>
      <el-table-column prop="address" label="操作">
        <template slot-scope="scope">
          <el-button size="mini">通过</el-button>
          <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">驳回</el-button>
        </template>
      </el-table-column>
    </el-table>

    <Pagination v-bind:child-msg="pageparm"></Pagination>

    <!-- 编辑 -->
    <el-dialog :title="title" :visible.sync="editFormVisible" width="50%" @click="closeDialog('editForm')">
      <el-form label-width="120px" :model="editForm" :rules="rules" ref="editForm">
        <!-- <el-form-item label="id" prop="id">
          <el-input size="small" v-model="editForm.id" auto-complete="off" disabled></el-input>
        </el-form-item> -->
        <!-- <el-form-item label="车号" prop="abstract">
          <el-input-number v-model="editForm.abstract" auto-complete="off" placeholder="请输入摘要"></el-input-number>
        </el-form-item>
        <el-form-item label="故障描述" prop="expenditurePrice">
          <el-input type="textarea" v-model="editForm.expenditurePrice" :min="1" label=""></el-input>
        </el-form-item> -->

        <el-form-item label="驳回原因" prop="Notes">
          <el-input type="textarea" size="small" v-model="editForm.Notes" auto-complete="off"
            placeholder="请输入驳回原因"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="closeDialog('editForm')">取消</el-button>
        <el-button size="small" type="primary" class="title" @click="submitForm('editForm')">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from '../../../components/Pagination.vue'


export default {
  name: 'Material',
  components: {
    Pagination
  },
  data() {
    return {
      tableData: [],
      editFormVisible: false,
      title: '驳回',
      editForm: {},
      rules: {
        time: [{ required: true, message: '请输入', trigger: 'blur' }],
        abstract: [
          { required: true, message: '请选择', trigger: 'blur' }
        ],
        income: [{ required: true, message: '请输入', trigger: 'blur' }],
        expenditurePrice: [
          { required: true, message: '请输入', trigger: 'blur' }
        ],
        expenditureNum: [{ required: true, message: '请输入', trigger: 'blur' }],
        expenditureAmount: [
          { required: true, message: '请输入', trigger: 'blur' }
        ],
        Notes: [
          { required: true, message: '请输入', trigger: 'blur' }
        ],
        Manager: [
          { required: true, message: '请输入', trigger: 'blur' }
        ],
        director: [
          { required: true, message: '请输入', trigger: 'blur' }
        ],
        remarks: [
          { required: true, message: '请输入', trigger: 'blur' }
        ]
      },
      pageparm: {
        currentPage: 1,
        limit: 10,
        total: 10
      }
    }
  },
  methods: {
    closeDialog() {

    },
    search() { },
    handleEdit: function (index, row) {
      this.editFormVisible = true
      if (row != undefined && row != 'undefined') {
        this.title = '驳回'
        this.editForm = row
        // this.editForm.time = row.time * 1000
      } else {
        this.title = '添加'
      }
    },
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>

<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="6">
        <div class="grid-content bg-purple">
          <el-button size="small" type="warning" icon="el-icon-star-on" @click="exportSourceFinalExcel()">导出</el-button>
        </div>
      </el-col>
    </el-row>

    <!-- 筛选 -->
    <el-form :inline="true" :model="pageparm" class="user-search" ref="searchForm">
      <el-form-item label="标注" prop="dimension">
        <el-select v-model="pageparm.dimension" placeholder="请选择" @change="changeInput($event)">
          <el-option label="非重点关注" value="0"></el-option>
          <el-option label="重点关注" value="1"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="批次" prop="batch">
        <el-input v-model="pageparm.batch" placeholder="输入批次" @input="changeInput($event)"></el-input>
      </el-form-item>
      <el-form-item label="总公司文号" prop="headDocumentNumber">
        <el-input v-model="pageparm.headDocumentNumber" placeholder="输入总公司文号" @input="changeInput($event)"></el-input>
      </el-form-item>
      <el-form-item label="路局文号" prop="roadDocumentNumber">
        <el-input v-model="pageparm.roadDocumentNumber" placeholder="输入路局文号" @input="changeInput($event)"></el-input>
      </el-form-item>
      <el-form-item label="申请单编号" prop="applicNumber">
        <el-input v-model="pageparm.applicNumber" placeholder="输入申请单编号" @input="changeInput($event)"></el-input>
      </el-form-item>
      <el-form-item label="项目名称" prop="entryName">
        <el-input v-model="pageparm.entryName" placeholder="输入项目名称" @input="changeInput($event)"></el-input>
      </el-form-item>
      <el-form-item label="项目完成情况" prop="state">
        <el-select v-model="pageparm.state" placeholder="请选择项目完成情况" @change="changeInput($event)">
          <el-option label="已完成" :value="1"></el-option>
          <el-option label="未完成" :value="0"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="修程" prop="repairProcedure">
        <el-input v-model="pageparm.repairProcedure" placeholder="输入修程" @input="changeInput($event)"></el-input>
      </el-form-item>
      <el-form-item label="车号" prop="carNumber">
        <el-select multiple filterable v-model="carNumbers" placeholder="请选择车号"  @change="changeInput($event)">
          <el-option v-for="item in squareCarNumberList" :key="item.value" :label="item.value" :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="车号完成情况" prop="complTime">
        <el-select v-model="pageparm.complTime" placeholder="请选择车号完成情况" @change="changeInput($event)">
          <el-option label="已完成" value="已完成"></el-option>
          <el-option label="未完成" value="未完成"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button size="small" type="primary" icon="el-icon-search" @click="search()">搜索</el-button>
        <el-button size="small" type="primary" icon="el-icon-refresh-right"
          @click="resetForm('searchForm')">重置</el-button>
        <el-button size="small" type="primary" icon="el-icon-plus" @click="handleEdit()">添加</el-button>
      </el-form-item>
    </el-form>

    <!-- 表格 -->
    <el-table :data="tableData" style="width: 100%" border v-loading="loading" height="650" :row-style="rowStyle">
      <el-table-column type="index" label="序号" align="center" width="70" :index="indexMethod" fixed></el-table-column>
      <el-table-column prop="batch" label="批次" width="80" align="center"></el-table-column>
      <el-table-column prop="headDocumentNumber" label="总公司文号" width="120" align="center"></el-table-column>
      <el-table-column prop="roadDocumentNumber" label="路局文号" width="120" align="center"></el-table-column>
      <el-table-column prop="applicNumber" label="申请单编号" width="120" align="center"></el-table-column>
      <el-table-column prop="entryName" label="项目名称" width="200" align="center"></el-table-column>
      <el-table-column prop="repairProcedure" label="修程" width="200" align="center"></el-table-column>
      <el-table-column prop="total" label="总数" align="center" width="70"></el-table-column>
      <el-table-column prop="complEight" label="CRH380A" width="90" align="center"></el-table-column>
      <el-table-column prop="complTwo" label="CRH2A" width="90" align="center"></el-table-column>
      <el-table-column prop="complFour" label="复兴号" width="90" align="center"></el-table-column>
      <el-table-column prop="complTotal" label="已完成" width="70" align="center"></el-table-column>
      <el-table-column prop="incomplEight" label="CRH380A" width="90" align="center"></el-table-column>
      <el-table-column prop="incomplTwo" label="CRH2A" width="90" align="center"></el-table-column>
      <el-table-column prop="incomplFour" label="复兴号" width="90" align="center"></el-table-column>
      <el-table-column prop="incomplTotal" label="未完成" width="70" align="center"></el-table-column>

      <el-table-column prop="carNumbers" label="车号" align="center" width="280">
        <template slot-scope="scope">
          <div v-for="tag in scope.row.sourceCarNumberDto" :key="tag.cid" style="display: inline-block;">
            <el-tag v-if="tag.complTime == '未完成' & tag.concern == 0" type="info">{{ tag.carNumber }}</el-tag>
            <el-tag v-else-if="tag.complTime != '未完成' & tag.concern == 0" type="success">{{ tag.carNumber }}</el-tag>
            <el-tag v-else type="warning">{{ tag.carNumber }}</el-tag>
          </div>
        </template>

      </el-table-column>

      <el-table-column prop="note" label="备注" align="center" width="220"></el-table-column>

      <!-- <el-table-column prop="notes" label="查看" align="center" width="130">
        <template slot-scope="scope">
          <el-button @click="showModal(scope.row.sid)" class="icon-button">
            <i class="el-icon-view"></i>
            查看附件
          </el-button>
        </template>
        <el-dialog title="附件列表" :visible.sync="dialogVisible" width="40%" :before-close="handleCloseFile" append-to-body>
          <el-table :data="attachmentList" style="width: 100%">
            <el-table-column prop="fileName" align="center" label="名称">
              <template slot-scope="{ row }">
                <el-link @click="handleFileNameClick(row)">{{ row.fileName }}</el-link>
              </template>
            </el-table-column>
            <el-table-column prop="fileType" align="center" label="类型"></el-table-column>
            <el-table-column label="操作" align="center">
              <template slot-scope="{ row }">
                <el-button type="primary" icon="el-icon-download" @click="downloadAttachment(row)"></el-button>
                <el-button type="danger" icon="el-icon-delete" @click="deleteAttachment(row)"></el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-dialog>

      </el-table-column> -->
      <!-- <el-table-column prop="" label="附件" width="120" align="center" fixed="right">
        <template slot-scope="scope">
          <div style="margin-top: 5px;">
            <el-button @click="showUploadModal(scope.row)" size="small" type="primary">点击上传</el-button>
          </div>
        </template>
      </el-table-column> -->

      <!-- 文件上传 -->
      <el-dialog title="文件上传" :visible.sync="uploadModalVisible" width="650px" :before-close="beforeClose" append-to-body
        :show-close="false" :close-on-click-modal="false">
        <el-upload class="uploadFile" :action="`${baseURL}/source/upload`" :on-success="handleFileSuccess"
          :on-error="handleFileError" :file-list="fileList" :data="source" ref="refName" drag multiple>
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        </el-upload>
        <div slot="footer" class="dialog-footer">
          <el-button @click="upload">取 消</el-button>
          <el-button type="primary" @click="upload">确 定</el-button>
        </div>
      </el-dialog>

      <el-table-column prop="" label="操作" width="180" align="center" fixed="right">
        <template slot-scope="scope">
          <div>
            <el-button type="primary" icon="el-icon-circle-plus" circle
              @click="handleCarNumbersInfo(scope.row)"></el-button>
            <el-button type="danger" icon="el-icon-remove" circle @click="deleteCarNumbersInfo(scope.row)"></el-button>
          </div>
          <div style="margin-top: 10px;">
            <el-button type="primary" icon="el-icon-edit" circle @click="handleEdit(scope.$index, scope.row)"></el-button>
            <el-button type="danger" icon="el-icon-delete" circle
              @click="deleteSourceInfoBySID(scope.row.sid)"></el-button>
          </div>
          <div style="margin-top: 10px;">
            <el-button type="warning" v-if="scope.row.dimension == 1" icon="el-icon-warning" circle
              @click="changeDimension(scope.row.sid, 0)"></el-button>
            <el-button v-else="scope.row.dimension == 0" icon="el-icon-warning-outline" circle
              @click="changeDimension(scope.row.sid, 1)"></el-button>
          </div>
        </template>
      </el-table-column>

    </el-table>

    <!-- 编辑 -->
    <el-dialog :title="title" :visible.sync="editFormVisible" width="50%" @click="closeDialog('editForm')">
      <el-form label-width="120px" :model="editForm" ref="editForm">
        <el-form-item label="批次" prop="batch">
          <el-input v-model="editForm.batch" auto-complete="off" placeholder="请输入批次"></el-input>
        </el-form-item>
        <el-form-item label="总公司文号" prop="headDocumentNumber">
          <el-input v-model="editForm.headDocumentNumber" :min="1" label="" placeholder="请输入总公司文号"></el-input>
        </el-form-item>
        <el-form-item label="路局文号" prop="roadDocumentNumber">
          <el-input v-model="editForm.roadDocumentNumber" label="" placeholder="请输入路局文号"></el-input>
        </el-form-item>
        <el-form-item label="申请单编号" prop="applicNumber">
          <el-input v-model="editForm.applicNumber" auto-complete="off" placeholder="请输入申请单编号"></el-input>
        </el-form-item>
        <el-form-item label="项目名称" prop="entryName">
          <el-input type="textarea" v-model="editForm.entryName" auto-complete="off" placeholder="请输入项目名称"></el-input>
        </el-form-item>
        <el-form-item label="修程" prop="repairProcedure">
          <el-input v-model="editForm.repairProcedure" auto-complete="off" placeholder="请输入修程"></el-input>
        </el-form-item>
        <el-form-item label="总量" prop="total">
          <el-input-number :min="0" :max="1000" v-model="editForm.total" auto-complete="off"
            placeholder="请输入总量"></el-input-number>
        </el-form-item>
        <el-form-item label="CRH380A" prop="complEight">
          <el-input-number :min="0" :max="1000" v-model="editForm.complEight" label=""
            placeholder="请输入CRH380A"></el-input-number>
        </el-form-item>
        <el-form-item label="CRH2A" prop="complTwo">
          <el-input-number :min="0" :max="1000" v-model="editForm.complTwo" label=""
            placeholder="请输入CRH2A"></el-input-number>
        </el-form-item>
        <el-form-item label="复兴号" prop="complFour">
          <el-input-number :min="0" :max="1000" v-model="editForm.complFour" label=""
            placeholder="请输入复兴号"></el-input-number>
        </el-form-item>
        <el-form-item label="已完成" prop="complTotal">
          <el-input-number :min="0" :max="1000" v-model="editForm.complTotal" auto-complete="off"
            placeholder="请输入已完成"></el-input-number>
        </el-form-item>
        <el-form-item label="CRH380A" prop="incomplEight">
          <el-input-number :min="0" :max="1000" v-model="editForm.incomplEight" label=""
            placeholder="请输入CRH380A"></el-input-number>
        </el-form-item>
        <el-form-item label="CRH2A " prop="incomplTwo">
          <el-input-number :min="0" :max="1000" v-model="editForm.incomplTwo" label=""
            placeholder="请输入CRH2A"></el-input-number>
        </el-form-item>
        <el-form-item label="复兴号 " prop="incomplFour">
          <el-input-number :min="0" :max="1000" v-model="editForm.incomplFour" label=""
            placeholder="请输入复兴号"></el-input-number>
        </el-form-item>
        <el-form-item label="未完成" prop="incomplTotal">
          <el-input-number v-model="editForm.incomplTotal" auto-complete="off" placeholder="请输入未完成"></el-input-number>
        </el-form-item>

        <el-form-item label="备注" prop="node">
          <el-input type="textarea" v-model="editForm.note" auto-complete="off" placeholder="备注"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="closeDialog('editForm')">取消</el-button>
        <el-button size="small" type="primary" class="title" @click="handelSource('editForm')">保存</el-button>
      </div>
    </el-dialog>

    <!-- 对应车号详情 -->
    <el-dialog title="查看车号" :visible.sync="carNumbersInfoVisible" width="50%" :before-close="closeCarNumbersInfoVisible">
      <div>
        <el-form :inline="true" :model="pageparmcar" class="user-search" ref="searchForm">
          <el-form-item label="" prop="">
            <el-select v-model="selectSquareCarNumberList" multiple placeholder="请选择车号">
              <el-option v-for="item in squareCarNumberList" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button size="small" type="primary" icon="el-icon-search" @click="insertLongCarNumber()">添加</el-button>
          </el-form-item>
        </el-form>
        <el-table :data="carNumbersInfoData" style="width: 100%" border v-loading="loading" height="500"
          :row-style="rowCarStyle">
          <el-table-column type="index" label="序号" align="center" width="70" :index="indexMethod" fixed></el-table-column>
          <el-table-column prop="carNumber" label="车号" width="180" align="center"></el-table-column>
          <el-table-column prop="complTime" label="完成时间" width="240" align="center">
            <template slot-scope="scope">
              <el-input type="textarea" class="input-new-tag" v-model="scope.row.complTime" ref="saveTagInput"
                @blur="editComplTime(scope.row)"></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="" label="操作" align="center">
            <template slot-scope="scope">
              <el-button type="warning" v-if="scope.row.concern == 1" icon="el-icon-warning" circle
                @click="changeCarConcern(scope.row.cid, 0)"></el-button>
              <el-button v-else="scope.row.concern == 0" icon="el-icon-warning-outline" circle
                @click="changeCarConcern(scope.row.cid, 1)"></el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeCarNumbersInfoVisible()">取 消</el-button>
      </span>
    </el-dialog>

    <!-- 删除车号 -->
    <el-dialog title="删除车号" :visible.sync="deleteCarNumbersInfoVisible" width="50%"
      :before-close="() => { deleteCarNumbersInfoVisible = false }">
      <div>
        <el-table :data="carNumbersInfoData" style="width: 100%" border v-loading="loading" height="500"
          :row-style="rowCarStyle">
          <el-table-column type="index" label="序号" align="center" width="70" :index="indexMethod" fixed></el-table-column>
          <el-table-column prop="carNumber" label="车号" width="180" align="center"></el-table-column>
          <el-table-column prop="complTime" label="完成时间" width="240" align="center">
            <template slot-scope="scope">
              <el-input type="textarea" disabled class="input-new-tag" v-model="scope.row.complTime" ref="saveTagInput"
                @blur="editComplTime(scope.row)"></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="" label="操作" align="center">
            <template slot-scope="scope">
              <el-button type="danger" icon="el-icon-delete" circle
                @click="deleteCarNumber(scope.row.cid, scope.row)"></el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="deleteCarNumbersInfoVisible = false">取 消</el-button>
      </span>
    </el-dialog>

  </div>
</template>
  
<script>
import axios from 'axios'
import { baseURL } from '../../../api/base'
import { carNumberList } from '../.././../common/carNumber'
import { classCarNumbers } from '../.././../common/classCarNumbers'
import { squareCarNumberList, twoCarNumberList, eightCarNumberList, fourCarNumberList } from '../../../common/squareCarnumbers'
import { downloadFile } from '../../../api/FileDownload'


export default {
  name: 'qualitySquare',
  data() {
    return {
      baseURL,
      carNumberList,
      classCarNumbers,
      squareCarNumberList,
      twoCarNumberList,
      eightCarNumberList,
      fourCarNumberList,
      selectSquareCarNumberList: [],
      sid: 0,
      carNumbers: [],
      tableData: [],
      loading: false,
      pageparm: {
        type: 1,
        pageNo: 1,
        pageSize: 100000
      },
      pageparmcar: {},
      editFormVisible: false,
      title: '编辑',
      editForm: {},
      total: 0,
      loading: false,
      carNumbersVisible: false,

      props: { multiple: true },

      selectedCarNumbers: [],
      inputVisible: false,
      inputValue: '',

      carNumberComplTimeVisible: false,
      carNumberComplForm: {},

      carNumbersBySid: [],

      carNumbersInfoVisible: false,
      carNumbersInfoData: [],

      ComplTimeVisible: true,

      deleteCarNumbersInfoVisible: false,

      selectLongCarNumberList: [],

      updateTotal: 0,
      updateIncompl: 0,
      updateCompl: 0,
      updateIncomplTwo: 0,
      updateIncomplEight: 0,
      updateIncomplFour: 0,
      updateComplTwo: 0,
      updateComplEight: 0,
      updateComplFour: 0,

      span: [],
      index: null,

      uploadModalVisible: false,
      fileList: [],
      dialogVisible: false,
      attachmentList: [
        // 你的附件数据应该在这里
        // 格式示例：{ name: '文件1', type: '文档', url: '附件下载接口地址' }
      ],
      previewDialogVisible: false,
      previewFile: '',
      source: {},
      deleteParams: {},

    }
  },
  computed: {
    indexMethod: function () {
      return (this.pageparm.pageNo - 1) * (this.pageparm.pageSize) + 1
    },
  },
  created() {
    this.getQS()
  },
  methods: {
    changeInput(e) {
      this.$forceUpdate();
    },
    rowStyle({ row }) {
      if (row.dimension == 1) {
        return { 'background': 'antiquewhite' }
      }
    },
    search() {
      if (this.carNumbers.length) {
        this.pageparm.carNumbers = this.carNumbers
      }
      this.loading = true
      axios({
        method: 'post',
        url: baseURL + '/source/selectallsourceinfo',
        data: this.pageparm
      }).then(res => {
        let tableData = res.data.data
        tableData = tableData.map(item => {
          (item.sourceCarNumberDto).sort(this.compare('carNumber'))
          return item
        })
        this.tableData = tableData
        console.log(tableData);
        this.loading = false
        this.$message.success('搜索成功')
      }).catch(err => {
        this.initPage()
        this.$message.error('搜索失败')
        console.log(err)
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.carNumbers = []
      if (this.pageparm.carNumbers) {
        delete this.pageparm.carNumbers
      }
    },
    initPage() {
      this.pageparm = {
        pageNo: 1,
        pageSize: 100000,
        type: 1
      }
    },
    getQS() {
      axios({
        url: baseURL + '/source/selectallsourceinfo',
        method: 'post',
        data: this.pageparm
      }).then(res => {
        let tableData = res.data.data
        tableData = tableData.map(item => {
          (item.sourceCarNumberDto).sort(this.compare('carNumber'))
          return item
        })
        this.tableData = tableData
        this.loading = false
      }).catch(err => {
        console.log(err);
      })
    },
    compare(property) {
      return function (a, b) {
        return a[property] - b[property];
      }
    },
    handleEdit(index, row) {
      this.editFormVisible = true
      if (row != undefined && row != 'undefined') {
        this.title = '修改'
        this.editForm = row
      } else {
        this.title = '添加'
        this.editForm = {}
      }
    },
    changeResult() {
      this.editForm.result = ''
    },
    handelSource() {
      this.$refs['editForm'].validate((valid) => {
        if (valid) {
          if (this.title == '添加') {
            console.log(this.editForm)
            axios({
              url: baseURL + '/source/insertsource',
              method: 'post',
              data: this.editForm
            }).then(res => {
              console.log(res)
              this.$message({
                message: this.title + '成功',
                type: 'success'
              });
              this.editFormVisible = false
              this.editForm = {}
              this.getQS()
            }).catch(err => {
              console.log(err)
              this.$message({
                message: this.title + '失败',
                type: 'error'
              });
              this.editFormVisible = false
              this.editForm = {}
            })
          } else {
            axios({
              url: baseURL + '/source/updatesourceid',
              method: 'post',
              data: this.editForm,
            }).then(res => {
              this.editFormVisible = false
              this.editForm = {}
              this.$message.success('修改成功')
            }).catch(err => {
              console.log(err)
              this.$message.error("请重新提交")
            })
          }
        } else {
          console.log('提交失败');
          return false;
        }
      });
    },
    callFather(val) {
      this.pageparm.pageNo = val.pageNo
      this.pageparm.pageSize = val.pageSize
    },
    closeDialog() {
      this.editFormVisible = false
      this.editForm = {}
    },
    handleCarNumbers(row) {
      this.editForm = row
      this.sid = row.sid
      this.getCarNumbersBySid(row.sid)
      this.carNumbersVisible = true
    },
    getCarNumbersBySid(sid) {
      axios({
        method: 'post',
        url: baseURL + '/source/selectallsourceinfo',
        data: { sid, ...this.pageparm }
      }).then(res => {
        this.carNumbersBySid = res.data.data[0].sourceCarNumberDto
        this.carNumbersInfoData = res.data.data[0].sourceCarNumberDto
        this.carNumbersInfoData.sort(this.compare('carNumber'))
      }).catch(err => {

      })
    },
    insertLongCarNumber() {
      this.$confirm('是否提交该车号?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (this.selectSquareCarNumberList.length) {
          console.log('提交车号',this.selectLongCarNumberList)
          for (let i = 0; i < this.selectSquareCarNumberList.length; i++) {
            axios({
              url: baseURL + '/source/insertsourcecarnumber',
              method: 'post',
              data: { sid: this.sid, carNumber: this.selectSquareCarNumberList[i] },
            }).then(res => {
              this.getQS()
              this.getCarNumbersBySid(this.sid)

            }).catch(err => {
              this.getQS()
              this.getCarNumbersBySid(this.sid)
              console.log(err)
              this.$message.error("请重新提交")
            })
          }
          this.selectSquareCarNumberList = []
          // this.updateNumber(this.sid)

        } else {
          this.$message.warning("请选择车号")
        }

      }).then(() => {
        this.updateNumber(this.sid)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消提交'
        });
      })
    },
    toRemoveSpacing(str) {
      var reg = /[\t\r\f\n\s]*/g;
      if (typeof str === 'string') {
        var trimStr = str.replace(reg, '');
      }
      return trimStr
    },
    updateNumber(sid) {
      axios({
        method: 'post',
        url: baseURL + '/source/selectallsourceinfo',
        data: { sid }
      }).then(res => {
        let sourceCarNumberDto = res.data.data[0].sourceCarNumberDto
        let total = sourceCarNumberDto.length
        this.updateTotal = total
        let incompl = 0
        let compl = 0

        let incomplTwo = 0
        let incomplEight = 0
        let incomplFour = 0
        let complTwo = 0
        let complEight = 0
        let complFour = 0

        for (let i = 0; i < total; i++) {
          console.log('当前carNumber',sourceCarNumberDto[i].carNumber)
          let complTime = this.toRemoveSpacing(sourceCarNumberDto[i].complTime)
          if (complTime.toLowerCase() == 'null' || complTime == '' || complTime == 'N/A' || complTime == '未完成') {
            incompl += 1
            // 在2A
            if (twoCarNumberList.includes(sourceCarNumberDto[i].carNumber)) {
              console.log('属于2A',sourceCarNumberDto[i].carNumber)
              incomplTwo += 1
            }else if(eightCarNumberList.includes(sourceCarNumberDto[i].carNumber)){
              console.log('属于380A',sourceCarNumberDto[i].carNumber)
              incomplEight += 1
            }else if (fourCarNumberList.includes(sourceCarNumberDto[i].carNumber)) {
              console.log('属于复兴号',sourceCarNumberDto[i].carNumber)
              incomplFour += 1
            }
            // 不在2A
          } else {
            compl += 1
            if (twoCarNumberList.includes(sourceCarNumberDto[i].carNumber)) {
              console.log('属于2A',sourceCarNumberDto[i].carNumber)
              complTwo += 1
            } else if(eightCarNumberList.includes(sourceCarNumberDto[i].carNumber)){
              console.log('属于380A',sourceCarNumberDto[i].carNumber)
              complEight += 1
            }else if (fourCarNumberList.includes(sourceCarNumberDto[i].carNumber)){
              console.log('属于复兴号',sourceCarNumberDto[i].carNumber)
              complFour +=1
            }
          }
        }
        this.updateIncompl = incompl
        this.updateCompl = compl
        this.updateComplEight = complEight
        this.updateComplTwo = complTwo
        this.updateComplFour = complFour
        this.updateIncomplTwo = incomplTwo
        this.updateIncomplEight = incomplEight
        this.updateIncomplFour = incomplFour
      }).then(() => {
        let state
        if (this.updateIncompl == 0 & this.updateTotal != 0) {
          state = 1
        } else {
          state = 0
        }
        axios({
          url: baseURL + '/source/updatesourceid',
          method: 'post',
          data: {
            sid,
            ...this.editForm,
            total: this.updateTotal,
            incomplTotal: this.updateIncompl,
            complTotal: this.updateCompl,
            complEight: this.updateComplEight,
            complTwo: this.updateComplTwo,
            complFour: this.updateComplFour,
            incomplEight: this.updateIncomplEight,
            incomplTwo: this.updateIncomplTwo,
            incomplFour: this.updateIncomplFour,
            state
          },
        }).then(res => {
          console.log('返回数据',res.data)
          this.editFormVisible = false
          // this.initPage()
          this.search()
          this.getCarNumbersBySid(this.sid)
        }).catch(err => {
          console.log(err)
          // this.$message.error("请重新提交")
        })
      })

    },
    handleCarNumberForm() {
      if (!this.inputValue) {
        return
      }
      this.$confirm('是否提交该车号?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {

        let inputValue = this.inputValue;
        if (inputValue) {
          this.selectedCarNumbers.push(inputValue);
          axios({
            url: baseURL + '/source/insertsourcecarnumber',
            method: 'post',
            data: { sid: this.sid, carNumber: this.inputValue },
          }).then(res => {
            this.getQS()
            this.getCarNumbersBySid(this.sid)
            this.inputVisible = false;
            this.$message.success('提交成功')
          }).catch(err => {
            this.getQS()
            this.editForm = {}
            console.log(err)
            this.$message.error("请重新提交")
          })
        }
        this.inputValue = '';

      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消提交'
        });
      });
    },
    handleClose() {
      this.carNumberComplForm = {}
      this.carNumberComplTimeVisible = false
    },
    handleSelectedCarNumbers() {
      this.carNumbersVisible = false
    },
    handleCloseNumbers(cid, tag) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        axios({
          url: baseURL + '/source/deletesourcecarnumbersid',
          method: 'post',
          params: { cid }
        }).then(res => {
          this.$message({
            message: '删除成功',
            type: 'success'
          });
          this.getQS()
        }).catch(err => {
          console.log(err)
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    deleteCarNumber(cid, row) {
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        axios({
          url: baseURL + '/source/deletesourcecarnumbersid',
          method: 'post',
          params: { cid }
        }).then(res => {
          this.$message({
            message: '删除成功',
            type: 'success'
          });
          this.getCarNumbersBySid(this.sid)
        }).then(() => {
          // 修改total等
          let total = this.editForm.total
          total = total - 1
          console.log(total)
          let incomplTotal
          let complTotal
          let state
          let editForm
          let complTime = this.toRemoveSpacing(row.complTime)
          let incomplTwo, incomplEight, complTwo, complEight, incomplFour, complFour
          if (complTime.toLowerCase() == 'null' || complTime == '' || complTime == 'N/A' || complTime == '未完成') {
            incomplTotal = this.editForm.incomplTotal - 1
            if (total != 0 & incomplTotal == 0) {
              state = 1
            } else {
              state = 0
            }

            if (twoCarNumberList.includes(row.carNumber)) {
              incomplTwo = this.editForm.incomplTwo - 1
            } else if (eightCarNumberList.includes(row.carNumber)){
              incomplEight = this.editForm.incomplEight - 1
            }else{
              incomplFour = this.editForm.incomplFour - 1
            }

          } else {
            complTotal = this.editForm.complTotal - 1
            if (total == complTotal) {
              state = 1
              console.log(state)
            } else {
              state = 0
              console.log(state)
            }

            if (twoCarNumberList.includes(row.carNumber)) {
              complTwo = this.editForm.complTwo - 1
            } else if (eightCarNumberList.includes(row.carNumber)){
              complEight = this.editForm.complEight - 1
            }else{
              complFour = this.editForm.complFour - 1
            }
          }

          editForm = { ...this.editForm, total, incomplTotal, complTotal, state }
          if (complTime.toLowerCase() == 'null' || complTime == '' || complTime == 'N/A' || complTime == '未完成') {
            if (twoCarNumberList.includes(row.carNumber)) {
              editForm = { ...this.editForm, total, incomplTotal, incomplTwo, state }
            } else if (eightCarNumberList.includes(row.carNumber)) {
              editForm = { ...this.editForm, total, incomplTotal, incomplEight, state }
            }else{
              editForm = { ...this.editForm, total, incomplTotal, incomplFour, state }
            }

          } else {
            if (twoCarNumberList.includes(row.carNumber)) {
              editForm = { ...this.editForm, total, complTotal, complTwo, state }
            } else if (eightCarNumberList.includes(row.carNumber)){
              editForm = { ...this.editForm, total, complTotal, complEight, state }
            }else{
              editForm = { ...this.editForm, total, complTotal, complFour, state }
            }

          }


          axios({
            url: baseURL + '/source/updatesourceid',
            method: 'post',
            data: {
              sid: this.sid,
              ...editForm,

            },
          }).then(res => {
            this.initPage()
            this.getQS()
          }).then(() => {

            axios({
              method: 'post',
              url: baseURL + '/source/selectallsourceinfo',
              data: { sid: this.sid }
            }).then(res => {
              this.editForm = res.data.data[0]
              console.log(this.editForm)
              this.initPage()
              this.getQS()
              this.getCarNumbersBySid(this.sid)
            })

          })

        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    handleInputConfirm(row) {
      this.$confirm('是否提交该车号?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {

        let inputValue = this.inputValue;
        if (inputValue) {
          this.selectedCarNumbers.push(inputValue);
          axios({
            url: baseURL + '/source/insertsourcecarnumber',
            method: 'post',
            data: { sid: row.sid, carNumber: this.inputValue },
          }).then(res => {
            this.inputVisible = false;
            this.$message.success('提交成功')
          }).catch(err => {
            console.log(err)
            this.$message.error("请重新提交")
          })
        }
        this.inputValue = '';

      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消提交'
        });
      });
    },
    showInput() {
      this.inputVisible = true;
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    editCarNumber(tag, row) {
      this.carNumberComplForm = tag
    },
    handleComplTime() {
      this.carNumberComplTimeVisible = false
      axios({
        url: baseURL + '/source/updatesourcecarnumber',
        method: 'post',
        data: this.carNumberComplForm,
      }).then(res => {
        this.getQS()
      }).catch(err => {

      })

    },
    exportSourceExcel() {
      let openUrl = `${baseURL}/source/exportsource?`;

      for (let obj in this.pageparm) {
        if (this.pageparm[obj]) {
          openUrl += obj + '=' + this.pageparm[obj] + '&'
        }
      }
      axios.get(openUrl).then(res => {
        window.location.href = openUrl
      })
    },
    exportSourceFinalExcel() {
      let openUrl = `${baseURL}/source/exportsourcefinalqualitysquare?`;

      for (let obj in this.pageparm || this.pageparm[obj] == 0) {
        if (this.pageparm[obj]) {
          openUrl += obj + '=' + this.pageparm[obj] + '&'
        }
      }
      axios.get(openUrl).then(res => {
        window.location.href = openUrl
      })
    },
    handleSourceExceed(files, fileList) {
      this.$message.warning(`当前限制选择文件个数，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
    },
    handleSourceSuccess() {
      this.getQS()
      this.$message.success("导入成功")
    },
    handleError() {
      this.$message.error("导入格式错误，请修改后重新导入！")
    },
    handleCarNumbersInfo(row) {
      this.carNumbersInfoVisible = true
      this.getCarNumbersBySid(row.sid)
      this.sid = row.sid
      this.editForm = row
    },
    deleteCarNumbersInfo(row) {
      this.deleteCarNumbersInfoVisible = true
      this.getCarNumbersBySid(row.sid)
      this.sid = row.sid
      this.editForm = row
    },
    enditComplTime() {
      this.ComplTimeVisible = false
    },
    editComplTime(row) {
      axios({
        url: baseURL + '/source/updatesourcecarnumber',
        method: 'post',
        data: { cid: row.cid, complTime: row.complTime },
      }).then(res => {
        this.$message.success("提交成功")
        this.getQS()
      }).then(() => {
        this.updateNumber(this.sid)
      })
    },
    deleteSourceInfoBySID(sid) {
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {

        axios({
          url: baseURL + '/source/deletesourceinfosid',
          method: 'post',
          params: { sid }
        }).then(res => {
          this.$message.success("删除成功")
          this.getQS()
        }).catch(err => {
          this.$message.error("删除失败")
        })

      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    changeDimension(sid, dimension) {
      this.$confirm('是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        axios({
          url: ` ${baseURL}/source/changedimension`,
          params: { sid, dimension }
        }).then(res => {
          this.$message.success("成功")
          this.search()
        }).catch(err => {
          this.$message.error('失败')
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        });
      });
    },
    rowCarStyle({ row }) {
      if (row.concern == 1) {
        return { 'background': 'antiquewhite' }
      }
    },
    changeCarConcern(cid, concern) {
      this.$confirm('是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        axios({
          url: ` ${baseURL}/source/changeconcern`,
          params: { cid, concern }
        }).then(res => {
          this.$message.success("标注成功")
          this.getQS()
          this.getCarNumbersBySid(this.sid)
          this.search()
        }).catch(err => {
          this.getQS()
          this.getCarNumbersBySid(this.sid)
          this.$message.error('标注失败')
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        });
      });
    },
    closeCarNumbersInfoVisible() {
      this.carNumbersInfoVisible = false
      this.carNumbersInfoData = []
    },
    showModal(id) {
      console.log(id)
      // 调用接口
      axios({
        url: baseURL + '/source/fileList/' + id,
        method: 'get'
      }).then(res => {
        console.log(res)
        this.dialogVisible = true;
        this.attachmentList = res.data.data || []
      })
    },
    handleCloseFile(done) {
      // 在这里可以处理模态框关闭前的逻辑
      done(); // 调用 done() 表示关闭模态框
    },
    handleFileNameClick(row) {
      console.log(baseURL + '/source/download/' + row.sourceFileMidId)
      // 处理文件名点击事件，你可以在这里执行相应的操作
      console.log('点击文件名', row);
      // 假设row.url为文件的预览地址，你需要根据实际情况获取
      // 调用接口
      this.$confirm('点击后下载，是否确定？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        axios({
          url: baseURL + '/source/getFileInfo/' + row.fileId,
          method: 'get'
        }).then(res => {
          console.log(res)
          if (res.data.code !== 200) {
            this.$message.error(res.data.msg)
            this.showModal(row.sourceId);
          }
          downloadFile(baseURL + '/source/download/' + row.sourceFileMidId, row.fileName)
          console.log(baseURL + '/source/download/' + row.sourceFileMidId)
        }).catch(err => {
          this.$message.error(err)
        })
      })
    },
    downloadAttachment(attachment) {
      // 调用附件下载接口，你需要根据实际情况修改这里的代码
      console.log('下载附件', attachment);
      // 这里可以使用 window.open 或者其他方式调用下载接口
      downloadFile(baseURL + '/source/download/' + attachment.sourceFileMidId, attachment.fileName)
    },
    deleteAttachment(row) {
      // 调用附件下载接口，你需要根据实际情况修改这里的代码
      console.log('删除附件', row);
      this.deleteParams = {
        fileId: row.fileId,
        sourceFileMidId: row.sourceFileMidId
      }
      // 调用接口
      this.$confirm('点击后删除，是否确定？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        axios({
          url: baseURL + '/source/deleteFile',
          method: 'post',
          data: this.deleteParams
        }).then(res => {
          console.log(res)
          if (res.data.code !== 200) {
            this.$message.error(res.data.msg)
          } else {
            this.$message.success('操作成功!')
            this.showModal(row.sourceId)
          }
        }).catch(err => {
          this.$message.error(err)
        })
      })
    },
    showUploadModal(row) {
      this.source.sid = row.sid;
      this.uploadModalVisible = true;
    },
    beforeClose(done) {
      // 在这里可以进行一些关闭前的操作
      done();
    },
    handleFileSuccess(response, file, fileList) {
      console.log("success")
      if (response.code !== 200) {
        this.$message.error(response.msg)
        this.$refs.refName.uploadFiles.splice(this.$refs.refName.uploadFiles.indexOf(file), 1);
      } else {
        this.$message.success("上传成功")
      }
    },
    handleFileError(err, file, fileList) {
      this.$message.error('文件超出大小限制，上传失败，请联系管理员!')
      this.$refs.refName.uploadFiles.splice(this.$refs.refName.uploadFiles.indexOf(file), 1);
      this.$refs.refName.clearFiles();
    },
    upload() {
      // 在这里可以处理文件上传的逻辑
      this.$refs.refName.clearFiles();
      this.uploadModalVisible = false;
    }
  }
}
</script>
  
  <!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.el-tag+.el-tag {
  margin-bottom: 10px;
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

.el-row {
  margin-bottom: 20px;
}

.el-col {
  border-radius: 4px;
}

.el-col-6 {
  width: 10%;
}

.bg-purple-light {
  background: #e5e9f2;
}

.grid-content {
  border-radius: 4px;
  min-height: 36px;
}

.row-bg {
  padding: 10px 0;
}

.input-new-tag {
  width: 150px !important;
}

.rate_wrap {
  display: flex;
  align-items: center;
}

.uploadFile {
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 添加拖拽时的样式 */
.uploadFile.drag-over {
  border-color: #409eff;
  /* 拖拽时的边框颜色 */
}

.icon-button {
  border: none;
  /* 移除按钮边框 */
  color: #409eff;
  /* 设置按钮文字颜色为蓝色 */
}

/* 设置el-link的默认颜色 */
.el-link {
  color: #409eff !important;
}
</style>
  
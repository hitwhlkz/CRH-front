<template>
  <div>
    <!-- 导出导入 -->
    <el-row :gutter="20">
      <!-- <el-col :span="6">
        <div class="grid-content bg-purple">
          <el-upload class="upload-demo" :action="`${baseURL}/source/importsource`" multiple
            :on-exceed="handleSourceExceed" :on-success="handleSourceSuccess" :on-error="handleError">
            <el-button plain size="small" type="warning" icon="el-icon-star-off">导入源头</el-button>
          </el-upload>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="grid-content bg-purple">
          <el-button plain size="small" type="warning" icon="el-icon-star-off"
            @click="exportSourceExcel()">导出源头</el-button>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="grid-content bg-purple">
          <el-upload class="upload-demo" :action="`${baseURL}/source/importsourcecarnumber`" multiple
            :on-exceed="handleSourceExceed" :on-success="handleSourceSuccess" :on-error="handleError">
            <el-button plain size="small" type="warning" icon="el-icon-star-off">导入车型</el-button>
          </el-upload>
        </div>
      </el-col> -->

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
      <el-form-item label="文号" prop="motorDocumentNumber">
        <el-input v-model="pageparm.motorDocumentNumber" placeholder="输入文号" @input="changeInput($event)"></el-input>
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
      <el-form-item label="车号" prop="carNumber">
        <el-select multiple filterable v-model="carNumbers" placeholder="请选择车号" @change="changeInput($event)">
          <el-option label="2048" :value="2048"></el-option>
          <el-option label="2049" :value="2049"></el-option>
          <el-option label="2050" :value="2050"></el-option>
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
      <el-table-column prop="motorDocumentNumber" label="文号" width="120" align="center"></el-table-column>
      <el-table-column prop="entryName" label="项目名称" width="200" align="center"></el-table-column>

      <el-table-column prop="total" label="总数" align="center" width="70"></el-table-column>
      <el-table-column prop="complTotal" label="已完成" width="70" align="center"></el-table-column>
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

      <el-table-column prop="" label="操作" width="180" align="center">
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
        <el-form-item label="文号" prop="motorDocumentNumber">
          <el-input v-model="editForm.motorDocumentNumber" label="" placeholder="请输入文号"></el-input>
        </el-form-item>
        <el-form-item label="项目名称" prop="entryName">
          <el-input type="textarea" v-model="editForm.entryName" auto-complete="off" placeholder="请输入项目名称"></el-input>
        </el-form-item>
        <el-form-item label="总量" prop="total">
          <el-input-number v-model="editForm.total" auto-complete="off" placeholder="请输入总量"></el-input-number>
        </el-form-item>
        <el-form-item label="已完成" prop="complTotal">
          <el-input-number v-model="editForm.complTotal" auto-complete="off" placeholder="请输入已完成"></el-input-number>
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
            <el-select v-model="selectLongCarNumberList" multiple placeholder="请选择车号">
              <el-option label="2048" :value="2048"></el-option>
              <el-option label="2049" :value="2049"></el-option>
              <el-option label="2050" :value="2050"></el-option>
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
              <el-input type="textarea" disabled class="input-new-tag" v-model="scope.row.complTime"
                ref="saveTagInput"></el-input>
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
import { longCarNumberList } from '../.././../common/longCarNumbers'


export default {
  name: 'techlong',
  data() {
    return {
      baseURL,
      longCarNumberList,
      carNumberList,
      classCarNumbers,
      selectLongCarNumberList: [],
      sid: 0,
      carNumbers: [],
      tableData: [],
      loading: false,
      pageparm: {
        type: 6,
        pageNo: 1,
        pageSize: 100000
      },
      pageparmcar: {},
      editFormVisible: false,
      title: '编辑',
      editForm: { type: 6 },
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

      updateTotal: 0,
      updateIncompl: 0,
      updateCompl: 0,

      deleteCarNumbersInfoVisible: false

    }
  },
  computed: {
    indexMethod: function () {
      return (this.pageparm.pageNo - 1) * (this.pageparm.pageSize) + 1
    }
  },
  created() {
    this.getTL()
  },
  methods: {
    changeInput(e) {
      this.$forceUpdate();
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
        type: 6
      }
    },
    getTL() {
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
            axios({
              url: baseURL + '/source/insertsource',
              method: 'post',
              data: { ...this.editForm, type: 6 }
            }).then(res => {
              this.$message({
                message: this.title + '成功',
                type: 'success'
              });
              this.editFormVisible = false
              this.editForm = { type: 6 }
              this.getTL()
            }).catch(err => {
              console.log(err)
              this.$message({
                message: this.title + '失败',
                type: 'error'
              });
              this.editFormVisible = false
              this.editForm = { type: 6 }
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
        console.log(this.carNumbersInfoData)
        this.carNumbersInfoData.sort(this.compare('carNumber'))
        console.log(this.carNumbersInfoData)
      }).catch(err => {

      })
    },
    insertLongCarNumber() {
      this.$confirm('是否提交该车号?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (this.selectLongCarNumberList.length) {
          for (let i = 0; i < this.selectLongCarNumberList.length; i++) {
            axios({
              url: baseURL + '/source/insertsourcecarnumber',
              method: 'post',
              data: { sid: this.sid, carNumber: this.selectLongCarNumberList[i] },
            }).then(res => {
              this.getTL()
              this.getCarNumbersBySid(this.sid)
            }).catch(err => {
              this.getTL()
              this.getCarNumbersBySid(this.sid)
              console.log(err)
              this.$message.error("请重新提交")
            })
          }
          this.selectLongCarNumberList = []
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
        console.log(res.data.data[0].sourceCarNumberDto)
        let total = sourceCarNumberDto.length
        console.log(total)
        this.updateTotal = total
        console.log('total', total)
        let incompl = 0
        let compl = 0
        for (let i = 0; i < total; i++) {
          let complTime = this.toRemoveSpacing(sourceCarNumberDto[i].complTime)
          if (complTime.toLowerCase() == 'null' || complTime == '' || complTime == 'N/A' || complTime == '未完成') {
            incompl += 1
          } else {
            compl += 1
          }
        }
        console.log('incoml', incompl)
        this.updateIncompl = incompl
        this.updateCompl = compl
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
            state
          },
        }).then(res => {
          this.editFormVisible = false
          this.search()

          this.getCarNumbersBySid(this.sid)

        }).catch(err => {
          console.log(err)
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
            this.getTL()
            this.getCarNumbersBySid(this.sid)
            this.inputVisible = false;
            this.$message.success('提交成功')
          }).catch(err => {
            this.getTL()
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
    handleClose(done) {
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
          this.getTL()
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
          // 修改未完成数
          if (complTime.toLowerCase() == 'null' || complTime == '' || complTime == 'N/A' || complTime == '未完成') {
            incomplTotal = this.editForm.incomplTotal - 1
            if (total != 0 & incomplTotal == 0) {
              state = 1
            } else {
              state = 0
            }
          } else {
            // 修改已完成数
            complTotal = this.editForm.complTotal - 1
            if (total == complTotal) {
              state = 1
              console.log(state)
            } else {
              state = 0
              console.log(state)
            }
          }
          console.log(row)
          console.log(total, incomplTotal, complTotal)
          editForm = { ...this.editForm, total, incomplTotal, complTotal, state }
          // 根据已完成/未完成 回填
          if (complTime.toLowerCase() == 'null' || complTime == '' || complTime == 'N/A' || complTime == '未完成') {
            editForm = { ...this.editForm, total, incomplTotal, state }
            console.log(editForm)
          } else {
            editForm = { ...this.editForm, total, complTotal, state }
            console.log(editForm)
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
            this.getTL()
            this.getCarNumbersBySid(this.sid)
          }).then(() => {

            axios({
              method: 'post',
              url: baseURL + '/source/selectallsourceinfo',
              data: { sid: this.sid }
            }).then(res => {
              this.editForm = res.data.data[0]
              this.initPage()
              this.getTL()
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
      this.editForm = row
      console.log(tag, row)
      this.carNumberComplForm = tag
      this.sid = row.sid
    },
    handleComplTime() {
      this.carNumberComplTimeVisible = false
      axios({
        url: baseURL + '/source/updatesourcecarnumber',
        method: 'post',
        data: this.carNumberComplForm,
      }).then(res => {
        this.getTL()
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
        console.log(openUrl)
        window.location.href = openUrl
      })
    },
    exportSourceFinalExcel() {
      let openUrl = `${baseURL}/source/exportsourcefinaltechnologyconcentra?`;

      for (let obj in this.pageparm || this.pageparm[obj] == 0) {
        if (this.pageparm[obj]) {
          openUrl += obj + '=' + this.pageparm[obj] + '&'
        }
      }
      axios.get(openUrl).then(res => {
        console.log(openUrl)
        window.location.href = openUrl
      })
    },
    handleSourceExceed(files, fileList) {
      this.$message.warning(`当前限制选择文件个数，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
    },
    handleSourceSuccess() {
      this.getTL()
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
        this.getTL()
        this.$message.success("提交成功")
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
          this.getTL()
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
    rowStyle({ row }) {
      if (row.dimension == 1) {
        return { 'background': 'antiquewhite' }
      }
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
          this.getTL()
          this.getCarNumbersBySid(this.sid)
          this.search()
        }).catch(err => {
          this.getTL()
          this.getCarNumbersBySid(this.sid)
          this.search()
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
</style>
  
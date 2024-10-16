<template>
    <div class="fault-component">
        <!-- 筛选 -->
        <el-form :inline="true" :model="pageparm" class="user-search" ref="searchForm">
            <el-row :gutter="20">
                <el-col :span="8">
                    <el-form-item label="处理结果：" prop="result">
                        <el-select v-model="pageparm.result" placeholder="请选择处理结果" @change="changeInput($event)" clearable style="width: 100%;">
                            <el-option label="未处理" value="未处理"></el-option>
                            <el-option label="已处理" value="已处理"></el-option>
                            <el-option label="长期跟踪" value="长期跟踪"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="交修日期" class="date-picker-item">
                        <el-date-picker 
                            v-model="timeList" 
                            type="daterange" 
                            range-separator="至" 
                            start-placeholder="开始日期" 
                            end-placeholder="结束日期"
                            size="small">
                        </el-date-picker>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="车号" prop="carNumber">
                        <el-select multiple filterable v-model="carNumbers" placeholder="请选择车号" @change="changeInput($event)" clearable style="width: 100%;">
                            <el-option v-for="item in carNumberList" :key="item.value" :label="item.value" :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row :gutter="20">
                <el-col :span="8">
                    <el-form-item label="车厢号" prop="carBodyNumber">
                        <el-input size="small" v-model="pageparm.carBodyNumber" placeholder="输入车厢号" @input="changeInput($event)" style="width: 100%;"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="故障描述：" prop="faultDescription">
                        <el-input size="small" v-model="pageparm.faultDescription" placeholder="输入故障描述" @input="changeInput($event)" style="width: 100%;"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="故障来源：" prop="source">
                        <el-input size="small" v-model="pageparm.source" placeholder="输入故障来源" @input="changeInput($event)" style="width: 100%;"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row :gutter="20">
                <el-col :span="8">
                    <el-form-item label="处理方法：" prop="method">
                        <el-input size="small" v-model="pageparm.method" placeholder="输入处理方法" @input="changeInput($event)" style="width: 100%;"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="处理班组" prop="teamsGroups">
                        <el-select v-model="pageparm.teamsGroups" placeholder="请选择处理班组" @change="changeInput($event)" clearable style="width: 100%;">
                            <el-option v-for="item in teamsList" :key="item.id" :label="item.name" :value="item.name">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item class="button-group">
                        <el-button size="small" type="primary" icon="el-icon-search" @click="search()">搜索</el-button>
                        <el-button size="small" type="warning" icon="el-icon-refresh-right" @click="resetForm('searchForm')">重置</el-button>
                        <el-button size="small" type="success" icon="el-icon-plus" @click="handleEdit()">添加</el-button>
                        <el-button size="small" type="info" icon="el-icon-star-off" @click="exportExcel()">导出</el-button>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>

        <!-- 表格 -->
        <el-table :data="tableData" style="width: 100%" border height="600">
            <el-table-column type="index" label="序号" align="center" width="130" :index="indexMethod"
                fixed></el-table-column>
            <el-table-column prop="deliveryDate" label="交修日期" width="180" align="center"></el-table-column>
            <el-table-column prop="carNumber" label="车号" width="180" align="center"></el-table-column>
            <el-table-column prop="carBodyNumber" label="车厢号" align="center"></el-table-column>
            <el-table-column prop="faultDescription" label="故障描述" width="180" align="center"></el-table-column>
            <el-table-column prop="teamsGroups" label="处理班组" width="180" align="center"></el-table-column>
            <el-table-column prop="result" label="处理结果" width="130" align="center"></el-table-column>
            <el-table-column prop="method" label="处理方法" width="180" align="center"></el-table-column>
            <el-table-column prop="source" label="故障来源" align="center">
                <template slot-scope="scope">
                    {{ scope.row.source == 'null' ? '' : scope.row.source }}
                </template>
            </el-table-column>
            <el-table-column prop="notes" label="车组预计送修时间" align="center" width="160">
                <template slot-scope="scope">
                    {{ scope.row.notes == 'null' ? '' : scope.row.notes }}
                </template>
            </el-table-column>

            <el-table-column prop="" label="删除" align="center">
                <template slot-scope="scope">
                    <el-button type="danger" icon="el-icon-delete" circle @click="deleteById(scope.row)"></el-button>
                </template>
            </el-table-column>

            <el-table-column prop="notes" label="查看" align="center" width="130">
              <template slot-scope="scope">
                <el-button @click="showModal(scope.row.id)" class="icon-button">
                  <i class="el-icon-view"></i>
                  查看附件
                </el-button>
              </template>
              <el-dialog
                title="附件列表"
                :visible.sync="dialogVisible"
                width="40%"
                :before-close="handleCloseFile"
                append-to-body
              >
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

            </el-table-column>
            <el-table-column prop="" label="附件" width="120" align="center" fixed="right">
                <template slot-scope="scope">
                    <div style="margin-top: 5px;">
                        <!-- 触发模态框的按钮 -->
                        <el-button @click="showUploadModal(scope.row)" size="small" type="primary">点击上传</el-button>
                    </div>
                </template>
            </el-table-column>

            <el-table-column prop="" label="操作" width="180" align="center" fixed="right">
                <template slot-scope="scope">
                    <el-button type="primary" icon="el-icon-edit" circle
                        @click="handleEdit(scope.$index, scope.row)"></el-button>
                    <!-- <el-button type="danger" icon="el-icon-delete" circle @click="deleteById(scope.row)"></el-button> -->
                    <el-button type="success" icon="el-icon-bottom" circle
                        @click="changState(scope.row.id, scope.row.state)"></el-button>
                </template>
            </el-table-column>
        </el-table>

        <Pagination v-bind:child-msg="pageparm" v-bind:total="total" @callFather="callFather"></Pagination>

        <!-- 编辑 -->
        <el-dialog :title="title" :visible.sync="editFormVisible" width="55%" @click="closeDialog('editForm')">
            <el-form label-width="120px" :model="editForm" :rules="rules" ref="editForm">
                <el-form-item label="交修日期" prop="deliveryDate">
                    <el-date-picker value-format="yyyy-MM-dd" v-model="editForm.deliveryDate" type="date"
                        placeholder="选择日期">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="车号" prop="carNumber">
                    <el-input v-model="editForm.carNumber" auto-complete="off" placeholder="请输入车号"></el-input>
                </el-form-item>
                <el-form-item label="车厢号" prop="carBodyNumber">
                    <el-input v-model="editForm.carBodyNumber" :min="1" label="" placeholder="请输入车箱号"></el-input>
                </el-form-item>
                <el-form-item label="故障描述" prop="faultDescription">
                    <el-input type="textarea" v-model="editForm.faultDescription" label="" placeholder="请输入故障描述"></el-input>
                </el-form-item>
                <el-form-item label="处理班组" prop="teamsGroups">
                    <el-select v-model="editForm.teamsGroups" placeholder="请选择处理班组">
                        <el-option v-for="item in teamsList" :key="item.id" :label="item.name" :value="item.name">
                        </el-option>
                    </el-select>
                    <el-link type="primary" href="http://localhost:8080/#/teams/index" :underline="false">添加班组</el-link>
                </el-form-item>
                <el-form-item label="处理结果" prop="result">
                    <label slot="label"><span style="color:red">*</span>&nbsp;处理结果</label>
                    <el-radio-group v-model="result" @change="changeResult">
                        <el-radio class="radio" label="未处理">未处理</el-radio>
                        <el-radio class="radio" label="长期跟踪">长期跟踪</el-radio>
                        <el-radio class="radio" label="已处理">已处理(填写处理时间)</el-radio>
                    </el-radio-group>
                    <el-input v-if="result == '已处理'" v-model="editForm.result" label="" placeholder="请输入处理结果"
                        size="mini"></el-input>
                </el-form-item>
                <el-form-item label="处理方法" prop="method">
                    <el-input type="textarea" size="small" v-model="editForm.method" auto-complete="off"
                        placeholder="请输入处理结果"></el-input>
                </el-form-item>
                <el-form-item label="故障来源" prop="respDepart">
                    <el-input v-model="editForm.source" label="" placeholder="请输入故障来源"></el-input>
                </el-form-item>
                <el-form-item label="车组预计送修时间" prop="node">
                    <el-input size="small" v-model="editForm.notes" auto-complete="off" placeholder="车组预计送修时间"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button size="small" @click="closeDialog('editForm')">取消</el-button>
                <el-button size="small" type="primary" class="title" @click="handelFault('editForm')">保存</el-button>
            </div>
        </el-dialog>

        <!-- 文件上传 -->
        <el-dialog title="文件上传" :visible.sync="uploadModalVisible" width="650px" :before-close="beforeClose" append-to-body
         :show-close="false" :close-on-click-modal="false">
            <el-upload class="uploadFile" :action="`${baseURL}/fault/upload`" :on-success="handleFileSuccess"
                :on-error="handleFileError" :file-list="fileList" :data="fault" ref="refName" drag multiple>
                <i class="el-icon-upload"></i>
                <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
            </el-upload>
            <div slot="footer" class="dialog-footer">
                <el-button @click="upload">取 消</el-button>
                <el-button type="primary" @click="upload">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
  
<script>
import axios from 'axios'
import Pagination from '../../../components/Pagination.vue'
import { baseURL } from '../../../api/base'
import { carNumberList } from '../.././../common/carNumber'
import {downloadFile} from '../../../api/FileDownload'


export default {
    name: 'Fault',
    components: {
        Pagination
    },
    data() {
        return {
            carNumbers: [],
            carNumberList,
            baseURL,
            timeList: [],
            tableData: [],
            editFormVisible: false,
            title: '编辑',
            editForm: {
                risk: 0,
                state: 1
            },
            risk: 0,
            result: '',
            rules: {
                deliveryDate: [{ required: true, message: '请输入日期', trigger: 'blur' }],
                carNumber: [{ required: true, message: '请输入车号', trigger: 'blur' }],
                carBodyNumber: [{ required: true, message: '请输入车厢号', trigger: 'blur' }],
                faultDescription: [{ required: true, message: '请输入故障描述', trigger: 'blur' }],
                teamsGroups: [{ required: true, message: '请选择班组', trigger: 'blur' }],
                funClass: [{ required: true, message: '请选择功能分类', trigger: 'blur' }],
                handle: [{ required: true, message: '请选择处置分类', trigger: 'blur' }],
            },
            pageparm: {
                pageNo: 1,
                pageSize: 10000,
                state: 1
            },
            total: 0,
            allList: [],
            headers: "'Content-Type': 'multipart/form-data'",
            loading: true,
            teamsList: [],

            uploadModalVisible: false,
            fileList: [],
            dialogVisible: false,
            attachmentList: [
                // 你的附件数据应该在这里
                // 格式示例：{ name: '文件1', type: '文档', url: '附件下载接口地址' }
            ],
            previewDialogVisible: false,
            previewFile: '',
            fault: {},
            deleteParams: {},
        }
    },
    created() {
        this.getFault()
        this.getTeams()
    },
    computed: {
        indexMethod: function () {
            return (this.pageparm.pageNo - 1) * (this.pageparm.pageSize) + 1
        }
    },
    methods: {
        changeInput(e) {
            this.$forceUpdate();
        },
        // 重置
        resetForm(formName) {
            this.$refs[formName].resetFields();
            this.timeList = []
            delete this.pageparm.startTime
            delete this.pageparm.endTime
            if (this.pageparm.carNumbers) {
                delete this.pageparm.carNumbers
            }
            this.carNumbers = []
        },
        getTeams() {
            axios({
                url: baseURL + '/teams/selectall'
            }).then(res => {
                this.teamsList = res.data.data
                this.loading = false
            }).catch(err => {
                console.log(err);
            })
        },
        search() {
            if (this.carNumbers.length) {
                this.pageparm.carNumbers = this.carNumbers
            }
            this.loading = true
            if (this.timeList.length) {
                this.pageparm.startTime = this.getYMDHMS(new Date(this.timeList[0].toString()));
                this.pageparm.endTime = this.getYMDHMS(new Date(this.timeList[1].toString()))
            }
            this.pageparm.state = 1
            this.pageparm.pageNo = 1
            this.pageparm.pageSize = 10000
            axios({
                method: 'post',
                url: baseURL + '/fault/screenfault',
                data: this.pageparm
            }).then(res => {
                this.$message.success('搜索成功')
                this.tableData = res.data.data.list
                this.tableData = this.tableData.map(item => {
                    item.deliveryDate = this.getYMDHMS(item.deliveryDate)
                    item.risk = item.risk == 'null' || '0' ? 0 : parseInt(item.risk)
                    item.code = item.code == 'null' ? '' : item.code
                    item.schedule = item.schedule == 'null' ? '' : item.schedule
                    item.respDepart = item.respDepart == 'null' ? '' : item.respDepart
                    item.notes = item.notes == 'null' ? '' : item.notes
                    return item
                })
                this.total = res.data.data.size
                this.loading = false
            }).catch(err => {
                this.initPage()
                this.getFault()
                this.$message.error('搜索失败')
                console.log(err)
            })

        },
        initPage() {
            this.pageparm = {
                pageNo: 1,
                pageSize: 10000,
            }
        },
        getYMDHMS(val) {
            let date = new Date(val)
            let Y = date.getFullYear()
            const M = (date.getMonth() + 1).toString().padStart(2, '0')
            const D = (date.getDate()).toString().padStart(2, '0')
            return Y + "-" + M + "-" + D;
        },
        exportExcel() {
            if (this.carNumbers.length) {
                this.pageparm.carNumbers = this.carNumbers
            }
            if (this.timeList.length) {
                this.pageparm.startTime = this.getYMDHMS(new Date(this.timeList[0].toString()));
                this.pageparm.endTime = this.getYMDHMS(new Date(this.timeList[1].toString()))
            }

            let openUrl = `${baseURL}/fault/exportsenior?`;
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
        callFather(val) {
            this.pageparm.pageNo = val.pageNo
            this.pageparm.pageSize = val.pageSize
            this.getFault()
        },
        getFault() {
            if (this.carNumbers.length) {
                this.pageparm.carNumbers = this.carNumbers
            }
            this.pageparm.state = 1
            axios({
                url: baseURL + '/fault/screenfault',
                method: 'post',
                data: this.pageparm
            }).then(res => {
                this.tableData = res.data.data.list
                this.tableData = this.tableData.map(item => {
                    item.deliveryDate = this.getYMDHMS(item.deliveryDate)
                    item.risk = item.risk == 'null' || '0' ? 0 : parseInt(item.risk)
                    item.code = item.code == 'null' ? '' : item.code
                    item.schedule = item.schedule == 'null' ? '' : item.schedule
                    item.respDepart = item.respDepart == 'null' ? '' : item.respDepart
                    item.notes = item.notes == 'null' ? '' : item.notes
                    return item
                })
                this.total = res.data.data.size
                this.loading = false
            }).catch(err => {
                console.log(err);
            })
        },
        deleteById(row) {
            this.$confirm('此操作将永久删除, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                axios({
                    url: baseURL + '/fault/deletefaultid',
                    params: { id: row.id }
                }).then(res => {
                    this.$message({
                        message: '删除成功',
                        type: 'success'
                    });
                    this.search()
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
        handleEdit(index, row) {
            this.editFormVisible = true
            if (row != undefined && row != 'undefined') {
                this.title = '修改'
                this.editForm = row
                if (this.editForm.result != '未处理' & this.editForm.result != '长期跟踪') {
                    this.result = '已处理'
                } else if (this.editForm.result == '未处理') {
                    this.result = '未处理'
                } else if (this.editForm.result == "长期跟踪") {
                    this.result = '长期跟踪'
                }
            } else {
                this.title = '添加'
                this.editForm = { state: 1 }
            }
        },
        changeResult() {
            this.editForm.result = ''
        },
        handelFault() {
            this.$refs['editForm'].validate((valid) => {
                if (valid) {
                    if (this.result != '已处理') {
                        this.editForm.result = this.result
                    }
                    this.editForm.risk = this.risk
                    if (this.title == '添加') {
                        axios({
                            url: baseURL + '/fault/insertfault',
                            method: 'post',
                            data: this.editForm
                        }).then(res => {
                            this.$message({
                                message: this.title + '成功',
                                type: 'success'
                            });
                            this.editFormVisible = false
                            this.editForm = {}
                            this.initPage()
                            this.getFault()
                        }).catch(err => {
                            console.log(err)
                            this.$message({
                                message: this.title + '失败',
                                type: 'error'
                            });
                            this.editFormVisible = false
                            this.editForm = {}
                            this.initPage()
                            this.getFault()
                        })
                    } else {
                        for (let obj in this.editForm) {
                            if (!this.editForm[obj] & obj != 'risk') {
                                this.editForm[obj] = 'null'
                            }
                        }
                        axios({
                            url: baseURL + '/fault/updatefaultid',
                            method: 'post',
                            data: this.editForm,
                        }).then(res => {
                            this.editFormVisible = false
                            this.editForm = {}
                        }).catch(err => {
                            console.log(err)
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
            this.initPage()
            this.getFault()
        },
        handleUploadSuccess(res) {
            this.uploadUrlPath = JSON.stringify(res);
            this.loading.close();
        },
        handleBeforeUpload() {
            this.loading = this.$loading({
                lock: true,
                text: "上传中",
                background: "rgba(0, 0, 0, 0.7)",
            });
        },
        handleUploadError() {
            this.$message({
                type: "error",
                message: "上传失败",
            });
            this.loading.close();
        },
        handleRemove(file, fileList) {
            console.log(file, fileList);
        },
        handlePreview(file) {
            console.log(file);
        },
        handleExceed(files, fileList) {
            this.$message.warning(`当前限制选择文件个数，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
        },
        beforeRemove(file, fileList) {
            return this.$confirm(`确定移除 ${file.name}？`);
        },
        handleSuccess() {
            this.getFault()
            this.$message.success("导入成功")
        },
        handleError() {
            this.getFault()
            this.$message.error("导入格式错误，请修改后重新导入！")
        },
        resetRisk() {
            this.risk = 0
        },
        changState(id, state) {
            this.$confirm('此操作将数据提交到故障遗留列表, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                axios({
                    url: ` ${baseURL}/fault/changestate`,
                    params: { id, state: 0 }
                }).then(res => {
                    this.$message.success("已转移到故障遗留库")
                    this.search()
                }).catch(err => {
                    this.$message.error('重新提交')
                })
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消提交'
                });
            });
        },
        showModal(id) {
          // 调用接口
          axios({
            url: baseURL + '/fault/fileList/' + id,
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
        // 显示模态框
        showUploadModal(row) {
            this.fault.id = row.id;
            this.uploadModalVisible = true;
        },
         // 关闭模态框前的钩子
         beforeClose(done) {
          // 在这里可以进行一些关闭前的操作
          done();
        },
        // 确定上传按钮的点击事件
        upload() {
          // 在这里可以处理文件上传的逻辑
          this.$refs.refName.clearFiles();
          this.uploadModalVisible = false;
        },
        handleFileSuccess(response,  file, fileList) {
            console.log("success")
            if (response.code !== 200) {
              this.$message.error(response.msg)
              this.$refs.refName.uploadFiles.splice(this.$refs.refName.uploadFiles.indexOf(file), 1);
            }else {
              this.$message.success("上传成功")
            }
        },
        handleFileError(err, file, fileList) {
          this.$message.error('文件超出大小限制，上传失败，请联系管理员!')
          this.$refs.refName.uploadFiles.splice(this.$refs.refName.uploadFiles.indexOf(file), 1);
          this.$refs.refName.clearFiles();
        },
        downloadAttachment(attachment) {
          // 调用附件下载接口，你需要根据实际情况修改这里的代码
          console.log('下载附件', attachment);
          // 这里可以使用 window.open 或者其他方式调用下载接口
          downloadFile(baseURL + '/fault/download/' + attachment.faultFileMidId, attachment.fileName)
        },
        deleteAttachment(row) {
          // 调用附件下载接口，你需要根据实际情况修改这里的代码
          console.log('删除附件', row);
          this.deleteParams = {
            fileId: row.fileId,
            faultFileMidId: row.faultFileMidId
          }
          // 调用接口
          this.$confirm('点击后删除，是否确定？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            axios({
              url: baseURL + '/fault/deleteFile',
              method: 'post',
              data: this.deleteParams
            }).then(res => {
              console.log(res)
              if (res.data.code !== 200) {
                this.$message.error(res.data.msg)
              }else {
                this.$message.success('操作成功!')
                this.showModal(row.faultId)
              }
            }).catch(err => {
              this.$message.error(err)
            })
          })
        },
        handleFileNameClick(row) {
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
              url: baseURL + '/fault/getFileInfo/' + row.fileId,
              method: 'get'
            }).then(res => {
              console.log(res)
              if (res.data.code !== 200) {
                this.$message.error(res.data.msg)
                this.showModal(row.faultId);
              }
              downloadFile(baseURL + '/fault/download/' + row.faultFileMidId, row.fileName)
            }).catch(err => {
              this.$message.error(err)
            })
          })
        },
    }
}
</script>
  
  <!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.fault-component {
  background-color: #f5f7fa;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.user-search {
  background: #ffffff;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  margin-bottom: 24px;
}

.el-form-item {
  margin-bottom: 20px;
}

.el-select, .el-input {
  border-radius: 4px;
  transition: border-color 0.2s;
}

.el-select:hover, .el-input:hover {
  border-color: #409eff;
}

.el-button {
  transition: all 0.3s ease;
}

.el-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.el-link {
  color: #409eff !important;
}

.user-search .el-form-item {
  margin-bottom: 18px;
}

.user-search .date-picker-item {
  display: flex;
  align-items: center;
  width: 100%;
}

.user-search .date-picker-item .el-form-item__label {
  margin-right: 10px;
  text-align: right;
  padding-right: 12px;
  box-sizing: border-box;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.user-search .date-picker-item .el-form-item__content {
  flex: 1;
  margin-left: 0 !important;
}

.user-search .date-picker-item .el-date-editor {
  width: 100% !important;
}

/* 调整日期选择器的内部布局 */
.user-search .el-date-editor .el-range-separator {
  padding: 0 1px;
  width: 8%;
}

.user-search .el-date-editor .el-range-input {
  width: 40% !important;
  padding: 0 1px;
}

/* 按钮悬停效果 */
.el-button--primary:hover {
  background-color: #66b1ff;
  border-color: #66b1ff;
}

.el-button--success:hover {
  background-color: #85ce61;
  border-color: #85ce61;
}

.el-button--warning:hover {
  background-color: #ebb563;
  border-color: #ebb563;
}

.el-button--danger:hover {
  background-color: #f78989;
  border-color: #f78989;
}

.el-button--info:hover {
  background-color: #a6a9ad;
  border-color: #a6a9ad;
}

.el-button--default:hover {
  background-color: #ecf5ff;
  color: #409EFF;
  border-color: #c6e2ff;
}

.el-button.is-circle:hover {
  transform: translateY(-2px) scale(1.05);
}

/* 统一输入框高度 */
.fault-component .user-search .el-input__inner,
.fault-component .user-search .el-select .el-input__inner,
.fault-component .user-search .el-date-editor.el-input__inner,
.fault-component .user-search .el-date-editor.el-range-editor.el-input__inner {
  height: 32px !important;
  line-height: 32px !important;
}

/* 调整日期选择器的内部元素 */
.fault-component .user-search .el-date-editor .el-range-input {
  height: 30px !important;
  line-height: 30px !important;
}

.fault-component .user-search .el-date-editor .el-range-separator {
  line-height: 30px !important;
}

/* 调整选择器的下拉图标位置 */
.fault-component .user-search .el-select .el-input__icon,
.fault-component .user-search .el-date-editor .el-input__icon {
  line-height: 30px !important;
}

/* 确保多选选择器的标签在一行内显示 */
.fault-component .user-search .el-select .el-select__tags {
  height: 30px !important;
  overflow: hidden;
}

/* 调整按钮高度以匹配输入框 */
.fault-component .user-search .el-button {
  height: 32px !important;
  line-height: 30px !important;
  padding-top: 0;
  padding-bottom: 0;
}

.button-group {
  display: flex;
  justify-content: flex-end;
}

.button-group .el-button {
  margin-left: 10px;
}

/* 在小屏幕上调整按钮组的布局 */
@media (max-width: 768px) {
  .button-group {
    justify-content: flex-start;
    margin-top: 10px;
  }
  
  .button-group .el-button {
    margin-left: 0;
    margin-right: 10px;
  }
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
}

.icon-button {
  border: none;
  color: #409eff;
}
</style>
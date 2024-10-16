<template>
    <div>
        <!-- 筛选 -->
        <el-form :inline="true" :model="pageparm" class="user-search" ref="searchForm">
            <el-form-item label="处理结果：" prop="result">
                <el-select v-model="pageparm.result" placeholder="请选择处理结果" @change="changeResultSelect">
                    <el-option label="全部" value="全部"></el-option>
                    <el-option label="未处理" value="未处理"></el-option>
                    <el-option label="已处理" value="已处理"></el-option>
                    <el-option label="长期跟踪" value="长期跟踪"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="标注" prop="dimension">
                <el-select v-model="pageparm.dimension" placeholder="请选择" @change="changeUpdate">
                    <el-option label="非重点关注" value="0"></el-option>
                    <el-option label="重点关注" value="1"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="到料" prop="material">
                <el-select v-model="pageparm.material" placeholder="请选择到料情况">
                    <el-option label="无" value="无"></el-option>
                    <el-option label="否" value="否"></el-option>
                    <el-option label="是" value="是"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="复核" prop="review">
                <el-select v-model="pageparm.review" placeholder="请选择">
                    <el-option label="否" value="0"></el-option>
                    <el-option label="是" value="1"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="车号" prop="carNumber">
                <el-select multiple filterable v-model="carNumbers" placeholder="请选择车号">
                    <el-option v-for="item in carNumberList" :key="item.value" :label="item.value" :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="车厢号" prop="carBodyNumber">
                <el-input size="small" v-model="pageparm.carBodyNumber" placeholder="输入车厢号"></el-input>
            </el-form-item>
            <el-form-item label="责任人" prop="trackPerson">
                <el-input size="small" v-model="pageparm.trackPerson" placeholder="输入责任人"></el-input>
            </el-form-item>
            <el-form-item label="交修日期">
                <el-col :span="11">
                    <el-date-picker v-model="timeList" type="daterange" range-separator="至" start-placeholder="开始日期"
                        end-placeholder="结束日期">
                    </el-date-picker>
                </el-col>
            </el-form-item>
            <el-form-item label="故障描述：" prop="faultDescription">
                <el-input size="small" v-model="pageparm.faultDescription" placeholder="输入故障描述"></el-input>
            </el-form-item>
            <el-form-item label="影响进度原因：" prop="schedule">
                <el-input size="small" v-model="pageparm.schedule" placeholder="输入影响进度原因"></el-input>
            </el-form-item>
            <el-form-item label="故障来源：" prop="source">
                <el-input size="small" v-model="pageparm.source" placeholder="输入故障来源"></el-input>
            </el-form-item>
            <el-form-item label="处理方法：" prop="method">
                <el-input size="small" v-model="pageparm.method" placeholder="输入处理方法"></el-input>
            </el-form-item>
            <el-form-item label="处理班组" prop="teamsGroups" @change="changeUpdate">
                <el-input size="small" v-model="pageparm.teamsGroups" placeholder="输入处理班组"></el-input>
            </el-form-item>
            <el-form-item label="功能分类" prop="funClass">
                <el-select v-model="pageparm.funClass" placeholder="请选择功能分类" @change="changeUpdate">
                    <el-option label="整车" value="整车"></el-option>
                    <el-option label="车体" value="车体"></el-option>
                    <el-option label="车端连接" value="车端连接"></el-option>
                    <el-option label="转向架及其辅助" value="转向架及其辅助"></el-option>
                    <el-option label="主供电" value="主供电"></el-option>
                    <el-option label="牵引" value="牵引"></el-option>
                    <el-option label="辅助电气" value="辅助电气"></el-option>
                    <el-option label="供风制动" value="供风制动"></el-option>
                    <el-option label="网络及辅助监控" value="网络及辅助监控"></el-option>
                    <el-option label="旅客信息" value="旅客信息"></el-option>
                    <el-option label="空调" value="空调"></el-option>
                    <el-option label="给排水卫生" value="给排水卫生"></el-option>
                    <el-option label="外门及车内设施" value="外门及车内设施"></el-option>
                    <el-option label="驾驶设施" value="驾驶设施"></el-option>
                    <el-option label="电务车载" value="电务车载"></el-option>
                    <el-option label="其他" value="其他"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="处置分类" prop="handle">
                <el-input size="small" v-model="pageparm.handle" placeholder="输入处置分类"></el-input>
            </el-form-item>
            <el-form-item label="风险等级" prop="risk">
                <el-select multiple filterable v-model="risks" placeholder="请选择风险等级" @change="changeUpdate">
                    <el-option label="无风险" :value="0"></el-option>
                    <el-option v-for="item in riskList" :key="item.value" :label="item.label" :value="item.value">
                        <span style="float: left"><el-rate v-model="item.value" :max="item.value" disabled></el-rate></span>
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button size="small" type="primary" icon="el-icon-search" @click="search()">搜索</el-button>
                <el-button size="small" type="primary" icon="el-icon-refresh-right"
                    @click="resetForm('searchForm')">重置</el-button>
                <el-button size="small" type="warning" icon="el-icon-star-off" @click="exportExcel()">导出</el-button>
            </el-form-item>
        </el-form>

        <!-- 表格 -->
        <el-table :data="tableData" style="width: 100%" border v-loading="loading" height="600" :row-style="rowStyle">
            <el-table-column type="index" label="序号" align="center" width="70" :index="indexMethod" fixed></el-table-column>
            <el-table-column prop="deliveryDate" label="交修日期" width="100" align="center"></el-table-column>
            <el-table-column prop="carNumber" label="车号" width="70" align="center"></el-table-column>
            <el-table-column prop="carBodyNumber" label="车厢号" align="center"></el-table-column>
            <el-table-column prop="trackPerson" label="责任人" width="100" align="center"></el-table-column>
            <el-table-column prop="trackRequire" label="追踪要求" width="180" align="center"></el-table-column>
            <el-table-column prop="feedback" label="反馈实现" width="100" align="center"></el-table-column>
            <el-table-column prop="faultDescription" label="故障描述" width="180" align="center"></el-table-column>
            <el-table-column prop="teamsGroups" label="处理班组" width="100" align="center"></el-table-column>
            <el-table-column prop="result" label="处理结果" width="180" align="center">
                <template slot-scope="scope">
                    {{ scope.row.result == 'null' ? '' : scope.row.result }}
                </template>
            </el-table-column>
            <el-table-column prop="method" label="处理方法" width="200" align="center">
                <template slot-scope="scope">
                    {{ scope.row.method == 'null' ? '' : scope.row.method }}
                </template>
            </el-table-column>
            <el-table-column prop="source" label="故障来源" align="center">
                <template slot-scope="scope">
                    {{ scope.row.source == 'null' ? '' : scope.row.source }}
                </template>
            </el-table-column>
            <el-table-column prop="funClass" label="功能分类" width="130" align="center">
                <template slot-scope="scope">
                    {{ scope.row.funClass == 'null' ? '' : scope.row.funClass }}
                </template>
            </el-table-column>
            <el-table-column prop="risk" label="风险等级" width="100" align="center">
                <template slot-scope="scope">
                    <el-rate v-model="scope.row.risk" :max="3" disabled></el-rate>
                </template>
            </el-table-column>
            <el-table-column prop="handle" label="处置分类" width="150" align="center">
                <template slot-scope="scope">
                    {{ scope.row.handle == 'null' ? '' : scope.row.handle }}
                </template>
            </el-table-column>
            <el-table-column prop="notes" label="备注" align="center">
                <template slot-scope="scope">
                    {{ scope.row.notes == 'null' ? '' : scope.row.notes }}
                </template>
            </el-table-column>
            <el-table-column prop="notes" label="查看" align="center" width="130">
                <template slot-scope="scope">
                    <el-button @click="showModal(scope.row.id)" class="icon-button">
                        <i class="el-icon-view"></i>
                        查看附件
                    </el-button>
                </template>
                <el-dialog title="附件列表" :visible.sync="dialogVisible" width="40%" :before-close="handleCloseFile"
                    append-to-body>
                    <el-table :data="attachmentList" style="width: 100%">
                        <!-- <el-table-column prop="faultFileMidId" label="序号"></el-table-column> -->
                        <el-table-column prop="fileName" align="center" label="名称">
                            <template slot-scope="{ row }">
                                <el-link @click="handleFileNameClick(row)">{{ row.fileName }}</el-link>
                            </template>
                        </el-table-column>
                        <el-table-column prop="fileType" align="center" label="类型"></el-table-column>
                        <el-table-column label="操作" align="center">
                            <template slot-scope="{ row }">
                                <el-button type="primary" icon="el-icon-download"
                                    @click="downloadAttachment(row)"></el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-dialog>
            </el-table-column>
        </el-table>

        <Pagination v-bind:child-msg="pageparm" v-bind:total="total" @callFather="callFather"></Pagination>

    </div>
</template>
  
<script>
import axios from 'axios'
import Pagination from '../../../components/Pagination.vue'
import { baseURL } from '../../../api/base'
import { carNumberList } from '../.././../common/carNumber'


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
                state: 2,
                risk: 0
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
                method: [{ required: true, message: '请输入处理方法', trigger: 'blur' }],
                source: [{ required: true, message: '请输入故障来源', trigger: 'blur' }],
                trackPerson: [{ required: true, message: '请输入责任人', trigger: 'blur' }]

            },
            pageparm: {
                pageNo: 1,
                pageSize: 100000,
                state: 2,
            },
            total: 0,
            allList: [],
            headers: "'Content-Type': 'multipart/form-data'",
            loading: true,
            teamsList: [],
            riskList: [{
                label: "⭐",
                value: 1
            }, {
                label: "⭐⭐",
                value: 2
            }, {
                label: "⭐⭐⭐",
                value: 3
            }
            ],


            fileList: [],
            dialogVisible: false,
            attachmentList: [
                // 附件数据应该在这里
                // 格式示例：
                // { name: '文件1', type: '文档', url: '附件下载接口地址' }
            ],
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
        rowStyle({ row }) {
            if (row.dimension == 1) {
                return { 'background': 'antiquewhite' }
            }
        },
        changeUpdate() {
            this.$forceUpdate()
        },
        changeResultSelect() {
            if (this.pageparm.result == '全部') {
                delete this.pageparm.result
            }
        },
        resetForm(formName) {
            this.$refs[formName].resetFields();
            this.timeList = []
            delete this.pageparm.startTime
            delete this.pageparm.endTime
            if (this.pageparm.carNumbers) {
                delete this.pageparm.carNumbers
            }
            this.carNumbers = []
            if (this.pageparm.risks) {
                delete this.pageparm.risks
            }
            this.risks = []
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
            if (this.risks.length) {
                this.pageparm.risks = this.risks
            }
            this.pageparm.pageNo = 1
            this.pageparm.pageSize = 100000
            axios({
                method: 'post',
                url: baseURL + '/fault/screenfault',
                data: this.pageparm
            }).then(res => {

                this.tableData = res.data.data.list
                this.tableData = this.tableData.map(item => {
                    item.deliveryDate = this.getYMDHMS(item.deliveryDate)
                    item.risk = item.risk == '0' ? 0 : parseInt(item.risk)
                    item.code = item.code == 'null' ? '' : item.code
                    item.schedule = item.schedule == 'null' ? '' : item.schedule
                    item.respDepart = item.respDepart == 'null' ? '' : item.respDepart
                    item.notes = item.notes == 'null' ? '' : item.notes
                    return item
                })
                this.total = res.data.data.size
                this.loading = false
                this.$message.success('搜索成功')
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
                pageSize: 100000,
                state: 2
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
            if (this.pageparm.result == '全部') {
                delete this.pageparm.result
            }
            if (this.carNumbers.length) {
                this.pageparm.carNumbers = this.carNumbers
            }
            if (this.timeList.length) {
                this.pageparm.startTime = this.getYMDHMS(new Date(this.timeList[0].toString()));
                this.pageparm.endTime = this.getYMDHMS(new Date(this.timeList[1].toString()))
            }
            if (this.risks.length) {
                this.pageparm.risks = this.risks
            }

            let openUrl = `${baseURL}/fault/exporttrack?`;

            for (let obj in this.pageparm) {
                if (this.pageparm[obj]) {
                    openUrl += obj + '=' + this.pageparm[obj] + '&'
                }
            }
            console.log(openUrl)

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
            axios({
                // url: 'http://localhost:8888/fault/selectfaultallByPage',
                url: baseURL + '/fault/screenfault',
                method: 'post',
                data: this.pageparm
            }).then(res => {
                this.tableData = res.data.data.list || []
                this.tableData = this.tableData.map(item => {
                    item.deliveryDate = this.getYMDHMS(item.deliveryDate)
                    item.risk = item.risk == '0' ? parseInt(0) : parseInt(item.risk)
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
                    this.getFault()
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
                this.risk = row.risk
            } else {
                this.title = '添加'
                this.editForm = {}
                this.result = ''
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
                        this.editForm.dimension = "0"
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
                            this.risk = 0
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
                            this.risk = 0
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
                            this.risk = 0
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
            this.risk = 0
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
        changeDimension(id, dimension) {
            this.$confirm('此操作将数据列为重点故障，是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                axios({
                    url: ` ${baseURL}/fault/changedimension`,
                    params: { id, dimension }
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
        changeTrack(id) {
            this.$confirm('此操作将数据提交到故障遗留列表, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                axios({
                    url: ` ${baseURL}/fault/changestate`,
                    params: { id, state: 0, trackPerson: '' }
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
                this.dialogVisible = true;
                this.attachmentList = res.data.data || []
            })
        },
        handleCloseFile(done) {
            // 在这里可以处理模态框关闭前的逻辑
            done(); // 调用 done() 表示关闭模态框
        },
        downloadAttachment(attachment) {
            // 调用附件下载接口，你需要根据实际情况修改这里的代码
            console.log('下载附件', attachment);
            // 这里可以使用 window.open 或者其他方式调用下载接口
            downloadFile(baseURL + '/fault/download/' + attachment.faultFileMidId, attachment.fileName)
        },
    }
}
</script>
  
  <!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
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
  
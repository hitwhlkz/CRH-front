<template>
    <div>
        <!-- 筛选 -->
        <el-form :inline="true" :model="pageparm" class="user-search" ref="searchForm">
            <el-form-item label="处理结果：" prop="result">
                <el-select v-model="pageparm.result" placeholder="请选择处理结果">
                    <el-option label="未处理" value="未处理"></el-option>
                    <el-option label="已处理" value="已处理"></el-option>
                    <el-option label="长期跟踪" value="长期跟踪"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="交修日期">
                <el-col :span="11">
                    <el-date-picker v-model="timeList" type="daterange" range-separator="至" start-placeholder="开始日期"
                        end-placeholder="结束日期">
                    </el-date-picker>
                </el-col>
            </el-form-item>
            <el-form-item label="车号" prop="carNumber">
                <el-select multiple filterable v-model="carNumbers" placeholder="请选择车号">
                    <el-option v-for="item in carNumberList" :key="item.value" :label="item.value" :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="车箱号" prop="carBodyNumber">
                <el-input size="small" v-model="pageparm.carBodyNumber" placeholder="输入车厢号"></el-input>
            </el-form-item>
            <el-form-item label="故障描述：" prop="faultDescription">
                <el-input size="small" v-model="pageparm.faultDescription" placeholder="输入故障描述"></el-input>
            </el-form-item>
            <el-form-item label="故障来源：" prop="source">
                <el-input size="small" v-model="pageparm.source" placeholder="输入故障来源："></el-input>
            </el-form-item>
            <el-form-item label="处理方法：" prop="method">
                <el-input size="small" v-model="pageparm.method" placeholder="输入处理方法"></el-input>
            </el-form-item>
            <el-form-item label="处理班组" prop="teamsGroups">
                <el-select v-model="pageparm.teamsGroups" placeholder="请选择处理班组">
                    <el-option v-for="item in teamsList" :key="item.id" :label="item.name" :value="item.name">
                    </el-option>
                </el-select>
            </el-form-item>
            <br>
            <el-form-item>
                <el-button size="small" type="primary" icon="el-icon-search" @click="search()">搜索</el-button>
                <el-button size="small" type="primary" icon="el-icon-refresh-right"
                    @click="resetForm('searchForm')">重置</el-button>
                <el-button size="small" type="primary" icon="el-icon-plus" @click="handleEdit()">添加</el-button>
                <el-button size="small" type="warning" icon="el-icon-star-off" @click="exportExcel()">导出</el-button>
            </el-form-item>
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
            <el-table-column prop="result" label="处理结果" align="center"></el-table-column>
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
            <el-table-column prop="" label="操作" width="180" align="center" fixed="right">
                <template slot-scope="scope">
                    <el-button type="primary" icon="el-icon-edit" circle
                        @click="handleEdit(scope.$index, scope.row)"></el-button>
                    <el-button type="danger" icon="el-icon-delete" circle @click="deleteById(scope.row)"></el-button>
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
                pageSize: 50,
                state: 1
            },
            total: 0,
            allList: [],
            headers: "'Content-Type': 'multipart/form-data'",
            loading: true,
            teamsList: [],
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
            this.pageparm.pageSize = 50
            axios({
                method: 'post',
                url: baseURL + '/tedsfault/screenfault',
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
                pageSize: 50,
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

            let openUrl = `${baseURL}/tedsfault/exportsenior?`;

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
            this.pageparm.state = 1
            axios({
                url: baseURL + '/tedsfault/screenfault',
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
                    url: baseURL + '/tedsfault/deletefaultid',
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
                            url: baseURL + '/tedsfault/insertfault',
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
                            url: baseURL + '/tedsfault/updatefaultid',
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
                    url: ` ${baseURL}/tedsfault/changestate`,
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
        }
    }
}
</script>
  
  <!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.rate_wrap {
    display: flex;
    align-items: center;
}
</style>
  
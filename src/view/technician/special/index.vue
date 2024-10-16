<template>
    <div>
        <el-upload class="upload-demo" :action="`${baseURL}/fault/import`" :on-preview="handlePreview"
            :on-remove="handleRemove" :before-remove="beforeRemove" multiple :on-exceed="handleExceed"
            :on-success="handleSuccess" :on-error="handleError">
            <el-button size="small" type="warning" icon="el-icon-star-on">导入</el-button>
        </el-upload>

        <br><br>
        <!-- 筛选 -->
        <el-form :inline="true" :model="pageparm" class="user-search" ref="searchForm">

            <el-form-item label="专项名称" prop="specialName">
                <el-input size="small" v-model="pageparm.specialName" placeholder="输入专项名称"></el-input>
            </el-form-item>
            <el-form-item label="到期日期">
                <el-col :span="11">
                    <el-date-picker v-model="timeList" type="daterange" range-separator="至" start-placeholder="开始日期"
                        end-placeholder="到期日期">
                    </el-date-picker>
                </el-col>
            </el-form-item>
            <el-form-item>
                <el-button size="small" type="primary" icon="el-icon-search" @click="search()">搜索</el-button>
                <el-button size="small" type="primary" icon="el-icon-refresh-right"
                    @click="resetForm('searchForm')">重置</el-button>
                <el-button size="small" type="primary" icon="el-icon-plus" @click="handleEdit()">添加</el-button>
                <el-button size="small" type="warning" icon="el-icon-star-off" @click="exportExcel()">导出</el-button>
            </el-form-item>
        </el-form>

        <!-- 表格 -->
        <el-table class="abc" :data="tableData" style="width: 100%" border v-loading="loading" height="600" :row-style="rowStyle">
            <el-table-column type="index" label="序号" align="center" width="70" :index="indexMethod" fixed></el-table-column>
            <el-table-column prop="specialName" label="专项名称" width="300" align="center"></el-table-column>
            <el-table-column prop="deliveryDate" label="交修日期" width="200" align="center"></el-table-column>
            <el-table-column prop="notes" label="备注" width="200" align="center"></el-table-column>

            <el-table-column prop="" label="操作" width="180" align="center">
                <template slot-scope="scope">
                    <el-button type="primary" icon="el-icon-edit" circle
                        @click="handleEdit(scope.$index, scope.row)"></el-button>
                    <el-button type="danger" icon="el-icon-delete" circle @click="deleteById(scope.row)"></el-button>
                    <!-- <el-button type="warning" v-if="scope.row.dimension == 1" icon="el-icon-warning" circle
                        @click="changeDimension(scope.row.id, 0)"></el-button>
                    <el-button v-else="scope.row.dimension == 0" icon="el-icon-warning-outline" circle
                        @click="changeDimension(scope.row.id, 1)"></el-button> -->

                </template>
            </el-table-column>
        </el-table>

        <!-- 编辑 -->
        <el-dialog :title="title" :visible.sync="editFormVisible" width="50%" :show-close="false"
            :close-on-click-modal="false">
            <el-form label-width="120px" :model="editForm" :rules="rules" ref="editForm">
                <el-form-item label="专项名称" prop="specialName">
                    <el-input v-model="editForm.specialName" auto-complete="off" placeholder="请输入专项名称"></el-input>
                </el-form-item>
                <el-form-item label="交修日期" prop="deliveryDate">
                    <el-date-picker value-format="yyyy-MM-dd" v-model="editForm.deliveryDate" type="date"
                        placeholder="选择日期">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="备注" prop="node">
                    <el-input size="small" v-model="editForm.notes" auto-complete="off" placeholder="备注"></el-input>
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
import { baseURL } from '../../../api/base'
import { carNumberList } from '../.././../common/carNumber'


export default {
    name: 'Fault',
    data() {
        return {
            carNumbers: [],
            carNumberList,
            baseURL,
            timeList: [],
            tableData: [
            //     {
            //     id: 1,
            //     deliveryDate: '2023-11-25 00:00:00',
            //     specialName: '专项1'
            // }, {
            //     id: 2,
            //     deliveryDate: '2023-11-27 00:00:00',
            //     specialName: '专项2'
            // }, {
            //     id: 3,
            //     deliveryDate: '2023-11-27 10:04:00',
            //     specialName: '专项3'
            // }, {
            //     id: 4,
            //     deliveryDate: '2023-11-25 00:00:00',
            //     specialName: '专4'
            // }, {
            //     id: 5,
            //     deliveryDate: '2023-11-25 00:00:00',
            //     specialName: '专项'
            // }, {
            //     id: 5,
            //     deliveryDate: '2023-12-08 00:00:00',
            //     specialName: '专项'
            // }
        ],
            editFormVisible: false,
            dialogTrackVisible: false,
            title: '编辑',
            editForm: {
                code: '无',
                schedule: '无',
                respDepart: '无'
            },
            editTrackForm: {},
            risk: 0,
            result: '',
            rules: {
                deliveryDate: [{ required: true, message: '请输入日期', trigger: 'blur' }],
                specialName: [{ required: true, message: '请输入专项名称', trigger: 'blur' }],
            },
            pageparm: {
                pageNo: 1,
                pageSize: 100000
            },
            total: 0,
            allList: [],
            headers: "'Content-Type': 'multipart/form-data'",
            loading: false,
            teamsList: [],
            riskList: [{
                label: "一星",
                value: 1
            }, {
                label: "二星",
                value: 2
            }, {
                label: "三星",
                value: 3
            },],
            id: 0
        }
    },
    created() {
        // this.getFault()
        // this.getTeams()
        // this.getSpecail()
        this.search()
    },
    computed: {
        indexMethod: function () {
            return (this.pageparm.pageNo - 1) * (this.pageparm.pageSize) + 1
        }
    },
    methods: {
        rowStyle({ row }) {
            let deliveryDate = Date.parse(row.deliveryDate)
            let nowDate = Date.now()
            console.log(deliveryDate, nowDate)
            if (deliveryDate <= nowDate) {
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
        search() {
            // if (this.carNumbers.length) {
            //     this.pageparm.carNumbers = this.carNumbers
            // }
            this.loading = true
            if (this.timeList.length) {
                this.pageparm.startTime = this.getYMDHMS(new Date(this.timeList[0].toString()));
                this.pageparm.endTime = this.getYMDHMS(new Date(this.timeList[1].toString()))
            }
            this.pageparm.pageNo = 1
            this.pageparm.pageSize = 100000
            axios({
                method: 'post',
                url: baseURL + '/special/screenall',
                data: this.pageparm
            }).then(res => {
                this.tableData = res.data.data
                this.tableData = this.tableData.map(item => {
                    item.deliveryDate = this.getYMDHMS(item.deliveryDate)
                    return item
                })
                this.loading = false
                this.$message.success('搜索成功')
            }).catch(err => {
                this.initPage()
                // this.getFault()
                this.$message.error('搜索失败')
            })
        },
        initPage() {
            this.pageparm = {
                pageNo: 1,
                pageSize: 100000,
                state: 0
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

            let openUrl = `${baseURL}/fault/export?`;
            // let carNumbersList = `carNumbers=`
            // if (this.pageparm['carNumbers'].length) {
            //     for (let i = 0; i < this.pageparm['carNumbers'].length; i++) {
            //         carNumbersList += this.pageparm['carNumbers'][i] + ','
            //     }
            // }
            // console.log(carNumbersList)

            for (let obj in this.pageparm) {
                if (this.pageparm[obj]) {
                    openUrl += obj + '=' + this.pageparm[obj] + '&'
                }
                // if(this.pageparm['carNumbers'].length) {
                //     continue
                // }
            }
            // openUrl += carNumbersList
            console.log(openUrl)

            axios.get(openUrl).then(res => {
                console.log(openUrl)
                window.location.href = openUrl
            })


            // axios({
            //     url: `${baseURL}/fault/export`,
            //     // method: 'POST',
            //     params: this.pageparm,
            // }).then(res => {



            //     // let openUrl = `${baseURL}/fault/export?`;
            //     // let carNumbersList = `carNumbers=`
            //     // for (let obj in this.pageparm) {
            //     //     if (this.pageparm[obj]) {
            //     //         openUrl += obj + '=' + this.pageparm[obj] + '&'
            //     //     }
            //     //     let carNumbersList = `carNumbers=`
            //     //     if (this.pageparm['carNumbers'].length) {
            //     //         for (let i = 0; i < this.pageparm['carNumbers'].length; i++) {
            //     //             carNumbersList += this.pageparm['carNumbers'][i] + ','
            //     //         }
            //     //         console.log(carNumbersList)
            //     //     }
            //     // }

            //     // console.log(openUrl, carNumbersList)
            //     // window.location.href = openUrl

            // let openUrl = `${baseURL}/fault/export?`;
            // let carNumbersList = `carNumbers=`

            // for (let obj in this.pageparm) {
            //     if (this.pageparm[obj]) {
            //         openUrl += obj + '=' + this.pageparm[obj] + '&'
            //     }

            //     if (this.pageparm['carNumbers'].length) {
            //         for (let i = 0; i < this.pageparm['carNumbers'].length; i++) {
            //             carNumbersList += this.pageparm['carNumbers'][i] + ','
            //         }
            //         console.log(carNumbersList)
            //         openUrl += carNumbersList
            //     }
            // }
            // console.log(openUrl)
            //     // window.location.href = openUrl

            // }).catch(err => {
            //     this.$message.error('下载失败，请重新下载。')
            // })
        },
        getFault() {
            if (this.carNumbers.length) {
                this.pageparm.carNumbers = this.carNumbers
            }
            axios({
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
            console.log(row)
            this.$confirm('此操作将永久删除, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                axios({
                    url: baseURL + '/special/deletespecialid',
                    // method: 'post',
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
            } else {
                this.title = '添加'
                this.result = ''
            }
        },
        changeResult() {
            this.editForm.result = ''
        },
        handelFault() {
            this.$refs['editForm'].validate((valid) => {
                if (valid) {
                    if (this.title == '添加') {
                        // this.editForm.dimension = "0"
                        axios({
                            url: baseURL + '/special/insertspecial',
                            method: 'post',
                            data: this.editForm
                        }).then(res => {
                            this.$message({
                                message: this.title + '成功',
                                type: 'success'
                            });
                            this.editFormVisible = false
                            this.editForm = {}
                            // this.initPage()
                            this.search()
                        }).catch(err => {
                            console.log(err)
                            this.$message({
                                message: this.title + '失败',
                                type: 'error'
                            });
                            this.editFormVisible = false
                            this.editForm = {}
                            this.initPage()
                            this.search()
                        })
                    } else {
                        axios({
                            url: baseURL + '/special/updatespecial',
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
            this.risk = 0
            this.initPage()
            // this.getFault()
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
            // this.getFault()
            this.$message.success("导入成功")
        },
        handleError() {
            // this.getFault()
            this.$message.error("导入格式错误，请修改后重新导入！")

        },
        resetRisk() {
            this.risk = 0
        },
        changState(id, state) {
            this.$confirm('此操作将数据提交到高级修库, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                axios({
                    url: ` ${baseURL}/fault/changestate`,
                    params: { id, state: 1 }
                }).then(res => {
                    this.$message.success("已转移到高级修库")
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
        changeTrack() {
            this.$refs['editTrackForm'].validate((valid) => {
                if (valid) {
                    this.$confirm('此操作将数据提交到故障追踪列表, 是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        axios({
                            url: ` ${baseURL}/fault/changestate`,
                            params: {
                                id: this.id,
                                state: 2,
                                trackPerson: this.editTrackForm.trackPerson,
                                trackRequire: this.editTrackForm.trackRequire,
                                feedback: this.editTrackForm.feedback
                            }
                        }).then(res => {
                            this.$message.success("已转移到故障追踪列表")
                            this.search()
                            this.dialogTrackVisible = false
                            this.editTrackForm = {}
                        }).catch(err => {
                            this.$message.error('请重新提交')
                            this.editTrackForm = {}
                        })
                    }).catch(() => {
                        this.$message({
                            type: 'info',
                            message: '已取消提交'
                        });
                    });
                } else {
                    console.log('请输入责任人');
                    return false;
                }
            });
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
        handleTrack(id) {
            this.dialogTrackVisible = true
            this.id = id
        },
        handleClose() {
            this.editTrackForm = {}
            this.dialogTrackVisible = false
        },
        handleMethod() {
            if (this.title == '修改') {
                this.editForm.handle = ''
            }
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
.el-table tbody tr:hover>td { 
    background-color:#ecf5ff!important
}
</style>

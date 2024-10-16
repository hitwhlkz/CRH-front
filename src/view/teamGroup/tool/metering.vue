<template>
    <div>
        <!-- 计量 -->
        <template>

            <!-- 导入 -->
            <el-upload class="upload-demo" :action="`${baseURL}/tool/import`" :on-preview="handlePreview"
                :on-remove="handleRemove" :before-remove="beforeRemove" multiple :on-exceed="handleExceed"
                :on-success="handleSuccess" :on-error="handleError">
                <el-button size="small" type="warning" icon="el-icon-star-on">导入</el-button>
            </el-upload>

            <br /><br />

            <!-- 搜索 -->
            <el-form :inline="true" :model="pageparm" class="user-search" ref="searchForm">
                <el-form-item label="名称：" prop="name">
                    <el-input size="small" v-model="pageparm.name" placeholder="输入计量用品名称"></el-input>
                </el-form-item>
                <el-form-item label="编号：" prop="number">
                    <el-input size="small" v-model="pageparm.number" placeholder="输入计量用品编号"></el-input>
                </el-form-item>
                <el-form-item label="量程：" prop="survey">
                    <el-input size="small" v-model="pageparm.survey" placeholder="输入计量用品量程"></el-input>
                </el-form-item>
                <el-form-item label="存放位置：" prop="position">
                    <el-input size="small" v-model="pageparm.position" placeholder="输入存放位置"></el-input>
                </el-form-item>
                <el-form-item label="到期日期：">
                    <el-col :span="11">
                        <el-date-picker size="small" v-model="becomeTimeList" type="daterange" range-separator="至"
                            start-placeholder="开始日期" end-placeholder="结束日期">
                        </el-date-picker>
                    </el-col>
                </el-form-item>
                <el-form-item label="距离下次送检日期：" prop="nextday">
                    <el-select size="small" v-model="pageparm.nextday" placeholder="请选择下次送检天数">
                        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="备注：" prop="note">
                    <el-input size="small" v-model="pageparm.note" placeholder="输入备注"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button size="small" type="primary" icon="el-icon-search" @click="getTool()">搜索</el-button>
                    <el-button size="small" type="primary" icon="el-icon-refresh-right"
                        @click="resetForm('searchForm')">重置</el-button>
                    <el-button size="small" type="primary" icon="el-icon-plus" @click="handleEdit()">添加</el-button>
                    <el-button size="small" type="warning" icon="el-icon-star-off" @click="exportExcel()">导出</el-button>
                </el-form-item>
            </el-form>

            <!-- 表格 -->
            <el-table :data="toolData" stripe style="width: 100%" height="800" :cell-style="rowStyle"
                @selection-change="handleSelectionChange">
                <el-table-column ref="multipleTable" type="selection" width="55"></el-table-column>
                <el-table-column type="index" label="序号" align="center" width="70" :index="indexMethod"
                    fixed></el-table-column>
                <el-table-column prop="name" label="名称" width="" align="center"></el-table-column>
                <el-table-column prop="number" label="编号" width="" align="center"></el-table-column>
                <el-table-column prop="survey" label="量程" width="" align="center">
                    <template slot-scope="scope">
                        {{ scope.row.survey == 'null' ? '' : scope.row.survey }}
                    </template>
                </el-table-column>
                <el-table-column prop="position" label="存放位置" width="" align="center"></el-table-column>
                <el-table-column prop="currentime" label="当前日期" width="" align="center"></el-table-column>
                <el-table-column prop="becometime" label="到期日期" width="" align="center"></el-table-column>
                <el-table-column prop="nextday" label="距离下次送检日期" width="" align="center"></el-table-column>
                <el-table-column prop="note" label="备注" width="" align="center">
                    <template slot-scope="scope">
                        {{ scope.row.note == 'null' ? '' : scope.row.note }}
                    </template>
                </el-table-column>

                <el-table-column prop="" label="操作" width="130" align="center" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <el-button type="text" icon="el-icon-edit" circle
                            @click="handleEdit(scope.$index, scope.row)"></el-button>
                        <el-button type="text" icon="el-icon-delete" circle @click="deleteById(scope.row)"></el-button>

                        <el-popover placement="top-start" title="" width="" trigger="click">
                            <el-button type="text" icon="" circle @click="changeType(scope.row.id, 2)">
                                <i class="el-icon-top"></i>绝缘
                            </el-button>
                            <el-button type="text" icon="" circle @click="changeType(scope.row.id, 3)">
                                <i class="el-icon-top"></i>仪器
                            </el-button>
                            <el-button type="text" circle slot="reference"><i class="el-icon-top"
                                    style="padding: 9px;"></i></el-button>
                        </el-popover>

                    </template>
                </el-table-column>
            </el-table>


            <div class="bottom">
                <Pagination v-bind:child-msg="pageparm" v-bind:total="total" @callFather="callFather"></Pagination>
                <el-button size="small" type="danger" @click="toggleSelection()">删除</el-button>
            </div>



            <!-- 编辑 -->
            <el-dialog :title="title" :visible.sync="editFormVisible" width="40%" :close-on-click-modal="false">
                <el-form label-width="120px" :model="editForm" :rules="rules" ref="editForm">
                    <el-form-item label="名称" prop="name">
                        <el-input v-model="editForm.name" auto-complete="off" placeholder="请输入名称"></el-input>
                    </el-form-item>
                    <el-form-item label="编号" prop="number">
                        <el-input v-model="editForm.number" auto-complete="off" placeholder="请输入编号"></el-input>
                    </el-form-item>
                    <el-form-item label="量程" prop="survey">
                        <el-input v-model="editForm.survey" auto-complete="off" placeholder="请输入量程"></el-input>
                    </el-form-item>
                    <el-form-item label="存放位置" prop="position">
                        <el-input v-model="editForm.position" auto-complete="off" placeholder="请输入存放位置"></el-input>
                    </el-form-item>
                    <!-- <el-form-item label="当前日期" prop="currentime">
                        <el-date-picker value-format="yyyy-MM-dd" v-model="editForm.currentime" type="date"
                            placeholder="选择日期">
                        </el-date-picker>
                    </el-form-item> -->
                    <el-form-item label="到期日期" prop="becometime">
                        <el-date-picker value-format="yyyy-MM-dd" v-model="editForm.becometime" type="date"
                            placeholder="选择日期">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="备注" prop="note">
                        <el-input size="small" v-model="editForm.note" auto-complete="off" placeholder="请输入备注"></el-input>
                    </el-form-item>
                </el-form>
                <span style="color: brown; font-size: 12px;">若无需说明 请填写“无”</span>
                <div slot="footer" class="dialog-footer">
                    <el-button size="small" @click="closeDialog('editForm')">取消</el-button>
                    <el-button size="small" type="primary" class="title" @click="handelTool('editForm')">保存</el-button>
                </div>
            </el-dialog>

        </template>
    </div>
</template>
  
<script>
import axios from 'axios'
import { baseURL } from '../../../api/base'
import Pagination from '../../../components/Pagination.vue'

export default {
    name: 'Metering',
    components: {
        Pagination
    },
    data() {
        return {
            baseURL,
            toolData: [],
            editFormVisible: false,
            title: '编辑',
            editForm: {},
            rules: {
                name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
                number: [{ required: true, message: '请输入编号', trigger: 'blur' }],
                survey: [{ required: true, message: '请输入量程', trigger: 'blur' }],
                position: [{ required: true, message: '请输入存放位置', trigger: 'blur' }],
                currentime: [{ required: true, message: '请选择当前日期', trigger: 'blur' }],
                becometime: [{ required: true, message: '请选择到期日期', trigger: 'blur' }],
                note: [{ required: true, message: '请输入备注', trigger: 'blur' }]
            },
            loading: true,
            pageparm: {
                pageNo: 1,
                pageSize: 100000,
                // 计量
                type: 1
            },
            total: 0,
            currentTimeList: [],
            becomeTimeList: [],
            typeVisible: false,

            options: [
                { value: '0', label: '小于等于15天' },
                { value: '1', label: '小于30天' }
            ],
            multipleSelection: []
        }
    },
    created() {
        this.getTool()
    },
    computed: {
        indexMethod: function () {
            return (this.pageparm.pageNo - 1) * (this.pageparm.pageSize) + 1
        }
    },
    methods: {
        resetForm(formName) {
            this.becomeTimeList = []
            delete this.pageparm.startBecometime
            delete this.pageparm.endBecometime

            this.$refs[formName].resetFields();
        },
        rowStyle(row) {
            if (parseInt(row.row.nextday) <= 15) {
                return { 'background': 'rgb(236 207 203)', 'padding': '3px' }
            } else {
                return { 'padding': '3px' }
            }
        },
        getYMDHMS(val) {
            let date = new Date(val)
            let Y = date.getFullYear()
            const M = (date.getMonth() + 1).toString().padStart(2, '0')
            const D = (date.getDate()).toString().padStart(2, '0')
            return Y + "-" + M + "-" + D;
        },

        getDaysDiff(date) {
            const timestamp = new Date(date).getTime();
            const oneDay = 24 * 60 * 60 * 1000; // 一天的毫秒数
            // const timeDiff = Math.abs(timestamp - Date.now());
            const timeDiff = timestamp - Date.now()
            return Math.round(timeDiff / oneDay);
        },
        getTool() {
            if (this.becomeTimeList.length) {
                this.pageparm.startBecometime = this.getYMDHMS(new Date(this.becomeTimeList[0].toString()));
                this.pageparm.endBecometime = this.getYMDHMS(new Date(this.becomeTimeList[1].toString()))
            }
            axios({
                url: `${baseURL}/tool/selecttool`,
                method: 'post',
                data: this.pageparm
            }).then(res => {
                this.total = res.data.data.size
                this.toolData = res.data.data.list
                this.toolData = this.toolData.map(item => {
                    item.currentime = this.getYMDHMS(item.currentime)
                    item.becometime = this.getYMDHMS(item.becometime)
                    return item
                })
                this.rowStyle()
                this.loading = false
            }).catch(err => {
                console.log(err);
            })
        },
        handleEdit(index, row) {
            this.editFormVisible = true
            if (row != undefined && row != 'undefined') {
                this.title = '修改'
                this.editForm = row
            } else {
                this.title = '添加'
            }
        },
        closeDialog() {
            this.editForm = {}
            this.editFormVisible = false
        },
        handelTool() {
            this.editForm.type = 1

            this.$refs['editForm'].validate((valid) => {
                if (valid) {

                    if (this.title == '添加') {
                        this.editForm.currentime = this.getYMDHMS(Date.now())
                        axios({
                            url: `${baseURL}/tool/inserttool`,
                            method: 'post',
                            data: this.editForm
                        }).then(res => {
                            this.$message({
                                message: this.title + '成功',
                                type: 'success'
                            });
                            this.editFormVisible = false
                            this.editForm = {}
                            this.getTool()
                        }).catch(err => {
                            console.log(err)
                            this.$message({
                                message: this.title + '失败',
                                type: 'error'
                            });
                            this.editFormVisible = false
                            this.editForm = {}
                            this.getTool()
                        })
                    } else {
                        axios({
                            url: `${baseURL}/tool/updatetoolid`,
                            method: 'post',
                            data: this.editForm,
                        }).then(res => {
                            this.$message({
                                message: this.title + '成功',
                                type: 'success'
                            });
                            this.editFormVisible = false
                            this.editForm = {}
                            // this.initPage()
                            this.getTool()
                        }).catch(err => {
                            console.log(err)
                        })


                    }
                }
            });
        },
        callFather(val) {
            this.pageparm.pageNo = val.pageNo
            this.pageparm.pageSize = val.pageSize
            this.getTool()
            document.querySelector('.el-main').scrollTo(0, 0)
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
            this.getTool()
            this.$message.success("导入成功")
        },
        handleError() {
            this.getTool()
            this.$message.error("导入格式错误，请修改后重新导入！")
        },
        deleteById(row) {
            this.$confirm('此操作将永久删除, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                axios({
                    url: baseURL + '/tool/deletetoolid',
                    params: { id: row.id }
                }).then(res => {
                    this.$message({
                        message: '删除成功',
                        type: 'success'
                    });
                    this.getTool()
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
        changeType(id, type) {
            let typename = type == 2 ? '绝缘' : '仪器'
            this.$confirm(`此操作将该数据转移到${typename}列表, 是否继续?`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                axios({
                    url: baseURL + '/tool/changetooltype',
                    params: { id, type }
                }).then(res => {
                    this.$message({
                        message: `已转移到${typename}列表`,
                        type: 'success'
                    });
                    this.getTool()
                }).catch(err => {
                    console.log(err)
                })
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消转移'
                });
            });
        },
        exportExcel() {
            if (this.becomeTimeList.length) {
                this.pageparm.startBecometime = this.getYMDHMS(new Date(this.becomeTimeList[0].toString()));
                this.pageparm.endBecometime = this.getYMDHMS(new Date(this.becomeTimeList[1].toString()))
            }

            let openUrl = `${baseURL}/tool/export?`;

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
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        toggleSelection() {
            let length = this.multipleSelection.length
            if (this.multipleSelection.length) {
                let ids = []
                this.multipleSelection.map(ele => {
                    ids.push(ele.id)
                })
                console.log(ids)
                this.$confirm(`此操作将永久删除已选中的${length}条数据, 是否继续?`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    axios({
                        url: baseURL + '/tool/deleteids',
                        method: 'post',
                        data: { ids }
                        // params: {ids}
                    }).then(res => {
                        this.$message({
                            message: '删除成功',
                            type: 'success'
                        });
                        this.getTool()
                    }).catch(err => {
                        console.log(err)
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });

            } else {
                this.$message({
                    message: '没有选择数据，请重新选择！',
                    type: 'warning'
                });
            }


        }
    },


}
</script>
  
  <!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.el-button.is-circle {
    padding: 0 !important;
}

.bottom {
    margin-top: 20px;
    display: flex;
    justify-content: space-between;
}
</style>
  
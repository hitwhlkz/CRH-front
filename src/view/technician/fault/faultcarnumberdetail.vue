<template>
    <div>
        <!-- 导航 -->
        <el-breadcrumb class="breadcrumb" separator="/">
            <el-breadcrumb-item :to="{ path: '/technician/faultcarnumber' }">返回</el-breadcrumb-item>
            <el-breadcrumb-item style="font-size: 36px;"><b>{{ this.$route.query.tag }}</b></el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 上传 -->
        <el-upload class="upload-demo" :action="`${baseURL}/fault/importcar`" :on-preview="handlePreview"
            :on-remove="handleRemove" :before-remove="beforeRemove" multiple :on-exceed="handleExceed"
            :on-success="handleSuccess" :on-error="handleError">
            <el-button size="small" type="warning" icon="el-icon-star-on">导入</el-button>
        </el-upload><br>
        <!-- 筛选 -->
        <!-- <el-form :inline="true" :model="pageparm" class="user-search" ref="searchForm">
            <el-form-item label="种类：" prop="state">
                <el-select v-model="pageparm.state" placeholder="请选择" @change="changeResultSelect">
                    <el-option label="高级修" :value="1"></el-option>
                    <el-option label="故障遗留" :value="0"></el-option>
                    <el-option label="故障追踪" :value="2"></el-option>
                    <el-option label="其他" :value="3"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="处理结果：" prop="result">
                <el-select v-model="pageparm.result" placeholder="请选择处理结果" @change="changeResultSelect">
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
            <el-form-item label="车厢号" prop="carBodyNumber">
                <el-input size="small" v-model="pageparm.carBodyNumber" placeholder="输入车厢号"></el-input>
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
            <el-form-item label="故障来源：" prop="source">
                <el-input size="small" v-model="pageparm.source" placeholder="输入故障来源："></el-input>
            </el-form-item>
            <el-form-item label="处理方法：" prop="method">
                <el-input size="small" v-model="pageparm.method" placeholder="输入处理方法"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button size="small" type="primary" icon="el-icon-search" @click="search()">搜索</el-button>
                <el-button size="small" type="primary" icon="el-icon-refresh-right"
                    @click="resetForm('searchForm')">重置</el-button>
                <el-button size="small" type="warning" icon="el-icon-star-off" @click="exportExcel()">导出</el-button>
            </el-form-item>
        </el-form> -->

        <!-- 表格 -->
        <el-table :data="tableData" style="width: 100%" border v-loading="loading" height="700" :row-style="rowStyle">
            <el-table-column type="index" label="序号" align="center" width="70" :index="indexMethod" fixed></el-table-column>
            <el-table-column prop="deliveryDate" label="交修日期" width="100" align="center"></el-table-column>
            <el-table-column prop="carNumber" label="车号" width="70" align="center"></el-table-column>
            <el-table-column prop="carBodyNumber" label="车厢号" align="center"></el-table-column>
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
            <el-table-column prop="handle" label="处置分类" align="center">
                <template slot-scope="scope">
                    {{ scope.row.handle == 'null' ? '' : scope.row.handle }}
                </template>
            </el-table-column>
            <el-table-column prop="" label="操作" width="180" align="center" fixed="right">
                <template slot-scope="scope">
                    <el-button type="danger" icon="el-icon-delete" circle @click="deleteById(scope.row)"></el-button>
                    <el-button type="warning" v-if="scope.row.dimension == 1" icon="el-icon-warning" circle
                        @click="changeDimension(scope.row.id, 0)"></el-button>
                    <el-button v-else="scope.row.dimension == 0" icon="el-icon-warning-outline" circle
                        @click="changeDimension(scope.row.id, 1)"></el-button>
                </template>
            </el-table-column>
        </el-table>

        <!-- <Pagination v-bind:child-msg="pageparm" v-bind:total="total" @callFather="callFather"></Pagination> -->

        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage4"
            :page-sizes="[ 200, 300, 400]" :page-size="100" layout="total, sizes, prev, pager, next, jumper"
            :total="total">
        </el-pagination>

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
            result: '',
            pageparm: {
                pageNo: 1,
                pageSize: 200,
            },
            total: 0,
            allList: [],
            loading: true,
            teamsList: [],
            id: 0
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
            this.pageparm.pageNo = 1
            this.pageparm.pageSize = 100000
            this.pageparm.carNumber = this.$route.query.tag
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
            this.pageparm.carNumber = this.$route.query.tag
            let openUrl = `${baseURL}/fault/export?`;
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
                // url: baseURL + '/fault/screenfaultCarnumber',
                // method: 'post',
                // data: { ...this.pageparm, carNumber: this.$route.query.tag }
                url: baseURL + '/fault/screenfaultCarnumberDetail',
                params: {
                    carNumber: this.$route.query.tag,
                    // pageNo: 1,
                    // pageSize: 3
                    pageNo: this.pageparm.pageNo,
                    pageSize: this.pageparm.pageSize
                }
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
        handleSizeChange(val) {
            this.pageparm.pageSize = val
            this.getFault()
            document.querySelector('.el-main').scrollTo(0,0)
            console.log(`每页 ${val} 条`);
        },
        handleCurrentChange(val) {
            this.pageparm.pageNo = val
            this.getFault()
            document.querySelector('.el-main').scrollTo(0,0)
            console.log(`当前页: ${val}`);
        }
    }
}
</script>
  
  <!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.breadcrumb {
    font-size: 20px;
    margin-bottom: 20px;
}

.rate_wrap {
    display: flex;
    align-items: center;
}
</style>
  
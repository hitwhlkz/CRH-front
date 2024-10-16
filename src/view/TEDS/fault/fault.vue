<template>
    <div>
        <el-upload class="upload-demo" :action="`${baseURL}/tedsfault/import`" :on-preview="handlePreview"
            :on-remove="handleRemove" :before-remove="beforeRemove" multiple :on-exceed="handleExceed"
            :on-success="handleSuccess" :on-error="handleError">
            <el-button size="small" type="warning" icon="el-icon-star-on">导入</el-button>
        </el-upload>

        <br><br>
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
            <!-- <el-form-item label="车型" prop="car">
                <el-input size="small" v-model="pageparm.car" placeholder="输入车型"></el-input>
            </el-form-item> -->
            <el-form-item label="车号" prop="carNumber">
                <el-select multiple filterable v-model="carNumbers" placeholder="请选择车号">
                    <el-option v-for="item in carNumberList" :key="item.value" :label="item.value" :value="item.value">
                    </el-option>
                </el-select>
                <!-- <el-button size="mini" icon="el-icon-refresh-right" circle @click="resetRisk"></el-button> -->
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
            <el-form-item label="影响进度原因：" prop="schedule">
                <el-input size="small" v-model="pageparm.schedule" placeholder="输入影响进度原因"></el-input>
            </el-form-item>
            <el-form-item label="故障来源：" prop="source">
                <el-input size="small" v-model="pageparm.source" placeholder="输入故障来源："></el-input>
            </el-form-item>
            <el-form-item label="处理方法：" prop="method">
                <el-input size="small" v-model="pageparm.method" placeholder="输入处理方法"></el-input>
            </el-form-item>
            <el-form-item label="处理班组" prop="teamsGroups" @change="changeUpdate">
                <el-select v-model="pageparm.teamsGroups" placeholder="请选择处理班组">
                    <el-option v-for="item in teamsList" :key="item.id" :label="item.name" :value="item.name">
                    </el-option>
                </el-select>
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
                <el-select v-model="pageparm.handle" placeholder="请选择处理分类" @change="changeUpdate">
                    <el-option label="已处理" value="已处理"></el-option>
                    <el-option label="待处理" value="待处理"></el-option>
                    <el-option label="待二级修" value="待二级修"></el-option>
                    <el-option label="待高级修" value="待高级修"></el-option>
                    <el-option label="待集中处理" value="待集中处理"></el-option>
                    <el-option label="待售后处理" value="待售后处理"></el-option>
                    <el-option label="待料" value="待料"></el-option>
                    <el-option label="跟踪观察" value="跟踪观察"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="风险等级" prop="risk">
                <el-select v-model="pageparm.risk" placeholder="请选择风险等级" @change="changeUpdate">
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
                <el-button size="small" type="primary" icon="el-icon-plus" @click="handleEdit()">添加</el-button>
                <el-button size="small" type="warning" icon="el-icon-star-off" @click="exportExcel()">导出</el-button>
            </el-form-item>
        </el-form>

        <!-- 表格 -->
        <el-table :data="tableData" style="width: 100%" border v-loading="loading" height="600" :row-style="rowStyle">
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
            <el-table-column prop="code" label="物料编码" width="100" align="center">
                <template slot-scope="scope">
                    {{ scope.row.code == 'null' ? '' : scope.row.code }}
                </template>
            </el-table-column>
            <el-table-column prop="schedule" label="影响进度原因" width="180" align="center">
                <template slot-scope="scope">
                    {{ scope.row.schedule == 'null' ? '' : scope.row.schedule }}
                </template>
            </el-table-column>
            <el-table-column prop="respDepart" label="责任部门（待料）" width="180" align="center">
                <template slot-scope="scope">
                    {{ scope.row.respDepart == 'null' ? '' : scope.row.respDepart }}
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
            <el-table-column prop="risk" label="风险等级" width="140" align="center">
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
            <el-table-column prop="" label="操作" width="180" align="center" fixed="right">
                <template slot-scope="scope">

                    <el-button type="primary" icon="el-icon-edit" circle
                        @click="handleEdit(scope.$index, scope.row)"></el-button>
                    <el-button type="danger" icon="el-icon-delete" circle @click="deleteById(scope.row)"></el-button>
                    <el-button type="success" icon="el-icon-top" circle
                        @click="changState(scope.row.id, scope.row.state)"></el-button>

                    <el-button type="warning" v-if="scope.row.dimension == 1" icon="el-icon-warning" circle
                        @click="changeDimension(scope.row.id, 0)"></el-button>
                    <el-button v-else="scope.row.dimension == 0" icon="el-icon-warning-outline" circle
                        @click="changeDimension(scope.row.id, 1)"></el-button>

                </template>
            </el-table-column>
        </el-table>

        <Pagination v-bind:child-msg="pageparm" v-bind:total="total" @callFather="callFather"></Pagination>

        <!-- 编辑 -->
        <el-dialog :title="title" :visible.sync="editFormVisible" width="50%" @click="closeDialog('editForm')">
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
                <el-form-item label="处置分类" prop="handle">
                    <el-select v-model="editForm.handle" placeholder="请选择处置分类">
                        <el-option label="已处理" value="已处理"></el-option>
                        <el-option label="待处理" value="待处理"></el-option>
                        <el-option label="待二级修" value="待二级修"></el-option>
                        <el-option label="待高级修" value="待高级修"></el-option>
                        <el-option label="待集中处理" value="待集中处理"></el-option>
                        <el-option label="待售后处理" value="待售后处理"></el-option>
                        <el-option label="待料" value="待料"></el-option>
                        <el-option label="跟踪观察" value="跟踪观察"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="功能分类" prop="funClass">
                    <el-select v-model="editForm.funClass" placeholder="请选择功能分类">
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
                <el-form-item label="处理方法" prop="method">
                    <el-input type="textarea" size="small" v-model="editForm.method" auto-complete="off"
                        placeholder="请输入遗留原因；处理方法；物料情况；跟踪周期。"></el-input>
                </el-form-item>
                <el-form-item label="物料编码" prop="code">
                    <el-input size="small" v-model="editForm.code" auto-complete="off" placeholder="请输入物料编码"></el-input>
                </el-form-item>
                <el-form-item label="影响进度原因" prop="schedule">
                    <el-input size="small" v-model="editForm.schedule" auto-complete="off"
                        placeholder="请输入影响进度原因"></el-input>
                </el-form-item>
                <el-form-item label="责任部门（待料）" prop="respDepart">
                    <el-input v-model="editForm.respDepart" label="" placeholder="请输入责任部门（待料）"></el-input>
                </el-form-item>
                <el-form-item label="故障来源" prop="source">
                    <el-input v-model="editForm.source" label="" placeholder="请输入故障来源"></el-input>
                </el-form-item>
                <el-form-item label="风险等级" prop="risk">
                    <div class="rate_wrap">
                        <el-rate v-model="risk" :max="3"></el-rate>
                        <el-button size="mini" icon="el-icon-refresh-right" circle @click="resetRisk"></el-button>
                    </div>
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

        <!-- 责任人 -->
        <el-dialog title="移交追踪列表" :visible.sync="dialogTrackVisible" width="45%" :before-close="handleClose">
            <el-form label-width="120px" :model="editTrackForm" ref="editTrackForm" :rules="trackRules">
                <el-form-item label="责任人" prop="trackPerson">
                    <el-input v-model="editTrackForm.trackPerson" auto-complete="off" placeholder="请输入责任人"></el-input>
                </el-form-item>
                <el-form-item label="追踪要求" prop="trackRequire">
                    <el-input type="textarea" v-model="editTrackForm.trackRequire" auto-complete="off"
                        placeholder="请输入追踪要求"></el-input>
                </el-form-item>
                <el-form-item label="反馈实现" prop="feedback">
                    <el-input type="textarea" v-model="editTrackForm.feedback" auto-complete="off"
                        placeholder="请输入反馈实现"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogTrackVisible = false">取 消</el-button>
                <el-button type="primary" @click="changeTrack">确 定</el-button>
            </span>
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
            dialogTrackVisible: false,
            title: '编辑',
            editForm: {},
            editTrackForm: {},
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
                source: [{ required: true, message: '请输入故障来源', trigger: 'blur' }]
            },
            trackRules: {
                trackPerson: [{ required: true, message: '请输入责任人', trigger: 'blur' }],
                trackRequire: [{ required: true, message: '请输入追踪要求', trigger: 'blur' }],
                feedback: [{ required: true, message: '请输入反馈实现', trigger: 'blur' }],
            },
            pageparm: {
                pageNo: 1,
                pageSize: 100000,
                result: '未处理',
                state: 0,
            },
            total: 0,
            allList: [],
            headers: "'Content-Type': 'multipart/form-data'",
            loading: true,
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
            axios({
                method: 'post',
                url: baseURL + '/tedsfault/screenfault',
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

            let openUrl = `${baseURL}/tedsfault/export?`;

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
                url: baseURL + '/tedsfault/screenfault',
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
                            url: baseURL + '/tedsfault/updatefaultid',
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
        changState(id, state) {
            this.$confirm('此操作将数据提交到高级修库, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                axios({
                    url: ` ${baseURL}/tedsfault/changestate`,
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
                            url: ` ${baseURL}/tedsfault/changestate`,
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
                    url: ` ${baseURL}/tedsfault/changedimension`,
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
  
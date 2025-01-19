<template>
    <div class="fault-component">
        <el-upload class="upload-demo" :action="`${baseURL}/fault/import`" :on-preview="handlePreview"
            :on-remove="handleRemove" :before-remove="beforeRemove" multiple :on-exceed="handleExceed"
            :on-success="handleSuccess" :on-error="handleError">
            <el-button size="small" type="warning" icon="el-icon-star-on">导入</el-button>
        </el-upload>

        <br><br>
        <!-- 筛选 -->
        <el-form :inline="true" :model="pageparm" class="user-search" ref="searchForm">
          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item label="处理结果：" prop="result">
                <el-select v-model="pageparm.result" placeholder="请选择处理结果" @change="changeResultSelect" clearable style="width: 100%;">
                  <el-option label="全部" value="全部"></el-option>
                  <el-option label="未处理" value="未处理"></el-option>
                  <el-option label="已处理" value="已处理"></el-option>
                  <el-option label="长期跟踪" value="长期跟踪"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="标注" prop="dimension">
                <el-select v-model="pageparm.dimension" placeholder="请选择" @change="changeUpdate" clearable style="width: 100%;">
                  <el-option label="非重点关注" value="0"></el-option>
                  <el-option label="重点关注" value="1"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <!-- <el-col :span="8">
              <el-form-item label="到料" prop="material">
                <el-select v-model="pageparm.material" placeholder="请选择到料情况" @change="changeInput($event)" clearable style="width: 100%;">
                  <el-option label="无" value="无"></el-option>
                  <el-option label="否" value="否"></el-option>
                  <el-option label="是" value="是"></el-option>
                </el-select>
              </el-form-item>
            </el-col> -->
          </el-row>

          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item label="限制" prop="review">
                <el-select v-model="pageparm.review" placeholder="请选择" @change="changeInput($event)" clearable style="width: 100%;">
                  <el-option label="否" value="0"></el-option>
                  <el-option label="是" value="1"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="车号" prop="carNumber">
                <el-select multiple filterable v-model="carNumbers" placeholder="请选择车号" @change="changeInput($event)" clearable style="width: 100%;">
                  <el-option v-for="item in carNumberList" :key="item.value" :label="item.value" :value="item.value"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="车厢号" prop="carBodyNumber">
                <el-input size="small" v-model="pageparm.carBodyNumber" placeholder="输入车厢号" @input="changeInput($event)" style="width: 100%;"></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item label="交修日期" class="date-picker-item">
                <el-date-picker 
                  v-model="timeList" 
                  type="daterange" 
                  range-separator="至" 
                  start-placeholder="开始日期" 
                  end-placeholder="结束日期" 
                  :picker-options="pickerOptions"
                  size="mini">
                </el-date-picker>
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
                <el-select v-model="pageparm.teamsGroups" placeholder="请选择处理班组" @change="changeUpdate" clearable style="width: 100%;">
                  <el-option v-for="item in teamsList" :key="item.id" :label="item.name" :value="item.name"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="功能分类" prop="funClass">
                <el-select v-model="pageparm.funClass" placeholder="请选择功能分类" @change="changeUpdate" clearable style="width: 100%;">
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
            </el-col>
          </el-row>

          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item label="处置分类" prop="handle">
                <el-input size="small" v-model="pageparm.handle" placeholder="输入处置分类" @input="changeInput($event)" style="width: 100%;"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="风险等级" prop="risk">
                <el-select multiple filterable v-model="risks" placeholder="请选择风险级" @change="changeUpdate" clearable style="width: 100%;">
                  <el-option label="无险" :value="0"></el-option>
                  <el-option v-for="item in riskList" :key="item.value" :label="item.label" :value="item.value">
                    <span style="float: left"><el-rate v-model="item.value" :max="item.value" disabled></el-rate></span>
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item>
                <el-button size="small" type="primary" icon="el-icon-search" @click="search()">搜索</el-button>
                <el-button size="small" type="warning" icon="el-icon-refresh-right" @click="resetForm('searchForm')">重置</el-button>
                <el-button size="small" type="success" icon="el-icon-plus" @click="handleEdit()">添加</el-button>
                <el-button size="small" type="info" icon="el-icon-star-off" @click="exportExcel()">导出</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <!-- 格 -->
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
            <!-- <el-table-column prop="material" label="是否到料" width="100" align="center"></el-table-column> -->
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
            <el-table-column prop="risk" label="风险等级" width="180" align="center">
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

            <el-table-column prop="notes" label="看" align="center" width="130">
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
                                <el-button type="danger" icon="el-icon-delete" @click="deleteAttachment(row)"></el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-dialog>
            </el-table-column>
            
            <el-table-column prop="" label="删除" align="center">
                <template slot-scope="scope">
                    <el-button type="danger" icon="el-icon-delete" circle @click="deleteById(scope.row)"></el-button>
                </template>
            </el-table-column>

            <el-table-column prop="" label="附件" width="120" align="center" fixed="right">
                <template slot-scope="scope">
                    <div style="margin-top: 5px;">
                        <!-- 触发模态框的按钮 -->
                        <el-button @click="showUploadModal(scope.row)" size="small" type="primary">点击上传</el-button>
                    </div>
                </template>
            </el-table-column>

            <!-- 文件上传 -->
            <el-dialog title="文件上传" :visible.sync="uploadModalVisible" width="650px" :before-close="beforeClose"
                append-to-body :show-close="false" :close-on-click-modal="false">
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

            <el-table-column prop="" label="操作" width="180" align="center" fixed="right">
                <template slot-scope="scope">
                    <div style="margin-top: 5px;">
                        <el-button type="primary" icon="el-icon-edit" circle
                            @click="handleEdit(scope.$index, scope.row)"></el-button>
                        <!-- <el-button type="danger" icon="el-icon-delete" circle @click="deleteById(scope.row)"></el-button> -->
                        <el-button type="warning" v-if="scope.row.dimension == 1" icon="el-icon-warning" circle
                            @click="changeDimension(scope.row.id, 0)"></el-button>
                        <el-button v-else="scope.row.dimension == 0" icon="el-icon-warning-outline" circle
                            @click="changeDimension(scope.row.id, 1)"></el-button>
                    </div>
                    <div style="margin-top: 5px;">
                        <el-tooltip content="移交高级修列表" placement="top">
                            <el-button type="success" icon="el-icon-top" circle
                                @click="changState(scope.row.id, scope.row.state)"></el-button>
                        </el-tooltip>
                        <el-tooltip content="移交追踪列表" placement="top">
                            <el-button type="success" icon="el-icon-upload2" circle
                                @click="handleTrack(scope.row.id)"></el-button>
                        </el-tooltip>
                    </div>
                    <!-- <div style="margin-top: 5px;">
                        <el-button type="warning" v-if="scope.row.dimension == 1" icon="el-icon-warning" circle
                            @click="changeDimension(scope.row.id, 0)"></el-button>
                        <el-button v-else="scope.row.dimension == 0" icon="el-icon-warning-outline" circle
                            @click="changeDimension(scope.row.id, 1)"></el-button>
                    </div> -->
                    <div style="margin-top: 5px;">
                        <el-tooltip content="移交车内装饰类故障列表" placement="top">
                            <el-button type="success" icon="el-icon-caret-top" circle
                                @click="changStateDecoration(scope.row.id)"></el-button>
                        </el-tooltip>
                    </div>
                </template>
            </el-table-column>
        </el-table>

        <Pagination v-bind:child-msg="pageparm" v-bind:total="total" @callFather="callFather"></Pagination>


        <!-- <el-pagination
            :total="total">
        </el-pagination>  -->
        <!-- @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="pageparm.pageNo"
            :page-sizes="[10, 20, 50, 100]"
            :page-size="pageparm.pageSize"
            layout="total, sizes, prev, pager, next, jumper" -->
        <!-- :page-sizes="[10, 20, 50, 100]"

        <!-- 编辑 -->
        <el-dialog :title="title" :visible.sync="editFormVisible" width="50%" :close-on-click-modal="false">
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
                    <el-button type="text" @click="goTeam()" :underline="false">添加班组</el-button>
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
                        <el-option label="待料" value="待料"></el-option>
                        <!-- <el-option label="待处理" value="待处理"></el-option> -->
                        <el-option label="待一级修" value="待一级修"></el-option>
                        <el-option label="待二级修" value="待二级修"></el-option>
                        <el-option label="待扣修" value="待扣修"></el-option>
                        <el-option label="待高级修" value="待高级修"></el-option>
                        <el-option label="待集中处理" value="待集中处理"></el-option>
                        <el-option label="待售后处理" value="待售后处理"></el-option>
                        <!-- <el-option label="短期跟踪" value="短期跟踪"></el-option> -->
                    </el-select>
                </el-form-item>
                <el-form-item label="功能分类" prop="funClass">
                    <el-select v-model="editForm.funClass" placeholder="请选择能分类">
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
                <!-- <el-form-item label="到料" prop="material">
                    <label slot="label">到料&nbsp;
                        <span style="color:red; font-size: 10px;float: left;width: 300px;line-height: 0;">
                            <br>（无需提料）&nbsp;&nbsp;&nbsp;&nbsp;（待料）&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;（到料）
                        </span>
                    </label>
                    <el-radio-group v-model="editForm.material" @change="handleMethod">
                        <el-radio label="无" value="无"></el-radio>
                        <el-radio label="否" value="否"></el-radio>
                        <el-radio label="是" value="是"></el-radio>
                    </el-radio-group>
                </el-form-item> -->
                <el-form-item label="处理方法" prop="method">
                    <el-input type="textarea" size="small" v-model="editForm.method" auto-complete="off"
                        placeholder="请输入遗原因；处理法；物料情况；跟踪周期。" @input="handleMethod"></el-input>
                </el-form-item>

                <!-- 限制 -->
                <el-form-item label="限制" prop="review">
                    <el-select v-model="editForm.review" placeholder="请选择">
                        <el-option label="否" value="0"></el-option>
                        <el-option label="是" value="1"></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item hidden label="物料编码" prop="code">
                    <el-input size="small" v-model="editForm.code" auto-complete="off" placeholder="请输入物料编码"></el-input>
                </el-form-item>
                <el-form-item hidden label="影响进度原因" prop="schedule">
                    <el-input size="small" v-model="editForm.schedule" auto-complete="off"
                        placeholder="请输入影响进度原因"></el-input>
                </el-form-item>
                <el-form-item hidden label="责任部门（待料）" prop="respDepart">
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
import { downloadFile } from '../../../api/FileDownload'

export default {
    name: 'Fault',
    components: {
        Pagination
    },
    data() {
        return {
            carNumbers: [],
            risks: [],
            carNumberList,
            baseURL,
            timeList: [],
            tableData: [],
            editFormVisible: false,
            dialogTrackVisible: false,
            title: '编辑',
            editForm: {
                code: '无',
                schedule: '无',
                respDepart: '无',
                review: '0',
                review: '',
            },
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
                source: [{ required: true, message: '请输入故障来源', trigger: 'blur' }],
                material: [{ required: true, message: '请选择到料情况', trigger: 'blur' }]
            },
            trackRules: {
                trackPerson: [{ required: true, message: '请输入责任人', trigger: 'blur' }],
                trackRequire: [{ required: true, message: '请输入追踪要求', trigger: 'blur' }],
                feedback: [{ required: true, message: '请输入反馈', trigger: 'blur' }],
            },
            pageparm: {
                pageNo: 1,
                pageSize: 100000,
                result: '未处理',
                state: '0',
            },
            total: 0,
            loading: true,
            teamsList: [],
            riskList: [
                {
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
            id: 0,
            uploadModalVisible: false,
            fileList: [],
            dialogVisible: false,
            attachmentList: [
                // 附件数据应该在这里
                // 格式示例：
                // { name: '文件1', type: '文档', url: '附件下载接口地址' }
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
        },
    },
    methods: {
        changeInput(e) {
            this.$forceUpdate();
        },
        rowStyle({ row }) {
            if (row.dimension == 1) {
                return { 'background': 'antiquewhite' }
            }
            if (row.review == 1) {
                return { 'background': 'rgb(159 199 159)' }
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
            if (this.risks.length) {
                this.pageparm.risks = this.risks
            }
            this.loading = true
            if (this.timeList.length) {
                this.pageparm.startTime = this.getYMDHMS(new Date(this.timeList[0].toString()));
                this.pageparm.endTime = this.getYMDHMS(new Date(this.timeList[1].toString()))
            }
            this.pageparm.pageNo = 1
            // this.pageparm.pageSize = 100
            axios({
                // get请求
                // url: baseURL + '/fault/screenfault',
                // params: {
                //     // record: this.pageparm,
                //     ...this.pageparm,
                //     state: '0',
                //     pageNo: this.pageparm.pageNo,
                //     pageSize: this.pageparm.pageSize
                // }

                // post请求
                method: 'post',
                url: baseURL + '/fault/screenfault',
                params:{
                    pageNo: this.pageparm.pageNo,
                    pageSize: this.pageparm.pageSize
                },
                // data: this.pageparm
                data: {
                    ...this.pageparm,
                    pageNo: this.pageparm.pageNo,
                    pageSize: this.pageparm.pageSize
                }
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
            })
        },
        searchCurrent() {
            if (this.carNumbers.length) {
                this.pageparm.carNumbers = this.carNumbers
            }
            if (this.risks.length) {
                this.pageparm.risks = this.risks
            }
            this.loading = true
            if (this.timeList.length) {
                this.pageparm.startTime = this.getYMDHMS(new Date(this.timeList[0].toString()));
                this.pageparm.endTime = this.getYMDHMS(new Date(this.timeList[1].toString()))
            }
            this.pageparm.pageNo = 1
            this.pageparm.pageSize = 10000
            axios({
                // get请求
                // url: baseURL + '/fault/screenfault',
                // params: {
                //     // record: this.pageparm,
                //     ...this.pageparm,
                //     state: '0',
                //     pageNo: this.pageparm.pageNo,
                //     pageSize: this.pageparm.pageSize
                // }

                // post请求
                method: 'post',
                url: baseURL + '/fault/screenfault',
                data: this.pageparm
                // data: {
                //     ...this.pageparm,
                //     pageNo: this.pageparm.pageNo,
                //     pageSize: this.pageparm.pageSize
                // }
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
            })
        },
        initPage() {
            this.pageparm = {
                pageNo: 1,
                pageSize: 10,
                state: 0,
                result: '未处理'
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

            let openUrl = `${baseURL}/fault/export?`;

            // let carNumbersList = `carNumbers=`
            // if (this.pageparm['carNumbers'].length) {
            //     for (let i = 0; i < this.pageparm['carNumbers'].length; i++) {
            //         carNumbersList += this.pageparm['carNumbers'][i] + ','
            //     }
            // }

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
        callFather(val) {
            this.pageparm.pageNo = val.pageNo
            this.pageparm.pageSize = val.pageSize
            this.searchCurrent()
            document.querySelector('.el-main').scrollTo(0, 0)
        },
        getFault() {
            if (this.carNumbers.length) {
                this.pageparm.carNumbers = this.carNumbers
            }
            console.log(this.pageparm)
            axios({

                // get请求
                // url: baseURL + '/fault/screenfault',
                // params: {
                //     // record: this.pageparm,
                //     result: '未处理',
                //     state: '0',
                //     pageNo: this.pageparm.pageNo,
                //     pageSize: this.pageparm.pageSize
                // }

                // post请求
                method: 'post',
                url: baseURL + '/fault/screenfault',
                params: {
        pageNo: this.pageparm.pageNo,
        pageSize: this.pageparm.pageSize
    },
                data: {
                    result: '未处理',
                    state: '0',
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
                console.log('返回数据',res)
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
            console.log(row)
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
                this.editForm = {
                    review: '0',
                    code: '无',
                    schedule: '无',
                    respDepart: '无',
                    notes: '无',
                    // material: '无'
                }
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
                        // 没有选择处理结果 
                        if (!this.editForm.result) {
                            this.$message.error("请选择处理结果")
                        } else {
                            // 选择处理结果
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
                                this.search()
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
                                this.search()
                            })
                        }


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
                            this.$message.error("请重新交")
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
        changStateDecoration(id, state) {
            this.$confirm('此操作将数据提交到车内装饰类故障列表, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                axios({
                    url: ` ${baseURL}/fault/changestate`,
                    params: { id, state: 4 }
                }).then(res => {
                    this.$message.success("已转移到车内装饰类故障列表")
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
                                feedback: '请责任人填写'
                            }
                        }).then(res => {
                            this.$message.success("已转移到故障追踪列表")
                            this.search()
                            this.dialogTrackVisible = false
                            this.editTrackForm = {}
                        }).catch(err => {
                            this.$message.error('请重新')
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
        handleFileSuccess(response, file, fileList) {
            if (response.code !== 200) {
                this.$message.error(response.msg)
                this.$refs.refName.uploadFiles.splice(this.$refs.refName.uploadFiles.indexOf(file), 1);
            } else {
                this.$message.success("上传成功")
            }
        },
        handleFileError(err, file, fileList) {
            this.$message.error('文件超出大小限制，上传失败，请联系理!')
            this.$refs.refName.uploadFiles.splice(this.$refs.refName.uploadFiles.indexOf(file), 1);
            this.$refs.refName.clearFiles();
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
        deleteAttachment(row) {
            // 调用附件下载接口，你需要根据实际情况修改这里的代码
            console.log('删除附件', row);
            this.deleteParams = {
                fileId: row.fileId,
                faultFileMidId: row.faultFileMidId
            }
            // 
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
                    } else {
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

        handleSizeChange(val) {
            this.pageparm.pageSize = val;
            this.pageparm.pageNo = 1;
            this.getFault();
        },
        handleCurrentChange(val) {
            this.pageparm.pageNo = val;
            this.getFault();
        },
        goTeam() {
            this.$router.push({ path: '/teams/index' })
        }

    }
}
</script>

  <!-- Add "scoped" attribute to limit CSS to this component only -->
  <style>
  .user-search {
      background: #f9f9f9;
      border-radius: 8px;
      padding: 20px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
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

.user-search .el-form-item__content {
  display: inline-block;
  vertical-align: middle;
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

/* 其他样式保持不变 */

/* 移除表单项的悬停效果 */
.user-search .el-form-item {
  transition: none;
}

.user-search .el-form-item:hover {
  transform: none;
  box-shadow: none;
}

/* 为每个按钮单独添加悬停效果 */
.el-button {
  transition: all 0.3s ease;
}

.el-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* 主要按钮 */
.el-button--primary:hover {
  background-color: #66b1ff;
  border-color: #66b1ff;
}

/* 成功按钮 */
.el-button--success:hover {
  background-color: #85ce61;
  border-color: #85ce61;
}

/* 警告按钮 */
.el-button--warning:hover {
  background-color: #ebb563;
  border-color: #ebb563;
}

/* 危险按钮 */
.el-button--danger:hover {
  background-color: #f78989;
  border-color: #f78989;
}

/* 信息按钮 */
.el-button--info:hover {
  background-color: #a6a9ad;
  border-color: #a6a9ad;
}

/* 默认按钮 */
.el-button--default:hover {
  background-color: #ecf5ff;
  color: #409EFF;
  border-color: #c6e2ff;
}

/* 圆形按钮 */
.el-button.is-circle:hover {
  transform: translateY(-2px) scale(1.05);
}

/* 按钮组样式 */
.button-group {
  display: flex;
  justify-content: flex-end;
}

.button-group .el-button + .el-button {
  margin-left: 10px;
}

/* 在小屏幕上调整按钮组的布局 */
@media (max-width: 768px) {
  .button-group {
    justify-content: flex-start;
    margin-top: 10px;
  }
  
  .button-group .el-button + .el-button {
    margin-left: 0;
    margin-right: 10px;
  }
}

/* 其他样式保持不变 */
</style>
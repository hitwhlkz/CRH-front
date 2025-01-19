<template>
  <div class="special-survey-management">
    <h1>专项普查管理界面</h1>
    
    <!-- 搜索和筛选部分 -->
    <el-form :inline="true" :model="searchForm" class="search-form">
      <el-form-item label="普查名称">
        <el-input v-model="searchForm.name" placeholder="请输入普查名称"></el-input>
      </el-form-item>
      <el-form-item label="状态">
        <el-select v-model="searchForm.status" placeholder="请选择状态">
          <el-option label="全部" value=""></el-option>
          <el-option label="进行中" value="ongoing"></el-option>
          <el-option label="已完成" value="completed"></el-option>
          <el-option label="未开始" value="pending"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="searchSurveys">搜索</el-button>
      </el-form-item>
    </el-form>

    <!-- 普查列表 -->
    <el-table :data="surveyList" style="width: 100%">
      <el-table-column prop="name" label="普查名称">
        <template slot-scope="scope">
          <el-button type="text" @click="openWordDocument(scope.row)">{{ scope.row.name }}</el-button>
        </template>
      </el-table-column>
      <el-table-column label="作业要点">
        <template slot-scope="scope">
          <el-link v-if="scope.row.excelData" type="primary" @click="openExcel(scope.row.excelData)">作业要点</el-link>
          <el-upload
            v-else
            class="upload-demo"
            action="#"
            :on-change="(file) => handleExcelUploadForExisting(file, scope.row)"
            :auto-upload="false"
          >
            <el-button size="small" type="primary">上传作业要点</el-button>
          </el-upload>
        </template>
      </el-table-column>
      <el-table-column label="培训记录表">
        <template slot-scope="scope">
          <el-link type="primary" @click="openExcel(scope.row.trainingRecordData)">培训记录表</el-link>
        </template>
      </el-table-column>
      <el-table-column label="普查记录表">
        <template slot-scope="scope">
          <el-link 
            type="primary" 
            @click="handleSurveyRecord(scope.row)"
          >
            {{ scope.row.surveyRecordFileName || '上传普查记录表' }}
          </el-link>
        </template>
      </el-table-column>
      <el-table-column prop="createdAt" label="建立时间"></el-table-column>
      <el-table-column prop="manager" label="负责人"></el-table-column>
      <el-table-column prop="status" label="状态">
        <template slot-scope="scope">
          <el-tag :type="getStatusType(scope.row.status)">{{ scope.row.status }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="长客状态">
        <template slot-scope="scope">
          {{ getStatusText(scope.row.changkeStatus) }}
          
        </template>
      </el-table-column>
      <el-table-column label="二级状态">
        <template slot-scope="scope">
          {{ getStatusText(scope.row.erjiStatus) }}
        </template>
      </el-table-column>
      <el-table-column label="质检状态">
        <template slot-scope="scope">
          {{ getStatusText(scope.row.zhijianStatus) }}
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="small" @click="viewSurveyDetails(scope.row)">查看详情</el-button>
          <el-button size="small" type="primary" @click="editSurvey(scope.row)">编辑</el-button>
          <el-button size="small" type="danger" @click="deleteSurvey(scope.row)">删除</el-button>
          <el-button v-if="isJishuyuan && scope.row.status === '未下发'" size="small" type="success" @click="issueSurvey(scope.row)">下发</el-button>
          <el-button v-if="(isChangke || isErji) && (scope.row.changke === 0 || scope.row.erji === 0)" size="small" type="warning" @click="sendToZhijian(scope.row)">送至质检</el-button>
          <el-button v-if="isZhijian && scope.row.zhijian === 0" size="small" type="info" @click="sendToJishuyuan(scope.row)">送审</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <!-- <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination> -->

    <!-- 新建普查对话框 -->
    <el-dialog
      title="新建专项普查"
      :visible.sync="dialogVisible"
      width="50%"
      :before-close="handleClose"
    >
      <el-form :model="newSurvey" label-width="120px">
        <el-form-item label="普查称" required>
          <el-input v-model="newSurvey.name" placeholder="请输普查名称"></el-input>
        </el-form-item>
        <el-form-item label="普文档" required>
          <el-upload
            class="upload-demo"
            action="#"
            :on-change="handleDocumentUpload"
            :auto-upload="false">
            <el-button size="small" type="primary">上传普查文档</el-button>
            <template #tip>
              <div class="el-upload__tip">只能上传 docx 文件，且不超过 10MB</div>
            </template>
          </el-upload>
        </el-form-item>
        <el-form-item label="作业要点">
          <el-upload
            class="upload-demo"
            action="#"
            :on-change="handleExcelUpload"
            :auto-upload="false">
            <el-button size="small" type="primary">点击上传</el-button>
            <template #tip>
              <div class="el-upload__tip">只能上传 xlsx 文件，且不超过 10MB</div>
            </template>
          </el-upload>
        </el-form-item>
        <el-form-item label="创建时间">
          <el-input v-model="newSurvey.createdAt" disabled></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeDialog">取 消</el-button>
        <el-button type="primary" @click="submitNewSurvey">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 新查按钮 -->
    <el-button type="primary" @click="openCreateDialog" class="create-button">新建专项普查</el-button>

    <!-- Excel预览对话框 -->
    <el-dialog
      :visible.sync="surveyRecordDialogVisible"
      width="95%"
      :fullscreen="false"
      custom-class="survey-record-dialog"
    >
      <div v-if="currentSurvey.surveyRecordData && currentSurvey.surveyRecordData.length > 0" class="excel-preview-container">
        <div class="excel-table-wrapper">
          <table class="excel-table">
            <tbody>
              <tr v-for="(row, rowIndex) in currentSurvey.surveyRecordData" :key="rowIndex">
                <td v-for="(cell, cellIndex) in row" :key="cellIndex">
                  {{ cell || '' }} <!-- 直接显示单元格的值 -->
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div v-else>
        <p>请上传普查记录表</p>
        <el-upload
          class="upload-demo"
          action="#"
          :on-change="handleSurveyRecordUpload"
          :auto-upload="false"
        >
          <el-button size="small" type="primary">点击上传</el-button>
          <template #tip>
            <div class="el-upload__tip">只能上传 xlsx 文件，且不超过 10MB</div>
          </template>
        </el-upload>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="surveyRecordDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveSurveyRecord">保存并导出</el-button>
      </span>
    </el-dialog>

    <!-- Word文档预览对话框 -->
    <el-dialog
      :title="currentSurvey.name + ' - 普查文档预览'"
      :visible.sync="wordPreviewVisible"
      width="90%"
      :fullscreen="false"
    >
      <div class="word-preview-container" style="min-height: 600px;">
        <div v-if="!wordPreviewContent">正在加载文档...</div>
        </div>
    </el-dialog>

    <!-- 编辑普查对框 -->
    <el-dialog title="编辑普查" :visible.sync="editDialogVisible">
      <el-form :model="editingSurvey">
        <el-form-item label="普查名称">
          <el-input v-model="editingSurvey.name"></el-input>
        </el-form-item>
        <el-form-item label="">
          <el-input v-model="editingSurvey.manager"></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="editingSurvey.status">
            <el-option label="未开" value="未开始"></el-option>
            <el-option label="进行中" value="进行中"></el-option>
            <el-option label="已完成" value="已完成"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="普查文档">
          <el-upload
            action="#"
            :on-change="handleDocumentFileChange"
            :auto-upload="false">
            <el-button size="small" type="primary">选择文件</el-button>
          </el-upload>
        </el-form-item>
        <!-- 添加其他文件上传组件 -->
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveEditedSurvey">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 上传对话框 -->
    <el-dialog
      title="上传普查记录表"
      :visible.sync="uploadDialogVisible"
      width="50%"
    >
      <el-upload
        class="upload-demo"
        action="#"
        :on-change="handleFileChange"
        :auto-upload="false"
      >
        <el-button size="small" type="primary">选择文件</el-button>
        <template #tip>
          <div class="el-upload__tip">只能上传 xlsx 文件，且不超过 10MB</div>
        </template>
      </el-upload>
      <span slot="footer" class="dialog-footer">
        <el-button @click="uploadDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="uploadSurveyRecord">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import axios from '../../../api/axios';  // 使用我们配置好的 axios 实例
import * as XLSX from 'xlsx';

export default {
  name: 'SpecialSurveyManagement',
  components: {
  },
  data() {
    return {
      searchForm: {
        name: '',
        status: ''
      },
      surveyList: [],
      currentPage: 1,
      pageSize: 10,
      total: 0,
      loading: false,
      dialogVisible: false,
      newSurvey: {
        name: '',
        document: null,
        excel: null,
        createdAt: '' // 这个字段将在打开创建对话框时设置
      },
      excelPreviewVisible: false,
      excelPreviewUrl: '',
      surveyRecordDialogVisible: false,
      currentSurvey: {},
      wordPreviewVisible: false,
      wordPreviewUrl: '',
      hotSettings: null, // 移除 Handsontable 关设置
      columnWidths: [],
      tableWrapperStyle: {},
      tableStyle: {},
      wordPreviewContent: '',
      isJishuyuan: localStorage.getItem('roleId') === '3',
      isChangke: localStorage.getItem('roleId') === '5',
      isErji: localStorage.getItem('roleId') === '1' && localStorage.getItem('userName') === 'erji',
      isZhijian: false, // 需要根据实际情况置
      editDialogVisible: false,
      editingSurvey: {},
      uploadDialogVisible: false,
      uploadedFile: null,
    }
  },
  created() {
    this.fetchSurveys();
    this.currentSurvey = {
      surveyRecordData: [],
      surveyRecordFileName: ''
    };
    console.log('Component created, dialogVisible:', this.dialogVisible)
  },
  mounted() {
    console.log('Component mounted, dialogVisible:', this.dialogVisible)
  },
  watch: {
    dialogVisible(newVal, oldVal) {
      console.log('dialogVisible changed:', oldVal, '->', newVal)
    }
  },
  methods: {
    async fetchSurveys() {
      console.log('开始取普查列表');
      this.loading = true;
      try {
        const timestamp = new Date().getTime();
        const response = await axios.get(`/api/special-surveys?t=${timestamp}`);
        console.log('获取普查列表响应:', response);
        if (response.data && Array.isArray(response.data)) {
          this.surveyList = response.data;
          this.total = response.data.length;
          console.log('更新后的普查列表:', this.surveyList);
          console.log('数:', this.total);
        } else {
          console.error('响应据格式不正确:', response.data);
          this.$message.error('获取数据式不正确，请系管理员');
        }
      } catch (error) {
        console.error('获取普查列表失败:', error);
        this.$message.error('获取普查列表失败，请试');
      } finally {
        this.loading = false;
        console.log('取普查列表操作完');
      }
    },
    async submitNewSurvey() {
      console.log('开始提交新普查');
      if (!this.newSurvey.name || !this.newSurvey.document) {
        console.log('普查名称或文档缺失');
        this.$message.error('普查名称和普查文档是必填项');
        return;
      }

      const formData = new FormData();
      formData.append('name', this.newSurvey.name);
      formData.append('manager', localStorage.getItem('userName'));
      formData.append('status', '未开始');
      formData.append('created_at', new Date().toISOString()); // 确保日期格式正确
      formData.append('changkeStatus', -1); // 初始设置为-1
      formData.append('erjiStatus', -1);    // 初始设置为-1
      formData.append('zhijianStatus', -1); // 初始设置为-1
      // 确保文件被正确附加
      if (this.newSurvey.document) {
        formData.append('documentData', this.newSurvey.document);
        console.log('附加文档:', this.newSurvey.document.name);
      } else {
        console.warn('文档未附加');
      }
      if (this.newSurvey.excel) {
        formData.append('excelData', this.newSurvey.excel);
        console.log('附Excel文件:', this.newSurvey.excel.name);
      } else {
        console.warn('Excel文件未附加');
      }

      try {
        console.log('发送创建普查请求1');
        console.log('FormData内容：');
        for (let pair of formData.entries()) {
            console.log(`${pair[0]}: ${pair[1]}`);
        };
        const response = await axios.post('/api/special-surveys', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        console.log('创建普查成功响应数据:', response.data);

        // 创建新记录，确保格式与正常记录一致
        const newRecord = {
          id: response.data.id, // 使用后端返回的ID
          name: response.data.name,
          documentData: response.data.documentData, // 直接使用后端返回的文档数据
          excelData: response.data.excelData, // 直接使用后端返回的Excel数据
          trainingRecordData: response.data.trainingRecordData, // 接使用后端回的培训记录数据
          surveyRecordData: response.data.surveyRecordData, // 直接使用后端返回的普查记录数据
          surveyRecordFilename: response.data.surveyRecordFilename, // 使用后端返回文件名
          createdAt: response.data.createdAt,
          manager: response.data.manager,
          status: response.data.status,
          changkeStatus: response.data.changkeStatus, // 根据需要设置
          erjiStatus: response.data.erjiStatus, // 据需要设置
          zhijianStatus: response.data.zhijianStatus // 根据需要设置
        };

        this.surveyList.unshift(newRecord);
        this.total += 1;
        this.$message.success('新建普查成功');
        this.closeDialog();
      } catch (error) {
        console.error('创建普查失败:', error);
        if (error.response) {
          console.error('错误响应:', error.response.data);
          this.$message.error(`新建普查失败: ${error.response.data.message || '未知错误'}`);
        } else {
          this.$message.error('新建普查失败，请重试');
        }
      }

      await this.fetchSurveys(); // 提成功后重新获取列
    },
    async deleteSurvey(survey) {
      console.log('开始删除普查:', survey);
      try {
        await axios.delete(`/api/special-surveys/${survey.id}`);
        console.log('删除普查成功');
        const index = this.surveyList.findIndex(s => s.id === survey.id);
        if (index > -1) {
          this.surveyList.splice(index, 1);
          this.total -= 1;
          console.log('从列表中移除普查');
          console.log('更新后的普查列表:', this.surveyList);
          console.log('更新后的总数:', this.total);
        } else {
          console.warn('未找到要删除的普查');
        }
        this.$message.success('删功');
      } catch (error) {
        console.error('删除普查失败:', error);
        this.$message.error('删除普查失败，请重试');
      }

      await this.fetchSurveys(); // 删除成功后重新获取列表
    },
    async updateSurvey(survey) {
      console.log('开始更新普查:', JSON.stringify(survey, null, 2)); // 输出当前普查数据
      const formData = new FormData(); // 创建表单数据对象
      formData.append('name', survey.name); // 添加普查名称
      formData.append('manager', survey.manager); // 添加负责人
      formData.append('status', survey.status); // 添加状态
      formData.append('changkeStatus', survey.changkeStatus); // 添加长客状态
      formData.append('erjiStatus', survey.erjiStatus); // 添加二级状态
      formData.append('zhijianStatus', survey.zhijianStatus); // 添加质检状态

      // 附加文件数据
      if (survey.documentData instanceof File) {
          formData.append('documentData', survey.documentData); // 添加文档数据
          console.log('附加更新文档:', survey.documentData.name);
      } else {
          console.warn('更新文档未附加'); // 警告未附加
      }
      if (survey.excelData instanceof File) {
          formData.append('excelData', survey.excelData); // 添加Excel数据
          console.log('附加更新Excel文件:', survey.excelData.name);
      } else {
          console.warn('更新Excel文件未附加'); // 警告未附加
      }
      if (survey.trainingRecordData instanceof File) {
          formData.append('trainingRecordData', survey.trainingRecordData); // 添加培训记录数据
          console.log('附加更新培训记录文件:', survey.trainingRecordData.name);
      }
      if (survey.surveyRecordData instanceof File) {
          formData.append('surveyRecordData', survey.surveyRecordData); // 添加普查记录数据
          console.log('附加更新普查记录文件:', survey.surveyRecordData.name);
      }

      try {
          const response = await axios.put(`/api/special-surveys/${survey.id}`, formData, {
              headers: {
                  'Content-Type': 'multipart/form-data' // 设置请求头
              }
          });
          console.log('更新普查成功，响应数据:', JSON.stringify(response.data, null, 2)); // 输出更新后的数据
          const index = this.surveyList.findIndex(s => s.id === survey.id); // 查找索引
          if (index > -1) {
              this.$set(this.surveyList, index, response.data); // 更新列表中的数据
          } else {
              console.warn('未找到要更新的普查'); // 警告未找到
          }
          this.$message.success('更新普查成功'); // 显示成功信息
          return response.data; // 返回更新后的数据
      } catch (error) {
          console.error('更新普查失败:', error); // 输错误信息
          console.error('错误详情:', error.response ? error.response.data : error.message); // 输出详细错误信息
          this.$message.error('更新普查失败，请重试'); // 显示错误信息
          throw error; // 抛出错误
      }
    },
    async issueSurvey(survey) {
      console.log('下发普查:', survey);
      survey.changkeStatus = 0; // 设置长客状态为0
      survey.erjiStatus = 0; // 设置二级状态为0
      survey.zhijianStatus = 0; // 设置质检状态为0
      survey.status = '进行中'; // 更新普查状态为进行中
      await this.updateSurvey(survey); // 更新普查
    },
    async sendToZhijian(survey) {
      console.log('送至质检:', survey);
      if (this.isChangke) survey.changke = 1;
      if (this.isErji) survey.erji = 1;
      survey.zhijian = 0;
      await this.updateSurvey(survey);
    },
    async sendToJishuyuan(survey) {
      console.log('送审:', survey);
      survey.zhijian = 1;
      survey.status = '待审核';
      await this.updateSurvey(survey);
    },
    openCreateDialog() {
      console.log('打开新建对话框');
      this.dialogVisible = true;
      this.newSurvey = {
        name: '',
        document: null,
        excel: null,
        createdAt: new Date().toISOString() // 设置创建时间
      };
      console.log('新建普查数据:', this.newSurvey);
    },
    closeDialog() {
      console.log('关闭对话框');
      this.dialogVisible = false;
    },
    handleClose(done) {
      this.$confirm('确关闭？')
        .then(_ => {
          this.closeDialog()
          done()
        })
        .catch(_ => {})
    },
    openDocument(url) {
      if (url.startsWith('blob:')) {
        window.open(url, '_blank');
      } else {
        // 对于非 blob URL，保持原有的打开方式
        window.open(url, '_blank');
      }
    },
    async openExcel(data) {
      console.log('打开Excel文件:', data);
      if (data) {
        try {
          // 假设data是文件ID或者某种标识符
          const response = await axios.get(`/api/special-surveys/excel/${data}`, {
            responseType: 'blob'
          });
          const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
          const url = URL.createObjectURL(blob);
        window.open(url, '_blank');
          URL.revokeObjectURL(url);
        } catch (error) {
          console.error('打开Excel文件失败:', error);
          this.$message.error('打开文件失败，请重试');
        }
      } else {
        this.$message.warning('文件不存在');
      }
    },
    getStatusType(status) {
      const statusMap = {
        '进行中': 'primary',
        '未开始': 'info',
        '已完成': 'success'
      }
      return statusMap[status] || ''
    },
    viewSurveyDetails(survey) {
      console.log('查看普查详情', survey)
    },
    editSurvey(survey) {
      console.log('编辑普查', survey);
      // 这里应该打开一个编辑对话框
      this.editingSurvey = { ...survey };
      this.editDialogVisible = true;
    },
    handleDocumentFileChange(file) {
      this.editingSurvey.documentData = file.raw;
    },
    handleExcelFileChange(file) {
      this.editingSurvey.excelData = file.raw;
    },
    handleTrainingRecordFileChange(file) {
      this.editingSurvey.trainingRecordData = file.raw;
    },
    handleSurveyRecordFileChange(file) {
      this.editingSurvey.surveyRecordData = file.raw;
    },
    saveEditedSurvey() {
      this.updateSurvey(this.editingSurvey)
        .then(updatedSurvey => {
          this.editDialogVisible = false;
          // 可能需要刷新列表或更新本地数据
        })
        .catch(error => {
          console.error('保存编辑失败:', error);
          // 可能需要显示错误消息
        });
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.fetchSurveys()
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.fetchSurveys()
    },
    searchSurveys() {
      console.log('搜索普查', this.searchForm)
      this.fetchSurveys()
    },
    handleDocumentUpload(file) {
      this.newSurvey.document = file.raw;
    },
    handleExcelUpload(file) {
      this.newSurvey.excel = file.raw;
    },
    // submitNewSurvey() {
    //   if (!this.newSurvey.name || !this.newSurvey.document) {
    //     this.$message.error('普查名称和普查文档是必填');
    //     return;
    //   }

    //   // 创建新记录对象
    //   const newRecord = {
    //     id: this.surveyList.length + 1,
    //     name: this.newSurvey.name,
    //     documentUrl: URL.createObjectURL(this.newSurvey.document),
    //     excelUrl: this.newSurvey.excel ? URL.createObjectURL(this.newSurvey.excel) : null,
    //     trainingRecordUrl: null, // 假设培训记录表创建时为空
    //     surveyRecordUrl: null,
    //     surveyRecordFileName: null,
    //     createdAt: this.newSurvey.createdAt,
    //     manager: '管理员', // 这里可根据实际情况设置
    //     status: '未开'
    //   };

    //   // 添加新录到列表
    //   this.surveyList.unshift(newRecord);

    //   // 更新总数
    //   this.total += 1;

    //   console.log('新建普查', newRecord);
    //   this.$message.success('新建普查成功');

    //   this.closeDialog();

    //   // 在实际应用中，你应该在这里调 API 并理响应
    //   // 成功后刷新普查列表
    //   // this.fetchSurveys();
    // },
    handleExcelUploadForExisting(file, survey) {
      // 这应该调用API来上件并更新记录
      console.log('为现有记录上传作要点', file, survey);
      
      // 模拟上传成功
      this.$set(survey, 'excelUrl', URL.createObjectURL(file.raw));
      
      // 在实际应用中，你应该这里调用API来上传件
      // 传成功后，更新 survey.excelUrl 为务器返回的URL
      // 如：
      // this.uploadExcelToServer(file.raw, survey.id).then(response => {
      //   this.$set(survey, 'excelUrl', response.data.url);
      // }).catch(error => {
      //   console.error('上失败', error);
      //   this.$message.error('上失，请重');
      // });
    },

    // 模拟上传到务器的方法（实际应用中需要实现）
    uploadExcelToServer(file, surveyId) {
      // 这里应该是真实的API调用
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            data: {
              url: URL.createObjectURL(file)
            }
          });
        }, 1000);
      });
    },

    previewExcel(url) {
      if (url) {
        this.excelPreviewUrl = url;
        this.excelPreviewVisible = true;
      } else {
        this.$message.warning('普查记录表不存在');
      }
    },

    handleSurveyRecord(survey) {
      console.log('处理普查记录:', survey);
      this.currentSurvey = { ...survey };  // 创建一个副本

      // 根据后端数据设置状态
      this.currentSurvey.changkeStatus = survey.changkeStatus === -1 ? '未下发' : '已下发';
      this.currentSurvey.erjiStatus = survey.erjiStatus === -1 ? '未下发' : '已下发';
      this.currentSurvey.zhijianStatus = survey.zhijianStatus === -1 ? '未下发' : '已下发';
      this.currentSurvey.status = survey.status || '未开始'; // 初始状态

      // 直接使用 surveyRecordData 进行解析
      if (this.currentSurvey.surveyRecordData) {
          console.log('使用现有的普查记录数据进行解析:', this.currentSurvey.surveyRecordData);
          this.parseExcelData(this.currentSurvey.surveyRecordData); // 解析数据
          this.surveyRecordDialogVisible = true; // 打开预览对话框
      } else {
          // 如果没有数据，弹出上传对话框
          this.$message.warning('当前普查记录表不存在，请上传新的记录表。');
          this.openUploadDialog(); // 打开上传对话框
      }
    },

    openUploadDialog() {
        // 打开上传对话框的逻辑
        this.uploadDialogVisible = true; // 假设您有一个控制上传对话框可见性的变量
    },

    async uploadSurveyRecord() {
        // 处理上传文件的逻辑
        const formData = new FormData();
        if (this.uploadedFile) {
            formData.append('surveyRecordData', this.uploadedFile); // 添加上的文件
        }

        try {
            const response = await axios.put(`/api/special-surveys/${this.currentSurvey.id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            console.log('上传普查记录成功，响应数据:', response.data);
            this.$message.success('上传成功');

            // 解析上传的文件内容
            this.parseExcelData(response.data.surveyRecordData); // 假设后端返回的surveyRecordData是文件内容
            this.uploadDialogVisible = false; // 关闭上传对话框
            this.surveyRecordDialogVisible = true; // 打开预览对话框
        } catch (error) {
            console.error('上传普查记录失败:', error);
            this.$message.error('上传失败，请重试');
        }
    },

    handleFileChange(file) {
        this.uploadedFile = file.raw; // 处理文件选择
    },

    parseExcelData(data) {
      console.log('解析Excel数据:', data);
      try {
        let workbook;
        if (typeof data === 'string') {
          // 尝试解码Base64
          try {
            const decodedData = atob(data);
            workbook = XLSX.read(decodedData, { type: 'binary' });
          } catch (decodeError) {
            console.error('Base64解码失败，尝试直接解析数据:', decodeError);
            workbook = XLSX.read(data, { type: 'string' });
          }
        } else if (data instanceof ArrayBuffer) {
          workbook = XLSX.read(new Uint8Array(data), { type: 'array' });
        } else {
          throw new Error('不支持的数据类型');
        }

        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        // 直接将解析后的数据存储在 surveyRecordData 中
        this.currentSurvey.surveyRecordData = jsonData.map(row => 
            row.map(cell => (cell !== undefined ? cell : '')) // 直接使用单元格的值
        );

        console.log('解析后的表格数据:', this.currentSurvey.surveyRecordData);
      } catch (error) {
        console.error('解析Excel数据失败:', error);
        this.$message.error('解析Excel数据失败，请检查文件格式');
        this.currentSurvey.surveyRecordData = [];  // 设置为空数组以避免渲染错误
      }
    },

    saveSurveyRecord() {
      // 将当前编辑的数据转换为 XLSX 可以处理的格式
      const data = this.currentSurvey.surveyRecordData.map(row => 
        row.map(cell => cell.v)
      );

      const ws = XLSX.utils.aoa_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
      
      const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });
      const blob = new Blob([this.s2ab(wbout)], { type: "application/octet-stream" });
      
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${this.currentSurvey.name}_普查记录表.xlsx`;
      a.click();
      
      window.URL.revokeObjectURL(url);
      this.surveyRecordDialogVisible = false;

      // 可以在这里添加保存到服务器的逻辑
      // this.saveToServer(this.currentSurvey.surveyRecordData);
    },

    handleSurveyRecordUpload(file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        
        this.currentSurvey.surveyRecordData = jsonData.map(row => 
          row.map(cell => ({ v: cell !== undefined ? cell : '' }))
        );
        this.currentSurvey.surveyRecordFileName = file.name;
      };
      reader.readAsArrayBuffer(file.raw);
    },

    someMethodBeforeParseExcelFile() {
      // 方法内容
    },

    parseExcelFile(file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        console.log('Excel 工作簿信息:', workbook);
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        console.log('第一个工作表信息:', worksheet);

        const range = XLSX.utils.decode_range(worksheet['!ref']);
        console.log('Excel 数据范围:', range);

        const tableData = [];
        
        // 处理列宽
        this.columnWidths = [];
        if (worksheet['!cols']) {
          worksheet['!cols'].forEach((col, index) => {
            let width = (col.wpx || 60);
            if (index === 1) { // 假设检查项目是第二列
              width = Math.max(width, 300); // 确检查项目列少有 300px 宽
            }
            this.columnWidths.push(width + 'px');
          });
        }

        // 处理格样式
        this.tableStyle = {
          borderCollapse: 'collapse',
          width: '100%',
          tableLayout: 'fixed',
        };

        // 处理表格容器样式
        this.tableWrapperStyle = {
          overflowX: 'auto',
          maxWidth: '100%',
        };

        for (let R = range.s.r; R <= range.e.r; ++R) {
          const row = [];
          for (let C = range.s.c; C <= range.e.c; ++C) {
            const cellAddress = XLSX.utils.encode_cell({r: R, c: C});
            const cell = worksheet[cellAddress] || { v: '', t: 's' };
            
            // 确保 cell.style 存在
            cell.style = this.parseExcelStyle(cell.s) || {};

            cell.v = cell.v != null ? cell.v.toString() : '';
            cell.r = R;
            cell.c = C;

            if (!cell.hidden) {
              row.push(cell);
            }
          }
          tableData.push(row);
        }

        console.log('解析后的表格数据:', tableData);
        this.$set(this.currentSurvey, 'surveyRecordData', tableData);
      };
      reader.readAsArrayBuffer(file);
    },

    parseExcelStyle(style) {
      const result = {};
      if (style) {
        if (style.font) {
          result.fontWeight = style.font.bold ? 'bold' : 'normal';
          result.fontStyle = style.font.italic ? 'italic' : 'normal';
          result.textDecoration = style.font.underline ? 'underline' : 'none';
          result.fontSize = (style.font.sz || 11) + 'pt';
          result.fontFamily = style.font.name || 'Arial';
          result.color = style.font.color && style.font.color.rgb ? '#' + style.font.color.rgb : '#000000';
        }
        if (style.fill && style.fill.fgColor) {
          result.backgroundColor = '#' + style.fill.fgColor.rgb;
        }
        if (style.alignment) {
          result.textAlign = style.alignment.horizontal || 'left';
          result.verticalAlign = style.alignment.vertical || 'middle';
        }
        if (style.border) {
          const borderStyle = (side) => side ? `${side.style || 'thin'} #${side.color.rgb || '000000'}` : 'none';
          result.borderTop = borderStyle(style.border.top);
          result.borderRight = borderStyle(style.border.right);
          result.borderBottom = borderStyle(style.border.bottom);
          result.borderLeft = borderStyle(style.border.left);
        }
      }
      return result;
    },

    getCellStyle(cell, rowIndex, cellIndex) {
      const style = {
        border: '1px solid #000',
        padding: '4px',
        textAlign: cellIndex === 0 ? 'center' : 'left',
        verticalAlign: 'middle',
        fontSize: '12px',
      };

      if (rowIndex < 2) {
        style.fontWeight = 'bold';
        style.textAlign = 'center';
        style.backgroundColor = '#f0f0f0';
      }

      if (cellIndex === 1) {
        style.minWidth = '300px';
      }

      return { ...style, ...(cell && cell.style || {}) };
    },

    formatCellContent(cell) {
      if (!cell || cell.v === undefined) return '';
      if (cell.v === '✓') {
        return '<span style="font-size: 16px; color: #000; font-weight: bold;">✓</span>';
      }
      return String(cell.v).replace(/\n/g, '<br>');
    },

    findMergedCell(merges, row, col) {
      if (!merges) return null;
      return merges.find(m => 
        row >= m.s.r && row <= m.e.r &&
        col >= m.s.c && col <= m.e.c
      );
    },

    async openWordDocument(survey) {
      console.log('Downloading Word document:', survey);
      if (survey.id) {
        try {
          const response = await axios.get(`/api/special-surveys/${survey.id}/document`, {
            responseType: 'blob'
          });
          const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
          const url = URL.createObjectURL(blob);
          
          const link = document.createElement('a');
          link.href = url;
          link.download = `${survey.name}.docx`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          
          URL.revokeObjectURL(url);
        } catch (error) {
          console.error('Error downloading document:', error);
          this.$message.error('无法下载文档，请稍后重试');
        }
      } else {
        console.warn('Document ID is missing');
        this.$message.warning('无法下载文档，文档ID缺失');
      }
    },

    isValidBase64(str) {
      try {
        return btoa(atob(str)) == str;
      } catch (err) {
        return false;
      }
    },

    base64ToBlob(base64) {
      const parts = base64.split(';base64,');
      const contentType = parts[0].split(':')[1];
      const raw = window.atob(parts[1]);
      const rawLength = raw.length;
      const uInt8Array = new Uint8Array(rawLength);

      for (let i = 0; i < rawLength; ++i) {
        uInt8Array[i] = raw.charCodeAt(i);
      }

      return new Blob([uInt8Array], { type: contentType });
    },

    downloadDocument() {
      if (this.wordPreviewUrl) {
        window.open(this.wordPreviewUrl, '_blank');
      }
    },

    isEditableColumn(cellIndex) {
      if (!this.currentSurvey.surveyRecordData || !this.currentSurvey.surveyRecordData[0]) {
        return false;
      }
      const headerRow = this.currentSurvey.surveyRecordData[0];
      const columnName = headerRow[cellIndex] ? headerRow[cellIndex].v : '';
      return this.editableColumns.includes(columnName);
    },

    getStatusText(status) {
      console.log("当前行数据：", status);
      status = Number(status);
      switch(status) {
        case -1: return '未开始';
        case 0: return '进行中';
        case 1: return '已完成';
        default: return '未知状态';
      }
    },

    getTableHeaders() {
        // 根据实际数据生成表头
        return [
            '车组号',
            '检查项点',
            '检查结果',
            '检查人员',
            '二级人员',
            '质检',
            '质检抽检车号',
            '日期'
        ];
    },
  }
}
</script>

<style scoped>
.special-survey-management {
  padding: 20px;
}
.search-form {
  margin-bottom: 20px;
}
.create-button {
  margin-top: 20px;
}
.survey-record-note {
  margin-top: 20px;
  font-style: italic;
  color: #666;
}
.excel-table-container {
  overflow-x: auto;
  max-width: 100%;
}

.excel-table {
  border-collapse: collapse;
  width: 100%;
  font-size: 12px;
}

.excel-table td {
  border: 1px solid #000;
  padding: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.excel-table tr:first-child td {
  font-weight: bold;
  text-align: center;
  background-color: #f0f0f0;
}

.excel-table tr:nth-child(2) td {
  font-weight: bold;
  text-align: center;
  background-color: #f0f0f0;
}

.excel-editor-container {
  height: 600px;
  width: 100%;
  overflow: auto;
}

.excel-preview-container {
  overflow-x: auto;
  max-width: 100%;
  margin-bottom: 20px;
}

.excel-table {
  border-collapse: collapse;
  width: 100%;
  font-size: 12px;
}

.excel-table th, .excel-table td {
  border: 1px solid #000;
  padding: 4px;
}

.excel-table thead th {
  font-weight: bold;
  text-align: center;
  background-color: #f0f0f0;
}

.excel-table thead tr:first-child th {
  font-size: 14px;
}

.table-note {
  margin-top: 10px;
  font-style: italic;
  color: #666;
}

.survey-record-dialog {
  display: flex;
  flex-direction: column;
}

.excel-preview-container {
  display: flex;
  flex-direction: column;
  height: auto;
  max-height: 80vh;
}

.excel-table-wrapper {
  overflow: auto;
  max-height: calc(80vh - 100px);
}

.excel-table {
  border-collapse: collapse;
  table-layout: fixed;
}

.excel-table td {
  border: 1px solid #dcdfe6;
  padding: 4px;
  font-size: 12px;
  white-space: normal; /* 允许换行 */
  word-wrap: break-word; /* 确保长单词也能换行 */
  max-width: 300px; /* 设置最大宽度，可以根据需要调整 */
}

.excel-table .el-input__inner,
.excel-table .el-textarea__inner {
  border: none;
  padding: 4px;
}

.excel-table .el-textarea__inner {
  resize: none;
}
</style>
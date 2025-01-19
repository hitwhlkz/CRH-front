<template>
  <div class="special-survey-management">
    <h1>专项普查管理界面</h1>

    <!-- 搜索和新建普查部分 -->
    <div class="search-and-create-container">
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
          <el-button type="success" @click="openCreateDialog">新建</el-button>
          <el-button type="warning" @click="resetForm('searchForm')">重置</el-button>
          <el-button type="info" @click="exportToExcel">导出</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 普查列表 -->
    <el-table :data="surveyList" style="width: 100%" border>
      <el-table-column prop="name" label="普查名称">
        <template slot-scope="scope">
          <el-button type="text" @click="openWordDocument(scope.row)">{{ scope.row.name }}</el-button>
        </template>
      </el-table-column>
      <el-table-column label="作业要点">
        <template slot-scope="scope">
          <el-link type="primary" @click="handleexcelData(scope.row)">
            {{ scope.row.excelData ? '作业要点' : '暂无作业要点' }}
          </el-link>
        </template>
      </el-table-column>
      <el-table-column label="培训记录表">
        <template slot-scope="scope">
          <el-link type="primary" @click="handleTrainingData(scope.row)">
            {{ scope.row.trainingRecordData ? '培训记录' : '暂无培训记录' }}
          </el-link>
        </template>
      </el-table-column>
      <el-table-column label="普查记录表">
        <template slot-scope="scope">
          <el-link type="primary" @click="handleSurveyRecord(scope.row)">
            {{ scope.row.surveyRecordFilename || '新建普查记录表' }}
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
      <el-table-column label="操作" width="180">
        <template slot-scope="scope">
          <el-button size="small" type="primary" @click="openDialog(scope.row)">下发</el-button>
          <el-button size="small" type="danger" @click="deleteSurvey(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 下发对话框 -->
    <el-dialog title="选择下发人员" :visible.sync="dialogVisible1" width="30%" @close="resetDialog">
      <el-form :model="dialogForm">
        <el-form-item label="下发对象" :label-width="formLabelWidth">
          <el-checkbox-group v-model="dialogForm.receivers">
            <el-checkbox label="changke" name="receiver">长客</el-checkbox>
            <el-checkbox label="erji" name="receiver">二级</el-checkbox>
            <el-checkbox label="zhijian" name="receiver">质检</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible1 = false">取消</el-button>
        <el-button type="primary" @click="submitDialog">确认</el-button>
      </span>
    </el-dialog>

    <!-- 新建普查对话框 -->
    <el-dialog title="新建专项普查" :visible.sync="dialogVisible" width="50%" :before-close="handleClose">
      <el-form :model="newSurvey" label-width="120px">
        <el-form-item label="普查名称" required>
          <el-input v-model="newSurvey.name" placeholder="请输入普查名称"></el-input>
        </el-form-item>
        <el-form-item label="普查文档" required>
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

    <!-- Excel预览对话框 -->
    <el-dialog
      :visible.sync="surveyRecordDialogVisible"
      width="75%"
      :fullscreen="false"
      custom-class="survey-record-dialog"
      :modal="true"
      display: flex
      :z-index="1">
      <Sheetjs :width="'100%'" :height="'100%'" :data="currentSurvey"  @upload-success="handleUploadSuccess"/>
    </el-dialog>

    <!-- Word文档预览对话框 -->
    <el-dialog
      :title="currentSurvey.name + ' - 普查文档预览'"
      :visible.sync="wordPreviewVisible"
      width="90%"
      :fullscreen="false">
      <div class="word-preview-container" style="min-height: 600px;">
        <div v-if="!wordPreviewContent">正在加载文档...</div>
      </div>
    </el-dialog>

    <!-- 编辑普查对话框 -->
    <el-dialog title="编辑普查" :visible.sync="editDialogVisible">
      <el-form :model="editingSurvey">
        <el-form-item label="普查名称">
          <el-input v-model="editingSurvey.name"></el-input>
        </el-form-item>
        <el-form-item label="负责人">
          <el-input v-model="editingSurvey.manager"></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="editingSurvey.status">
            <el-option label="未开始" value="未开始"></el-option>
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
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveEditedSurvey">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 上传普查记录表对话框 -->
    <el-dialog title="上传普查记录表" :visible.sync="uploadDialogVisible" width="50%">
      <el-upload
        class="upload-demo"
        action="#"
        :on-change="handleFileChange"
        :auto-upload="false">
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

    <!-- 上传作业要点对话框 -->
    <el-dialog title="上传作业要点" :visible.sync="uploadexcelDialogVisible" width="50%">
      <el-upload
        class="upload-demo"
        action="#"
        :on-change="handleexcelFileChange"
        :auto-upload="false">
        <el-button size="small" type="primary">选择文件</el-button>
        <template #tip>
          <div class="el-upload__tip">只能上传 xlsx 文件，且不超过 10MB</div>
        </template>
      </el-upload>
      <span slot="footer" class="dialog-footer">
        <el-button @click="uploadexcelDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="uploadExcelData">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 上传培训记录对话框 -->
    <el-dialog title="上传培训记录" :visible.sync="uploadtrainingDialogVisible" width="50%">
      <el-upload
        class="upload-demo"
        action="#"
        :on-change="handletrainingChange"
        :auto-upload="false">
        <el-button size="small" type="primary">选择文件</el-button>
        <template #tip>
          <div class="el-upload__tip">只能上传 xlsx 文件，且不超过 10MB</div>
        </template>
      </el-upload>
      <span slot="footer" class="dialog-footer">
        <el-button @click="uploadtrainingDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="uploadTrainingData">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

  
  <script>
  import axios from '../../../api/axios';  // 使用我们配置好的 axios 实例
  import * as XLSX from 'xlsx';
  import HandsontableComponent from '../../../components/HandsontableComponent.vue';
  import Sheetjs from '../../../components/Sheetjs.vue';
// import Spreadsheet from '../../../components/Spreadsheet.vue';



  export default {
    name: 'SpecialSurveyManagement',
    components: {
      HandsontableComponent,
      Sheetjs,

    },
    data() {
      return {
        searchForm: {
          name: '',
          status: ''
        },
        surveyList: [],
        currentPage: 1,
        pageSize: 1000000,
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
        uploadexcelDialogVisible: false,
        uploadedFile: null,
        uploadExcelFile: null,
        uploadtrainingFile: null,
        surveyRecordDialogVisible: false,
        uploadtrainingDialogVisible: false,
      currentSurvey: {},
      uploadDialogVisible: false,
      dialogVisible1: false,
      dialogForm: {
        receiver:[], // 下发对象
        rowData: null, // 当前行的数据
      },
      formLabelWidth: '80px',
      }
    },
    created() {
      this.fetchSurveys();
      this.currentSurvey = {
        surveyRecordData: [],
        surveyRecordFileName: ''
      };
      console.log('Component created, surveyRecordData:', this.currentSurvey.surveyRecordData)
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
  console.log('开始获取普查列表');
  this.loading = true;
  try {
    const timestamp = new Date().getTime();
    const response = await axios.get(`/api/special-surveys?t=${timestamp}&page=${this.currentPage}&size=${100000}`);
    console.log('获取普查列表响应:', response);

    if (response.data && Array.isArray(response.data)) {
      // 对普查列表按创建时间降序排序
      this.surveyList = response.data.sort((a, b) => {
        return new Date(b.createdAt) - new Date(a.createdAt); // 降序排序
      });

      this.total = parseInt(response.headers['x-total-count'], 10);
      console.log('更新后的普查列表:', this.surveyList);
      console.log('总数:', this.total);
    } else {
      console.error('响应数据格式不正确:', response.data);
      this.$message.error('获取数据格式不正确，请联系管理员');
    }
  } catch (error) {
    console.error('获取普查列表失败:', error);
    this.$message.error('获取普查列表失败，请重试');
  } finally {
    this.loading = false;
    console.log('获取普查列表操作完成');
  }
},
      openDialog(row) {
        console.log(row);
  this.dialogForm = {
    receivers: [], // 确保初始值为空数组
    rowData: row,
  };
  this.dialogVisible1 = true;
    },
    // 重置对话框
    resetDialog() {
      this.dialogForm = {
        receivers: [],
        rowData: null,
      };
    },
    // 提交下发
    async submitDialog() {
  if (this.dialogForm.receivers.length === 0) {
    this.$message.warning('请选择下发对象');
    return;
  }

  const { receivers, rowData } = this.dialogForm;

  // 创建一个数组，存储所有需要执行的下发操作
  const tasks = [];

  if (receivers.includes('changke')) {
    tasks.push(this.issueSurvey(rowData));
  }
  if (receivers.includes('erji')) {
    tasks.push(this.sendToErji(rowData));
  }
  if (receivers.includes('zhijian')) {
    tasks.push(this.sendToZhijian(rowData));
  }

  try {
    // 使用 Promise.allSettled 并行执行所有下发操作
    const results = await Promise.allSettled(tasks);

    // 检查每个操作的结果
    results.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        console.log(`下发操作 ${index + 1} 成功:`, result.value);
      } else {
        console.error(`下发操作 ${index + 1} 失败:`, result.reason);
      }
    });

    // 提示用户下发结果
    const successCount = results.filter((result) => result.status === 'fulfilled').length;
    if (successCount === tasks.length) {
      this.$message.success('所有下发操作成功');
    } else if (successCount > 0) {
      this.$message.warning(`部分下发操作成功（${successCount}/${tasks.length}）`);
    } else {
      this.$message.error('所有下发操作失败');
    }
  } catch (error) {
    console.error('下发失败:', error);
    this.$message.error('下发失败，请重试');
  } finally {
    this.dialogVisible1 = false; // 关闭对话框
  }
}
,

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
      async deleteSurvey(row) {
        const survey = row;
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
        console.log('开始更新普查:', survey); // 输出当前普查数据
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
        console.log('开始更新普查:1');
        for (let [key, value] of formData.entries()) {
  console.log(key, value);
}
        try {
            const response = await axios.put(`/api/special-surveys/${survey.id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data' // 设置请求头
                }
            });
            console.log('更新普查成功，响应数据:', response.data); // 输出更新后的数据
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
        survey.status = '进行中'; // 更新普查状态为进行中
        await this.updateSurvey(survey); // 更新普查
      },
      async sendToZhijian(survey) {
        console.log('送至质检:', survey);
        // if (this.isChangke) survey.changke = 1;
        // if (this.isErji) survey.erji = 1;
        survey.zhijianStatus = 0;
        await this.updateSurvey(survey);
      },
      async sendToErji(survey) {
        console.log('送至二级:', survey);
        survey.erjiStatus = 0;
        await this.updateSurvey(survey);
      },
      async sendToJishuyuan(survey) {
        console.log('送审:', survey);
        survey.zhijian = 1;
        survey.status = '待审核';
        await this.updateSurvey(survey);
      },
      handleUploadSuccess(updatedSurvey) {
    console.log('收到 upload-success 事件，数据:', updatedSurvey);

    // 检查 updatedSurvey.id 和 surveyList 中的 id
    console.log('updatedSurvey.id:', updatedSurvey.id, '类型:', typeof updatedSurvey.id);
    console.log('surveyList 中的 id:', this.surveyList.map(s => ({ id: s.id, type: typeof s.id })));

    // 查找匹配项的索引
    const index = this.surveyList.findIndex(s => String(s.id) === String(updatedSurvey.id));
    console.log('找到的索引:', index);

    if (index !== -1) {
      // 如果找到匹配项，更新数据
      this.$set(this.surveyList, index, updatedSurvey);
    } else {
      // 如果未找到匹配项，添加新记录
      console.warn('未找到匹配的项，添加新记录');
      this.surveyList.push(updatedSurvey);
    }

    console.log('更新后的 surveyList:', this.surveyList);
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
      closeDialog1() {
        console.log('关闭对话框');
        this.dialogVisible1 = false;
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
            this.$message.error('打开文件失败请重试');
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
        console.log('查普查详情', survey)
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
        this.pageSize = val;
        this.currentPage = 1;
        this.fetchSurveys();
      },
      handleCurrentChange(val) {
        this.currentPage = val;
        this.fetchSurveys();
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
      
      handleexcelData(survey) {
  this.currentSurvey = { ...survey }; // 创建一个副本
  if (this.currentSurvey.excelData) {
    // 如果有数据，解析并下载 Excel 文件
    const base64Data = this.currentSurvey.excelData; // 获取 Base64 编码数据
    const binaryStr = atob(base64Data); // 解码 Base64 字符串
    const len = binaryStr.length;
    const bytes = new Uint8Array(len);

    for (let i = 0; i < len; i++) {
      bytes[i] = binaryStr.charCodeAt(i);
    }

    // 创建 Blob 对象
    const blob = new Blob([bytes], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = URL.createObjectURL(blob);

    // 创建下载链接
    const a = document.createElement('a');
    a.href = url;
    a.download = this.currentSurvey.surveyRecordFilename || '作业要点.xlsx'; // 设置文件名
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    // 释放 URL 对象
    URL.revokeObjectURL(url);
  } else {
    // 如果没有数据，弹出上传对话框
    this.$message.warning('当前作业要点不存在，请上传新的作业要点。');
    this.openexcelDialog(); // 打开上传对话框
  }
}
,
handleTrainingData(survey) {
  this.currentSurvey = { ...survey }; // 创建一个副本
  if (this.currentSurvey.trainingRecordData) {
    // 如果有数据，解析并下载 Excel 文件
    const base64Data = this.currentSurvey.trainingRecordData; // 获取 Base64 编码数据
    const binaryStr = atob(base64Data); // 解码 Base64 字符串
    const len = binaryStr.length;
    const bytes = new Uint8Array(len);

    for (let i = 0; i < len; i++) {
      bytes[i] = binaryStr.charCodeAt(i);
    }

    // 创建 Blob 对象
    const blob = new Blob([bytes], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = URL.createObjectURL(blob);

    // 创建下载链接
    const a = document.createElement('a');
    a.href = url;
    a.download = this.currentSurvey.surveyRecordFilename || '培训记录.xlsx'; // 设置文件名
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    // 释放 URL 对象
    URL.revokeObjectURL(url);
  } else {
    // 如果没有数据，弹出上传对话框
    this.$message.warning('当前培训记录表不存在，请上传新的培训记录表。');
    this.opentrainingDialog(); // 打开上传对话框
  }
}
,
      opentrainingDialog(){
          this.uploadtrainingDialogVisible = true;
      },
      openexcelDialog(){
          this.uploadexcelDialogVisible = true;
      },
      handleSurveyRecord(survey) {/*  */
        this.currentSurvey.surveyRecordData = 0;
        console.log('处理普查记录:', survey);
        this.currentSurvey = { ...survey };  // 创建一个副本
        // // 根据后端数据设置状态
        // this.currentSurvey.changkeStatus = survey.changkeStatus === -1 ? '未下发' : '已下发';
        // this.currentSurvey.erjiStatus = survey.erjiStatus === -1 ? '未下发' : '已下发';
        // this.currentSurvey.zhijianStatus = survey.zhijianStatus === -1 ? '未下发' : '已下发';
        // this.currentSurvey.status = survey.status || '未开始'; // 初始状态
  
        // 直接使用 surveyRecordData 进行解析
        if (this.currentSurvey.surveyRecordData) {
          this.surveyRecordDialogVisible = true; 
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
      async uploadExcelData() {
  const formData = new FormData();
  if (this.uploadExcelFile) {
    formData.append('excelData', this.uploadExcelFile); // 添加上传的文件
  }

  try {
    const response = await axios.put(`/api/special-surveys/${this.currentSurvey.id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    // 更新 currentSurvey 数据
    this.currentSurvey = {
      ...this.currentSurvey,
      excelData: response.data.excelData, // 更新作业要点数据
    };

    // 更新 surveyList 中的数据
    const index = this.surveyList.findIndex(s => s.id === this.currentSurvey.id);
    if (index !== -1) {
      this.$set(this.surveyList, index, {
        ...this.surveyList[index],
        excelData: response.data.excelData, // 更新作业要点数据
      });
    }

    this.$message.success('上传成功');
    this.uploadexcelDialogVisible = false; // 关闭上传对话框
  } catch (error) {
    console.error('上传作业要点失败:', error);
    this.$message.error('上传失败，请重试');
  }
}
,
async uploadTrainingData() {
  const formData = new FormData();
  if (this.uploadtrainingFile) {
    formData.append('trainingRecordData', this.uploadtrainingFile); // 添加上传的文件
  }

  try {
    const response = await axios.put(`/api/special-surveys/${this.currentSurvey.id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    // 更新 currentSurvey 数据
    this.currentSurvey = {
      ...this.currentSurvey,
      trainingRecordData: response.data.trainingRecordData, // 更新培训记录数据
    };

    // 更新 surveyList 中的数据
    const index = this.surveyList.findIndex(s => s.id === this.currentSurvey.id);
    if (index !== -1) {
      this.$set(this.surveyList, index, {
        ...this.surveyList[index],
        trainingRecordData: response.data.trainingRecordData, // 更新培训记录数据
      });
    }

    this.$message.success('上传成功');
    this.uploadtrainingDialogVisible = false; // 关闭上传对话框
  } catch (error) {
    console.error('上传培训记录失败:', error);
    this.$message.error('上传失败，请重试');
  }
}
,
      async uploadSurveyRecord() {
  const formData = new FormData();
  if (this.uploadedFile) {
    formData.append('surveyRecordData', this.uploadedFile);
  }

  try {
    const response = await axios.put(`/api/special-surveys/${this.currentSurvey.id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    // 更新 currentSurvey 数据
    this.currentSurvey = {
      ...this.currentSurvey,
      surveyRecordData: response.data.surveyRecordData,
      surveyRecordFilename: response.data.surveyRecordFilename,
    };

    // 更新 surveyList 中的数据
    const index = this.surveyList.findIndex(s => s.id === this.currentSurvey.id);
    if (index !== -1) {
      this.$set(this.surveyList, index, {
        ...this.surveyList[index],
        surveyRecordData: response.data.surveyRecordData,
        surveyRecordFilename: response.data.surveyRecordFilename,
      });
    }

    this.$message.success('上传成功');
    this.uploadDialogVisible = false;
    this.surveyRecordDialogVisible = true; // 打开预览对话框
  } catch (error) {
    console.error('上传失败:', error);
    this.$message.error('上传失败，请重试');
  }
}

,
  
      handleFileChange(file) {
          this.uploadedFile = file.raw; // 处理文件选择
      },
      handleexcelFileChange(file){
          this.uploadExcelFile = file.raw;
      },
      handletrainingChange(file){
          this.uploadtrainingFile = file.raw;
          console.log('dsadsadc',this.uploadtrainingFile)
      },
      parseExcelData(base64Str) {
        const base64Data = base64Str.replace(/^data:application\/\w+;base64,/, "");

      console.log('解析Base64编码的Excel数据:', base64Str);
      try {
        const binaryStr = atob(base64Str);
        const len = binaryStr.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
          bytes[i] = binaryStr.charCodeAt(i);
        }
        const workbook = XLSX.read(bytes.buffer, { type: 'array' });
        console.log(workbook);


        const firstSheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[firstSheetName];
        // 将数据转换为二维数组（Handsontable 的格式）
        this.surveyRecordData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
         // 解析合并单元格信息
        const mergeCells = sheet['!merges'] || [];
        this.merges = mergeCells.map((merge) => ({
          row: merge.s.r,
          col: merge.s.c,
          rowspan: merge.e.r - merge.s.r + 1,
          colspan: merge.e.c - merge.s.c + 1,
        }));

        console.log('第二种方法表格',this.surveyRecordData)
        console.log('第二种方法',this.merges)

      } catch (error) {
        console.error('解析Excel数据失败:', error);
        this.surveyRecordData = []; // 设置为空数组以避免渲染错误
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

      getStatusText(status) {
        // console.log("当前行数据：", status);
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
  .search-and-create-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.search-form {
  flex: 1;
  margin-right: 20px;
}

.create-button {
  white-space: nowrap; /* 防止按钮文字换行 */
}
.special-survey-management .el-table .el-table__cell {
  white-space: normal; /* 允许换行 */
  word-wrap: break-word; /* 强制长单词换行 */
}

.special-survey-management .el-table .el-table__cell .el-button {
  white-space: normal; /* 允许按钮文本换行 */
  text-align: left; /* 左对齐 */
}


  </style>
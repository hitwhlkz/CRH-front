<template>
  <div>
    <div v-if="originalFileName" class="table-title">
      <h2>{{ originalFileName }}</h2>
    </div>
    <div ref="handsontable" class="handsontable" :style="handsontableStyle"></div>
    <el-button @click="uploadSurveyRecord">上传记录</el-button>
    <el-button type="primary" @click="exportToExcel">导出为Excel</el-button>
  </div>
</template>

<script>
import Handsontable from 'handsontable';
import 'handsontable/dist/handsontable.full.css';
import axios from "../../src/api/axios";
import * as XLSX from 'xlsx';

export default {
  props: {
    data: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      handsontableInstance: null,
      columnWidths: [], // 用于存储列宽信息
      rowHeights: [],    // 用于存储行高信息
      surveyRecordData: [],
      handsontableStyle: {
        width: '100%',
        height: '400px',
        border: '1px solid #ccc',
      },
      merges: [], // 存储合并单元格信息
      originalFileName: '', // 存储原始文件名
    };
  },
  watch: {
    data: {
      immediate: true,
      handler(newValue) {
        console.log('监测到数据变化:', newValue);
        if (newValue && newValue.surveyRecordData) {
          this.originalFileName = newValue.surveyRecordFilename; // 获取原始文件名
          this.parseExcelData(newValue.surveyRecordData);
        }
      },
    },
  },
  mounted() {
    console.log('组件挂载完成，初始化 Handsontable');
    if (this.data.surveyRecordData) {
      this.originalFileName = this.data.surveyRecordFilename; // 获取原始文件名
      this.parseExcelData(this.data.surveyRecordData);
    }
  },
  methods: {
    initializeHandsontable() {
      if (this.handsontableInstance) {
        console.log('销毁旧的 Handsontable 实例');
        this.handsontableInstance.destroy();
      }

      console.log('初始化 Handsontable 实例，数据:', this.surveyRecordData);
      this.handsontableInstance = new Handsontable(this.$refs.handsontable, {
        data: this.surveyRecordData,
        colHeaders: true,
        rowHeaders: true,
        contextMenu: true,
        manualColumnResize: true,
        manualRowResize: true,
        height: 'auto',
        width: '100%',
        colWidths: this.columnWidths, // 应用列宽
        rowHeights: this.rowHeights, // 应用行高
        mergeCells: this.merges, // 应用合并单元格信息
        licenseKey: 'non-commercial-and-evaluation',
      });
      console.log('Handsontable 实例初始化完成');
    },

    parseExcelData(base64Str) {
      console.log('解析Base64编码的Excel数据:', base64Str);
      try {
        const binaryStr = atob(base64Str);
        const len = binaryStr.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
          bytes[i] = binaryStr.charCodeAt(i);
        }
        const workbook = XLSX.read(bytes.buffer, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[firstSheetName];
        this.surveyRecordData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

        // 解析列宽和行高
        this.columnWidths = sheet['!cols'] ? sheet['!cols'].map(col => col && col.wpx || null) : [];
        this.rowHeights = sheet['!rows'] ? sheet['!rows'].map(row => row && row.hpx || null) : [];

        console.log('行高列宽数据，',this.columnWidths,this.rowHeights)

        // 解析合并单元格信息
        const mergeCells = sheet['!merges'] || [];
        this.merges = mergeCells.map((merge) => ({
          row: merge.s.r,
          col: merge.s.c,
          rowspan: merge.e.r - merge.s.r + 1,
          colspan: merge.e.c - merge.s.c + 1,
        }));

        this.initializeHandsontable();
      } catch (error) {
        console.error('解析Excel数据失败:', error);
        this.surveyRecordData = []; // 设置为空数组以避免渲染错误
      }
    },

    async uploadSurveyRecord() {
      const formData = new FormData();
      const surveyId = this.data.id; // 获取 survey 的 ID
      const updatedData = this.handsontableInstance.getData(); // 获取修改后的数据

      // 将数据转换为工作表
      const worksheet = XLSX.utils.aoa_to_sheet(updatedData);

      // 设置合并单元格
      const mergeArray = this.merges.map(merge => {
        return {
          s: { r: merge.row, c: merge.col },
          e: { r: merge.row + (merge.rowspan - 1), c: merge.col + (merge.colspan - 1) }
        };
      });
      worksheet['!merges'] = mergeArray;

      // 创建工作簿并添加工作表
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

      // 生成 Excel 文件
      const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
      
      // 将文件名添加到 formData
      formData.append('surveyRecordData', blob, this.originalFileName);

      console.log('准备上传的数据:');
      for (let [key, value] of formData.entries()) {
        console.log(key, value);
      }

      try {
        const response = await axios.put(`/api/special-surveys/${surveyId}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        console.log('上传普查记录成功，响应数据:', response.data);
        this.$message.success('上传成功');
        this.parseExcelData(response.data.surveyRecordData); // 使用后端返回的数据解析 Excel
        await this.fetchSurveyData(); // 确保这个方法能获取最新数据并更新 UI
      } catch (error) {
        console.error('上传普查记录失败:', error);
        this.$message.error('上传失败，请重试');
      }
    },

    exportToExcel() {
      const updatedData = this.handsontableInstance.getData(); // 获取当前表格数据
      const worksheet = XLSX.utils.aoa_to_sheet(updatedData); // 将数据转换为工作表
      const workbook = XLSX.utils.book_new(); // 创建工作簿
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1'); // 添加工作表

      // 生成 Excel 文件
      const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = this.originalFileName || 'survey_record.xlsx'; // 设置下载文件名
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url); // 释放 URL 对象
    },

    async fetchSurveyData() {
      const surveyId = this.data.id; // 获取 survey 的 ID
      try {
        const response = await axios.get(`/api/special-surveys/${surveyId}`);
        console.log('获取到的调查数据:', response.data);
        this.surveyRecordData = response.data.surveyRecordData; // 假设响应中包含最新的 surveyRecordData
        this.initializeHandsontable(); // 重新初始化 Handsontable
      } catch (error) {
        console.error('获取普查数据失败:', error);
      }
    },
  },
};
</script>

<style scoped>
.handsontable {
  border: 1px solid #ccc; /* 恢复边框 */
  font-family: Arial, sans-serif; /* 恢复字体 */
}
.table-title {
  margin-bottom: 10px; /* 添加一些底部间距 */
}
</style>

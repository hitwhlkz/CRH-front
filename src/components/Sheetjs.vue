<template>
  <div>
    <div v-if="originalFileName" class="table-title">
      <h2>{{ originalFileName }}</h2>
    </div>
    <table class="excel-table">
      <thead>
        <tr>
          <th
            v-for="(header, index) in tableData[0]"
            :key="'header-' + index"
            :colspan="getCellSpan(0, index, 'colspan')"
            :rowspan="getCellSpan(0, index, 'rowspan')"
            v-if="!isMergedCell(0, index) || getCellSpan(0, index, 'colspan') > 1 || getCellSpan(0, index, 'rowspan') > 1"
          >
            {{ header }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row, rowIndex) in tableData.slice(1)" :key="'row-' + rowIndex">
          <td
            v-for="(cell, colIndex) in row"
            :key="'cell-' + rowIndex + '-' + colIndex"
            :colspan="getCellSpan(rowIndex + 1, colIndex, 'colspan')"
            :rowspan="getCellSpan(rowIndex + 1, colIndex, 'rowspan')"
            v-if="!isMergedCell(rowIndex + 1, colIndex) || getCellSpan(rowIndex + 1, colIndex, 'rowspan') > 1 || getCellSpan(rowIndex + 1, colIndex, 'colspan') > 1"
          >
            <!-- 如果是“检查日期”列，渲染日期选择框 -->
            <template v-if="isCheckDateColumn(colIndex)">
              <el-date-picker
                v-model="tableData[rowIndex + 1][colIndex]"
                type="date"
                placeholder="选择日期"
                :disabled-date="disableFutureDates"
                size="mini"
                class="check-date-picker"
              ></el-date-picker>
            </template>
            <!-- 如果是“检查结果”列，渲染下拉框 -->
            <template v-else-if="isCheckResultColumn(colIndex)">
              <el-select
                v-model="tableData[rowIndex + 1][colIndex]"
                placeholder="请选择"
                size="mini"
                class="check-result-select"
              >
                <el-option label="√" value="√"></el-option>
                <el-option label="×" value="×"></el-option>
              </el-select>
            </template>
            <!-- 其他列正常渲染 -->
            <template v-else-if="!isReadOnly(colIndex)">
              <input
                v-model="tableData[rowIndex + 1][colIndex]"
                class="table-cell"
              />
            </template>
            <template v-else>
              {{ tableData[rowIndex + 1][colIndex] }}
            </template>
          </td>
        </tr>
      </tbody>
    </table>
    <el-button @click="uploadSurveyRecord">上传记录</el-button>
    <el-button type="primary" @click="exportToExcel">导出为Excel</el-button>
  </div>
</template>


<script>
import axios from "../../src/api/axios";
import * as XLSX from "xlsx";

export default {
  props: {
    data: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      tableData: [[]], // 表格数据
      merges: [], // 合并单元格信息
      originalFileName: "", // 原始文件名
      readOnlyColumns: [0, 1], // 第一列和第二列是只读列
    };
  },
  watch: {
    data: {
      immediate: true,
      handler(newValue) {
        if (newValue && newValue.surveyRecordData) {
          this.originalFileName = newValue.surveyRecordFilename; // 更新文件名
          this.parseExcelData(newValue.surveyRecordData); // 解析 Base64 数据
        }
      },
    },
  },
  methods: {
    parseExcelData(base64Str) {
  console.log("解析Base64编码的Excel数据:", base64Str);
  try {
    const binaryStr = atob(base64Str);
    const len = binaryStr.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryStr.charCodeAt(i);
    }
    const workbook = XLSX.read(bytes.buffer, { type: "array" });
    const firstSheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[firstSheetName];

    // 获取表格范围
    const range = XLSX.utils.decode_range(sheet["!ref"]);
    const rowCount = range.e.r + 1; // 总行数
    const colCount = range.e.c + 1; // 总列数

    // 将数据解析为二维数组，包括空白单元格
    const tableData = Array.from({ length: rowCount }, () =>
      Array.from({ length: colCount }, () => "")
    );
    Object.keys(sheet).forEach((key) => {
      if (key.startsWith("!")) return; // 忽略 "!ref" 和 "!merges" 等特殊属性
      const { r, c } = XLSX.utils.decode_cell(key);
      tableData[r][c] = sheet[key].v || ""; // 如果单元格为空，用空字符串填充
    });
    
    this.tableData = tableData;
    
    console.log("Excel 合并单元格原始数据:", sheet["!merges"]);
    // 提取合并单元格信息
    const mergeCells = sheet["!merges"] || [];
    this.merges = mergeCells.map((merge) => ({
      row: merge.s.r,
      col: merge.s.c,
      rowspan: merge.e.r - merge.s.r + 1,
      colspan: merge.e.c - merge.s.c + 1,
    }));

    console.log("表格数据解析完成:", this.tableData);
    console.log("合并单元格信息:", this.merges);
  } catch (error) {
    console.error("解析Excel数据失败:", error);
    this.tableData = [[]]; // 出错时置空数据
  }
},
isCheckResultColumn(colIndex) {
    // 假设表头的第一行是列名
    const header = this.tableData[0][colIndex];
    return header === '检查结果';
  },
    isReadOnly(colIndex) {
      return this.readOnlyColumns.includes(colIndex);
    },
    getCellSpan(row, col, type) {
  const merge = this.merges.find((m) => m.row === row && m.col === col);
  return merge ? merge[type] : 1; // 只有起始单元格有合并信息
},
 // 判断当前列是否为“检查日期”列
 isCheckDateColumn(colIndex) {
    // 假设表头的第一行是列名
    const header = this.tableData[0][colIndex];
    return header === '日期';
  },

  // 禁用未来日期
  disableFutureDates(date) {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // 设置时间为当天 00:00:00
    return date > today; // 禁用未来日期
  },

isMergedCell(row, col) {
  const isMerged = this.merges.some((m) => {
    const inRowRange = row >= m.row && row < m.row + m.rowspan;
    const inColRange = col >= m.col && col < m.col + m.colspan;

    console.log(
      `检查单元格 [${row}, ${col}] 是否在合并范围: 起始[${m.row}, ${m.col}], rowspan=${m.rowspan}, colspan=${m.colspan}, 行(${inRowRange}), 列(${inColRange})`
    );
    return inRowRange && inColRange;
  });
  return isMerged;
},



    async uploadSurveyRecord() {
      const surveyId = this.data.id; // 获取 survey ID
      const tableDataWithCorrectDates = this.tableData.map(row => {
    return row.map(cell => {
      if (cell instanceof Date) {
        return cell.toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' });
      }
      return cell;
    });
  });
      const worksheet = XLSX.utils.aoa_to_sheet(tableDataWithCorrectDates);

      // 设置合并单元格
      const mergeArray = this.merges.map((merge) => ({
        s: { r: merge.row, c: merge.col },
        e: {
          r: merge.row + (merge.rowspan - 1),
          c: merge.col + (merge.colspan - 1),
        },
      }));
      worksheet["!merges"] = mergeArray;

      // 创建工作簿
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

      // 转换为 Blob
      const excelBuffer = XLSX.write(workbook, {
        bookType: "xlsx",
        type: "array",
      });
      const blob = new Blob([excelBuffer], { type: "application/octet-stream" });

      const formData = new FormData();
      formData.append("surveyRecordData", blob, this.originalFileName);

      try {
        const response = await axios.put(
          `/api/special-surveys/${surveyId}`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
        console.log("上传成功:", response.data);
        // 更新组件内部状态
        this.currentSurvey = {
  ...this.data, // 保留父组件传递的所有字段
  id: surveyId, // 更新 id
  changkeStatus: this.data.changkeStatus, // 更新 changkeStatus
  surveyRecordData: response.data.surveyRecordData, // 更新 Excel 数据
  surveyRecordFilename: response.data.surveyRecordFilename, // 更新文件名
  name: this.data.name, // 确保普查名称存在
  status: this.data.status, // 确保状态存在
  createdAt: this.data.createdAt, // 确保创建时间存在
  documentData: this.data.documentData, // 确保文档数据存在
  erjiStatus: this.data.erjiStatus, // 确保二级状态存在
  excelData: this.data.excelData, // 确保 Excel 数据存在
  manager: this.data.manager, // 确保负责人存在
  trainingRecordData: this.data.trainingRecordData, // 确保培训记录数据存在
  zhijianStatus: this.data.zhijianStatus, // 确保质检状态存在
};
    // 通知父组件更新数据
    this.$emit('upload-success', this.currentSurvey);
    console.log('事件已触发');
    this.$message.success('上传成功');
    this.uploadDialogVisible = false;
        this.$message.success("上传成功");
      } catch (error) {
        console.error("上传失败:", error);
        this.$message.error("上传失败，请重试");
      }
    },
    exportToExcel() {
      const worksheet = XLSX.utils.aoa_to_sheet(this.tableData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

      const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
      const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = this.originalFileName || "export.xlsx";
      a.click();
      URL.revokeObjectURL(url);
    },
  },
};

</script>

<style scoped>
.excel-table {
  border-collapse: collapse;
  width: 100%;
  table-layout: fixed;
  
}
.excel-table th,
.excel-table td {
  border: 1px solid #ccc;
  text-align: left;
  padding: 8px;
  vertical-align: top; /* 确保内容从顶部开始显示 */
  word-wrap: break-word; /* 强制内容换行 */
  white-space: normal; /* 允许换行 */
  word-wrap: break-word; /* 允许长单词换行 */
  white-space: normal;   /* 允许换行 */
  overflow: visible;     /* 让内容溢出时仍然可见 */
}
.table-cell {
  border: none;
  padding: 4px;
  width: 100%;
  height: auto; /* 让输入框自适应高度 */
  min-height: 30px; /* 设置最小高度 */
  overflow: visible; /* 显示溢出的文本 */
  white-space: normal; /* 允许换行 */
}
.excel-table {
  border-collapse: collapse;
  width: 100%;
  table-layout: fixed;
}

.excel-table th,
.excel-table td {
  border: 1px solid #ccc;
  text-align: left;
  padding: 8px;
  vertical-align: top;
  word-wrap: break-word;
  white-space: normal;
  overflow: visible;
}

.table-cell {
  border: none;
  padding: 4px;
  width: 100%;
  height: auto;
  min-height: 30px;
  overflow: visible;
  white-space: normal;
}

/* 下拉框样式 */
.check-result-select {
  width: 100%;
}

.check-result-select .el-input__inner {
  padding: 0 4px; /* 调整内边距 */
  height: 30px; /* 调整高度 */
  line-height: 30px; /* 调整行高 */
}
.excel-table {
  border-collapse: collapse;
  width: 100%;
  table-layout: fixed;
}

.excel-table th,
.excel-table td {
  border: 1px solid #ccc;
  text-align: left;
  padding: 8px;
  vertical-align: top;
  word-wrap: break-word;
  white-space: normal;
  overflow: visible;
}

.table-cell {
  border: none;
  padding: 4px;
  width: 100%;
  height: auto;
  min-height: 30px;
  overflow: visible;
  white-space: normal;
}

/* 下拉框样式 */
.check-result-select {
  width: 100%;
}

.check-result-select .el-input__inner {
  padding: 0 4px; /* 调整内边距 */
  height: 30px; /* 调整高度 */
  line-height: 30px; /* 调整行高 */
}

/* 日期选择框样式 */
.check-date-picker {
  width: 100%;
}

.check-date-picker .el-input__inner {
  padding: 0 4px; /* 调整内边距 */
  height: 30px; /* 调整高度 */
  line-height: 30px; /* 调整行高 */
}
</style>

<template>
    <div>
      <input type="file" ref="fileInput" accept=".xlsx, .xls" />
      <button @click="loadData">加载数据</button>
      <button @click="exportData">导出数据</button>
      <div ref="spreadsheet" style="height: 400px; width: 100%; border: 1px solid #ccc;"></div>
    </div>
  </template>
  
  <script>
  import xDataSpreadsheet from 'x-data-spreadsheet';
  import * as XLSX from 'xlsx'; // 引入 XLSX 库
  
  export default {
    name: 'Spreadsheet',
    mounted() {
      this.initSpreadsheet();
    },
    beforeDestroy() {
      // 在组件销毁时清理
      if (this.spreadsheet) {
        this.spreadsheet.destroy();
      }
    },
    methods: {
      initSpreadsheet() {
        this.spreadsheet = xDataSpreadsheet(this.$refs.spreadsheet, {
          showBottomBar: true,
        });
      },
      loadData() {
        const fileInput = this.$refs.fileInput;
  
        if (fileInput.files.length === 0) {
          alert("请先选择文件。");
          return;
        }
  
        const file = fileInput.files[0];
        const reader = new FileReader();
        
        reader.onload = (e) => {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: 'array' });
          const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
          const jsonData = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });
  
          // 加载数据到 x-data-spreadsheet
          this.spreadsheet.loadData(jsonData);
        };
  
        reader.readAsArrayBuffer(file);
      },
      exportData() {
        const data = this.spreadsheet.getData();
        const worksheet = XLSX.utils.aoa_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
  
        // 导出文件
        XLSX.writeFile(workbook, '导出数据.xlsx');
      },
    },
  };
  </script>
  
  <style>
  /* 你可以在这里添加样式 */
  </style>
  
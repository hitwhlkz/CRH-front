<template>
    <div class="aum-management">
      <!-- <el-upload ref="upload"action="" :before-upload="beforeUpload"  :show-file-list="false" :auto-upload="false"  :on-change="handleFileChange"  accept=".xlsx, .xls">
        <el-button size="small" type="warning" icon="el-icon-star-on">导入</el-button>
      </el-upload>
      <br><br> -->
      <!-- 搜索表单 -->
      <el-form :inline="true" :model="pageparm" class="user-search" ref="searchForm">
        <el-form-item label="车号：" prop="carNumber">
          <el-input size="small" v-model="pageparm.carNumber" placeholder="请输入完整车号" >
          </el-input>
        </el-form-item>
        <el-form-item label="车厢号：" prop="carBodyNumber">
          <el-input size="small" v-model="pageparm.carBodyNumber" placeholder="请输入车厢编号"></el-input>
        </el-form-item>
        <el-form-item label="部件名称：" prop="part">
          <el-input size="small" v-model="pageparm.part" placeholder="请输入部件具体名称"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button size="small" type="primary" icon="el-icon-search" @click="fetchItems()">搜索</el-button>
          <el-button size="small" type="success" icon="el-icon-plus" @click="addItem()">添加</el-button>
          <el-button size="small" type="warning" icon="el-icon-refresh-right" @click="resetForm('searchForm')">重置</el-button>
          <el-button size="small" type="info" icon="el-icon-download" @click="exportToExcel">导出</el-button>
        </el-form-item>
      </el-form>
  
      <!-- 数据表格 -->
      <el-table :data="items" style="width: 100%;overflow-y:auto;" border :cell-style="getRowClassName">
        <el-table-column prop="displayId" label="ID" min-width="80" max-width="100%">
        </el-table-column>
        <el-table-column prop="carNumber" label="车号" min-width="120" max-width="100%">
        </el-table-column>
        <el-table-column prop="carBodyNumber" label="车厢号" min-width="80" max-width="100%">
        </el-table-column>
        <el-table-column prop="part" label="部件名称" min-width="120" max-width="100%">
        </el-table-column>
        <!-- <el-table-column prop="currenTime" label="当前日期" min-width="120" max-width="100%">
        </el-table-column> -->
        <el-table-column prop="beginTime" label="更换日期" min-width="120" max-width="100%">
        </el-table-column>
        <el-table-column prop="becomeTime" label="到期日期" min-width="120" max-width="100%">
        </el-table-column>
        <el-table-column prop="note" label="备注" min-width="150" max-width="100%">
        </el-table-column>
        <el-table-column label="操作" min-width="120" max-width="100%">
          <template slot-scope="scope">
            <el-button type="text" @click="editItem(scope.row)">编辑</el-button>
            <el-button type="text" @click="deleteItem(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
  
      <!-- 新建部件对话框 -->
      <el-dialog title="新建部件" :visible.sync="dialogVisible" width="50%">
        <el-form :model="newItem" label-width="120px">
          <el-form-item label="车号" required>
            <el-input v-model="newItem.carNumber" placeholder="请输入车号"></el-input>
          </el-form-item>
          <el-form-item label="车厢号" required>
            <el-input v-model="newItem.carBodyNumber" placeholder="请输入车厢号"></el-input>
          </el-form-item>
          <el-form-item label="部件名称" required>
            <el-input v-model="newItem.part" placeholder="请输入部件名称"></el-input>
          </el-form-item>
          <!-- <el-form-item label="当前日期" required>
            <el-date-picker v-model="newItem.currenTime" type="date" placeholder="选择日期" disabled></el-date-picker>
          </el-form-item> -->
          <el-form-item label="更换日期" required>
            <el-date-picker v-model="newItem.beginTime" type="date" placeholder="选择日期"></el-date-picker>
          </el-form-item>
          <el-form-item label="到期日期" required>
            <el-date-picker v-model="newItem.becomeTime" type="date" placeholder="选择日期"></el-date-picker>
          </el-form-item>
          <el-form-item label="备注">
            <el-input v-model="newItem.note" placeholder="请输入备注"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="submitNewItem">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  import { baseURL } from '../../../api/base';
  import _ from 'lodash';
 import * as XLSX from 'xlsx';
  
  export default {
    name: 'Aumanage',
    data() {
      return {
        items: [],
        dialogVisible: false,
        newItem: {
          carNumber: '',
          carBodyNumber: '',
          part: '',
          currenTime: '',
          becomeTime: '',
          note: '',
          beginTime:''
        },
        pageparm: {
          carNumber: '',
          carBodyNumber: '',
          part: ''
        },
        isEditing: false
      };
    },
    created() {
      this.fetchItems();
    },
    methods: {
      // 获取数据列表方法
      async fetchItems() {
        let queryParams = '';
        if (this.pageparm.carNumber) {
          queryParams += `?carNumber=${this.pageparm.carNumber}`;
        }
        if (this.pageparm.carBodyNumber) {
          queryParams += queryParams? `&carBodyNumber=${this.pageparm.carBodyNumber}` : `?carBodyNumber=${this.pageparm.carBodyNumber}`;
        }
        if (this.pageparm.part) {
          queryParams += queryParams? `&part=${this.pageparm.part}` : `?part=${this.pageparm.part}`;
        }
        try {
          const response = await axios.get(`${baseURL}/aumanage/search${queryParams}`);
          if (response.data.length === 0) {
            this.$message.info('未找到符合条件的部件，请更换搜索条件重新尝试');
          }
          const processedItems = response.data.map((item, index) => {
            const currenTime = new Date(item.currenTime);
            const becomeTime = new Date(item.becomeTime);
            const beginTime = new Date(item.beginTime)
            const timeDiff = becomeTime - currenTime;
            const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
            let colorClass = '';
            if (daysDiff < 10 || currenTime > becomeTime) {
              colorClass = 'red-row';
            } else if (daysDiff < 15 && daysDiff >= 10) {
              colorClass = 'yellow-row';
            }
            return {
             ...item,
              timeDiffDays: daysDiff,
              colorClass
            };
          }).reverse();
          this.items = processedItems.map((item, index) => {
            return {
             ...item,
              displayId: index + 1
            };
          });
        } catch (error) {
          console.error('获取部件数据失败:', error);
        }
      },
      // 格式化日期为 yyyy-MM-dd HH:mm:ss（可按需调整）
      formatDate(date) {
        if (!date) return '';
        const d = new Date(date);
        const year = d.getFullYear();
        const month = (d.getMonth() + 1).toString().padStart(2, '0');
        const day = d.getDate().toString().padStart(2, '0');
        const hours = d.getHours().toString().padStart(2, '0');
        const minutes = d.getMinutes().toString().padStart(2, '0');
        const seconds = d.getSeconds().toString().padStart(2, '0');
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
      },
      beforeUpload(file) {
    const isExcel = file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || 
                    file.type === 'application/vnd.ms-excel';
    if (!isExcel) {
      this.$message.error('只能上传 Excel 文件！');
    }
    return isExcel;  // 如果是 Excel 格式的文件，返回 true，否则返回 false
  },
  handleFileChange(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = e.target.result;
      const workbook = XLSX.read(data, { type: 'binary' });

      // 获取第一个工作表的名称
      const sheetNames = workbook.SheetNames;
      const worksheet = workbook.Sheets[sheetNames[0]];

      // 将工作表的数据转换成 JSON 格式
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      // 解析数据并导入到表格
      this.importData(jsonData);
    };
    reader.readAsBinaryString(file.raw);
  },
      addItem() {
        const currentDate = new Date();
        this.newItem = {
          carNumber: '',
          carBodyNumber: '',
          part: '',
          currenTime: this.formatDate(currentDate),
          becomeTime: '',
          note: '',
          beginTime:''
        };
        this.isEditing = false;
        this.dialogVisible = true;
      },
      async submitNewItem() {
        try {
          if (this.isEditing) {
            await axios.put(`${baseURL}/aumanage`, {
        ...this.newItem,
        currenTime: this.formatDate(this.newItem.currenTime),
        becomeTime: this.formatDate(this.newItem.becomeTime),
        beginTimeTime: this.formatDate(this.newItem.currenTime),  // 格式化日期
      });
            this.$message.success('更新部件成功');
          } else {
            this.newItem.beginTime = this.formatDate(this.newItem.beginTime);
            this.newItem.becomeTime = this.formatDate(this.newItem.becomeTime);
            await axios.post(`${baseURL}/aumanage`, this.newItem);
            this.$message.success('新建部件成功');
          }
          this.dialogVisible = false;
          this.fetchItems();
        } catch (error) {
          console.error('操作失败:', error);
          this.$message.error('操作失败，请重试');
        }
      },
      editItem(item) {
  this.newItem = {
    ...item,   // 保证把所有字段都赋值到 newItem
    //currenTime: new Date(item.currenTime)   // 如果 currenTime 是字符串，确保转换为日期对象
  };
  console.log(this.newItem)
  this.isEditing = true;
  this.dialogVisible = true;
},
      resetForm(formName) {
        if (formName ==='searchForm') {
          this.pageparm = {
            carNumber: '',
            carBodyNumber: '',
            part: ''
          };
        }
        this.$refs[formName].resetFields();
      },
      getRowClassName({ row }) {
        if (row.colorClass == 'red-row') {
          return { 'background': 'rgb(236, 207, 203)', 'padding': '3px' }
        } else if (row.colorClass == 'yellow-row') {
          return { 'background-color': 'rgba(255, 255, 0, 0.2)', 'padding': '3px' }
        }
      },
      async deleteItem(id) {
        try {
          await axios.delete(`${baseURL}/aumanage/${id}`);
          this.$message.success('删除成功');
          this.fetchItems();
        } catch (error) {
          console.error('删除部件失败:', error);
          this.$message.error('删除部件失败，请重试');
        }
      },
      // 对车号输入框输入内容进行简单验证（可根据实际需求调整正则等逻辑）
      // validateCarNumber() {
      //   const carNumberReg = /^[a-zA-Z0-9]+$/;
      //   if (this.pageparm.carNumber &&!carNumberReg.test(this.pageparm.carNumber)) {
      //     this.$message.warning('车号只能包含字母和数字，请重新输入');
      //     this.pageparm.carNumber = this.pageparm.carNumber.slice(0, -1);
      //   }
      // },
      // 导出数据到Excel的方法
      exportToExcel() {
      // 准备要导出的数据，从已有的 this.items 中提取需要的字段
      const exportData = this.items.map(item => {
        return {
          车号: item.carNumber,
          车厢号: item.carBodyNumber,
          部件名称: item.part,
          交修日期: item.beginTime,
          到期日期: item.becomeTime,
          备注: item.note
        };
      });

      // 创建一个新的工作簿对象
      const workbook = XLSX.utils.book_new();

      // 创建工作表
      const worksheet = XLSX.utils.json_to_sheet(exportData, {
        header: ['车号', '车厢号', '部件名称', '交修日期', '到期日期', '备注'], // 自定义表头
        skipHeader: false // 设置为 false 以显示表头
      });

      // 设置表头样式（淡灰色背景，居中，加粗）
      const headerCellStyle = {
        font: { bold: true, sz: 12 }, // 字体加粗，大小为 12
        alignment: { horizontal: 'center', vertical: 'center' }, // 居中对齐
        fill: { fgColor: { rgb: "D3D3D3" } } // 背景色淡灰色
      };

      // 设置列宽
      const colWidths = ['车号', '车厢号', '部件名称', '交修日期', '到期日期', '备注'].map(col => {
        let maxLength = Math.max(...exportData.map(item => item[col]?.length || 0));
        return { wch: maxLength + 2 }; // 为了避免内容被截断，稍微加宽
      });
      worksheet['!cols'] = colWidths;

      // 给每个单元格添加黑色边框
      const cellBorder = {
        top: { style: 'thin', color: { rgb: "000000" } },
        right: { style: 'thin', color: { rgb: "000000" } },
        bottom: { style: 'thin', color: { rgb: "000000" } },
        left: { style: 'thin', color: { rgb: "000000" } }
      };

      // 遍历并设置表头单元格样式
      Object.keys(worksheet).forEach((key) => {
        const cell = worksheet[key];
        if (key.charAt(1) === '1') { // 判断是否为表头
          cell.s = headerCellStyle;
        }
        // 给所有单元格添加边框
        if (cell.v) { // 只有包含值的单元格才应用样式
          if (!cell.s) {
            cell.s = {}; // 初始化样式
          }
          cell.s.border = cellBorder; // 添加边框
        }
      });

      // 将工作表添加到工作簿
      XLSX.utils.book_append_sheet(workbook, worksheet, '部件管理数据');

      // 生成Excel文件并下载，触发浏览器下载行为
      XLSX.writeFile(workbook, '部件管理数据.xlsx');
    }

    }
  };
  </script>
  
  <style scoped>
  .aum-management {
    padding: 20px;
  }
  </style>
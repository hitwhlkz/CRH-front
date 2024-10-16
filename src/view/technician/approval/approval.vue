<template>
  <div class="approval-container">
    <h2 class="title">审批管理</h2>
    <div class="approval-list">
      <el-table :data="approvalList" style="width: 100%">
        <el-table-column prop="id" label="审批ID" width="100"></el-table-column>
        <el-table-column prop="type" label="审批类型" width="120"></el-table-column>
        <el-table-column prop="applicant" label="申请人" width="120"></el-table-column>
        <el-table-column prop="content" label="审批内容"></el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="scope">
            <el-tag :type="getStatusType(scope.row.status)">{{ scope.row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template #default="scope">
            <el-button size="small" @click="openDialog(scope.row)" :disabled="scope.row.status !== '待审批'">通过</el-button>
            <el-button size="small" type="danger" @click="handleReject(scope.row)" :disabled="scope.row.status !== '待审批'">拒绝</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog
      title="审批确认"
      :visible.sync="dialogVisible"
      width="50%"
    >
      <el-form :model="currentApproval" label-width="100px">
        <el-form-item label="审批ID">
          <el-input v-model="currentApproval.id" disabled></el-input>
        </el-form-item>
        <el-form-item label="审批类型">
          <el-input v-model="currentApproval.type" disabled></el-input>
        </el-form-item>
        <el-form-item label="申请人">
          <el-input v-model="currentApproval.applicant" disabled></el-input>
        </el-form-item>
        <el-form-item label="审批内容">
          <el-input v-model="currentApproval.content" disabled></el-input>
        </el-form-item>
        <el-form-item label="签字">
          <el-input v-model="signature" placeholder="请输入您的名字"></el-input>
        </el-form-item>
        <el-form-item label="审批时间">
          <el-input v-model="approvalTime" disabled></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="confirmApproval">确认通过并导出</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import * as XLSX from 'xlsx';

export default {
  name: 'ApprovalManagement',
  data() {
    return {
      approvalList: [
        { id: 1, type: '请假', applicant: '张三', content: '病假两天', status: '待审批' },
        { id: 2, type: '报销', applicant: '李四', content: '出差费用报销', status: '待审批' },
        { id: 3, type: '加班', applicant: '王五', content: '周末加班4小时', status: '已通过' },
        { id: 4, type: '调休', applicant: '赵六', content: '调休一天', status: '已拒绝' },
      ],
      dialogVisible: false,
      currentApproval: {},
      signature: '',
      approvalTime: ''
    }
  },
  methods: {
    getStatusType(status) {
      switch (status) {
        case '待审批':
          return 'warning'
        case '已通过':
          return 'success'
        case '已拒绝':
          return 'danger'
        default:
          return 'info'
      }
    },
    openDialog(row) {
      this.currentApproval = { ...row };
      this.signature = '';
      this.approvalTime = new Date().toLocaleString();
      this.dialogVisible = true;
    },
    handleReject(row) {
      console.log('拒绝审批', row);
      this.$message.warning(`已拒绝 ${row.applicant} 的${row.type}申请`);
      row.status = '已拒绝';
    },
    confirmApproval() {
      if (!this.signature) {
        this.$message.warning('请输入您的签字');
        return;
      }

      const approvedItem = this.approvalList.find(item => item.id === this.currentApproval.id);
      if (approvedItem) {
        approvedItem.status = '已通过';
        this.$message.success(`已通过 ${approvedItem.applicant} 的${approvedItem.type}申请`);
        this.exportToExcel(approvedItem);
      }

      this.dialogVisible = false;
    },
    exportToExcel(item) {
      try {
        // 创建工作表
        const ws = XLSX.utils.aoa_to_sheet([
          ['审批表'],
          [],
          ['审批ID', item.id],
          ['审批类型', item.type],
          ['申请人', item.applicant],
          ['审批内容', item.content],
          ['审批状态', item.status],
          ['审批人签字', this.signature],
          ['审批时间', this.approvalTime],
        ]);

        // 设置单元格合并
        ws['!merges'] = [
          { s: { r: 0, c: 0 }, e: { r: 0, c: 1 } }, // 合并标题单元格
        ];

        // 设置列宽
        ws['!cols'] = [
          { wch: 15 }, // A列宽度
          { wch: 30 }, // B列宽度
        ];

        // 设置单元格样式
        for (let i = 0; i < 9; i++) {
          const cellRef = XLSX.utils.encode_cell({ r: i, c: 0 });
          if (!ws[cellRef]) continue;
          ws[cellRef].s = { 
            font: { bold: true },
            alignment: { vertical: 'center', horizontal: 'center' },
            border: {
              top: { style: 'thin' },
              bottom: { style: 'thin' },
              left: { style: 'thin' },
              right: { style: 'thin' }
            }
          };
        }

        // 设置标题样式
        const titleCell = ws['A1'];
        titleCell.s = {
          font: { bold: true, sz: 16 },
          alignment: { vertical: 'center', horizontal: 'center' }
        };

        // 创建工作簿并添加工作表
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "审批详情");

        // 生成Excel文件并触发下载
        const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });
        const blob = new Blob([s2ab(wbout)], { type: "application/octet-stream" });
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `审批表_${item.id}.xlsx`;
        link.click();

        console.log('Excel file generated and download triggered');
      } catch (error) {
        console.error('Error generating Excel:', error);
        this.$message.error('生成Excel文件时出错，请稍后重试');
      }
    }
  }
}

// 辅助函数：将字符串转换为ArrayBuffer
function s2ab(s) {
  const buf = new ArrayBuffer(s.length);
  const view = new Uint8Array(buf);
  for (let i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xFF;
  return buf;
}
</script>

<style scoped>
.approval-container {
  padding: 20px;
}
.title {
  font-size: 24px;
  margin-bottom: 20px;
}
.approval-list {
  background-color: #fff;
  padding: 20px;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}
</style>


// 文件下载函数
import axios from "axios";

function downloadFile(fileUrl, fileName) {
  // 发送 GET 请求下载文件
  axios({
    method: 'get',
    url: fileUrl,
    responseType: 'blob', // 响应类型为二进制流
  })
    .then(response => {
      // 创建一个 Blob 对象，并设置 MIME 类型
      const blob = new Blob([response.data], { type: response.headers['content-type'] });

      // 创建一个下载链接
      const downloadLink = document.createElement('a');
      downloadLink.href = window.URL.createObjectURL(blob);
      downloadLink.download = fileName;

      // 触发点击事件以开始下载
      downloadLink.click();
    })
    .catch(error => {
      console.error('文件下载失败', error);
      // 处理下载失败的逻辑
      this.$message.error('文件下载失败', error)
    });
}

export {downloadFile}

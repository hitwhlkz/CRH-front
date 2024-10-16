/**
* 分页组件
*/ 
<template>
  <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" background
    :current-page.sync="childMsg.pageNo" :page-sizes="[10000]" :page-size="childMsg.pageSize"
    layout="total,sizes, prev, pager, next" :total="total">
  </el-pagination>
</template>
<script>
export default {
  name: 'Pagination',
  props: ['childMsg', 'total'],
  data() {
    return {
      pageparm: {
        pageNo: this.childMsg.pageNo,
        pageSize: this.childMsg.pageSize,
        total: this.childMsg.total
      }
    }
  },
  created() {
  },
  methods: {
    handleSizeChange(val) {
      /**
       * 子传父
       * 参数1 父元素方法
       * 参数2 数据
       */
      console.log('scroll')
      this.pageparm.pageSize = val
      document.querySelector('.el-main').scrollTo(0,0)
      this.$emit('callFather', this.pageparm)
    },
    handleCurrentChange(val) {
      /**
       * 子传父
       * 参数1 父元素方法
       * 参数2 数据
       */
       document.querySelector('.el-main').scrollTo(0,0)
      this.pageparm.pageNo = val
      this.$emit('callFather', this.pageparm)
    }
  }
}
</script>

<style>
.page-box {
  margin: 10px auto;
}
</style>

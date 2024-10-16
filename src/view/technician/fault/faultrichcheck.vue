<template>
    <div>
        <el-page-header @back="goBack" content="详情页面">
        </el-page-header>
        <br>
        <div v-if="isShow" v-html="msg" class="ql-editor"></div>
        <div v-else><el-empty :image-size="300" description="暂无内容"></el-empty></div>
    </div>
</template>
  
<script>

import axios from 'axios'
import { baseURL } from '../../../api/base'

export default {
    name: "rickcheck",
    data() {
        return {
            baseURL,
            msg: '',
            isShow: false,
            id: 0,
        }
    },
    created() {
        this.id = this.$route.query.id
        console.log(this.id)
        this.getRich()
    },
    methods: {
        goBack() {
            this.$router.back(-1)
        },
        getRich() {
            axios({
                method: 'post',
                url: baseURL + '/fault/screenfault',
                data: {
                    pageNo: 1,
                    pageSize: 100000,
                    id: this.id
                }
            }).then(res => {
                let rich = res.data.data.list[0].rich
                if(rich) {
                    this.isShow = true
                    this.msg = rich
                }
                this.$message.success('搜索成功')
            }).catch(err => {
                this.initPage()
                this.getFault()
                this.$message.error('搜索失败')
                console.log(err)
            })
        }
    },
    watch: {
    },
};
</script>
  
  <!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.breadcrumb {
    font-size: 20px;
    margin-bottom: 20px;
}
</style>
  
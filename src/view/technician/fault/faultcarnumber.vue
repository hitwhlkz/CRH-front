<template>
    <div>
        <div v-for="item in classCarNumbers" class="item">
            <el-tag class="carNumber" effect="plain">{{ item.label }}</el-tag><br>
            <el-row :gutter="20">
                <el-col :span="4" v-for="tag in item.children" :key="tag.lable" >
                    <div class="grid-content bg-purple">
                        <el-tag class="tag_item" @click="checkFault(tag.label)">{{ tag.label }}</el-tag>
                    </div>
                </el-col>
            </el-row>
        </div>
    </div>
</template>
  
<script>
import { baseURL } from '../../../api/base'
import { classCarNumbers } from '../../../common/classCarNumbers'

export default {
    name: 'Fault',
    data() {
        return {
            baseURL,
            classCarNumbers
        }
    },
    created() {

    },
    methods: {
        checkFault(tag) {
            console.log(tag)
            
            this.$router.push({ path: '/technician/faultcarnumberdetail', query: {tag}})
        }
    }
}
</script>
  
  <!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.carNumber {
    border-style: none;
    font-size: 26px!important;
    padding: 0!important;
    margin-bottom: 10px;
    color: #547dab;
}
.tag_item{
    height: 40px;
    line-height: 40px;
    padding: 0 16px;
    font-size: 20px;
    cursor: pointer;
    padding: 0 30px;
    color: #f5f7fa;
    background-color: #547dab;
}
.item {
    margin-top: 10px;
}

.el-row {
    margin-bottom: 20px;

    &:last-child {
        margin-bottom: 0;
    }
}

.el-col {
    border-radius: 4px;
}

.bg-purple-dark {
    /* background: #99a9bf; */
}

.bg-purple {
    /* background: #d3dce6; */
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 5px;
}

.bg-purple-light {
    /* background: #e5e9f2; */
}

.grid-content {
    border-radius: 4px;
    min-height: 36px;
}

.row-bg {
    padding: 10px 0;
    background-color: #f9fafc;
}
</style>
  
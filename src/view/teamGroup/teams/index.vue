<template>
    <div>
        <!-- 表格 -->
        <el-table :data="tableData" style="width: 50%" border v-loading="loading">
            <el-table-column prop="name" label="班组" align="center"></el-table-column>
        </el-table>


        <!-- 编辑 -->
        <el-dialog :title="title" :visible.sync="editFormVisible" width="50%" @click="closeDialog('editForm')">
            <el-form label-width="120px" :model="editForm" :rules="rules" ref="editForm">
                <el-form-item label="班组" prop="name">
                    <el-input v-model="editForm.name" label="" placeholder="请输入班组名"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button size="small" @click="closeDialog('editForm')">取消</el-button>
                <el-button size="small" type="primary" class="title" @click="handelFault('editForm')">保存</el-button>
            </div>
        </el-dialog>
    </div>
</template>
  
<script>
import axios from 'axios'
import { baseURL } from '../../../api/base'

export default {
    name: 'Fault',
    data() {
        return {
            baseURL,
            tableData: [],
            editFormVisible: false,
            title: '编辑',
            editForm: {},
            rules: {
                name: [{ required: true, message: '请输入班组名', trigger: 'blur' }]
            },
            loading: true,
            pageparm: {}
        }
    },
    created() {
        this.getFault()
    },
    methods: {
        getFault() {
            axios({
                url: `${baseURL}/teams/selectall`
            }).then(res => {
                this.tableData = res.data.data
                this.loading = false
            }).catch(err => {
                console.log(err);
            })
        },
        handleEdit(index, row) {
            this.editFormVisible = true
            if (row != undefined && row != 'undefined') {
                this.title = '修改'
                this.editForm = row
            } else {
                this.title = '添加'
            }
        },
        handelFault() {
            if (this.title == '添加') {
                axios({
                    url: `${baseURL}/teams/insertteams`,
                    method: 'post',
                    data: this.editForm
                }).then(res => {
                    this.$message({
                        message: this.title + '成功',
                        type: 'success'
                    });
                    this.editFormVisible = false
                    this.editForm = {}
                    this.getFault()
                }).catch(err => {
                    console.log(err)
                    this.$message({
                        message: this.title + '失败',
                        type: 'error'
                    });
                    this.editFormVisible = false
                    this.editForm = {}
                    this.getFault()
                })
            } else {
                axios({
                    url: `${baseURL}/teams/insertteams`,
                    method: 'post',
                    data: this.editForm,
                }).then(res => {
                    this.editFormVisible = false
                    this.editForm = {}
                    this.initPage()
                    this.getFault()
                }).catch(err => {
                    console.log(err)
                })
            }

        }
    }
}
</script>
  
  <!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
  
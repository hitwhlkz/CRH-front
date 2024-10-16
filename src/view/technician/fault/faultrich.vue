<template>
    <div>
        <el-page-header @back="goBack" content="编辑页面">
        </el-page-header>
        <br>
        <quill-editor ref="myQuillEditor" v-model="content" :options="editorOption" @blur="onEditorBlur($event)"
            @focus="onEditorFocus($event)" @ready="onEditorReady($event)" @change="onEditorChange($event)" />
        <el-button size="small" type="primary" class="title" @click="handelFault()">保存</el-button>
    </div>
</template>
  
<script>
import axios from 'axios'
import { baseURL } from '../../../api/base'

import Quill from 'quill'

import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";
import { quillEditor } from "vue-quill-editor";
// 图片缩放组件引用
import ImageResize from "quill-image-resize-module";
// 注册
Quill.register("modules/imageResize", ImageResize);
// 图片拖动组件引用
import { ImageDrop } from 'quill-image-drop-module';
// 注册
Quill.register('modules/imageDrop', ImageDrop);

export default {
    components: { quillEditor },
    name: "Editor",
    props: {
        /* 编辑器的内容 */
        value: {
            type: String,
            default: "",
        },
        /* 高度 */
        height: {
            type: Number,
            default: null,
        },
        /* 最小高度 */
        minHeight: {
            type: Number,
            default: null,
        },
        /* 只读 */
        readOnly: {
            type: Boolean,
            default: false,
        },
        // 上传文件大小限制(MB)
        fileSize: {
            type: Number,
            default: 5,
        },
        /* 类型（base64格式、url格式） */
        type: {
            type: String,
            default: "url",
        }
    },
    data() {
        return {
            baseURL,
            id: 0,
            editForm: {},
            msg: '',
            // 文本内容
            content: "",
            editorOption: {
                placeholder: "请输入需要编写的内容...",
                modules: {
                    // 图片拖拽
                    imageDrop: true,
                    // 放大缩小
                    imageResize: {
                        displayStyles: {
                            backgroundColor: "black",
                            border: "none",
                            color: "white",
                        },
                        modules: ["Resize", "DisplaySize", "Toolbar"],
                    },
                    // 需要重置工具，不然富文本工具上的功能会缺失
                    toolbar: [
                        [
                            "bold",
                            "italic",
                            "underline",
                            "strike",
                            "blockquote",
                            "code-block",
                            { header: 1 },
                            { header: 2 },
                            { list: "ordered" },
                            { list: "bullet" },
                            { indent: "-1" },
                            { indent: "+1" },
                            { align: [] },
                            { color: [] },
                            { background: [] },
                            "image",
                        ],
                        // 字体大小
                        [{ size: ['small', false, 'large', 'huge'] }],
                        // 标题
                        [{ header: [1, 2, 3, 4, 5, 6, false] }],
                    ],
                },
            },
        };
    },
    created() {
        this.id = this.$route.query.id
        console.log(this.id)
        this.getRich()
    },
    methods: {
        // 失去焦点事件
        onEditorBlur(val) { },
        // 获得焦点事件
        onEditorFocus() { },
        // 准备编辑器
        onEditorReady() { },
        // 内容改变事件
        onEditorChange() { },
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
                this.editForm = res.data.data.list[0]
                if (rich) {
                    this.content = rich
                }
            }).catch(err => {
                this.initPage()
                this.getFault()
                this.$message.error('搜索失败')
                console.log(err)
            })
        },
        handelFault() {
            this.editForm = { ...this.editForm, rich: this.content }
            axios({
                url: baseURL + '/fault/updatefaultid',
                method: 'post',
                data: this.editForm,
            }).then(res => {
                this.editFormVisible = false
                this.editForm = {}
                this.risk = 0
                this.$message.success('修改成功')
            }).catch(err => {
                console.log(err)
                this.$message.error("请重新提交")
            })
        }
    },
    watch: {
        // 监听文本变化内容
        content() { },
    },
    mounted() {
        const titleConfig = [
            { Choice: ".ql-insertMetric", title: "跳转配置" },
            { Choice: ".ql-bold", title: "加粗" },
            { Choice: ".ql-italic", title: "斜体" },
            { Choice: ".ql-underline", title: "下划线" },
            { Choice: ".ql-header", title: "段落格式" },
            { Choice: ".ql-strike", title: "删除线" },
            { Choice: ".ql-blockquote", title: "块引用" },
            { Choice: ".ql-code", title: "插入代码" },
            { Choice: ".ql-code-block", title: "插入代码段" },
            { Choice: ".ql-font", title: "字体" },
            { Choice: ".ql-size", title: "字体大小" },
            { Choice: '.ql-list[value="ordered"]', title: "编号列表" },
            { Choice: '.ql-list[value="bullet"]', title: "项目列表" },
            { Choice: ".ql-direction", title: "文本方向" },
            { Choice: '.ql-header[value="1"]', title: "h1" },
            { Choice: '.ql-header[value="2"]', title: "h2" },
            { Choice: ".ql-align", title: "对齐方式" },
            { Choice: ".ql-color", title: "字体颜色" },
            { Choice: ".ql-background", title: "背景颜色" },
            { Choice: ".ql-image", title: "图像" },
            { Choice: ".ql-video", title: "视频" },
            { Choice: ".ql-link", title: "添加链接" },
            { Choice: ".ql-formula", title: "插入公式" },
            { Choice: ".ql-clean", title: "清除字体格式" },
            { Choice: '.ql-script[value="sub"]', title: "下标" },
            { Choice: '.ql-script[value="super"]', title: "上标" },
            { Choice: '.ql-indent[value="-1"]', title: "向左缩进" },
            { Choice: '.ql-indent[value="+1"]', title: "向右缩进" },
            { Choice: ".ql-header .ql-picker-label", title: "标题大小" },
            { Choice: '.ql-header .ql-picker-item[data-value="1"]', title: "标题一" },
            { Choice: '.ql-header .ql-picker-item[data-value="2"]', title: "标题二" },
            { Choice: '.ql-header .ql-picker-item[data-value="3"]', title: "标题三" },
            { Choice: '.ql-header .ql-picker-item[data-value="4"]', title: "标题四" },
            { Choice: '.ql-header .ql-picker-item[data-value="5"]', title: "标题五" },
            { Choice: '.ql-header .ql-picker-item[data-value="6"]', title: "标题六" },
            { Choice: ".ql-header .ql-picker-item:last-child", title: "标准" },
            { Choice: '.ql-size .ql-picker-item[data-value="small"]', title: "小号" },
            { Choice: '.ql-size .ql-picker-item[data-value="large"]', title: "大号" },
            { Choice: '.ql-size .ql-picker-item[data-value="huge"]', title: "超大号" },
            { Choice: ".ql-size .ql-picker-item:nth-child(2)", title: "标准" },
            { Choice: ".ql-align .ql-picker-item:first-child", title: "居左对齐" },
            { Choice: '.ql-align .ql-picker-item[data-value="center"]', title: "居中对齐" },
            { Choice: '.ql-align .ql-picker-item[data-value="right"]', title: "居右对齐" },
            { Choice: '.ql-align .ql-picker-item[data-value="justify"]', title: "两端对齐" },
            { Choice: ".ql-upload", title: "上传文件" },
            { Choice: ".ql-table", title: "插入表格" },
            { Choice: ".ql-table-insert-row", title: "插入行" },
            { Choice: ".ql-table-insert-column", title: "插入列" },
            { Choice: ".ql-table-delete-row", title: "删除行" },
            { Choice: ".ql-table-delete-column", title: "删除列" },
        ];
        for (let item of titleConfig) {
            let tip = document.querySelector(".quill-editor " + item.Choice);
            if (!tip) continue;
            tip.setAttribute("title", item.title);
        }
    }

};
</script>
  
  <!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
/* .ql-editor {
  height: 300px !important;
 } */
.rate_wrap {
    display: flex;
    align-items: center;
}

/* 富文本框汉化 */
.ql-snow .ql-picker.ql-size .ql-picker-label::before,
.ql-snow .ql-picker.ql-size .ql-picker-item::before {
    content: "14px";
}

.ql-snow .ql-picker.ql-size .ql-picker-label[data-value="small"]::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value="small"]::before {
    content: "10px";
}

.ql-snow .ql-picker.ql-size .ql-picker-label[data-value="large"]::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value="large"]::before {
    content: "18px";
}

.ql-snow .ql-picker.ql-size .ql-picker-label[data-value="huge"]::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value="huge"]::before {
    content: "32px";
}

.ql-snow .ql-picker.ql-header .ql-picker-label::before,
.ql-snow .ql-picker.ql-header .ql-picker-item::before {
    content: "文本";
}

.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="1"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="1"]::before {
    content: "标题1";
}

.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="2"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="2"]::before {
    content: "标题2";
}

.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="3"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="3"]::before {
    content: "标题3";
}

.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="4"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="4"]::before {
    content: "标题4";
}

.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="5"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="5"]::before {
    content: "标题5";
}

.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="6"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="6"]::before {
    content: "标题6";
}

.ql-snow .ql-picker.ql-font .ql-picker-label::before,
.ql-snow .ql-picker.ql-font .ql-picker-item::before {
    content: "标准字体";
}

.ql-snow .ql-picker.ql-font .ql-picker-label[data-value="serif"]::before,
.ql-snow .ql-picker.ql-font .ql-picker-item[data-value="serif"]::before {
    content: "衬线字体";
}

.ql-snow .ql-picker.ql-font .ql-picker-label[data-value="monospace"]::before,
.ql-snow .ql-picker.ql-font .ql-picker-item[data-value="monospace"]::before {
    content: "等宽字体";
}

/* 确认按钮 */
.button {
    margin-top: 10px;
}
</style>
  
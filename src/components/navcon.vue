/**
* 头部菜单
*/ 
<template>
  <el-menu :router="true" class="el-menu-demo" mode="horizontal" background-color="#334157" text-color="#fff"
    active-text-color="#fff">
    
    <!-- 提醒 -->
    <!-- <el-badge :is-dot="isDot" class="item">
      <el-button style="font-size: 20px;" class="share-button" icon="el-icon-alarm-clock" circle></el-button>
    </el-badge> -->


    <el-submenu index="1" class="submenu">
      <template slot="title">
        {{ userName }}
      </template>
      <el-menu-item @click="exit()" :index="$route.path">退出</el-menu-item>
    </el-submenu>
    
    <el-menu-item disabled index="2">太原动车所</el-menu-item>

  </el-menu>
</template>
<script>
export default {
  name: 'navcon',
  data() {
    return {
      userName: '',
      collapsed: true,
      imgshow: require('../assets/img/show.png'),
      imgsq: require('../assets/img/sq.png'),
      user: {},
      isDot: false
    }
  },
  // 创建完毕状态(里面是操作)
  created() {
    this.userName = localStorage.getItem('userName')
    // this.user = JSON.parse(localStorage.getItem('userdata'))

    //到期提醒 
    // this.toRemind()
  },
  methods: {
    // 退出登录
    exit() {
      this.$confirm('退出登录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          setTimeout(() => {
            localStorage.removeItem('roleId')
            localStorage.removeItem('userName')
            this.$router.push({ path: '/' })
            this.$message({
              type: 'success',
              message: '已退出登录!'
            })
          }, 1000)
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消操作'
          })
        })
    },
    // 切换显示
    toggle(showtype) {
      this.collapsed = !showtype
      // this.$root.Bus.$emit('toggle', this.collapsed)
    },
    toRemind() {
      if (Date.now() > Date.parse('2023-11-10 00:00:00')) {
        this.isDot = true
      }
    }
  }
}
</script>
<style scoped>
.el-menu-vertical-demo:not(.el-menu--collapse) {
  border: none;
}

.buttonimg {
  height: 60px;
  background-color: transparent;
  border: none;
}

.showimg {
  width: 26px;
  height: 26px;
  position: absolute;
  top: 17px;
  left: 17px;
}

.showimg:active {
  border: none;
}
</style>

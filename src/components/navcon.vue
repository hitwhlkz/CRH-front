<template>
  <el-menu :router="true" class="el-menu-demo" mode="horizontal" background-color="#334157" text-color="#fff"
    active-text-color="#fff">
    
    <el-submenu index="1" class="submenu">
      <template slot="title">
        {{ userName }}
      </template>
      <el-menu-item @click="exit()" :index="$route.path">退出</el-menu-item>
    </el-submenu>
    
    <!-- 根据用户名动态显示 -->
    <el-menu-item disabled index="2">{{ userLocation }}</el-menu-item>
  </el-menu>
</template>

<script>
export default {
  name: 'navcon',
  data() {
    return {
      userName: '',
      userLocation: '', // 用来存储显示的地点名称
      collapsed: true,
      imgshow: require('../assets/img/show.png'),
      imgsq: require('../assets/img/sq.png'),
      user: {},
      isDot: false
    }
  },
  created() {
    this.userName = localStorage.getItem('userName');
    this.setUserLocation();
  },
  methods: {
    // 设置用户地点
    setUserLocation() {
      if (this.userName === 'DTdcs') {
        this.userLocation = '大同南动车所'; // 如果用户名是 DTdcs，显示大同动车所
      } else {
        this.userLocation = '太原动车所'; // 默认显示太原动车所
      }
    },
    // 退出登录
    exit() {
      this.$confirm('退出登录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          setTimeout(() => {
            localStorage.removeItem('roleId');
            localStorage.removeItem('userName');
            this.$router.push({ path: '/' });
            this.$message({
              type: 'success',
              message: '已退出登录!'
            });
          }, 1000);
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消操作'
          });
        });
    },
    // 切换显示
    toggle(showtype) {
      this.collapsed = !showtype;
    }
  }
}
</script>

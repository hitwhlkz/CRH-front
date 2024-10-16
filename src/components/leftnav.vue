/**
* 左边菜单
*/ 
<template>
  <el-menu :collapse="collapsed" collapse-transition router :default-active="$route.path" :router="true"
    :unique-opened="false" class="el-menu-vertical-demo" background-color="#334157" text-color="#fff"
    active-text-color="#ffd04b">
    <div class="logobox">
      <img class="logoimg" src="../assets/img/logo.png" alt="">
    </div>
    <el-submenu v-for="menu in allmenu" :key="menu.menuid" :index="menu.name">
      <template slot="title">
        <i class="iconfont" :class="menu.icon"></i>
        <span>{{ menu.name }}</span>
      </template>
      <el-menu-item-group>
        <el-menu-item v-for="chmenu in menu.menus" :index="'/' + chmenu.url" :key="chmenu.menuid">
          <i class="iconfont" :class="chmenu.icon"></i>
          <span>{{ chmenu.name }}</span>
        </el-menu-item>
      </el-menu-item-group>
    </el-submenu>
  </el-menu>
</template>
<script>
export default {
  name: 'leftnav',
  data() {
    return {
      collapsed: false,
      allmenu: []
    }
  },
  // 创建完毕状态(里面是操作)
  created() {
    this.getRes()
  },
  methods: {
    getRes() {
      let roleId = localStorage.getItem('roleId')
      let username = localStorage.getItem('userName')
      if (roleId == 1 & username != 'TEDS' & username != 'zhuanxiang' & username != 'shangbuzu' & username != 'gongjuzu') {
        var res = {
          success: true,
          data: [
            {
              menuid: 1,
              icon: 'li-icon-xiangmuguanli',
              name: '班组查看',
              hasThird: null,
              url: null,
              menus: [
                {
                  menuid: 2,
                  icon: 'icon-cat-skuQuery',
                  name: '班组列表',
                  hasThird: 'N',
                  url: 'teams/check',
                  menus: null
                }
              ]
            },
            {
              menuid: 11,
              icon: 'li-icon-xiangmuguanli',
              name: '故障查看',
              hasThird: null,
              url: null,
              menus: [
                {
                  menuid: 22,
                  icon: 'icon-cat-skuQuery',
                  name: '故障列表',
                  hasThird: 'N',
                  url: 'teams/faultcheck',
                  menus: null
                }, {
                  menuid: 55,
                  icon: 'icon-cat-skuQuery',
                  name: '车内装饰类故障列表',
                  hasThird: 'N',
                  url: 'teams/faultdecorationcheck',
                  menus: null
                },
                {
                  menuid: 33,
                  icon: 'icon-cat-skuQuery',
                  name: '高级修列表',
                  hasThird: 'N',
                  url: 'teams/seniorfaultcheck',
                  menus: null
                }, {
                  menuid: 44,
                  icon: 'icon-cat-skuQuery',
                  name: '故障追踪列表',
                  hasThird: 'N',
                  url: 'teams/trackfaultcheck',
                  menus: null
                }
              ]
            },
            // {
            //   menuid: 111,
            //   icon: 'li-icon-xiangmuguanli',
            //   name: '源头管理',
            //   hasThird: null,
            //   url: null,
            //   menus: [
            //     {
            //       menuid: 222,
            //       icon: 'icon-cat-skuQuery',
            //       name: '源头质量（四方）',
            //       hasThird: 'N',
            //       url: 'source/qualitysquarecheck',
            //       menus: null
            //     },
            //     {
            //       menuid: 333,
            //       icon: 'icon-cat-skuQuery',
            //       name: '源头质量（长客）',
            //       hasThird: 'N',
            //       url: 'source/qualitylongcheck',
            //       menus: null
            //     },
            //     {
            //       menuid: 444,
            //       icon: 'icon-cat-skuQuery',
            //       name: '源头质量（动集）',
            //       hasThird: 'N',
            //       url: 'source/qualityconcentcheck',
            //       menus: null
            //     },
            //     {
            //       menuid: 555,
            //       icon: 'icon-cat-skuQuery',
            //       name: '技术改造（四方）',
            //       hasThird: 'N',
            //       url: 'source/technologysquarecheck',
            //       menus: null
            //     },
            //     {
            //       menuid: 666,
            //       icon: 'icon-cat-skuQuery',
            //       name: '技术改造（长客）',
            //       hasThird: 'N',
            //       url: 'source/technologylongcheck',
            //       menus: null
            //     },
            //     {
            //       menuid: 777,
            //       icon: 'icon-cat-skuQuery',
            //       name: '技术改造（动集）',
            //       hasThird: 'N',
            //       url: 'source/technologyconcentcheck',
            //       menus: null
            //     }

            //   ]
            // }

          ],
          msg: 'success'
        }
      } else if (roleId == 1 & username == 'TEDS') {
        var res = {
          success: true,
          data: [
            {
              menuid: 1,
              icon: 'li-icon-xiangmuguanli',
              name: '故障查看',
              hasThird: null,
              url: null,
              menus: [
                {
                  menuid: 2,
                  icon: 'icon-cat-skuQuery',
                  name: '故障列表',
                  hasThird: 'N',
                  url: 'teams/faultcheck',
                  menus: null
                }, {
                  menuid: 3,
                  icon: 'icon-cat-skuQuery',
                  name: '高级修列表',
                  hasThird: 'N',
                  url: 'teams/seniorfaultcheck',
                  menus: null
                }, {
                  menuid: 4,
                  icon: 'icon-cat-skuQuery',
                  name: '故障追踪列表',
                  hasThird: 'N',
                  url: 'teams/trackfaultcheck',
                  menus: null
                }
              ]
            },
            {
              menuid: 11,
              icon: 'li-icon-xiangmuguanli',
              name: 'TEDS故障管理',
              hasThird: null,
              url: null,
              menus: [
                {
                  menuid: 22,
                  icon: 'icon-cat-skuQuery',
                  name: '故障列表',
                  hasThird: 'N',
                  url: 'tedsfault/fault',
                  menus: null
                }, {
                  menuid: 33,
                  icon: 'icon-cat-skuQuery',
                  name: '高级修列表',
                  hasThird: 'N',
                  url: 'tedsfault/senior',
                  menus: null
                }
              ]
            },
          ],
          msg: 'success'
        }
      } else if (roleId == 3) {
        var res = {
          success: true,
          data: [
            {
              menuid: 1,
              icon: 'li-icon-xiangmuguanli',
              name: '班组管理',
              hasThird: null,
              url: null,
              menus: [
                {
                  menuid: 2,
                  icon: 'icon-cat-skuQuery',
                  name: '班组列表',
                  hasThird: 'N',
                  url: 'teams/index',
                  menus: null
                }
              ]
            },
            {
              menuid: 3,
              icon: 'li-icon-xiangmuguanli',
              name: '故障管理',
              hasThird: null,
              url: null,
              menus: [
                {
                  menuid: 4,
                  icon: 'icon-cat-skuQuery',
                  name: '故障库',
                  hasThird: 'N',
                  url: 'technician/faultcarnumber',
                  menus: null
                },
                {
                  menuid: 5,
                  icon: 'icon-cat-skuQuery',
                  name: '故障遗留列表',
                  hasThird: 'N',
                  url: 'technician/fault',
                  menus: null
                },
                {
                  menuid: 8,
                  icon: 'icon-cat-skuQuery',
                  name: '车内装饰类故障列表',
                  hasThird: 'N',
                  url: 'technician/faultdecoration',
                  menus: null
                }, {
                  menuid: 6,
                  icon: 'icon-cat-skuQuery',
                  name: '高级修列表',
                  hasThird: 'N',
                  url: 'technician/senior',
                  menus: null
                }, {
                  menuid: 7,
                  icon: 'icon-cat-skuQuery',
                  name: '故障追踪列表',
                  hasThird: 'N',
                  url: 'technician/track',
                  menus: null
                },
              ]
            },
            {
              menuid: 11,
              icon: 'li-icon-xiangmuguanli',
              name: '源头管理',
              hasThird: null,
              url: null,
              menus: [
                {
                  menuid: 22,
                  icon: 'icon-cat-skuQuery',
                  name: '源头质量（四方）',
                  hasThird: 'N',
                  url: 'source/qualitysquare',
                  menus: null
                },
                {
                  menuid: 33,
                  icon: 'icon-cat-skuQuery',
                  name: '源头质量（长客）',
                  hasThird: 'N',
                  url: 'source/qualitylong',
                  menus: null
                },
                {
                  menuid: 44,
                  icon: 'icon-cat-skuQuery',
                  name: '源头质量（动集）',
                  hasThird: 'N',
                  url: 'source/qualityconcent',
                  menus: null
                },
                {
                  menuid: 55,
                  icon: 'icon-cat-skuQuery',
                  name: '技术改造（四方）',
                  hasThird: 'N',
                  url: 'source/technologysquare',
                  menus: null
                },
                {
                  menuid: 66,
                  icon: 'icon-cat-skuQuery',
                  name: '技术改造（长客）',
                  hasThird: 'N',
                  url: 'source/technologylong',
                  menus: null
                },
                {
                  menuid: 77,
                  icon: 'icon-cat-skuQuery',
                  name: '技术改造（动集）',
                  hasThird: 'N',
                  url: 'source/technologyconcent',
                  menus: null
                }

              ]
            },
            {
              menuid: 4,
              icon: 'li-icon-xiangmuguanli',
              name: '审批管理',
              hasThird: null,
              url: null,
              menus: [
                {
                  menuid: 1,
                  icon: 'icon-cat-skuQuery',
                  name: '简单审批',
                  hasThird: 'N',
                  url: 'technician/approval',
                  menus: null
                },
              ]
            }
            // {
            //   menuid: 111111,
            //   icon: 'li-icon-xiangmuguanli',
            //   name: '专项管理',
            //   hasThird: null,
            //   url: null,
            //   menus: [
            //     {
            //       menuid: 222222,
            //       icon: 'icon-cat-skuQuery',
            //       name: '专项提醒',
            //       hasThird: 'N',
            //       url: 'special/index',
            //       menus: null
            //     }
            //   ]
            // }

          ]
        }
      } else if (roleId == 4) {
        var res = {
          success: true,
          data: [
            {
              menuid: 1,
              icon: 'li-icon-xiangmuguanli',
              name: '材料管理',
              hasThird: null,
              url: null,
              menus: [
                {
                  menuid: 2,
                  icon: 'icon-cat-skuQuery',
                  name: '材料签字',
                  hasThird: 'N',
                  url: 'manager/indexmaterial',
                  menus: null
                }
              ]
            }
          ],
          msg: 'success'
        }
      } else if (roleId == 1 & username == 'zhuanxiang') {
        var res = {
          success: true,
          data: [
            {
              menuid: 1,
              icon: 'li-icon-xiangmuguanli',
              name: '专项管理',
              hasThird: null,
              url: null,
              menus: [
                {
                  menuid: 2,
                  icon: 'icon-cat-skuQuery',
                  name: '专项提醒',
                  hasThird: 'N',
                  url: 'special/index',
                  menus: null
                }
              ]
            }
          ]
        }
      } else if (roleId == 1 & username == 'shangbuzu') {
        var res = {
          success: true,
          data: [
            {
              menuid: 1,
              icon: 'li-icon-xiangmuguanli',
              name: '班组查看',
              hasThird: null,
              url: null,
              menus: [
                {
                  menuid: 2,
                  icon: 'icon-cat-skuQuery',
                  name: '班组列表',
                  hasThird: 'N',
                  url: 'teams/check',
                  menus: null
                }
              ]
            },
            {
              menuid: 11,
              icon: 'li-icon-xiangmuguanli',
              name: '故障查看',
              hasThird: null,
              url: null,
              menus: [
                {
                  menuid: 22,
                  icon: 'icon-cat-skuQuery',
                  name: '故障列表',
                  hasThird: 'N',
                  url: 'teams/faultcheck',
                  menus: null
                }, {
                  menuid: 55,
                  icon: 'icon-cat-skuQuery',
                  name: '车内装饰类故障列表',
                  hasThird: 'N',
                  url: 'teams/faultdecorationcheck',
                  menus: null
                },
                {
                  menuid: 33,
                  icon: 'icon-cat-skuQuery',
                  name: '高级修列表',
                  hasThird: 'N',
                  url: 'teams/seniorfaultcheck',
                  menus: null
                }, {
                  menuid: 44,
                  icon: 'icon-cat-skuQuery',
                  name: '故障追踪列表',
                  hasThird: 'N',
                  url: 'teams/trackfaultcheck',
                  menus: null
                }
              ]
            }

          ],
          msg: 'success'
        }
      } else if (roleId == 1 & username == 'gongjuzu') {
        var res = {
          success: true,
          data: [ 
            {
              menuid: 1,
              icon: 'li-icon-xiangmuguanli',
              name: '工具室台账',
              hasThird: null,
              url: null,
              menus: [
                {
                  menuid: 2,
                  icon: 'icon-cat-skuQuery',
                  name: '计量用品台账',
                  hasThird: 'N',
                  url: 'tool/metering',
                  menus: null
                },
                {
                  menuid: 3,
                  icon: 'icon-cat-skuQuery',
                  name: '绝缘用品台账',
                  hasThird: 'N',
                  url: 'tool/insulation',
                  menus: null
                },
                {
                  menuid: 4,
                  icon: 'icon-cat-skuQuery',
                  name: '仪器用品台账',
                  hasThird: 'N',
                  url: 'tool/secure',
                  menus: null
                }
              ]
            },

          ],
          msg: 'success'
        }
      }
      this.allmenu = res.data
      // this.$root.Bus.$on('toggle', value => {
      //   this.collapsed = !value
      // })
    }
  }
}
</script>
<style>
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 240px;
  min-height: 100vh;
}

.el-menu-vertical-demo:not(.el-menu--collapse) {
  border: none;
  text-align: left;
}

.el-menu-item-group__title {
  padding: 0px;
}

.el-menu-bg {
  background-color: #1f2d3d !important;
}

.el-menu {
  border: none;
}

.logobox {
  height: 40px;
  line-height: 40px;
  color: #9d9d9d;
  font-size: 20px;
  text-align: center;
  padding: 20px 0px;
}

.logoimg {
  height: 40px;
}
</style>

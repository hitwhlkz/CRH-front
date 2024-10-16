import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/view/Login'
import index from '@/view/index'
// 故障
import Fault from '@/view/technician/fault/fault'
import SeniorFault from '@/view/technician/fault/senior'
import FaultTrack from '@/view/technician/fault/faultTrack'
import FaultCarNumber from '@/view/technician/fault/faultcarnumber'
import FaultCarNumberDetail from '@/view/technician/fault/faultcarnumberdetail'
import FaultRich from '@/view/technician/fault/faultrich'
import FaultRichCheck from '@/view/technician/fault/faultrichcheck'
import FaultDecoration from '@/view/technician/fault/faultdecoration'
import FaultDecorationCheck from '@/view/teamGroup/fault/faultdecoration'



import FaultCheck from '@/view/teamGroup/fault/fault'
import SeniorFaultCheck from '@/view/teamGroup/fault/senior'
import TrackFalutCheck from '@/view/teamGroup/fault/faultTrack'

import TEDSFault from '@/view/TEDS/fault/fault'
import TEDSFaultSenior from '@/view/TEDS/fault/senior'



// 材料
// import Material from '@/view/technician/material/index'
// import MaterialAdd from '@/view/teamGroup/material/addMaterial'
// import MaterialIndex from '@/view/teamGroup/material/index'
// import MaterialSgin from '@/view/manager/material/index'

// 专项
import Special from '@/view/technician/special/index'

// 源头
import qualitySquare from '@/view/technician/source/qualitySquare'
import qualityLong from '@/view/technician/source/qualityLong'
import technologySquare from '@/view/technician/source/technologySquare'
import technologyLong from '@/view/technician/source/technologyLong'

import qualityConcentration from '@/view/technician/source/qualityConcentration'
import technologyConcentration from '@/view/technician/source/technologyConcentration'


// 班组
import TeamsIndex from '@/view/technician/teams/index'
import TeamsCheck from '@/view/teamGroup/teams/index'



// 源头查看 
import qualitySquareCheck from '@/view/teamGroup/source/qualitySquare'
import qualityLongCheck from '@/view/teamGroup/source/qualityLong'
import technologySquareCheck from '@/view/teamGroup/source/technologySquare'
import technologyLongCheck from '@/view/teamGroup/source/technologyLong'
import qualityConcentrationCheck from '@/view/teamGroup/source/qualityConcentration'
import technologyConcentrationCheck from '@/view/teamGroup/source/technologyConcentration'

// 工具室
import ToolMetering from '@/view/teamGroup/tool/metering'
import ToolSecure from '@/view/teamGroup/tool/secure'
import ToolInsulation from '@/view/teamGroup/tool/insulation'

// 审批
import Approval from '@/view/technician/approval/approval'

Vue.use(Router)

let router = new Router({
  routes: [
    // 登录
    {
      path: '/',
      name: 'Login',
      component: Login
    },


    {
      path: '/index',
      name: 'Index',
      component: index,
      iconCls: 'el-icon-tickets',
      children: [

        // 工具
        {
          path: '/tool/metering',
          name: '计量用品列表',
          component: ToolMetering,
          meta: {
            requireAuth: true,
            title: '计量用品列表'
          }
        },
        {
          path: '/tool/insulation',
          name: '绝缘用品列表',
          component: ToolInsulation,
          meta: {
            requireAuth: true,
            title: '绝缘用品列表'
          }
        }, {
          path: '/tool/secure',
          name: '仪器用品列表',
          component: ToolSecure,
          meta: {
            requireAuth: true,
            title: '仪器用品列表'
          }
        },

        //故障
        {
          path: '/technician/fault',
          name: '故障遗留列表',
          component: Fault,
          meta: {
            requireAuth: true,
            title: '故障遗留列表'
          }
        }, {
          path: '/technician/senior',
          name: '高级修列表',
          component: SeniorFault,
          meta: {
            requireAuth: true,
            title: '高级修列表'
          }
        }, {
          path: '/technician/track',
          name: '故障追踪列表',
          component: FaultTrack,
          meta: {
            requireAuth: true,
            title: '故障追踪列表'
          }
        }, {
          path: '/technician/faultcarnumber',
          name: '故障库',
          component: FaultCarNumber,
          meta: {
            requireAuth: true,
            title: '故障库'
          }
        }, {
          path: '/technician/faultcarnumberdetail',
          name: '故障库详情',
          component: FaultCarNumberDetail,
          meta: {
            requireAuth: true,
            title: '故障库详情'
          }
        }, {
          path: '/technician/faultdecoration',
          name: '车内装饰类故障列表',
          component: FaultDecoration,
          meta: {
            requireAuth: true,
            title: '车内装饰类故障列表'
          }
        },
        {
          path: '/teams/faultdecorationcheck',
          name: '车内装饰类故障查看',
          component: FaultDecorationCheck,
          meta: {
            requireAuth: true,
            title: '车内装饰类故障查看'
          }
        }, {
          path: '/technician/fault/rich',
          name: '故障富文本',
          component: FaultRich,
          meta: {
            requireAuth: true,
            title: '故障编辑'
          }
        }, {
          path: '/technician/fault/richcheck',
          name: '故障富文本查看',
          component: FaultRichCheck,
          meta: {
            requireAuth: true,
            title: '故障信息查看'
          }
        },
        {
          path: '/teams/faultcheck',
          name: '故障查看',
          component: FaultCheck,
          meta: {
            requireAuth: true,
            title: '故障查看'
          }
        }, {
          path: '/teams/seniorfaultcheck',
          name: '高级修查看',
          component: SeniorFaultCheck,
          meta: {
            requireAuth: true,
            title: '高级修查看'
          }
        }, {
          path: '/teams/trackfaultcheck',
          name: '故障追踪查看',
          component: TrackFalutCheck,
          meta: {
            requireAuth: true,
            title: '故障追踪查看'
          }
        },

        // {
        //   path: '/material/index',
        //   name: '材料审核',
        //   component: Material,
        //   meta: {
        //     requireAuth: true,
        //     title: '材料审核'
        //   }
        // },

        // 专项
        {
          path: '/special/index',
          name: '专项列表',
          component: Special,
          meta: {
            requireAuth: true,
            title: '专项列表'
          }
        },

        // {
        //   path: '/team/addmaterial',
        //   name: '材料申报',
        //   component: MaterialAdd,
        //   meta: {
        //     requireAuth: true,
        //     title: '材料申报'
        //   }
        // },
        // {
        //   path: '/team/indexmaterial',
        //   name: '材料列表',
        //   component: MaterialIndex,
        //   meta: {
        //     requireAuth: true,
        //     title: '材料列表'
        //   }
        // },{
        //   path: '/manager/indexmaterial',
        //   name: '材料签字',
        //   component: MaterialSgin,
        //   meta: {
        //     requireAuth: true,
        //     title: '材料签字'
        //   }
        // },

        // 班组
        {
          path: '/teams/index',
          name: '班组管理',
          component: TeamsIndex,
          meta: {
            requireAuth: true,
            title: '班组管理'
          }
        },
        {
          path: '/teams/check',
          name: '班组查看',
          component: TeamsCheck,
          meta: {
            requireAuth: true,
            title: '班组管理'
          }
        },

        // 审批
        {
          path: '/technician/approval',
          name: '审批',
          component: Approval,
          meta: {
            requireAuth: true,
            title: '审批'
          }
        },
        // {
        //   path: '/teams/faultcheck',
        //   name: '故障查看',
        //   component: FaultCheck,
        //   meta: {
        //     requireAuth: true,
        //     title: '故障查看'
        //   }
        // }, {
        //   path: '/teams/seniorfaultcheck',
        //   name: '高级修查看',
        //   component: SeniorFaultCheck,
        //   meta: {
        //     requireAuth: true,
        //     title: '高级修查看'
        //   }
        // }, {
        //   path: '/teams/trackfaultcheck',
        //   name: '故障追踪查看',
        //   component: TrackFalutCheck,
        //   meta: {
        //     requireAuth: true,
        //     title: '故障追踪查看'
        //   }
        // },

        // 源头技改
        {
          path: '/source/qualitysquare',
          name: '源头质量（四方）',
          component: qualitySquare,
          meta: {
            requireAuth: true,
            title: '源头质量（四方）'
          }
        }, {
          path: '/source/qualitylong',
          name: '源头质量（长客）',
          component: qualityLong,
          meta: {
            requireAuth: true,
            title: '源头质量（长客）'
          }
        }, {
          path: '/source/qualityconcent',
          name: '源头质量（动集）',
          component: qualityConcentration,
          meta: {
            requireAuth: true,
            title: '源头质量（动集）'
          }
        }, {
          path: '/source/technologysquare',
          name: '技术改造（四方）',
          component: technologySquare,
          meta: {
            requireAuth: true,
            title: '技术改造（四方）'
          }
        }, {
          path: '/source/technologylong',
          name: '技术改造（长客）',
          component: technologyLong,
          meta: {
            requireAuth: true,
            title: '技术改造（长客）'
          }
        }, {
          path: '/source/technologyconcent',
          name: '技术改造（动集）',
          component: technologyConcentration,
          meta: {
            requireAuth: true,
            title: '技术改造（动集）'
          }
        },

        {
          path: '/source/qualitysquarecheck',
          name: '查看源头质量（四方）',
          component: qualitySquareCheck,
          meta: {
            requireAuth: true,
            title: '源头质量（四方）'
          }
        }, {
          path: '/source/qualitylongcheck',
          name: '查看源头质量（长客）',
          component: qualityLongCheck,
          meta: {
            requireAuth: true,
            title: '源头质量（长客）'
          }
        }, {
          path: '/source/qualityconcentcheck',
          name: '查看源头质量（动集）',
          component: qualityConcentrationCheck,
          meta: {
            requireAuth: true,
            title: '源头质量（动集）'
          }
        }, {
          path: '/source/technologysquarecheck',
          name: '查看技术改造（四方）',
          component: technologySquareCheck,
          meta: {
            requireAuth: true,
            title: '技术改造（四方）'
          }
        }, {
          path: '/source/technologylongcheck',
          name: '查看技术改造（长客）',
          component: technologyLongCheck,
          meta: {
            requireAuth: true,
            title: '技术改造（长客）'
          }
        }, {
          path: '/source/technologyconcentcheck',
          name: '查看技术改造（动集）',
          component: technologyConcentrationCheck,
          meta: {
            requireAuth: true,
            title: '技术改造（动集）'
          }
        },
        // TEDS
        {
          path: '/tedsfault/fault',
          name: 'TEDS故障列表',
          component: TEDSFault,
          meta: {
            requireAuth: true,
            title: 'TEDS故障列表'
          }
        }, {
          path: '/tedsfault/senior',
          name: 'TEDS高级修列表',
          component: TEDSFaultSenior,
          meta: {
            requireAuth: true,
            title: 'TEDS高级修列表'
          }
        },
        


      ]
    },
  ]
})

//前置守卫
//路由元信息
router.beforeEach((to, from, next) => {
  let title = to.meta.title || '太原动车所技术管理系统'
  document.title = title
  if (to.meta.requireAuth) {
    let roleId = localStorage.getItem('roleId');
    roleId = roleId && roleId.trim();
    if (roleId) {
      next();
    } else {
      next({ name: 'Login', query: { redirect: to.name } })
    }
  } else {
    next();
  }
})

// 导出路由 
export default router

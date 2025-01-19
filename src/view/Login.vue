<template>
  <div class="bg">
    <div id="login_box">
      <h2>LOGIN</h2>
      <div id="form">
        <div id="input_box">
          <input name="username" id="username" type="text" autocomplete="off" placeholder="Username"
            v-model="params.userName">
        </div>
        <div id="input_box">
          <input name="password" id="password" type="password" autocomplete="off" placeholder="Password"
            v-model="params.password">
        </div>
        <div id="input_box">
          <el-radio-group v-model="params.roleId">
            <el-radio label="1">班组</el-radio>
            <el-radio label="3">技术员</el-radio>
            <el-radio label="5">长客</el-radio>
          </el-radio-group>
        </div>
      </div>
      <el-button @click="getLogin" id="sign_in">登录</el-button>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import { baseURL } from '../api/base'

export default {
  name: 'Login',
  data() {
    return {
      params: {
        userName: '',
        password: '',
        roleId: '1'
      }
    }
  },
  methods: {
    getLogin() {

      // 注释掉的代码保持不变
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });
      this.params.roleId = parseInt(this.params.roleId)

      if (!this.params.userName || !this.params.password || !this.params.roleId) {
        this.$message.error("请完善登录信息！")
        loading.close()
      }

      axios({
        url: baseURL + '/login/doLogin',
        method: 'get',
        params: this.params
      }).then(res => {
        loading.close()
        if (res.data.code == 200) {
          loading.close()
          localStorage.setItem('roleId', this.params.roleId)
          localStorage.setItem('userName', this.params.userName)
          if (this.params.roleId == 3 & this.params.userName == 'jishuyuan') {
            this.$router.push({
              path: '/technician/fault'
            })
          }  else if (this.params.roleId == 1 & this.params.userName == 'erji') {
            this.$router.push({
              path: '/teamGroup/specific'
            })
          } else if(this.params.roleId == 1 & this.params.userName == 'shangbuzu'){
            this.$router.push({
              path: '/teams/faultdecorationcheck'
            })
            console.log('shangbuzu')

          } else if (this.params.roleId == 1 & this.params.userName != 'gongjuzu' & this.params.userName != 'cailiaozu') {
            this.$router.push({
              path: '/teamGroup/Aumanage/aum'
            })
            console.log('banzu')
          }else if (this.params.roleId == 4) {
            this.$router.push({
              path: '/manager/indexmaterial'
            })
          } else if(this.params.roleId == 1 & this.params.userName == 'gongjuzu') {
            this.$router.push({
              path: '/tool/metering'
            })
          }else if(this.params.roleId == 1 & this.params.userName == 'cailiaozu') {
            this.$router.push({
              path: '/teams/faultmaterial'
            })
          }else if (this.params.roleId == 5) {
            this.$router.push({
              path: '/technician/fault'
            })
            console.log('changke')

          }else if (this.params.roleId == 3 & this.params.userName == 'DTdcs') {
            this.$router.push({
              path: '/dtDcs/fault'
            })
            console.log('大同动车所')

          }
        } else {
          this.$message.error('用户名/密码/角色错误')
          loading.close()
          this.params.roleId = '1'

        }
      }).catch(err => {
        console.log(err)
        loading.close()
        this.$message.error("请重新填写用户名/密码/角色 ")
        this.params.roleId = '1'
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.bg {
  width: 100%;
  height: 100vh;
  background: url('../assets/login/bg.jpg') no-repeat;
  background-size: cover;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center
}


#login_box {
  width: 40%;
  height: 280px;
  background-color: #010101c4;
  margin: auto;
  text-align: center;
  border-radius: 10px;
  padding: 30px 50px 80px;
}

#login_box input,
#login_box button {
  outline: none;
}

#login_box h2 {
  color: #ffffff90;
  margin-top: 5%;
}

#login_box #form #input_box {
  margin-top: 5%;
}

#login_box #form #input_box input {
  border: 0;
  width: 60%;
  font-size: 15px;
  color: #ffffff;
  background: #ffffff00;
  border-bottom: 2px solid #ffffff;
  padding: 5px 10px;
  margin-top: 10px;
}

#login_box button {
  margin-top: 50px;
  width: 40%;
  height: 45px;
  border-radius: 10px;
  border: 0;
  color: #fff;
  font-size: 15px;
  background-image: linear-gradient(120deg, #93b0fb 0%, #8b93e8 100%);
  cursor: pointer;
}

#login_box #sign_up {
  margin-top: 45%;
}

#login_box #sign_up a {
  color: #b94648;
}
</style>

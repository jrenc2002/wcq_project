<template>
  <div class="loginav">
    <div class="loginbox boxall">
      <div class="logo">带式输送机多运行状态一体化智能监测系统</div>
      <div class="logintit"><span>欢迎使用</span></div>
      <form class="logininput" @submit.prevent="handleSubmit">
        <li>
          <i><img src="../assets/image/icon1.png"></i>
          <input v-model="formData.username" class="text-black" placeholder="用户名" size="10" type="text">
        </li>
        <li>
          <i><img src="../assets/image/icon2.png"></i>
          <input v-model="formData.password" class="text-black" placeholder="密码" type="password">
        </li>
        <li style="display: flex;">
          <button class="btn-primary" style="flex: 1;" type="submit" @click="handleSubmit">登录</button>
          <button class="btn-success" style="flex: 1;" type="button" @click="handleRegister">注册</button>
        </li>
      </form>
    </div>
  </div>
</template>
<script>
import axios from 'axios'
import Swal from 'sweetalert2'
import router from '../router'

export default {
  name: 'LoginForm',
  data () {
    return {
      formData: {
        username: '',
        password: ''
      },
      formErrors: {
        username: '',
        password: ''
      },
      error: ''
    }
  },
  methods: {
    handleSubmit () {
      const url = 'http://192.168.75.214:8080/userLogin/'
      const userData = {
        username: this.formData.username,
        password: this.formData.password
      }

      axios.post(url, userData)
        .then(response => {
          if (response.status === 200) {
            const access = response.data.access
            localStorage.setItem('token', access) // 存储 access 到 localStorage
            Swal.fire('登录成功', response.data.message, 'success').then(() => {
              // 点击 SweetAlert2 的确定按钮后跳转至 数据大屏页面，并将 username 作为查询参数传递
              const username = this.formData.username // 获取用户名
              const url = `main?username=${encodeURIComponent(username)}`

              localStorage.setItem('token', 'Bearer ' + response.data.access)
              // window.location.href = url;
              router.push('/main')
            })
          } else {
            Swal.fire('意外的状态码', `HTTP状态码: ${response.status}`, 'error')
          }
        })
        .catch(error => {
          if (error.response) {
            if (error.response.status === 401) {
              Swal.fire('登录失败', error.response.data.error, 'error')
            } else if (error.response.status === 400) {
              let title, text
              if ('username' in error.response.data && 'password' in error.response.data) {
                title = '用户名和密码未填写'
                text = 'These fields are required.'
              } else if ('username' in error.response.data) {
                title = '用户名未填写'
                text = error.response.data.username[0]
              } else if ('password' in error.response.data) {
                title = '密码未填写'
                text = error.response.data.password[0]
              } else {
                title = '登录失败'
                text = error.response.data.error
              }
              Swal.fire(title, text, 'error')
            }
          } else {
            Swal.fire('网络错误', error.message, 'error')
          }
        })
    },
    handleRegister () {
      const url = 'http://192.168.75.214:8080/userRegister/'
      const userData = {
        username: this.formData.username,
        password: this.formData.password
      }
      axios.post(url, userData)
        .then(response => {
          if (response.status === 201) {
            Swal.fire('注册成功', response.data.message, 'success')
          } else {
            Swal.fire('意外的状态码', `HTTP状态码: ${response.status}`, 'error')
          }
        })
        .catch(error => {
          if (error.response && error.response.status === 400) {
            let title, text
            if ('username' in error.response.data && 'password' in error.response.data) {
              title = '用户名、密码未填写'
              text = 'These fields are required.'
            } else if ('username' in error.response.data) {
              title = '用户名未填写'
              text = error.response.data.username[0]
            } else if ('password' in error.response.data) {
              title = '密码未填写'
              text = error.response.data.password[0]
            } else {
              title = '注册失败'
              text = error.response.data.error
            }

            Swal.fire(title, text, 'error')
          } else {
            Swal.fire('网络错误', error.message, 'error')
          }
        })
    }
  }
}
</script>
<style scoped>
* {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
  user-select: none;
}

li {
  list-style-type: none;
}

a {
  text-decoration: none;
  color: #fff;
}

html {
  background: #000;
  height: 100%;
}

.loginbg {
  background-image: linear-gradient(300deg, #004491, #1e88e5);
  position: absolute;
  width: 100%;
  height: 50%;
  left: 0;
  top: 0;
  z-index: 0
}

.loginav {
  max-width: 1300px;
  height: 100%;
  margin: 0 auto;
  z-index: 10;
  box-shadow: 0 0 30px rgba(0, 0, 0, .1);
  display: flex;
  align-items: center;
  justify-content: center;
  padding-bottom: 5%;
}

.loginbox {
  padding: 30px 0 50px 0;
  width: 1240px;
  height: 605px;
  padding: 30px 50px;
  background: url(@/assets/image/bg2.png) no-repeat center center;
  background-size: 100%;
  flex-shrink: 0;
  margin-top: 35px;
  z-index: 100;
}

.logininput {
  width: 1000px;
  margin: 0 auto;
}

.logininput {
  border: 1px solid #9ce7ff;
  border-radius: 5px;
  font-family: "PingFang SC", "Lantinghei SC", "Microsoft YaHei", "HanHei SC", "Helvetica Neue", "Open Sans", Arial, "Hiragino Sans GB", "微软雅黑", STHeiti, "WenQuanYi Micro Hei", SimSun, sans-serif;
  display: block;
  padding-left: 50px;
  font-size: 18px;
  color: #fff;
  line-height: 52px;
  outline: 0;
  text-indent: 1px;
  background: rgba(32, 163, 245, .1);
}

.logininput > li {
  display: block;
  padding: 12px 0;
  position: relative;

}

.logininput li > i {
  position: absolute;
  height: 100%;
  left: -35px;
  top: 0;
  display: flex;
  align-items: center;
}

.btn-primary {
  background: #20a3f5;
  display: block;
  text-align: center;
  color: #fff;
  line-height: 64px;
  font-size: 32px;
  transition: all .5s;
  border-radius: 6px;
  margin-left: -50px;
}

.btn-primary:hover {
  background: #137bd6
}

.btn-success {
  background: #5cb85a;
  display: block;
  text-align: center;
  color: #fff;
  line-height: 64px;
  font-size: 32px;
  transition: all .5s;
  border-radius: 6px;
}

.btn-success:hover {
  background: #4cae4c
}

.logintit {
  padding: 20px 0;
  font-size: 24px;
  display: flex;
  justify-content: center;
}

.logintit span {
  border-bottom: 3px solid #fff;
  padding-bottom: 10px;
  color: #fff;
  font-size: 24px;;
}

.logo {
  width: 100%;
  left: 0;
  display: flex;
  justify-content: center;
  font-size: 32px;
  margin-top: 30px;
  font-weight: bold;
  letter-spacing: 2px;
  background: linear-gradient(90deg, #04a8f0, #46daff, #4177ed, #04a8f0, #46daff, #4177ed, #04a8f0, #46daff, #4177ed);
  background-size: cover;
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  font-family: "Microsoft YaHei", "HanHei SC", "Helvetica Neue", "Open Sans", Arial, "Hiragino Sans GB", "微软雅黑", STHeiti, "WenQuanYi Micro Hei", SimSun, sans-serif;
}

.text-danger {
  color: #a94442;
}

a.text-danger:hover,
a.text-danger:focus {
  color: #843534;
}

.boxall {
  transform: scale(.5);
  opacity: 0;
  animation: shows 1.5s forwards;
}

@keyframes shows {
  to {
    transform: scale(1);
    opacity: 1;
  }
}

@media (max-width: 1200px) {
  .loginbox {
    width: 100%;
    height: auto;
    background: none;
    padding: 0 15px;
  }

  .logininput {
    width: 100%;
  }

  .logo {
    font-size: 36px;
  }

  .logintit span {
    font-size: 16px;
  }

  .btn-primary {
    font-size: 18px;
    line-height: 52px;
  }

  .loginav {
    backdrop-filter: blur(6px);
  }
}

.logininput li {
  display: flex;
  align-items: center;
  margin: 10px 0;
}

.logininput li i {
  flex: 0 0 auto;
  margin-right: 10px;
}

.logininput li input {
  flex: 1;
}

.logininput li {
  display: flex;
  align-items: center;
  margin: 10px 0;
}

.logininput li i {
  flex: 0 0 auto;
  margin-right: 10px;
  /* Adjust this margin to create space between icon and input */
}

.logininput li input {
  flex: 1;
}
</style>

<script setup lang="ts">
import { ref } from 'vue'
import { message } from 'ant-design-vue'

definePageMeta({
  layout: 'blank',
})

const router = useRouter()
const { setToken, setUser } = useAuth()
const { post } = useApi()

const loading = ref(false)
const form = ref({
  username: '',
  password: '',
})

const handleLogin = async () => {
  if (!form.value.username || !form.value.password) {
    message.warning('请输入用户名和密码')
    return
  }
  loading.value = true
  try {
    const res: any = await post('/auth/login', {
      username: form.value.username,
      password: form.value.password,
    })
    setToken(res.access_token)
    setUser(res.user)
    message.success('登录成功')
    router.push('/dashboard')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="login-container">
    <div class="login-box">
      <h1 class="login-title">壁纸管理后台</h1>
      <a-form layout="vertical">
        <a-form-item label="用户名">
          <a-input
            v-model:value="form.username"
            placeholder="请输入用户名"
            size="large"
            @pressEnter="handleLogin"
          />
        </a-form-item>
        <a-form-item label="密码">
          <a-input-password
            v-model:value="form.password"
            placeholder="请输入密码"
            size="large"
            @pressEnter="handleLogin"
          />
        </a-form-item>
        <a-button
          type="primary"
          size="large"
          block
          :loading="loading"
          @click="handleLogin"
        >
          登录
        </a-button>
      </a-form>
      <div class="login-tip">默认账号: admin / admin123</div>
    </div>
  </div>
</template>

<style scoped>
.login-container {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
.login-box {
  width: 400px;
  padding: 40px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}
.login-title {
  text-align: center;
  margin-bottom: 32px;
  color: #333;
  font-size: 24px;
}
.login-tip {
  margin-top: 16px;
  text-align: center;
  color: #999;
  font-size: 12px;
}
</style>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { message } from 'ant-design-vue'
import { UserOutlined, LockOutlined } from '@ant-design/icons-vue'

definePageMeta({
  layout: 'blank',
})

const router = useRouter()
const { setToken, setUser } = useAuth()
const { post } = useApi()

const loading = ref(false)
const form = reactive({
  username: '',
  password: '',
})
const formRef = ref()

const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, message: '用户名长度不能少于3位', trigger: 'blur' },
    { max: 20, message: '用户名长度不能超过20位', trigger: 'blur' },
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能少于6位', trigger: 'blur' },
    { max: 32, message: '密码长度不能超过32位', trigger: 'blur' },
  ],
}

const handleLogin = async () => {
  try {
    await formRef.value.validate()
  } catch {
    return
  }

  loading.value = true
  try {
    const res: any = await post('/auth/login', {
      username: form.username,
      password: form.password,
    })
    setToken(res.access_token)
    setUser(res.user)
    message.success('登录成功')
    router.push('/dashboard')
  } catch (err: any) {
    // 错误已由拦截器显示
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="login-page">
    <div class="login-wrapper">
      <div class="login-left">
        <div class="login-brand">
          <div class="login-logo">🖼️</div>
          <h1>壁纸管理后台</h1>
          <p>高效管理您的壁纸资源</p>
        </div>
      </div>

      <div class="login-right">
        <div class="login-card">
          <h2>欢迎登录</h2>
          <p class="login-subtitle">请输入您的账号密码</p>

          <a-form
            ref="formRef"
            :model="form"
            :rules="rules"
            layout="vertical"
            @finish="handleLogin"
          >
            <a-form-item name="username">
              <a-input
                v-model:value="form.username"
                placeholder="用户名"
                size="large"
                :prefix="h(UserOutlined)"
                @pressEnter="handleLogin"
              />
            </a-form-item>

            <a-form-item name="password">
              <a-input-password
                v-model:value="form.password"
                placeholder="密码"
                size="large"
                :prefix="h(LockOutlined)"
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
              登 录
            </a-button>
          </a-form>

          <div class="login-hint">
            默认账号：admin / admin123
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f0f2f5;
}

.login-wrapper {
  display: flex;
  width: 900px;
  min-height: 520px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
  overflow: hidden;
}

.login-left {
  width: 360px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  padding: 40px;
}

.login-brand {
  text-align: center;
}

.login-logo {
  font-size: 64px;
  margin-bottom: 24px;
}

.login-brand h1 {
  font-size: 28px;
  font-weight: 600;
  margin-bottom: 12px;
}

.login-brand p {
  font-size: 14px;
  opacity: 0.85;
}

.login-right {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
}

.login-card {
  width: 100%;
  max-width: 340px;
}

.login-card h2 {
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 4px;
  color: #1f1f1f;
}

.login-subtitle {
  color: #888;
  font-size: 14px;
  margin-bottom: 32px;
}

.login-hint {
  margin-top: 24px;
  padding: 12px 16px;
  background: #f6ffed;
  border: 1px solid #b7eb8f;
  border-radius: 6px;
  color: #52c41a;
  font-size: 13px;
  text-align: center;
}

@media (max-width: 768px) {
  .login-wrapper {
    width: 100%;
    min-height: auto;
    margin: 16px;
    flex-direction: column;
  }
  .login-left {
    width: 100%;
    padding: 32px;
    min-height: 200px;
  }
  .login-right {
    padding: 32px;
  }
}
</style>

<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  DashboardOutlined,
  PictureOutlined,
  FolderOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  LogoutOutlined,
  UserOutlined,
} from '@ant-design/icons-vue'

const route = useRoute()
const router = useRouter()
const { user, clearAuth } = useAuth()

const collapsed = ref(false)
const selectedKeys = computed(() => [route.path])

const menuItems = [
  { key: '/dashboard', icon: DashboardOutlined, label: '仪表盘' },
  { key: '/wallpapers', icon: PictureOutlined, label: '壁纸管理' },
  { key: '/categories', icon: FolderOutlined, label: '分类管理' },
]

const toggleCollapsed = () => {
  collapsed.value = !collapsed.value
}

const handleLogout = () => {
  clearAuth()
  router.push('/login')
}
</script>

<template>
  <a-layout style="min-height: 100vh">
    <a-layout-sider v-model:collapsed="collapsed" :trigger="null" collapsible>
      <div class="logo">
        <span v-if="!collapsed">壁纸后台</span>
        <span v-else>壁</span>
      </div>
      <a-menu
        :selected-keys="selectedKeys"
        theme="dark"
        mode="inline"
        @click="({ key }) => router.push(key)"
      >
        <a-menu-item v-for="item in menuItems" :key="item.key">
          <component :is="item.icon" />
          <span>{{ item.label }}</span>
        </a-menu-item>
      </a-menu>
    </a-layout-sider>

    <a-layout>
      <a-layout-header style="background: #fff; padding: 0 16px; display: flex; align-items: center; justify-content: space-between">
        <menu-fold-outlined v-if="collapsed" class="trigger" @click="toggleCollapsed" />
        <menu-unfold-outlined v-else class="trigger" @click="toggleCollapsed" />
        <div style="display: flex; align-items: center; gap: 12px">
          <a-avatar :icon="h(UserOutlined)" />
          <span>{{ user?.username || '管理员' }}</span>
          <a-button type="link" @click="handleLogout">
            <logout-outlined />
            退出
          </a-button>
        </div>
      </a-layout-header>

      <a-layout-content style="margin: 16px; padding: 16px; background: #fff; overflow: auto">
        <slot />
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<style scoped>
.logo {
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 18px;
  font-weight: bold;
  background: rgba(255, 255, 255, 0.1);
}
.trigger {
  font-size: 18px;
  line-height: 64px;
  padding: 0 24px;
  cursor: pointer;
  transition: color 0.3s;
}
.trigger:hover {
  color: #1890ff;
}
</style>
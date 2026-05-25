<script setup lang="ts">
import { ref, computed, h } from 'vue'
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
  <a-layout class="admin-layout">
    <a-layout-sider
      v-model:collapsed="collapsed"
      :trigger="null"
      collapsible
      theme="dark"
      class="admin-sider"
    >
      <div class="logo">
        <span v-if="!collapsed" class="logo-full">🖼️ 壁纸后台</span>
        <span v-else class="logo-icon">🖼️</span>
      </div>
      <a-menu
        :selected-keys="selectedKeys"
        theme="dark"
        mode="inline"
        class="admin-menu"
        @click="({ key }) => router.push(key)"
      >
        <a-menu-item v-for="item in menuItems" :key="item.key">
          <component :is="item.icon" />
          <span>{{ item.label }}</span>
        </a-menu-item>
      </a-menu>
    </a-layout-sider>

    <a-layout>
      <a-layout-header class="admin-header">
        <div class="header-left">
          <menu-fold-outlined v-if="collapsed" class="trigger" @click="toggleCollapsed" />
          <menu-unfold-outlined v-else class="trigger" @click="toggleCollapsed" />
        </div>
        <div class="header-right">
          <a-avatar :icon="h(UserOutlined)" class="user-avatar" />
          <span class="username">{{ user?.username || '管理员' }}</span>
          <a-dropdown>
            <a-button type="text" class="user-menu-btn">
              <logout-outlined />
            </a-button>
            <template #overlay>
              <a-menu>
                <a-menu-item @click="handleLogout">
                  <logout-outlined />
                  退出登录
                </a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>
        </div>
      </a-layout-header>

      <a-layout-content class="admin-content">
        <slot />
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<style scoped>
.admin-layout {
  min-height: 100vh;
}

.admin-sider {
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.15);
}

.logo {
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.logo-full {
  color: #fff;
  font-size: 16px;
  font-weight: 600;
}

.logo-icon {
  font-size: 24px;
}

.admin-menu {
  border-right: none;
}

.admin-header {
  background: #fff;
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
  z-index: 10;
}

.header-left {
  display: flex;
  align-items: center;
}

.trigger {
  font-size: 18px;
  cursor: pointer;
  transition: color 0.3s;
  padding: 8px;
}

.trigger:hover {
  color: #1890ff;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-avatar {
  background: #1890ff;
}

.username {
  font-size: 14px;
  color: #333;
}

.user-menu-btn {
  color: #666;
}

.admin-content {
  margin: 16px;
  padding: 16px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
  overflow: auto;
}
</style>
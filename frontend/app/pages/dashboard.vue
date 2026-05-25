<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { PictureOutlined, FolderOutlined, PlusOutlined } from '@ant-design/icons-vue'

const { get } = useApi()

const stats = ref({ wallpapers: 0, categories: 0, today: 0 })

onMounted(async () => {
  try {
    const [wpRes, catRes]: any = await Promise.all([
      get('/wallpapers', { pageSize: 1 }),
      get('/categories'),
    ])
    stats.value.wallpapers = wpRes?.total || 0
    stats.value.categories = catRes?.length || 0
  } catch {
    // ignore
  }
})
</script>

<template>
  <div>
    <h2>仪表盘</h2>
    <a-row :gutter="16" style="margin-top: 16px">
      <a-col :span="8">
        <a-card>
          <a-statistic title="壁纸总数" :value="stats.wallpapers">
            <template #prefix><PictureOutlined /></template>
          </a-statistic>
        </a-card>
      </a-col>
      <a-col :span="8">
        <a-card>
          <a-statistic title="分类总数" :value="stats.categories">
            <template #prefix><FolderOutlined /></template>
          </a-statistic>
        </a-card>
      </a-col>
      <a-col :span="8">
        <a-card>
          <a-statistic title="今日新增" :value="stats.today">
            <template #prefix><PlusOutlined /></template>
          </a-statistic>
        </a-card>
      </a-col>
    </a-row>

    <a-card title="快捷入口" style="margin-top: 16px">
      <a-space>
        <a-button type="primary" @click="navigateTo('/wallpapers')">管理壁纸</a-button>
        <a-button @click="navigateTo('/categories')">管理分类</a-button>
      </a-space>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed, h } from 'vue'
import { message, Modal } from 'ant-design-vue'
import {
  PlusOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
} from '@ant-design/icons-vue'

const { get, post, patch, del } = useApi()

const loading = ref(false)
const dataSource = ref<Wallpaper[]>([])
const total = ref(0)
const categories = ref<Category[]>([])
const query = reactive({
  page: 1,
  pageSize: 10,
  keyword: '',
  categoryId: undefined as number | undefined,
})

const modalVisible = ref(false)
const modalTitle = ref('')
const formRef = ref()
const form = reactive({
  id: undefined as number | undefined,
  title: '',
  description: '',
  categoryId: undefined as number | undefined,
  tags: [] as string[],
  status: 'ACTIVE' as 'ACTIVE' | 'DISABLED',
})
const fileList = ref<any[]>([])
const uploadFile = ref<File | null>(null)
const submitLoading = ref(false)

const previewVisible = ref(false)
const previewUrl = ref('')

const showPreview = (url: string) => {
  previewUrl.value = url
  previewVisible.value = true
}

const columns = [
  { title: 'ID', dataIndex: 'id', width: 80 },
  {
    title: '预览',
    dataIndex: 'imageUrl',
    width: 120,
    customRender: ({ text }: any) => {
      return h('img', {
        src: text,
        style: 'width: 80px; height: 60px; object-fit: cover; border-radius: 4px; cursor: pointer; border: 1px solid #f0f0f0;',
        onClick: () => showPreview(text),
        title: '点击预览',
      })
    },
  },
  { title: '标题', dataIndex: 'title', ellipsis: true },
  { title: '分类', dataIndex: 'category', customRender: ({ text }: any) => text?.name || '-' },
  { title: '状态', dataIndex: 'status', customRender: ({ text }: any) => text === 'ACTIVE' ? '启用' : '禁用' },
  { title: '创建时间', dataIndex: 'createdAt', customRender: ({ text }: any) => new Date(text).toLocaleString() },
  { title: '操作', key: 'action', width: 150, fixed: 'right' },
]

const fetchData = async () => {
  loading.value = true
  try {
    const res: any = await get('/wallpapers', query)
    dataSource.value = res.list
    total.value = res.total
  } finally {
    loading.value = false
  }
}

const fetchCategories = async () => {
  categories.value = await get('/categories') as Category[]
}

const handleSearch = () => {
  query.page = 1
  fetchData()
}

const handleReset = () => {
  query.keyword = ''
  query.categoryId = undefined
  query.page = 1
  fetchData()
}

const handleAdd = () => {
  modalTitle.value = '新增壁纸'
  Object.assign(form, { id: undefined, title: '', description: '', categoryId: undefined, tags: [], status: 'ACTIVE' })
  fileList.value = []
  uploadFile.value = null
  modalVisible.value = true
}

const handleEdit = (record: Wallpaper) => {
  modalTitle.value = '编辑壁纸'
  Object.assign(form, {
    id: record.id,
    title: record.title,
    description: record.description || '',
    categoryId: record.categoryId,
    tags: record.tags || [],
    status: record.status,
  })
  fileList.value = []
  uploadFile.value = null
  modalVisible.value = true
}

const handleDelete = (record: Wallpaper) => {
  Modal.confirm({
    title: '确认删除',
    content: `确定要删除壁纸 "${record.title}" 吗？`,
    async onOk() {
      await del(`/wallpapers/${record.id}`)
      message.success('删除成功')
      fetchData()
    },
  })
}

const handleSubmit = async () => {
  await formRef.value.validate()

  // 新增模式必须上传图片
  if (!form.id && !uploadFile.value) {
    message.warning('请上传图片')
    // 抛出错误阻止 Modal 关闭
    throw new Error('请上传图片')
  }

  submitLoading.value = true
  try {
    const formData = new FormData()
    formData.append('title', form.title)
    formData.append('description', form.description || '')
    if (form.categoryId) formData.append('categoryId', String(form.categoryId))
    formData.append('tags', JSON.stringify(form.tags))
    formData.append('status', form.status)

    if (uploadFile.value) {
      formData.append('file', uploadFile.value)
    }

    if (form.id) {
      await patch(`/wallpapers/${form.id}`, formData)
      message.success('更新成功')
    } else {
      await post('/wallpapers', formData)
      message.success('创建成功')
    }
    modalVisible.value = false
    fetchData()
  } finally {
    submitLoading.value = false
  }
}

const beforeUpload = (file: File) => {
  uploadFile.value = file
  fileList.value = [{
    uid: Date.now().toString(),
    name: file.name,
    status: 'done',
    url: URL.createObjectURL(file),
  }]
  return false
}

const pagination = computed(() => ({
  total: total.value,
  current: query.page,
  pageSize: query.pageSize,
  showSizeChanger: true,
  showTotal: (total: number) => `共 ${total} 条`,
}))

const handleTableChange = (pag: any) => {
  query.page = pag.current
  query.pageSize = pag.pageSize
  fetchData()
}

onMounted(() => {
  fetchData()
  fetchCategories()
})
</script>

<template>
  <div>
    <h2>壁纸管理</h2>

    <a-card style="margin-top: 16px">
      <a-space style="margin-bottom: 16px">
        <a-input
          v-model:value="query.keyword"
          placeholder="搜索标题"
          style="width: 200px"
          @pressEnter="handleSearch"
        >
          <template #prefix>
            <SearchOutlined />
          </template>
        </a-input>
        <a-select
          v-model:value="query.categoryId"
          placeholder="选择分类"
          style="width: 160px"
          allowClear
        >
          <a-select-option v-for="cat in categories" :key="cat.id" :value="cat.id">
            {{ cat.name }}
          </a-select-option>
        </a-select>
        <a-button type="primary" @click="handleSearch">搜索</a-button>
        <a-button @click="handleReset">重置</a-button>
        <a-button type="primary" @click="handleAdd">
          <PlusOutlined /> 新增壁纸
        </a-button>
      </a-space>

      <a-table
        :columns="columns"
        :data-source="dataSource"
        :loading="loading"
        :pagination="pagination"
        row-key="id"
        @change="handleTableChange"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'action'">
            <a-space>
              <a-button type="link" size="small" @click="handleEdit(record)">
                <EditOutlined /> 编辑
              </a-button>
              <a-button type="link" danger size="small" @click="handleDelete(record)">
                <DeleteOutlined /> 删除
              </a-button>
            </a-space>
          </template>
        </template>
      </a-table>
    </a-card>

    <a-modal
      v-model:open="modalVisible"
      :title="modalTitle"
      :confirm-loading="submitLoading"
      @ok="handleSubmit"
    >
      <a-form ref="formRef" :model="form" layout="vertical">
        <a-form-item label="标题" name="title" :rules="[{ required: true, message: '请输入标题' }]">
          <a-input v-model:value="form.title" />
        </a-form-item>
        <a-form-item label="描述" name="description">
          <a-textarea v-model:value="form.description" :rows="3" />
        </a-form-item>
        <a-form-item label="分类" name="categoryId">
          <a-select v-model:value="form.categoryId" allowClear placeholder="选择分类">
            <a-select-option v-for="cat in categories" :key="cat.id" :value="cat.id">
              {{ cat.name }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="标签" name="tags">
          <a-select v-model:value="form.tags" mode="tags" placeholder="输入标签" />
        </a-form-item>
        <a-form-item label="状态" name="status">
          <a-radio-group v-model:value="form.status">
            <a-radio value="ACTIVE">启用</a-radio>
            <a-radio value="DISABLED">禁用</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item label="图片">
          <div v-if="form.id && fileList.length === 0" style="margin-bottom: 12px;">
            <img
              :src="dataSource.find((w) => w.id === form.id)?.imageUrl"
              style="width: 120px; height: 90px; object-fit: cover; border-radius: 4px;"
            />
            <div style="color: #999; font-size: 12px; margin-top: 4px;">
              当前图片，上传新图片将替换此图
            </div>
          </div>
          <a-upload
            :file-list="fileList"
            :before-upload="beforeUpload"
            :max-count="1"
            accept="image/*"
            list-type="picture-card"
          >
            <div v-if="fileList.length === 0">
              <PlusOutlined />
              <div style="margin-top: 8px">
                {{ form.id ? '替换图片' : '上传图片' }}
              </div>
            </div>
          </a-upload>
        </a-form-item>
      </a-form>
    </a-modal>

    <a-modal
      v-model:open="previewVisible"
      :footer="null"
      :title="null"
      width="800px"
      @cancel="previewVisible = false"
    >
      <img :src="previewUrl" style="width: 100%; display: block;" />
    </a-modal>
  </div>
</template>

<style scoped>
h2 {
  margin-bottom: 0;
}
</style>

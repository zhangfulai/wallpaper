<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { message, Modal } from 'ant-design-vue'
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons-vue'

const { get, post, patch, del } = useApi()

const loading = ref(false)
const dataSource = ref<Category[]>([])

const modalVisible = ref(false)
const modalTitle = ref('')
const formRef = ref()
const form = reactive({
  id: undefined as number | undefined,
  name: '',
  description: '',
  sort: 0,
})
const submitLoading = ref(false)

const columns = [
  { title: 'ID', dataIndex: 'id', width: 80 },
  { title: '名称', dataIndex: 'name' },
  { title: '描述', dataIndex: 'description', ellipsis: true },
  { title: '排序', dataIndex: 'sort', width: 100 },
  { title: '壁纸数量', dataIndex: '_count', customRender: ({ text }: any) => String(text?.wallpapers || 0) },
  { title: '创建时间', dataIndex: 'createdAt', customRender: ({ text }: any) => new Date(text).toLocaleString() },
  { title: '操作', key: 'action', width: 150 },
]

const fetchData = async () => {
  loading.value = true
  try {
    dataSource.value = await get('/categories') as Category[]
  } finally {
    loading.value = false
  }
}

const handleAdd = () => {
  modalTitle.value = '新增分类'
  Object.assign(form, { id: undefined, name: '', description: '', sort: 0 })
  modalVisible.value = true
}

const handleEdit = (record: Category) => {
  modalTitle.value = '编辑分类'
  Object.assign(form, { id: record.id, name: record.name, description: record.description || '', sort: record.sort })
  modalVisible.value = true
}

const handleDelete = (record: Category) => {
  Modal.confirm({
    title: '确认删除',
    content: `确定要删除分类 "${record.name}" 吗？`,
    async onOk() {
      await del(`/categories/${record.id}`)
      message.success('删除成功')
      fetchData()
    },
  })
}

const handleSubmit = async () => {
  await formRef.value.validate()
  submitLoading.value = true
  try {
    if (form.id) {
      await patch(`/categories/${form.id}`, { name: form.name, description: form.description, sort: form.sort })
      message.success('更新成功')
    } else {
      await post('/categories', { name: form.name, description: form.description, sort: form.sort })
      message.success('创建成功')
    }
    modalVisible.value = false
    fetchData()
  } finally {
    submitLoading.value = false
  }
}

onMounted(fetchData)
</script>

<template>
  <div>
    <h2>分类管理</h2>
    <a-card style="margin-top: 16px">
      <a-space style="margin-bottom: 16px">
        <a-button type="primary" @click="handleAdd">
          <PlusOutlined /> 新增分类
        </a-button>
      </a-space>
      <a-table :columns="columns" :data-source="dataSource" :loading="loading" row-key="id">
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

    <a-modal v-model:open="modalVisible" :title="modalTitle" :confirm-loading="submitLoading" @ok="handleSubmit">
      <a-form ref="formRef" :model="form" layout="vertical">
        <a-form-item label="名称" name="name" :rules="[{ required: true, message: '请输入分类名称' }]">
          <a-input v-model:value="form.name" />
        </a-form-item>
        <a-form-item label="描述" name="description">
          <a-textarea v-model:value="form.description" :rows="3" />
        </a-form-item>
        <a-form-item label="排序" name="sort">
          <a-input-number v-model:value="form.sort" style="width: 100%" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<style scoped>
h2 { margin-bottom: 0; }
</style>
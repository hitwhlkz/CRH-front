<template>
  <TechnicianLayout>
    <template #header>
      <h2 class="font-semibold text-xl text-gray-800 leading-tight">
        审批管理
      </h2>
    </template>

    <div class="py-12">
      <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
        <div class="bg-white overflow-hidden shadow-xl sm:rounded-lg p-6">
          <!-- 在这里添加审批管理的具体内容 -->
          <p>这里是审批管理页面的内容</p>
        </div>
      </div>
    </div>
  </TechnicianLayout>
</template>

<script>
import TechnicianLayout from '@/Pages/Technician/TechnicianLayout.vue'

export default {
  components: {
    TechnicianLayout,
  },
}
</script>

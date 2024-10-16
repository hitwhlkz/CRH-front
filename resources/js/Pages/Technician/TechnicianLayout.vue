<template>
  <div>
    <!-- 现有代码 -->
    <aside>
      <nav>
        <ul>
          <!-- 现有的导航项 -->
          <li>
            <Link :href="route('technician.team')" :class="{ 'bg-gray-900 text-white': $page.component.startsWith('Technician/Team') }">
              班组管理
            </Link>
          </li>
          <li>
            <Link :href="route('technician.fault')" :class="{ 'bg-gray-900 text-white': $page.component.startsWith('Technician/Fault') }">
              故障管理
            </Link>
          </li>
          <!-- 新增审批管理导航项 -->
          <li>
            <Link :href="route('technician.approval')" :class="{ 'bg-gray-900 text-white': $page.component.startsWith('Technician/Approval') }">
              审批管理
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
    <!-- 其他现有代码 -->
  </div>
</template>

<script>
// 现有的 import 语句
import { Link } from '@inertiajs/vue3'

export default {
  components: {
    Link,
    // 其他组件
  },
  // 其他现有代码
}
</script>

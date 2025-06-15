<template>
  <div class="max-w-4xl mx-auto p-6 bg-white shadow rounded-lg mt-10">
    <h2 class="text-3xl font-bold mb-6 border-b pb-2">🧑‍💻 My Jira Issues</h2>

    <div v-if="pending" class="text-gray-500">Loading...</div>
    <div v-else-if="error" class="text-red-500">❌ {{ error.message }}</div>

    <div v-else>
      <div class="mb-6 flex gap-2 items-center">
        <label for="status" class="font-semibold">Filter by Status:</label>
        <select v-model="selectedStatus" @change="fetchFiltered" class="border rounded px-2 py-1 text-sm">
          <option>All</option>
          <option v-for="(count, status) in allStatusCounts" :key="status" :value="status">
            {{ status }}
          </option>
        </select>
      </div>
      <!-- Status Counts -->
      <div class="mb-6">
        <h3 class="text-xl font-semibold mb-2">🗂 Issue Count by Status</h3>
        <ul class="grid grid-cols-2 sm:grid-cols-3 gap-2 text-sm">
          <li v-for="(count, status) in statusCounts" :key="status" class="bg-gray-100 px-3 py-2 rounded text-center">
            <span class="font-medium text-gray-700">{{ status }}</span>: {{ count }}
          </li>
        </ul>
      </div>

      <!-- Issue List -->
      <ul class="space-y-4">
        <li v-for="issue in issues" :key="issue.id" class="border rounded p-4 hover:shadow transition duration-200">
          <div class="text-lg font-semibold text-blue-600">
            {{ issue.key }} - {{ issue.fields.summary }}
          </div>
          <div class="text-sm text-gray-500 mt-1">📅 Created: {{ formatDate(issue.fields.created) }}</div>
          <div class="text-sm mt-2">
            <span class="text-gray-700 font-medium">Status:</span> {{ issue.fields.status.name }} |
            <span class="text-gray-700 font-medium">Priority:</span> {{ issue.fields.priority.name }}
          </div>
<!--  -->
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
const selectedStatus = ref('All')
const issues = ref<any[]>([])
const allStatusCounts = ref({})
const pending = ref(false)
const error = ref<any>(null)
const statusCounts = ref({})


function formatDate(date: string) {
  return new Date(date).toLocaleDateString()
}


async function fetchFiltered() {
  try {
    pending.value = true
    error.value = null
    const res = await $fetch<{ issues: any[], statusCounts: Record<string, number> }>('/api/jira/me', {
      params: { status: selectedStatus.value }
    })
    issues.value = res.issues 
    statusCounts.value = res.statusCounts
    allStatusCounts.value = res.statusCounts
  } catch (err) {
    error.value = err
  } finally {
    pending.value = false
  }
}

// Initial fetch
onMounted(fetchFiltered)
</script>

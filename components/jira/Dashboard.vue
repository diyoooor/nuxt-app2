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
        <li v-for="issue in issues" :key="issue.id" @click="openEdit(issue)"
          class="border rounded p-4 hover:shadow transition duration-200">
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

    <!-- Edit Modal -->
    <div v-if="editingIssue" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 w-[400px] shadow-lg">
        <h3 class="text-xl font-semibold mb-4">Edit {{ editingIssue.key }}</h3>

        <!-- Edit Modal Fields -->
        <div class="mb-3">
          <label class="block text-sm font-medium">Summary</label>
          <input v-model="editForm.summary" class="w-full border px-2 py-1 rounded text-sm" />
        </div>

        <div class="mb-3">
          <label class="block text-sm font-medium">Dev Estimate (e.g., 3d)</label>
          <input v-model="editForm.devEstimate" class="w-full border px-2 py-1 rounded text-sm" />
        </div>

        <div class="mb-3">
          <label class="block text-sm font-medium">Dev Start Date</label>
          <input type="date" v-model="editForm.devStartDate" class="w-full border px-2 py-1 rounded text-sm" />
        </div>

        <div class="mb-3">
          <label class="block text-sm font-medium">Dev End Date</label>
          <input type="date" v-model="editForm.devEndDate" class="w-full border px-2 py-1 rounded text-sm" />
        </div>

        <div class="mb-3">
          <label class="block text-sm font-medium">Change Status</label>
          <select v-model="editForm.statusId" class="w-full border px-2 py-1 rounded text-sm">
            <option value="">Keep Current</option>
            <option v-for="t in transitions" :key="t.id" :value="t.id">
              {{ t.name }}
            </option>
          </select>
        </div>

        <div class="mb-3">
          <label class="block text-sm font-medium">Add Comment</label>
          <textarea v-model="editForm.comment" rows="3" class="w-full border px-2 py-1 rounded text-sm"></textarea>
        </div>


        <div class="flex justify-end gap-2 mt-4">
          <button @click="cancelEdit" class="text-sm px-3 py-1 bg-gray-200 rounded">Cancel</button>
          <button @click="saveEdit" class="text-sm px-3 py-1 bg-blue-600 text-white rounded">Save</button>
        </div>
      </div>
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
const editingIssue = ref<any>(null)
const editForm = ref({
  summary: '',
  devEstimate: '',
  devStartDate: '',
  devEndDate: '',
  statusId: '',
  comment: ''
})

const transitions = ref<any[]>([])


async function openEdit(issue: any) {
  editingIssue.value = issue
  editForm.value.summary = issue.fields.summary
  editForm.value.devEstimate = issue.fields.customfield_12345 || '' // <-- replace with real IDs
  editForm.value.devStartDate = issue.fields.customfield_23456 || ''
  editForm.value.devEndDate = issue.fields.customfield_34567 || ''
  editForm.value.comment = ''

  // Fetch available transitions
  const res = await $fetch<{ transitions: any[] }>(`/api/jira/transitions?issueKey=${issue.key}`)
  transitions.value = res.transitions || []
  editForm.value.statusId = ''
}

function cancelEdit() {
  editingIssue.value = null
}

async function saveEdit() {
  const issueKey = editingIssue.value.key

  await $fetch('/api/jira/update', {
    method: 'POST',
    body: {
      issueKey,
      fields: {
        summary: editForm.value.summary,
        customfield_12345: editForm.value.devEstimate,
        customfield_23456: editForm.value.devStartDate,
        customfield_34567: editForm.value.devEndDate
      },
      transitionId: editForm.value.statusId || undefined,
      comment: editForm.value.comment || undefined
    }
  })

  editingIssue.value = null
  await fetchFiltered()
}

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

<template>
  <div class="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow bg-white">
    <div class="flex justify-between items-start">
      <a :href="`https://${jiraHost}/browse/${issue.key}`"
        target="_blank"
        class="text-blue-600 hover:underline font-semibold"
        >
        {{ issue.key }}
      </a>
      <span class="text-xs font-medium px-2 py-1 rounded-full"
        :style="{ backgroundColor: issue.fields.status.statusCategory.colorName.replace('medium-gray', '#dfe1e6') }">
        {{ issue.fields.status.name }}
      </span>
    </div>
    <p class="mt-2 text-gray-800">{{ issue.fields.summary }}</p>
  </div>
</template>

<script setup lang="ts">
// กำหนด Type ของ Prop ที่รับเข้ามา
interface JiraIssue {
  key: string;
  fields: {
    summary: string;
    status: {
      name: string;
      statusCategory: {
        colorName: string;
      };
    };
  };
}

defineProps<{
  issue: JiraIssue;
  jiraHost: string;
}>();
</script>

// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  runtimeConfig: {
    jiraDomain: process.env.JIRA_DOMAIN,
    jiraEmail: process.env.JIRA_EMAIL,
    jiraApiKey: process.env.JIRA_API_KEY,
    public: {
    }
  },
  vite: {
    plugins: [
      tailwindcss(),
    ],
  },
})

<template>
  <n-config-provider :theme="theme" :theme-overrides="themeOverrides" abstract preflight-style-disabled inline-theme-disabled>
    <n-message-provider>
      <n-notification-provider :max="3" :scrollable="false">
        <n-dialog-provider>
          <n-modal-provider>
            <router-view />
          </n-modal-provider>
        </n-dialog-provider>
      </n-notification-provider>
    </n-message-provider>
  </n-config-provider>
</template>

<script setup>
import { theme, themeOverrides } from "@/hooks/useTheme"
</script>

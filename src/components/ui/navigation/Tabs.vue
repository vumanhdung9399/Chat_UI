<template>
  <div class="tabs">
    <div class="tabs-header">
      <button
        v-for="(tab, index) in tabs"
        :key="index"
        class="tab-button"
        :class="{ active: activeTab === index }"
        @click="selectTab(index)"
      >
        {{ tab.label }}
      </button>
    </div>
    <div class="tabs-content">
      <slot :name="`tab-${activeTab}`"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineComponent, PropType, ref } from "vue";

const props = defineProps({
  tabs: {
    type: Array as PropType<{ label: string }[]>,
    required: true,
  },
  defaultActive: {
    type: Number,
    default: 0,
  },
});

const emit = defineEmits<{
  (e: "tab-changed", index: number): void;
}>();

const activeTab = ref(props.defaultActive);

const selectTab = (index: number) => {
  activeTab.value = index;
  emit("tab-changed", index);
};
</script>

<style scoped>
.tabs {
  border-radius: 4px;
}
.tabs-header {
  display: flex;
  background: #f9f9f9;
}
.tab-button {
  flex: 1;
  padding: 5px 2px;
  cursor: pointer;
  background: transparent;
  border: none;
  outline: none;
  text-align: center;
  font-size: 13px;
}
.tab-button.active {
  background: white;
  font-weight: bold;
}
.tabs-content {
  padding-top: 10px;
}
</style>

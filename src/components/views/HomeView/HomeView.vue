<script setup lang="ts">
import { computed, onMounted, onUnmounted } from "vue";

import useStore from "@src/store/store";

import Chat from "@/components/views/HomeView/Chat/Chat.vue";
import Navigation from "@/components/views/HomeView/Navigation/Navigation.vue";
import Sidebar from "@/components/views/HomeView/Sidebar/Sidebar.vue";
import NoChatSelected from "@/components/states/empty-states/NoChatSelected.vue";
import Loading3 from "@src/components/states/loading-states/Loading3.vue";
import FadeTransition from "@src/components/ui/transitions/FadeTransition.vue";
import { useAuthStore } from "@src/store/authStore";
import { useContactStore } from "@src/store/contactStore";

const store = useStore();
const authStore = useAuthStore();
const contactStore = useContactStore();

let ws:any;


// the active chat component or loading component.
const activeChatComponent = computed(() => {
  if (store.status === "loading" || store.delayLoading) {
    return Loading3;
  } else if (store.activeConversationId) {
    return Chat;
  } else {
    return NoChatSelected;
  }
});

onMounted(() => {
  ws = new WebSocket("ws://localhost:8080");
  
  ws.onopen = () => {
    ws.send(JSON.stringify({ type: "identify", userId:  authStore.user.id})); // Thay thế `userId` với ID người dùng của bạn
  };
  ws.onmessage = (event: any) => {
    const data = JSON.parse(event.data);
    // if (data.type === "contactsStatus") {
    //   contactStore.showOnline(data.contacts);
    // }

    if (data.type === "contactStatusChange") {
      contactStore.showOnOff(data.contactId, data.isOnline);
    }
  };

  // Xử lý khi WebSocket đóng
  ws.onclose = () => {
    console.log("WebSocket connection closed");
  };
});

onUnmounted(() => {
  if (ws) ws.close();
})
</script>

<template>
  <KeepAlive>
    <div
      class="xs:relative md:static h-full flex xs:flex-col md:flex-row overflow-hidden"
    >
      <!--navigation-bar-->
      <Navigation class="xs:order-1 md:-order-none" />
      <!--sidebar-->
      <Sidebar
        class="xs:grow-1 md:grow-0 xs:overflow-y-scroll md:overflow-visible scrollbar-hidden"
      />
      <!--chat-->
      <div
        id="mainContent"
        class="xs:absolute xs:z-10 md:static grow h-full xs:w-full md:w-fit scrollbar-hidden bg-white dark:bg-gray-800 transition-all duration-500"
        :class="
          store.conversationOpen === 'open'
            ? ['xs:left-[0px]', 'xs:static']
            : ['xs:left-[1000px]']
        "
        role="region"
      >
        <FadeTransition name="fade" mode="out-in">
          <component
            :is="activeChatComponent"
            :key="store.activeConversationId"
          />
        </FadeTransition>
      </div>
    </div>
  </KeepAlive>
</template>

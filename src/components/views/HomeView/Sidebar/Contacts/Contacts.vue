<script setup lang="ts">
import { UserPlusIcon } from "@heroicons/vue/24/outline";
import type { IContact, IContactGroup, IUser } from "@src/types";
import { onBeforeUnmount, onMounted, onUnmounted, Ref } from "vue";
import { ref, watch } from "vue";

import useStore from "@src/store/store";

import AddContactModal from "@/components/shared/modals/AddContactModal.vue";
import NoContacts from "@/components/states/empty-states/NoContacts.vue";
import Loading2 from "@/components/states/loading-states/Loading2.vue";
import IconButton from "@/components/ui/inputs/IconButton.vue";
import SearchInput from "@/components/ui/inputs/SearchInput.vue";
import SortedContacts from "@/components/views/HomeView/Sidebar/Contacts/SortedContacts.vue";
import SidebarHeader from "@/components/views/HomeView/Sidebar/SidebarHeader.vue";
import { useContactStore } from "@src/store/contactStore";

const store = useStore();
const contactStore = useContactStore();

const searchText: Ref<string> = ref("");

const openModal = ref(false);

// html element containing the contact groups
const contactContainer: Ref<HTMLElement | null> = ref(null);

// contact groups filtered by search text
const filteredContactGroups: Ref<IContactGroup[] | undefined> = ref(
  contactStore.contactGroups
);

onMounted(() => {
  // contactStore.getContact();
  filteredContactGroups.value = contactStore.contactGroups
});

// update the filtered contact groups based on the search text
watch(searchText, () => {
  filteredContactGroups.value = contactStore.contactGroups
    ?.map((group) => {
      let newGroup = { ...group };

      newGroup.contacts = newGroup.contacts.filter((contact: IContact) => {
        if (
          contact.fullName
            .toLowerCase()
            .includes(searchText.value.toLowerCase())
        )
          return true;
      });

      return newGroup;
    })
    .filter((group) => group.contacts.length > 0);
});
</script>

<template>
  <div>
    <SidebarHeader>
      <!--title-->
      <template v-slot:title>Contacts</template>

      <!--side actions-->
      <template v-slot:actions>
        <IconButton
          @click="openModal = true"
          class="w-7 h-7"
          title="add contacts"
          aria-label="add contacts"
        >
          <UserPlusIcon
            class="w-[20px] h-[20px] text-indigo-300 hover:text-indigo-400"
          />
        </IconButton>
      </template>
    </SidebarHeader>

    <!--search-->
    <div class="px-5 xs:pb-6 md:pb-5">
      <SearchInput v-model="searchText" />
    </div>

    <!--content-->
    <div
      ref="contactContainer"
      class="w-full h-full scroll-smooth scrollbar-hidden"
      style="overflow-x: visible; overflow-y: scroll"
    >
      <div v-if="store.status === 'loading' || store.delayLoading">
        <Loading2 v-for="(item, index) in 5" :key="index" />
      </div>

      <SortedContacts
        v-else-if="
          store.status === 'success' &&
          !store.delayLoading &&
          contactStore.contactGroups?.length > 0
        "
        :contactGroups="filteredContactGroups"
        :bottom-edge="contactContainer?.getBoundingClientRect().bottom"
      />

      <NoContacts v-else />
    </div>

    <!--add contact modal-->
    <AddContactModal
      :open-modal="openModal"
      :close-modal="() => (openModal = false)"
    />
  </div>
</template>

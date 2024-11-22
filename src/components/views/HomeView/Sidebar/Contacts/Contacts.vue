<script setup lang="ts">
import { UserPlusIcon, TrashIcon, CheckIcon } from "@heroicons/vue/24/outline";
import type { IContact, IContactGroup, IUser } from "@src/types";
import { onBeforeUnmount, onMounted, onUnmounted, Ref } from "vue";
import { ref, watch } from "vue";

import useStore from "@src/store/store";

import Typography from "@/components/ui/data-display/Typography.vue";
import AddContactModal from "@/components/shared/modals/AddContactModal.vue";
import NoContacts from "@/components/states/empty-states/NoContacts.vue";
import Loading2 from "@/components/states/loading-states/Loading2.vue";
import IconButton from "@/components/ui/inputs/IconButton.vue";
import SearchInput from "@/components/ui/inputs/SearchInput.vue";
import SortedContacts from "@/components/views/HomeView/Sidebar/Contacts/SortedContacts.vue";
import SidebarHeader from "@/components/views/HomeView/Sidebar/SidebarHeader.vue";
import CommonTab from "@/components/ui/navigation/Tabs.vue";
import { useContactStore } from "@src/store/contactStore";
import contactService from "@src/services/contactService";
import { toast } from "vue3-toastify";

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
const contactSend: Ref<IContact[] | undefined> = ref(contactStore.contactSend);
const contactWaitConf: Ref<IContact[] | undefined> = ref(
  contactStore.contactWaitConf
);

onMounted(() => {
  filteredContactGroups.value = contactStore.contactGroups;
  contactSend.value = contactStore.contactSend;
  contactWaitConf.value = contactStore.contactWaitConf;
});

const onApproveClicked = async (contact: IContact, index: number) => {
  const params = {
    contact_id: contact.contact_id,
  };

  try {
    const res = await contactService.approveFriend(params);
    if (res.status === 200) {
      toast.success(`Ban da la ban be voi ${contact.fullName}`);
      contactStore.getContact();
      contactStore.contactWaitConf?.splice(index, 1);
    } else {
      toast.error(res.data.message);
    }
  } catch (err) {
    console.log(err);
  }
};

const onDeleteClicked = async (
  contact: IContact,
  index: number,
  type: string
) => {
  const params = {
    users_id: contact.id,
  };
  try {
    const res = await contactService.delete(params);
    if (res.status === 200) {
      toast.success(`Xoa thanh cong ${contact.fullName}`);
      if (type === "send") {
        contactStore.contactSend?.splice(index, 1);
      } else if (type === "waitconf") {
        contactStore.contactWaitConf?.splice(index, 1);
      }
    } else {
      toast.error(res.data.message);
    }
  } catch (err) {
    console.log(err);
  }
};

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

watch(
  () => contactStore.contactGroups,
  (value) => {
    filteredContactGroups.value = value;
  },
  { deep: true }
);

watch(
  () => contactStore.contactSend,
  (value) => {
    contactSend.value = value;
  },
  { deep: true }
);

watch(
  () => contactStore.contactWaitConf,
  (value) => {
    contactWaitConf.value = value;
  },
  { deep: true }
);
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

    <CommonTab
      :tabs="[
        { label: 'Bạn bè' },
        { label: 'Đã gửi' },
        { label: 'Chờ xác nhận' },
      ]"
    >
      <template #tab-0>
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
      </template>
      <template #tab-1>
        <div v-for="(contact, index) in contactSend" :key="index">
          <div class="w-full p-5 flex justify-between items-center">
            <button
              class="w-full default-outline transition-all duration-200 ease-out"
              :aria-label="contact.fullName"
            >
              <div class="flex items-center">
                <div
                  :style="{
                    backgroundImage: `url(https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80)`,
                  }"
                  class="w-[36px] h-[36px] bg-cover bg-center rounded-full relative"
                ></div>
                <div class="flex items-center ml-4 items-contact-right">
                  <!--contact name-->
                  <Typography variant="heading-2">
                    {{ contact.fullName }}
                  </Typography>
                  <IconButton
                    class="w-7 h-7"
                    @click="onDeleteClicked(contact, index, 'send')"
                  >
                    <TrashIcon
                      class="w-[16px] h-[16px] text-indigo-300 hover:text-indigo-400 text-rose-700"
                    />
                  </IconButton>
                </div>
              </div>
            </button>
          </div>
        </div>
      </template>
      <template #tab-2>
        <div v-for="(contact, index) in contactWaitConf" :key="index">
          <div class="w-full p-5 flex justify-between items-center">
            <button
              class="w-full default-outline transition-all duration-200 ease-out"
              :aria-label="contact.fullName"
            >
              <div class="flex items-center">
                <div
                  :style="{
                    backgroundImage: `url(https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80)`,
                  }"
                  class="w-[36px] h-[36px] bg-cover bg-center rounded-full relative"
                ></div>
                <div class="flex items-center ml-4 items-contact-right">
                  <!--contact name-->
                  <Typography variant="heading-2">
                    {{ contact.fullName }}
                  </Typography>
                  <div class="flex items-center">
                    <IconButton
                      class="w-7 h-7"
                      @click="onApproveClicked(contact, index)"
                    >
                      <CheckIcon
                        class="w-[16px] h-[16px] text-indigo-300 hover:text-indigo-400 text-green-700"
                      />
                    </IconButton>
                    <IconButton
                      class="w-7 h-7"
                      @click="onDeleteClicked(contact, index, 'waitconf')"
                    >
                      <TrashIcon
                        class="w-[16px] h-[16px] text-indigo-300 hover:text-indigo-400 text-rose-700"
                      />
                    </IconButton>
                  </div>
                </div>
              </div>
            </button>
          </div>
        </div>
      </template>
    </CommonTab>
  </div>
</template>

<style scoped>
.items-contact-right {
  width: -webkit-fill-available;
  justify-content: space-between;
}
</style>

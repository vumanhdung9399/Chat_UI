<script setup lang="ts">
import type { IContact, IContactGroup } from "@src/types";
import type { Ref } from "vue";
import { ref } from "vue";

import {
  EllipsisVerticalIcon,
  InformationCircleIcon,
  TrashIcon,
} from "@heroicons/vue/24/outline";
import Typography from "@/components/ui/data-display/Typography.vue";
import IconButton from "@/components/ui/inputs/IconButton.vue";
import Dropdown from "@/components/ui/navigation/Dropdown/Dropdown.vue";
import DropdownLink from "@/components/ui/navigation/Dropdown/DropdownLink.vue";
import contactService from "@src/services/contactService";
import { toast } from "vue3-toastify";
import { useContactStore } from "@src/store/contactStore";

const props = defineProps<{
  contactGroups?: IContactGroup[];
  bottomEdge?: number;
}>();

const contactStore = useContactStore();

// the position of the dropdown menu.
const dropdownMenuPosition = ref(["top-6", "right-0"]);

// controll the states of contact dropdown menus
const dropdownMenuStates: Ref<boolean[][] | undefined> = ref(
  props.contactGroups?.map((contactGroup) => {
    let group = contactGroup.contacts.map(() => false);
    return group;
  })
);

// close all contact dropdown menus
const handleCloseAllMenus = () => {
  dropdownMenuStates.value = props.contactGroups?.map((contactGroup) => {
    let group = contactGroup.contacts.map(() => false);
    return group;
  });
};

// (event) open/close the selected dropdown menu.
const handleToggleDropdown = (
  event: Event,
  groupIndex: number,
  index: number
) => {
  if (props.bottomEdge) {
    let buttonBottom = (
      event.currentTarget as HTMLElement
    ).getBoundingClientRect().bottom;

    if (buttonBottom >= props.bottomEdge - 75) {
      dropdownMenuPosition.value = ["bottom-6", "right-0"];
    } else {
      dropdownMenuPosition.value = ["top-6", "right-0"];
    }
  }

  dropdownMenuStates.value = (dropdownMenuStates.value as boolean[][]).map(
    (group) => {
      return group.map((value, idx) => {
        if (idx === index) return value;
        else return false;
      });
    }
  );

  dropdownMenuStates.value[groupIndex][index] = !(
    dropdownMenuStates.value as boolean[][]
  )[groupIndex][index];
};

// (event) close doprdown menu when clicking outside
const handleClickOutside = (event: Event) => {
  let target = event.target as HTMLElement;
  let parentElement = target.parentElement as HTMLElement;

  if (
    target &&
    !target.classList.contains("open-menu") &&
    !(parentElement && parentElement.classList.contains("open-menu"))
  ) {
    handleCloseAllMenus();
  }
};

const onDeleteContactClicked = async (contact: IContact) => {
  const params = {
    users_id: contact.id
  }
  try {
    const res = await contactService.delete(params);
    if (res.status === 200) {
      contactStore.getContact();
      toast.success('Xoa lien he thanh cong')
    } else {
      toast.error(res.data.message)
    }
  } catch (err) {
    console.log(err);
  }
}
</script>

<template>
  <div v-for="(group, groupIndex) in props.contactGroups" :key="groupIndex">
    <!--group title-->
    <Typography variant="heading-3" class="w-full px-5 pb-3 pt-5">
      {{ group.letter }}
    </Typography>

    <!--contacts-->
    <div v-for="(contact, index) in group.contacts" :key="index">
      <div class="w-full p-5 flex justify-between items-center">
        <button
          class="default-outline transition-all duration-200 ease-out"
          :aria-label="contact.fullName"
        >
          <div class="flex items-center">
            <div
              :style="{
                backgroundImage: `url(https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80)`,
              }"
              class="w-[36px] h-[36px] bg-cover bg-center rounded-full relative"
            >
              <div v-if="contact.isOnline" class="w-[10px] h-[10px] bg-lime-500 rounded-full absolute bottom-[1px] right-[1px]"></div>
            </div>
            <div class="flex-row ml-4">
              <!--contact name-->
              <Typography variant="heading-2">
                {{ contact.fullName }}
              </Typography>
            </div>
          </div>
        </button>

        <!--dropdown menu-->
        <div class="relative">
          <!--dropdown menu button-->
          <IconButton
            :id="'open-contact-menu-' + index"
            :aria-expanded="dropdownMenuStates[groupIndex][index]"
            :aria-controls="'contact-menu-' + index"
            @click="(event) => handleToggleDropdown(event, groupIndex, index)"
            class="open-menu w-6 h-6"
            title="toggle contact menu"
            aria-label="toggle contact menu"
          >
            <EllipsisVerticalIcon
              class="open-menu h-5 w-5 text-black opacity-60 dark:text-white dark:opacity-70"
              tabindex="0"
            />
          </IconButton>

          <Dropdown
            :id="'contact-menu-' + index"
            :close-dropdown="handleCloseAllMenus"
            :handle-click-outside="handleClickOutside"
            :aria-labelledby="'open-contact-menu-' + index"
            :show="dropdownMenuStates[groupIndex][index]"
            :position="dropdownMenuPosition"
          >
            <DropdownLink>
              <InformationCircleIcon
                class="h-5 w-5 mr-3 text-black opacity-60 dark:text-white dark:opacity-70"
              />
              Personal information
            </DropdownLink>

            <DropdownLink color="danger" @click="onDeleteContactClicked(contact)">
              <TrashIcon class="h-5 w-5 mr-3" />
              Delete contact
            </DropdownLink>
          </Dropdown>
        </div>
      </div>
    </div>
  </div>
</template>

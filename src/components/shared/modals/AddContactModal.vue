<script setup lang="ts">
import Typography from "@/components/ui/data-display/Typography.vue";
import Button from "@/components/ui/inputs/Button.vue";
import TextInput from "@/components/ui/inputs/TextInput.vue";
import Modal from "@/components/ui/utils/Modal.vue";
import contactService from "@src/services/contactService";
import { useContactStore } from "@src/store/contactStore";
import { ref } from "vue";
import { toast } from "vue3-toastify";

const props = defineProps<{
  openModal: boolean;
  closeModal: () => void;
}>();

const contactStore = useContactStore();

const email = ref<string>('');

const onAddClicked = async () => {
  if (!email.value) {
    return
  }
  const params = {
    users_id: '',
    email: email.value
  }

  try {
    const res = await contactService.add(params);
    if (res.status == 200) {
      contactStore.getContactSend();
      toast.success('add contact success')
      props.closeModal()
    } else {
      toast.error(res.data.message)
    }
  } catch (err) {
    console.log(err);
  }
}
</script>

<template>
  <Modal :open="props.openModal" :closeModal="props.closeModal">
    <template v-slot:content>
      <div class="w-[300px] bg-white dark:bg-gray-800 rounded py-6">
        <!--modal header-->
        <div class="flex justify-between items-center px-5">
          <Typography
            id="modal-title"
            variant="heading-1"
            class="default-outline"
            tabindex="0"
          >
            Add Contact
          </Typography>

          <Button
            variant="outlined"
            color="danger"
            @click="props.closeModal"
            typography="body-4"
          >
            esc
          </Button>
        </div>

        <!--text input-->
        <div class="px-5 pb-5 pt-6">
          <TextInput type="text" placeholder="Email" @value-changed="
            (value) => {
              email = value;
            }
          "
          :value="email"/>
        </div>

        <!--submit button-->
        <div class="px-5">
          <Button class="w-full py-4" @click="onAddClicked"> Add </Button>
        </div>
      </div>
    </template>
  </Modal>
</template>

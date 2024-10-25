<script setup lang="ts">
import { ref, watch } from "vue";
import { useRouter, useRoute } from "vue-router";

import { EyeSlashIcon, EyeIcon } from "@heroicons/vue/24/outline";
import IconButton from "@src/components/ui/inputs/IconButton.vue";
import TextInput from "@src/components/ui/inputs/TextInput.vue";
import Button from "@src/components/ui/inputs/Button.vue";

import authService from "@src/services/authService";
import { useAuthStore } from "@src/store/authStore";
import { toast } from "vue3-toastify";

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();

const props = defineProps(['params']);

const showPassword = ref(false);
const showPasswordConfirm = ref(false);

const register = ref({});

const onRegisterClicked = async () => {
  try {
    const res = await authService.register(register.value);
    if (res.status === 200) {
      toast.success("success");
      router.push({
        name: "Login",
      });
    } else {
      toast.error(res.data.message);
    }
  } catch (err) {
    toast.error("Lỗi hệ thống, vui lòng thử lại");
  }
}

watch(() => props.params, (value) => {
  register.value = value;
}, {deep: true, immediate: true})
</script>

<template>
  <div>
    <div class="mb-5">
      <!--form-->
      <TextInput
        label="Password"
        placeholder="Enter your password"
        :type="showPassword ? 'text' : 'password'"
        class="pr-[40px] mb-5"
        @value-changed="
            (value) => {
              register.password = value;
            }
          "
          :value="register.password"
      >
        <template v-slot:endAdornment>
          <IconButton
            title="toggle password visibility"
            aria-label="toggle password visibility"
            class="m-[8px] p-2"
            @click="showPassword = !showPassword"
          >
            <EyeSlashIcon
              v-if="showPassword"
              class="w-5 h-5 text-black opacity-50 dark:text-white dark:opacity-60"
            />
            <EyeIcon
              v-else
              class="w-5 h-5 text-black opacity-50 dark:text-white dark:opacity-60"
            />
          </IconButton>
        </template>
      </TextInput>

      <TextInput
        label="Confirm Password"
        placeholder="Enter your password"
        :type="showPasswordConfirm ? 'text' : 'password'"
        @value-changed="
            (value) => {
              register.re_password = value;
            }
          "
          :value="register.re_password"
      >
        <template v-slot:endAdornment>
          <IconButton
            title="toggle password visibility"
            aria-label="toggle password visibility"
            class="m-[8px] p-2"
            @click="showPasswordConfirm = !showPasswordConfirm"
          >
            <EyeSlashIcon
              v-if="showPasswordConfirm"
              class="w-5 h-5 text-black opacity-50 dark:text-white dark:opacity-60"
            />
            <EyeIcon
              v-else
              class="w-5 h-5 text-black opacity-50 dark:text-white dark:opacity-60"
            />
          </IconButton>
        </template>
      </TextInput>
    </div>

    <!--controls-->
    <div class="mb-5">
      <Button class="w-full mb-4" @click="onRegisterClicked">Sign up</Button>
      <Button
        variant="outlined"
        class="w-full"
        @click="
          $emit('active-section-change', {
            sectionName: 'personal-section',
            animationName: 'slide-right',
          })
        "
      >
        Back
      </Button>
    </div>
  </div>
</template>

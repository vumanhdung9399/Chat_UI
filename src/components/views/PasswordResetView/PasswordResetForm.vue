<script setup lang="ts">
import { ref } from "vue";
import { toast } from "vue3-toastify";
import { useRouter } from "vue-router";
import authService from "@src/services/authService";

import { EyeSlashIcon } from "@heroicons/vue/24/outline";

import IconButton from "@/components/ui/inputs/IconButton.vue";
import Button from "@/components/ui/inputs/Button.vue";
import TextInput from "@/components/ui/inputs/TextInput.vue";
import Typography from "@/components/ui/data-display/Typography.vue";

const router = useRouter();

const old_password = ref("");
const new_password = ref("");
const re_password = ref("");

const onResetClicked = async () => {
  try {
    let params = {
      old_password: old_password.value,
      new_password: new_password.value,
      re_password: re_password.value
    };
    const res = await authService.changePassword(params);
    if (res.status === 200) {
      toast.success("success");
      router.push({
        name: "HomePage",
      });
    } else {
      toast.error(res.data.message);
    }
  } catch (err) {
    toast.error("Lỗi hệ thống, vui lòng thử lại");
  }
};
</script>

<template>
  <div class="w-full p-5 flex flex-col justify-center items-center">
    <div class="mb-6 w-[350px]">
      <!--header-->
      <div class="mb-6 flex flex-col">
        <img
          src="@src/assets/vectors/logo-gradient.svg"
          class="w-[22px] h-[18px] mb-4 opacity-70"
          alt="bird logo"
        />
        <Typography variant="heading-2" class="mb-4"
          >Reset Your Password</Typography
        >
        <Typography variant="body-3" class="text-opacity-75 font-light">
          Enter your old password and your new password below to reset your
          password
        </Typography>
      </div>

      <!--form-->
      <div class="mb-6">
        <TextInput
          variant="bordered"
          label="Old Password"
          placeholder="Enter your password"
          class="mb-5"
          @value-changed="
            (value) => {
              old_password = value;
            }
          "
          :value="old_password"
        >
          <template v-slot:endAdornment>
            <IconButton
              variant="ghost"
              class="p-4"
              title="toggle show password"
              aria-label="toggle show password"
            >
              <EyeSlashIcon
                class="w-w-5 h-5 text-black opacity-50 dark:text-white dark:opacity-60"
              />
            </IconButton>
          </template>
        </TextInput>

        <TextInput
          variant="bordered"
          label="New Password"
          placeholder="Enter your password"
          class="mb-5"
          @value-changed="
            (value) => {
              new_password = value;
            }
          "
          :value="new_password"
        >
          <template v-slot:endAdornment>
            <IconButton
              variant="ghost"
              class="p-4"
              title="toggle show password"
              aria-label="toggle show password"
            >
              <EyeSlashIcon
                class="w-5 h-5 text-black opacity-50 dark:text-white dark:opacity-60"
              />
            </IconButton>
          </template>
        </TextInput>

        <TextInput
          variant="bordered"
          label="Confirm New Password"
          placeholder="Enter your password"
          @value-changed="
            (value) => {
              re_password = value;
            }
          "
          :value="re_password"
        >
          <template v-slot:endAdornment>
            <IconButton
              variant="ghost"
              class="p-4"
              title="toggle show password"
              aria-label="toggle show password"
            >
              <EyeSlashIcon
                class="w-5 h-5 text-black opacity-50 dark:text-white dark:opacity-60"
              />
            </IconButton>
          </template>
        </TextInput>
      </div>

      <!--controls-->
      <div>
        <Button class="w-full" @click="onResetClicked">Reset Password</Button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { toast } from "vue3-toastify";
import { useRouter } from "vue-router";
import authService from "@src/services/authService";

import { EyeSlashIcon } from "@heroicons/vue/24/outline";

import IconButton from "@/components/ui/inputs/IconButton.vue";
import Button from "@/components/ui/inputs/Button.vue";
import TextInput from "@/components/ui/inputs/TextInput.vue";
import Typography from "@/components/ui/data-display/Typography.vue";

import { useForm } from "vee-validate";
import * as yup from "yup";

const getSchema = () => {
  return yup.object({
    old_password: yup
      .string()
      .trim()
      .required("Vui long nhap mat khau cu")
      .min(8, "Do dai toi thieu la 4 ky tu")
      .max(50, "Do dai toi da laf 50 ky tu"),
    new_password: yup
      .string()
      .trim()
      .required("Vui long nhap mat khau moi")
      .min(8, "Do dai toi thieu la 8 ky tu")
      .max(50, "Do dai toi da laf 50 ky tu"),
    re_password: yup
      .string()
      .trim()
      .required("Vui long nhap lai mat khau moi")
      .oneOf(
        [yup.ref("new_password")],
        "Mat khau nhap lai phai trung voi mat khau moi da nhap"
      ),
  });
};

const schema = ref(getSchema());

const { defineField, handleSubmit, errors, setErrors } = useForm({
  validationSchema: schema,
});


const router = useRouter();

const [old_password] = defineField("old_password");
const [new_password] = defineField("new_password");
const [re_password] = defineField("re_password");

const styleError = computed(() => {
  return {
    old_password: `mb-1${errors.value.old_password ? " border !border-red-500" : ""}`,
    new_password: `pr-[40px] mb-1${errors.value.new_password ? " border !border-red-500" : ""}`,
    re_password: `mb-1${errors.value.re_password ? " border !border-red-500" : ""}`,
  };
});

const onResetClicked = handleSubmit(async (values) => {
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
});
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
          :class="styleError.old_password"
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
        <small class="block h-6 text-red-500">{{ errors.old_password }}</small>

        <TextInput
          variant="bordered"
          label="New Password"
          placeholder="Enter your password"
          :class="styleError.new_password"
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
        <small class="block h-6 text-red-500">{{ errors.new_password }}</small>

        <TextInput
          variant="bordered"
          label="Confirm New Password"
          placeholder="Enter your password"
          :class="styleError.re_password"
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
        <small class="block h-6 text-red-500">{{ errors.re_password }}</small>
      </div>

      <!--controls-->
      <div>
        <Button class="w-full" @click="onResetClicked">Reset Password</Button>
      </div>
    </div>
  </div>
</template>

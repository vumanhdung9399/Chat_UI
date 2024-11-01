<script setup lang="ts">
import { computed, ref } from "vue";
import { RouterLink, useRouter } from "vue-router";

import SlideTransition from "@/components/ui/transitions/SlideTransition.vue";
import Typography from "@/components/ui/data-display/Typography.vue";
import TextInput from "@/components/ui/inputs/TextInput.vue";
import Button from "@/components/ui/inputs/Button.vue";
import IconButton from "@/components/ui/inputs/IconButton.vue";
import { EyeSlashIcon, EyeIcon } from "@heroicons/vue/24/outline";
import authService from "@src/services/authService";
import { formatValidateBE } from "@src/utils/helper";
import { toast } from "vue3-toastify";

import { useForm } from "vee-validate";
import * as yup from "yup";

const getSchema = () => {
  return yup.object({
    email: yup
      .string()
      .trim()
      .required("Vui long nhap email")
      .email("Dinh dang email chua hop le"),
    username: yup
      .string()
      .trim()
      .required("Vui long nhap ten tai khoan")
      .min(4, "Do dai toi thieu la 4 ky tu")
      .max(50, "Do dai toi da laf 50 ky tu"),
    fullName: yup
      .string()
      .trim()
      .required("Vui long nhap ho ten")
      .min(4, "Do dai toi thieu la 4 ky tu")
      .max(50, "Do dai toi da laf 50 ky tu"),
    password: yup
      .string()
      .trim()
      .required("Vui long nhap mat khau")
      .min(8, "Do dai toi thieu la 8 ky tu")
      .max(50, "Do dai toi da laf 50 ky tu"),
    re_password: yup
      .string()
      .trim()
      .oneOf(
        [yup.ref("password")],
        "Mat khau nhap lai phai trung voi mat khau da nhap"
      ),
  });
};

const schema = ref(getSchema());

const { defineField, handleSubmit, errors, setErrors } = useForm({
  validationSchema: schema,
});

const [email] = defineField("email");
const [username] = defineField("username");
const [fullName] = defineField("fullName");
const [password] = defineField("password");
const [re_password] = defineField("re_password");

const router = useRouter();

const register = ref({});
const showPassword = ref(false);
const showPasswordConfirm = ref(false);

const styleError = computed(() => {
  return {
    username: `mb-1${errors.value.username ? " border !border-red-500" : ""}`,
    email: `mb-1${errors.value.email ? " border !border-red-500" : ""}`,
    fullName: `mb-1${errors.value.fullName ? " border !border-red-500" : ""}`,
    password: `pr-[40px] mb-1${errors.value.password ? " border !border-red-500" : ""}`,
    re_password: `mb-1${errors.value.re_password ? " border !border-red-500" : ""}`,
  };
});

const onRegisterClicked = async () => {
  let params = {
    email: email.value,
    username: username.value,
    fullName: fullName.value,
    password: password.value,
    re_password: re_password.value
  }
  try {
    const res = await authService.register(params);
    if (res.status === 200) {
      toast.success("success");
      router.push({
        name: "Login",
      });
    } if (res.status === 422) {
      setErrors(formatValidateBE(res.data.error))
    } else {
      toast.error(res.data.message);
    }
  } catch (err) {
    toast.error("Lỗi hệ thống, vui lòng thử lại");
  }
};

const onLoginClicked = () => {
  router.push({
    name: "Login",
  });
};
</script>

<template>
  <div
    class="p-5 md:basis-1/2 xs:basis-full flex flex-col justify-center items-center"
  >
    <div class="w-full md:px-[26%] xs:px-[10%]">
      <!--header-->
      <div class="mb-6 flex flex-col">
        <img
          src="@src/assets/vectors/logo-gradient.svg"
          class="w-[22px] h-[18px] mb-5 opacity-70"
        />
        <Typography variant="heading-2" class="mb-4"
          >Get started with Avian</Typography
        >
        <Typography variant="body-3" class="text-opacity-75 font-light">
          Sign in to start using messaging!
        </Typography>
      </div>
      <div class="mb-5">
        <TextInput
          label="Email"
          placeholder="Enter your email"
          :class="styleError.email"
          @value-changed="
            (value) => {
              email = value;
            }
          "
          :value="email"
        />
        <small class="block h-6 text-red-500">{{ errors.email }}</small>
        <TextInput
          label="Username"
          placeholder="Enter your username"
          :class="styleError.username"
          @value-changed="
            (value) => {
              username = value;
            }
          "
          :value="username"
        />
        <small class="block h-6 text-red-500">{{ errors.username }}</small>
        <TextInput
          label="Full Name"
          placeholder="Enter your full name"
          :class="styleError.fullName"
          @value-changed="
            (value) => {
              fullName = value;
            }
          "
          :value="fullName"
        />
        <small class="block h-6 text-red-500">{{ errors.fullName }}</small>

        <TextInput
          label="Password"
          placeholder="Enter your password"
          :type="showPassword ? 'text' : 'password'"
          :class="styleError.password"
          @value-changed="
            (value) => {
              password = value;
            }
          "
          :value="password"
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
        <small class="block h-6 text-red-500">{{ errors.password }}</small>

        <TextInput
          label="Confirm Password"
          placeholder="Enter your password"
          :type="showPasswordConfirm ? 'text' : 'password'"
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
        <small class="block h-6 text-red-500">{{ errors.re_password }}</small>
      </div>

      <div class="mb-5">
        <Button class="w-full mb-4" @click="onRegisterClicked">Sign up</Button>
      </div>

      <!--bottom text-->
      <div class="flex justify-center">
        <Typography variant="body-2"
          >Already have an account ?
          <span
            class="text-indigo-400 opacity-100 cursor-pointer"
            @click="onLoginClicked"
          >
            Sign in
          </span>
        </Typography>
      </div>
    </div>
  </div>
</template>

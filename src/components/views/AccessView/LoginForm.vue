<script setup lang="ts">
import { computed, ref } from "vue";
import { useRouter, useRoute } from "vue-router";

import Typography from "@/components/ui/data-display/Typography.vue";
import Button from "@/components/ui/inputs/Button.vue";
import IconButton from "@/components/ui/inputs/IconButton.vue";
import TextInput from "@/components/ui/inputs/TextInput.vue";
import { EyeSlashIcon, EyeIcon } from "@heroicons/vue/24/outline";

import authService from "@src/services/authService";
import { useAuthStore } from "@src/store/authStore";
import { toast } from "vue3-toastify";
import { useForm } from "vee-validate";
import * as yup from "yup";

const getSchema = () => {
  return yup.object({
    username: yup
      .string()
      .trim()
      .required("Vui long nhap username"),
    password: yup
      .string()
      .trim()
      .required("Vui long nhap password"),
  });
};

const schema = ref(getSchema());

const { defineField, handleSubmit, errors } = useForm({
  validationSchema: schema,
});

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();

const showPassword = ref(false);
const [password] = defineField("password");
const [username] = defineField("username");

const styleError = computed(() => {
  return {
    username: `mb-1${errors.value.username ? ' border !border-red-500' : ''}`,
    password: `pr-[40px]${errors.value.password ? ' border !border-red-500' : ''}`
  }
})

const onLoginClicked = handleSubmit(async (values) => {
  try {
    let params = {
      username: username.value,
      password: password.value,
    };
    const res = await authService.login(params);
    if (res.status === 200) {
      toast.success("success");
      localStorage.setItem("accessToken", res.data.data.accessToken);
      localStorage.setItem("refreshToken", res.data.data.refreshToken);
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

const onRegisterClicked = () => {
  router.push({
    name: "Register",
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
          class="w-[22px] h-[18px] mb-4 opacity-70"
          alt="bird logo"
        />
        <Typography variant="heading-2" class="mb-4">Welcome back</Typography>
        <Typography variant="body-3" class="text-opacity-75 font-light">
          Create an account a start messaging now!
        </Typography>
      </div>

      <!--form-->
      <div class="mb-6">
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
      </div>

      <!--local controls-->
      <div class="mb-6">
        <Button class="w-full mb-4" @click="onLoginClicked">Sign in</Button>
      </div>

      <!--divider-->
      <div class="mb-6 flex items-center">
        <span
          class="w-full border border-dashed border-gray-100 dark:border-gray-600 rounded-[1px]"
        ></span>
        <Typography variant="body-3" class="px-4 text-opacity-75 font-light"
          >or</Typography
        >
        <span
          class="w-full border border-dashed border-gray-100 dark:border-gray-600 rounded-[1px]"
        ></span>
      </div>

      <!--oauth controls-->
      <div>
        <Button variant="outlined" class="w-full mb-5">
          <span class="flex">
            <img
              src="@src/assets/vectors/google-logo.svg"
              class="mr-3"
              alt="google logo"
            />
            Sign in with google
          </span>
        </Button>

        <!--bottom text-->
        <div class="flex justify-center">
          <Typography variant="body-2"
            >Don’t have an account ?
            <span
              class="text-indigo-400 opacity-100 cursor-pointer"
              @click="onRegisterClicked"
            >
              Sign up
            </span>
          </Typography>
        </div>
      </div>
    </div>
  </div>
</template>

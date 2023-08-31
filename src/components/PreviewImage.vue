<template>
  <a :style="{cursor: 'pointer'}" @click="onClick">预览</a>
  <a-image
    :width="width"
    :src="src"
    :style="{ display: 'none' }"
    :preview="{
      visible,
      onVisibleChange: setVisible,
    }"
  />
</template>
<script setup>
import { ref, onMounted, } from 'vue';
import * as uploadApis from '../services/upload';

const props = defineProps({
  width: Number,
  fileName: String,
})

const src = ref('')
const visible = ref(false);
const setVisible = value => {
  visible.value = value;
};

const onClick = async () => {
  if (!src.value) {
    const res = await uploadApis.generateTokenUrl({
      fileName: props.fileName
    })
    src.value = res
    setVisible(true)
  }
  setVisible(true)
}

</script>

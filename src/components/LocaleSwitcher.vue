<template>
  <div class="p-8">
    <select class="text-xl font-bold uppercase webkit border-4 border-black" v-model="$i18n.locale">
      <option class="option-language" v-for="(locale, i) in locales" :key="`locale-${i}`" :value="locale">
        <div class="text-xl font-bold border-4 border-black">
          {{ locale }}
        </div>

      </option>
    </select>
  </div>
</template>
  
<script>
export default {
  name: "LocaleSwitcher",
  data() {
    return { locales: ["vi", "en"] };
  }
};
</script>
  
<script setup lang="ts">
import { onMounted, ref } from "vue";
const gif = ref(undefined);

const giphy = {
  baseURL: "https://api.giphy.com/v1/gifs/",
  apiKey: "0UTRbFtkMxAplrohufYco5IY74U8hOes",
  tag: "fail",
  type: "random",
  rating: "pg-13",
};

const giphyURL = encodeURI(
  giphy.baseURL +
    giphy.type +
    "?api_key=" +
    giphy.apiKey +
    "&tag=" +
    giphy.tag +
    "&rating=" +
    giphy.rating
);

const fetchGif = () => {
  fetch(giphyURL)
    .then((response) => response.json())
    .then((data) => {
      console.log(data);

      gif.value = data.data.images.original.url;
    });
};

onMounted(() => {
  fetchGif();
  setInterval(() => {
    fetch(giphyURL)
      .then((response) => response.json())
      .then((data) => {
        gif.value = data.data.images.original.url;
      });
  }, 5000);
});
</script>

<template>
  <div class="q-pa-lg">
    <p class="col-sm-9 col-12 text-body1">
      This is the default drawer component. Nothing to see here.
    </p>
    <q-img :src="gif" spinner-color="white" style="max-width: 250px" />
  </div>
</template>

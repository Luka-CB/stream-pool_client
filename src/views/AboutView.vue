<template>
  <div class="about">
    <div class="image">
      <img src="@/assets/images/popcorn.webp" alt="Popcorn png Image" />
    </div>
    <div class="info">
      <div class="text">
        <h1>Stream-Pool</h1>
        <p className="description">
          <b>Stream-Pool</b> is a demo full-stack <b>MEVN</b> website created to
          showcase in my <b>Portfolio</b>. STREAM-POOL is a website that lets
          you explore and discover <b>Movies</b> and <b>TV Series</b> of your
          interest. You can browse by genre, year, rating, or keyword, or use
          the advanced search feature to find exactly what you are looking for.
        </p>
        <p class="description">
          If you register and log in, you can enjoy more benefits such as
          creating your own lists of favorites, rating and commenting on the
          movies and TV series you watch, and sharing your opinions with other
          StreamPool members. StreamPool is the ultimate destination for movie
          and TV lovers who want to have a personalized and engaging experience.
        </p>
      </div>
      <div class="links">
        <div className="link">
          <p id="name">View my portfolio website</p>
          <span id="dash">-</span>
          <b id="here">here</b>
          <i class="fa-solid fa-arrow-right-long"></i>
          <a href="#" target="_blank">
            <button className="link-btn">
              <i class="fa-solid fa-globe icon"></i>
              <span id="btn-name">Portfolio</span>
            </button>
          </a>
        </div>
        <div className="link">
          <p id="name">View website Code</p>
          <span id="dash">-</span>
          <b id="here">here</b>
          <i class="fa-solid fa-arrow-right-long"></i>
          <a href="#" target="_blank">
            <button className="link-btn">
              <i class="fa-brands fa-github icon"></i>
              <span id="btn-name">Github</span>
            </button>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useHead } from "@vueuse/head";

export default defineComponent({
  name: "AboutView",
  setup() {
    useHead({
      title: "About Stream-Pool",
    });
  },
});
</script>

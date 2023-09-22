<template>
  <div class="landing">
    <Transition>
      <div class="landing-content" v-if="showLandingContent">
        <div class="landing-image">
          <img src="@/assets/images/landing-img-2.png" alt="Image Landing" />
        </div>
        <p id="text">
          Quisque scelerisque blandit accumsan. Sed elit massa, lobortis sit
          amet elit non, ultrices fermentum diam. Maecenas interdum libero arcu,
          at aliquam mauris mattis at. Donec quis libero eget sem tincidunt
          dictum. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec
          suscipit, purus quis condimentum rhoncus, urna elit venenatis magna,
          tincidunt viverra enim purus ac dolor. Duis quis efficitur tortor.
          Duis dolor sem, placerat vitae dapibus volutpat, vehicula sed nisi.
          Suspendisse ut diam imperdiet, porta mi eget, dictum augue. Quisque
          sit amet tincidunt orci, at sodales augue. Pellentesque pulvinar
          semper feugiat. Nullam viverra dignissim neque. Proin varius diam ut
          turpis luctus aliquet. Sed rutrum ligula et velit molestie congue.
          Pellentesque habitant morbi tristique senectus et netus et malesuada
          fames ac turpis egestas. Vestibulum eleifend, erat at pharetra cursus,
          sem leo mollis nunc, a iaculis massa libero a elit.
        </p>
      </div>
    </Transition>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "HomeLanding",
  props: ["showLandingContent"],
  setup() {
    return {};
  },
});
</script>

<style lang="scss" scoped>
.v-enter-active,
.v-leave-active {
  transition: opacity 0.3s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>

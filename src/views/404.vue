<template>
  <div class="not-found-container">
    <div class="not-found">
      <span>4</span>
      <span>0</span>
      <span>4</span>
    </div>
    <div class="text">
      <h2>Ooops! looks like something went wrong!</h2>
      <div class="subtext">
        <small>
          This usually happens when route you enter does not exist or is
          unauthorized.
          <span @click="goBackHandler">Go Back</span>
        </small>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useRouter } from "vue-router";
import { useHead } from "@vueuse/head";

export default defineComponent({
  name: "NotFound",
  setup() {
    const router = useRouter();

    useHead({
      title: "404",
    });

    const goBackHandler = () => router.go(-1);

    return { goBackHandler };
  },
});
</script>

<style lang="scss" scoped>
.not-found-container {
  width: 60%;
  min-width: 250px;
  margin: auto;
  margin-bottom: 50px;
  border-radius: 50px;
  transition: 0.3s ease-in-out;

  .not-found {
    width: 100%;
    display: flex;
    justify-content: space-between;
    font-size: 15rem;
    color: rgb(107, 60, 60);
    opacity: 0.3;
    transition: 0.3s ease-in-out;
  }

  .text {
    width: 100%;
    color: #d50000;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    padding: 10px;
    transition: 0.3s ease-in-out;

    .subtext {
      width: 250px;
      padding: 10px;
      transition: 0.3s ease-in-out;

      small {
        color: rgb(198, 183, 183);
        transition: 0.3s ease-in-out;

        span {
          color: rgb(60, 184, 226);
          cursor: pointer;
          transition: 0.3s ease-in-out;

          &:hover {
            text-decoration: underline;
          }
        }
      }
    }
  }

  @media (min-width: 1700px) {
    .not-found {
      width: 100%;
      font-size: 25rem;
    }

    .text {
      font-size: 1.5rem;

      .subtext {
        width: 450px;

        small {
          span {
            color: rgb(60, 60, 226);
            cursor: pointer;

            &:hover {
              text-decoration: underline;
            }
          }
        }
      }
    }
  }
  @media (max-width: 700px) {
    width: 95%;
    margin-top: 50px;
    border-radius: 10px;

    .not-found {
      width: 100%;
      font-size: 8rem;
    }

    .text {
      font-size: 0.8rem;
      text-align: center;

      .subtext {
        width: 100%;
      }
    }
  }
}
</style>

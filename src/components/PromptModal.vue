<template>
  <div class="prompt-bg" @click="handleCancel">
    <div class="prompt-body" @click.stop>
      <p>Are you sure?</p>
      <div class="btns">
        <button id="yes" @click="handleYesBtn">yes</button>
        <button id="no" @click="handleCancel">no</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useStore } from "vuex";

export default defineComponent({
  name: "PromptModal",

  setup() {
    const store = useStore();

    const handleYesBtn = () => {
      store.commit("SET_PROMPT_ANSWER", true);
      store.commit("TOGGLE_PROMPT", false);
    };

    const handleCancel = () => store.commit("RESET_PROMPT");

    return {
      handleYesBtn,
      handleCancel,
    };
  },
});
</script>

<style lang="scss" scoped>
.prompt-bg {
  background-color: rgba(0, 0, 0, 0.705);
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fade 0.2s ease-in;

  .prompt-body {
    background-color: rgb(4, 44, 41);
    width: 450px;
    border-radius: 20px;
    border: 2px solid rgba(4, 86, 79, 0.559);
    border-top: 6px solid rgba(4, 86, 79, 0.559);
    padding: 20px;
    animation: zoom 0.2s ease-in;

    p {
      text-align: center;
      text-transform: capitalize;
      font-size: large;
    }

    .btns {
      margin-top: 50px;
      width: 100%;
      display: flex;
      justify-content: space-between;

      button {
        border: none;
        outline: none;
        width: 150px;
        height: 30px;
        border-radius: 10px;
        font-family: inherit;
        font-size: medium;
        text-transform: uppercase;
        cursor: pointer;
        transition: all 0.2s ease-in-out;
        box-shadow: 0 6px 6px -4px black;
      }

      #yes {
        background-color: #07d1cd;
        color: rgba(0, 0, 0, 0.608);
        font-weight: 800;

        &:hover {
          box-shadow: 0 12px 12px -4px rgba(0, 0, 0, 0.603);
          color: black;
          background-color: #0afffb;
        }

        &:active {
          transform: scale(0.97);
          background-color: #07d1ce84;
          color: rgba(0, 0, 0, 0.5);
          box-shadow: 0 6px 6px -4px black;
        }
      }

      #no {
        background-color: #edc531;
        color: rgba(0, 0, 0, 0.608);
        font-weight: 800;

        &:hover {
          box-shadow: 0 12px 12px -4px rgba(0, 0, 0, 0.603);
          color: black;
          background-color: #ffca08;
        }

        &:active {
          transform: scale(0.97);
          background-color: #ffc90873;
          color: rgba(0, 0, 0, 0.5);
          box-shadow: 0 6px 6px -4px black;
        }
      }
    }

    @media (min-width: 1920px) {
      width: 650px;

      p {
        font-size: 1.5rem;
      }

      .btns {
        button {
          width: 250px;
          height: 40px;
          border-radius: 15px;
          font-size: 1.3rem;
        }
      }
    }

    @media (max-width: 500px) {
      width: 95%;
      min-width: 240px;

      p {
        font-size: small;
      }

      .btns {
        button {
          width: 150px;
          height: 20px;
          border-radius: 5px;
          font-size: small;
        }

        @media (max-width: 400px) {
          justify-content: space-around;

          button {
            width: 100px;
          }
        }

        @media (max-width: 300px) {
          button {
            width: 80px;
          }
        }
      }
    }
  }
}
</style>

<template>
  <div :class="inputWrapperCssClasses">
    <input
        v-bind="$attrs"
        class="input_input"
        id="input"
        v-model="input"
        @keyup="handleChange"
        @focus="handleFocus"
        @blur="handleBlur"
    >
    <label class="input_label" for="input">{{ placeholder }}</label>
    <span class="input_focusline"></span>
  </div>
</template>

<script>
export default {
  name: "TextInput",
  props: {
    placeholder: {
      type: String,
      default: null,
    },
    value: {
      type: String,
      default: null
    }
  },
  data(){
    return {
      inputWrapperCssClasses: {
        input_field: true,
        focused: false,
        underline: false
      },
      input: this.value
    }
  },
  created() {
    if(this.input){
      this.inputWrapperCssClasses.focused = true;
    }
  },
  methods: {
    handleChange(){
      this.$emit("input", this.input);
    },
    handleFocus(){
      this.inputWrapperCssClasses.focused = true;
      this.inputWrapperCssClasses.underline = true;
    },
    handleBlur(){
        this.inputWrapperCssClasses.underline = false;
        if(!this.input || this.input.length === 0){
          this.inputWrapperCssClasses.focused = false;
        }
    }
  }
}
</script>

<style scoped>
.input_field {
  position: relative;
  border-bottom: 1px solid rgba(204, 196, 188, 0.8);
  transition-property: border, padding;
  transition-duration: 0.25s;
  transition-timing-function: cubic-bezier(0.66, 0.13, 0.4, 0.99);
  margin: calc(10px + 1em) 8px 10px;
}

.input_field.underline {
  border-bottom: 1px solid rgba(23, 95, 148, 0.8);
}

.input_field.error {
  border-bottom: 1px solid rgba(228, 70, 31, 0.8) !important;
}

.input_field.underline.error {
  border-bottom: 1px solid rgba(251, 149, 33, 0) !important;
}

.input_input {
  display: block;
  margin: 0;
  padding: 0.5em 0 0.2em;
  width: 100%;
  min-height: 2.5rem;
  font-size: inherit;
  font-weight: 700;
  line-height: inherit;
  text-align: left;
  color: rgb(0, 58, 121);
  background: none;
  border: none;
  transition: color 0.25s cubic-bezier(0.66, 0.13, 0.4, 0.99);
  resize: none;
  outline: 0;
  border-radius: 0;
}

.white .input_input {
  color: white;
}

.input_label {
  display: block;
  position: absolute;
  left: 0;
  width: 100%;
  color: rgba(204, 196, 188, 0.8);
  top: 0.1875rem;
  font-size: inherit;
  font-weight: 700;
  text-align: left;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  pointer-events: none;
  transition-property: top, font-size, color, opacity;
  transition-duration: 0.25s;
  transition-timing-function: cubic-bezier(0.66, 0.13, 0.4, 0.99);
  pointer-events: none;
}

.input_field.focused > .input_label {
  top: -0.96em;
  font-size: 0.75rem;
}

.input_focusline {
  display: block;
  position: relative;
  width: 0;
  margin-top: -2px;
  height: 2px;
  background: rgb(0, 58, 121);
  opacity: 0;
  transition-property: width, opacity, background;
  transition-duration: 0.25s;
}

.white .input_focusline {
  background: white;
}

.input_field.underline > .input_focusline {
  opacity: 1;
  width: 100%;
}
</style>
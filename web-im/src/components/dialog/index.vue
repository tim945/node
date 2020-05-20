<template>
  <div class="popup" v-if="visable">
    <div class="dialog">
      <div class="title" v-if="title">{{title}}</div>
      <div class="content">
        <slot></slot>
      </div>
      <div class="btn">
        <button @click="cancel">{{cancelBtn?cancelBtn:'取消'}}</button>
        <button @click="confirm">{{confirmBtn?confirmBtn:'确认'}}</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    visable: {
      type: [Boolean],
      default: false
    },
    title: {
      type: [String],
      default: ''
    },
    cancelBtn: {
      type: [String],
      default: ''
    },
    confirmBtn: {
      type: [String],
      default: ''
    }
  },
  data(){
    return {
      // visable: false
    }
  },
  methods: {
    show(){
      // this.visable = true
      this.$emit("update:visable", true)
    },
    hide(){
      // this.visable = false
      this.$emit("update:visable", false)
    },
    cancel(){
      this.hide()
    },
    confirm(){
      this.$emit('confirm')
      // this.hide()
    }
  }  
}
</script>

<style lang='stylus'>
  @import './index.styl';
</style>
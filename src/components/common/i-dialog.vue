<template>
  <div>
    <!-- .sync 是双向绑定 -->
    <el-dialog
      :title="title"
      :visible.sync="visible"
      width="50%"
      :before-close="dialogBeforeClose"
      @close="dialogClose"
      :append-to-body="appendToBody">
      <slot></slot>

      <span slot="footer" class="dialog-footer" v-show="buttonShow">
        <el-button @click="dialogCancel">取 消</el-button>
        <el-button type="primary" @click="dialogconfirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'i-dialog',
  props: {
    buttonShow: {
      type: Boolean,
      default: true
    },
    value: {
      type: Boolean,
      default: false
    },
    appendToBody: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      visible: false
    }
  },
  methods: {
    dialogClose () {
      this.visible = false
      this.$emit('input', this.visible)
    },
    dialogBeforeClose () {
      this.$emit('dialog-before-close')
      this.visible = false
    },
    dialogCancel () {
      this.$emit('dialog-cancel')
    },
    dialogconfirm () {
      this.$emit('dialog-confirm')
    }
  },
  watch: {
    value: {
      handler (value) {
        this.visible = value
      },
      deep: true
    }
  }
}
</script>

<style lang="scss" scoped>

</style>

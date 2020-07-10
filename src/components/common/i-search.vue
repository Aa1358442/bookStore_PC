<template>
    <div class="i-search">
        <el-form ref="form" :inline="true" :model="model">
          <slot></slot>
          <el-form-item>
              <el-button @click="search" type="primary">查询</el-button>
              <el-button @click="reset" type="primary">重置</el-button>
          </el-form-item>
        </el-form>
    </div>
</template>

<script>
export default {
  name: 'i-search',
  props: {
    model: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data () {
    return {
    }
  },
  methods: {
    search () {
      this.$emit('search')
    },
    reset () {
      this.$emit('reset')
      this.$refs.form.resetFields()
    }
  }
}
</script>

<style lang="scss" scoped>
.i-search {
    padding: 10px;
.el-form {
   /deep/ .el-form-item {
     margin-bottom: 0;
        .el-form-item_label {
          width: 80px;
        }
    }
}
/deep/ .el-form-item .el-form-item__content .el-input .el-input__inner {
  width: 200px!important;
}
/deep/ .el-form--inline .el-form-item__label {
  width: 68px!important;
}
}
</style>

<template>
    <div class="material-input__component" :class="computedClasses">
        <input v-if="type === 'email'" type="email" class="material-input" :name="name" :id="id" :placeholder="placeholder" v-model="valueCopy"
            :readonly="readonly" :disabled="disabled" :autocomplete="autocomplete" :required="required" @focus="handleFocus(true)"
            @blur="handleFocus(false)" @input="handleModelInput">
        <input v-if="type === 'url'" type="url" class="material-input" :name="name" :id="id" :placeholder="placeholder" v-model="valueCopy"
            :readonly="readonly" :disabled="disabled" :autocomplete="autocomplete" :required="required" @focus="handleFocus(true)"
            @blur="handleFocus(false)" @input="handleModelInput">
        <input v-if="type === 'number'" type="number" class="material-input" :name="name" :id="id" :placeholder="placeholder" v-model="valueCopy"
            :readonly="readonly" :disabled="disabled" :autocomplete="autocomplete" :max="max" :min="min" :minlength="minlength"
            :maxlength="maxlength" :required="required" @focus="handleFocus(true)" @blur="handleFocus(false)" @input="handleModelInput">
        <input v-if="type === 'password'" type="password" class="material-input" :name="name" :id="id" :placeholder="placeholder"
            v-model="valueCopy" :readonly="readonly" :disabled="disabled" :autocomplete="autocomplete" :max="max" :min="min"
            :required="required" @focus="handleFocus(true)" @blur="handleFocus(false)" @input="handleModelInput">
        <input v-if="type === 'tel'" type="tel" class="material-input" :name="name" :id="id" :placeholder="placeholder" v-model="valueCopy"
            :readonly="readonly" :disabled="disabled" :autocomplete="autocomplete" :required="required" @focus="handleFocus(true)"
            @blur="handleFocus(false)" @input="handleModelInput">
        <input v-if="type === 'text'" type="text" class="material-input" :name="name" :id="id" :placeholder="placeholder" v-model="valueCopy"
            :readonly="readonly" :disabled="disabled" :autocomplete="autocomplete" :minlength="minlength" :maxlength="maxlength"
            :required="required" @focus="handleFocus(true)" @blur="handleFocus(false)" @input="handleModelInput">

        <span class="material-input-bar"></span>

        <label class="material-label">
            <slot></slot>
        </label>
        <div v-if="errorMessages" class="material-errors">
            <div v-for="error in computedErrors" class="material-error">
                {{ error }}
            </div>
        </div>
    </div>
</template>

<script>
    // source:https://github.com/wemake-services/vue-material-input/blob/master/src/components/MaterialInput.vue
    export default {
      name: 'material-input',
      computed: {
        computedErrors() {
          return typeof this.errorMessages === 'string'
                        ? [this.errorMessages] : this.errorMessages
        },
        computedClasses() {
          return {
            'material--active': this.focus,
            'material--disabled': this.disabled,
            'material--has-errors': Boolean(!this.valid || (this.errorMessages && this.errorMessages.length)),
            'material--raised': Boolean(this.focus || this.valueCopy || // has value
                            (this.placeholder && !this.valueCopy)) // has placeholder
          }
        }
      },
      data() {
        return {
          valueCopy: null,
          focus: false,
          valid: true
        }
      },
      beforeMount() {
        // Here we are following the Vue2 convention on custom v-model:
        // https://github.com/vuejs/vue/issues/2873#issuecomment-223759341
        this.copyValue(this.value)
      },
      methods: {
        handleModelInput(event) {
          this.$emit('input', event.target.value, event)
          this.handleValidation()
        },
        handleFocus(focused) {
          this.focus = focused
        },
        handleValidation() {
          this.valid = this.$el ? this.$el.querySelector('.material-input').validity.valid : this.valid
        },
        copyValue(value) {
          this.valueCopy = value
          this.handleValidation()
        }
      },
      watch: {
        value(newValue) {
          this.copyValue(newValue)
        }
      },
      props: {
        id: {
          type: String,
          default: null
        },
        name: {
          type: String,
          default: null
        },
        type: {
          type: String,
          default: 'text'
        },
        value: {
          default: null
        },
        placeholder: {
          type: String,
          default: null
        },
        readonly: {
          type: Boolean,
          default: false
        },
        disabled: {
          type: Boolean,
          default: false
        },
        min: {
          type: String,
          default: null
        },
        max: {
          type: String,
          default: null
        },
        minlength: {
          type: Number,
          default: null
        },
        maxlength: {
          type: Number,
          default: null
        },
        required: {
          type: Boolean,
          default: true
        },
        autocomplete: {
          type: String,
          default: 'off'
        },
        errorMessages: {
          type: [Array, String],
          default: null
        }
      }
    }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
    // Fonts:
    $font-size-base: 16px;
    $font-size-small: 18px;
    $font-size-smallest: 12px;
    $font-weight-normal: normal;
    // Utils
    $spacer: 12px;
    $transition: 0.2s ease all;
    // Base clases:
    %base-bar-pseudo {
        content: '';
        height: 1px;
        width: 0;
        bottom: 0;
        position: absolute;
        transition: $transition;
    }

    // Mixins:
    @mixin slided-top() {
        top: -2 * $spacer;
        font-size: $font-size-small;
    }

    // Component:
    .material-input__component {
        /*margin-top: 30px;*/
        position: relative;
        * {
            box-sizing: border-box;
        }
        .material-input {
            font-size: $font-size-base;
            padding: $spacer $spacer $spacer $spacer / 2;
            display: block;
            width: 100%;
            border: none;
            border-radius: 0;
            &:focus {
                outline: none;
                border: none;
                border-bottom: 1px solid transparent; // fixes the height issue
            }
        }
        .material-label {
            font-size: $font-size-base;
            font-weight: $font-weight-normal;
            position: absolute;
            pointer-events: none;
            left: 0;
            top: $spacer;
            transition: $transition;
        }
        .material-input-bar {
            position: relative;
            display: block;
            width: 100%;
            &:before {
                @extend %base-bar-pseudo;
                left: 50%;
            }
            &:after {
                @extend %base-bar-pseudo;
                right: 50%;
            }
        }
        // Disabled state:
        &.material--disabled {
            .material-input {
                border-bottom-style: dashed;
            }
        }
        // Raised state:
        &.material--raised {
            .material-label {
                @include slided-top();
            }
        }
        // Active state:
        &.material--active {
            .material-input-bar {
                &:before,
                &:after {
                    width: 50%;
                }
            }
        }
        // Errors:
        .material-errors {
            position: relative;
            overflow: hidden;
            .material-error {
                font-size: $font-size-smallest;
                line-height: $font-size-smallest + 2px;
                overflow: hidden;
                margin-top: 0;
                padding-top: $spacer / 2;
                padding-right: $spacer / 2;
                padding-left: 0;
            }
        }
    }

    // Theme:
    $color-white: white;
    $color-grey: #9E9E9E;
    $color-grey-light: #E0E0E0;
    $color-blue: #2196F3;
    $color-red: #F44336;
    $color-black: black;
    .material-input__component {
        background: $color-white;
        .material-input {
            background: none;
            color: $color-black;
            text-indent: 30px;
            border-bottom: 1px solid $color-grey-light;
        }
        .material-label {
            color: $color-grey;
        }
        .material-input-bar {
            &:before,
            &:after {
                background: $color-blue;
            }
        }
        // Active state:
        &.material--active {
            .material-label {
                color: $color-blue;
            }
        }
        // Errors:
        &.material--has-errors {
            &.material--active .material-label {
                color: $color-red;
            }
            .material-input-bar {
                &:before,
                &:after {
                    background: $color-red;
                }
            }
            .material-errors {
                color: $color-red;
            }
        }
    }
</style>

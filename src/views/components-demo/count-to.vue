<template>
  <div class="components-container">
    <aside>
      <a href="https://github.com/PanJiaChen/vue-countTo" target="_blank">countTo-component</a>
    </aside>
    <count-to
      ref="example"
      :start-val="_startVal"
      :end-val="_endVal"
      :duration="_duration"
      :decimals="_decimals"
      :separator="_separator"
      :prefix="_prefix"
      :suffix="_suffix"
      :autoplay="false"
      class="example"
    />
    <div style="margin-left: 25%; margin-top: 40px;">
      <label class="label" for="startValInput">startVal:
        <input v-model.number="setStartVal" type="number" name="startValInput">
      </label>
      <label class="label" for="endValInput">endVal:
        <input v-model.number="setEndVal" type="number" name="endVaInput">
      </label>
      <label class="label" for="durationInput">duration:
        <input v-model.number="setDuration" type="number" name="durationInput">
      </label>
      <div class="start-btn example-btn" @click="start">
        Start
      </div>
      <div class="pause-resume-btn example-btn" @click="pauseResume">
        pause/resume
      </div>
      <br>
      <label class="label" for="decimalsInput">decimals:
        <input v-model.number="setDecimals" type="number" name="decimalsInput">
      </label>
      <label class="label" for="separatorInput">separator:
        <input v-model="setSeparator" name="separatorInput">
      </label>
      <label class="label" for="prefixInput">prefix:
        <input v-model="setPrefix" name="prefixInput">
      </label>
      <label class="label" for="suffixInput">suffix:
        <input v-model="setSuffix" name="suffixInput">
      </label>
    </div>
    <aside>&lt;count-to :start-val=&#x27;{{ _startVal }}&#x27; :end-val=&#x27;{{ _endVal }}&#x27; :duration=&#x27;{{ _duration }}&#x27;
      :decimals=&#x27;{{ _decimals }}&#x27; :separator=&#x27;{{ _separator }}&#x27; :prefix=&#x27;{{ _prefix }}&#x27; :suffix=&#x27;{{ _suffix }}&#x27;
      :autoplay=false&gt;</aside>
  </div>
</template>

<script>
import countTo from 'vue-count-to'

export default {
  name: 'CountToDemo',
  components: { countTo },
  data() {
    return {
      setStartVal: 0,
      setEndVal: 2017,
      setDuration: 4000,
      setDecimals: 0,
      setSeparator: ',',
      setSuffix: ' rmb',
      setPrefix: '¥ '
    }
  },
  computed: {
    _startVal() {
      if (this.setStartVal) {
        return this.setStartVal
      } else {
        return 0
      }
    },
    _endVal() {
      if (this.setEndVal) {
        return this.setEndVal
      } else {
        return 0
      }
    },
    _duration() {
      if (this.setDuration) {
        return this.setDuration
      } else {
        return 100
      }
    },
    _decimals() {
      if (this.setDecimals) {
        if (this.setDecimals < 0 || this.setDecimals > 20) {
          alert('digits argument must be between 0 and 20')
          return 0
        }
        return this.setDecimals
      } else {
        return 0
      }
    },
    _separator() {
      return this.setSeparator
    },
    _suffix() {
      return this.setSuffix
    },
    _prefix() {
      return this.setPrefix
    }
  },
  methods: {
    start() {
      this.$refs.example.start()
    },
    pauseResume() {
      this.$refs.example.pauseResume()
    }
  }
}
</script>

<style scoped>
.example-btn {
  background-color: #fff;
  background-image: none;
  border: 1px solid transparent;
  border-color: #d9d9d9;
  border-radius: 4px;
  color: rgba(0, 0, 0, 0.65);
  cursor: pointer;
  display: inline-block;
  font-size: 12px;
  font-weight: 500;
  line-height: 1.5;
  margin-bottom: 0;
  padding: 4px 15px;
  position: relative;
  text-align: center;
  -ms-touch-action: manipulation;
  touch-action: manipulation;
  -webkit-transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
  transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  white-space: nowrap;
}

.example-btn:hover {
  background-color: #fff;
  border-color: #4ab7bd;
  color: #4ab7bd;
}

.example {
  color: #f6416c;
  display: block;
  font-size: 50px;
  font-size: 80px;
  font-weight: 500;
  margin: 10px 0;
  text-align: center;
}

.label {
  color: #2f4f4f;
  display: inline-block;
  font-size: 16px;
  margin: 15px 30px 15px 0;
}

input {
  background-color: #fff;
  background-image: none;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  color: rgba(0, 0, 0, 0.65);
  cursor: text;
  display: inline-block;
  font-size: 12px;
  height: 28px;
  line-height: 1.5;
  padding: 4px 7px;
  position: relative;
  -webkit-transition: all 0.3s;
  transition: all 0.3s;
  width: 70px;
}

.start-btn {
  background-color: #fff;
  color: #30b08f;
  font-size: 20px;
  margin-left: 20px;
}

.start-btn:hover {
  background-color: #30b08f;
  border-color: #30b08f;
  color: #fff;
}

.pause-resume-btn {
  background-color: #fff;
  color: #e65d6e;
  font-size: 20px;
}

.pause-resume-btn:hover {
  background-color: #e65d6e;
  border-color: #e65d6e;
  color: #fff;
}
</style>


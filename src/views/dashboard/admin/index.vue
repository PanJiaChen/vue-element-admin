<template>
  <div class="dashboard-editor-container">
    <el-row :gutter="20" class="bookings">
      <el-col :span="8" :offset="0">
        <booking-card />
        <br><br>
        <profile-card />
      </el-col>
      <el-col :span="8" :offset="0">
        <exercise-card />
        <br><br>
        <injuries-card />
      </el-col>
      <el-col :span="8" :offset="0">
        <physio-card />
        <br><br>
        <billing-card />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import BookingCard from './components/BookingCard'
import ExerciseCard from './components/ExerciseCard'
import PhysioCard from './components/PhysioCard'
import ProfileCard from './components/ProfileCard'
import InjuriesCard from './components/InjuriesCard'
import BillingCard from './components/BillingCard'

export default {
  name: 'DashboardAdmin',
  components: {
    BookingCard,
    ExerciseCard,
    PhysioCard,
    ProfileCard,
    InjuriesCard,
    BillingCard
  },
  data() {
    return {}
  },
  methods: {}
}
</script>

<style lang="scss" scoped>
.dashboard-editor-container {
  padding: 32px;
  background-color: rgb(240, 242, 245);
  position: relative;
}

</style>

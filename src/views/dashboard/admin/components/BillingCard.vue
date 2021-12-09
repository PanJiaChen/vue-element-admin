<template>
  <div class="card">
    <el-row :gutter="20">
      <el-col
        class="heading"
        :xs="10"
        :sm="10"
        :lg="6"
      ><div class="">
        <span class="heading__title">Billing</span>
      </div>
      </el-col>
      <el-col
        class="heading heading-icon"
        :xs="2"
        :sm="1"
        :md="1"
      ><div class=""><i class="el-icon-bank-card" /></div></el-col>
    </el-row>
    <el-row :gutter="20" class="card-content">
      <el-tabs type="border-card">
        <el-tab-pane label="Statements">
          <table class="info-table" cellspacing="0">
            <thead>
              <tr>
                <th class="thead-text">DATE</th>
                <th class="thead-text">ORDER ID</th>
                <th class="thead-text">AMOUNT</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>22-11-2021</td>
                <td>4576786</td>
                <td>£20</td>
              </tr>

              <tr>
                <td>16-11-2021</td>
                <td>4576786</td>
                <td>£40</td>
              </tr>

              <tr>
                <td>22-11-2021</td>
                <td>4576786</td>
                <td>£40</td>
              </tr>

              <tr>
                <td>22-11-2021</td>
                <td>4576786</td>
                <td>£20</td>
              </tr>
            </tbody>
          </table>
        </el-tab-pane>
        <el-tab-pane label="Credit Cards">
          <el-table :data="tableData" style="width: 100%">
            <el-table-column prop="date" label="DATE" width="180" />
            <el-table-column prop="orderId" label="ORDER ID" width="180" />
            <el-table-column prop="amount" label="AMOUNT" />
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-row>
  </div>
</template>

<script>
export default {
  props: {
    avatar: {
      type: String,
      default:
        'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif'
    }
  },
  data() {
    return {
      tableData: [
        {
          date: '22-11-2021',
          orderId: '4576786',
          amount: '£20'
        },
        {
          date: '16-11-2021',
          orderId: '4576786',
          amount: '£40'
        },
        {
          date: '22-11-2021',
          orderId: '4576786',
          amount: '£40'
        },
        {
          date: '22-11-2021',
          orderId: '4576786',
          amount: '£20'
        }
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
.heading {
  top: 120px;
  left: 211px;
  width: 479px;
  height: 38px;
  box-shadow: 30px 30px 50px #9d248a6e;
  border-radius: 6px;
  opacity: 1;
  color: #778298;
  padding: 10px;
  &-icon {
    padding: 10px;
    width: 38px;
    margin-left: 4px;
  }
  &-content {
    width: 521px;
    border-radius: 6px;
    background: transparent
      linear-gradient(180deg, #e03282 0%, #8a198e 85%, #8a198e 100%) 0% 0%
      no-repeat padding-box;
    box-shadow: 30px 30px 50px #9d248a6e;
    opacity: 1;
    &__right {
      position: absolute;
      font: normal normal 900 14px/16px SF Pro Display;
      letter-spacing: 0px;
      color: #ffffff;
      margin-top: 47px;
      margin-left: 30%;
      height: 251px;
    }
  }
  &__title {
    top: 130px;
    left: 232px;
    width: 98px;
    height: 18px;
    text-align: center;
    font: normal normal 900 15px/18px SF Pro Display Bold;
    letter-spacing: 0px;
    text-transform: uppercase;
    opacity: 1;
  }
}

.major {
  font: normal normal 900 34px/40px SF Pro Display;
}

.content {
  font: normal normal normal 14px/21px SF Pro Display;
  letter-spacing: 0px;
  color: #ffffff;
  &-value {
    font: normal normal 900 14px/21px SF Pro Display;
  }
}

.border {
  &-bottom {
    width: 126px;
    border-bottom: 1px solid #ffd603;
  }
  &-right {
    width: 126px;
    border-right: 1px solid #ffd603;
  }
}

.avatar {
  width: 38px !important;
  height: 38px !important;
  margin-top: 15px;
}

.form {
  padding-bottom: 30px;
}

.info-table {
  width: 481px;
  background-color: white;
  // border-collapse: collapse;
  border-collapse: separate;
  border-spacing: 0 5px;
  border-radius: 10px;
  overflow: hidden;
  th:not(:first-child) {
    text-align: center;
  }
}

thead {
  background: #778298 0% 0% no-repeat padding-box;
  color: white;
  th {
    padding: 10px;
    height: 37px;
    text-align: left;
    font: normal normal 15px/18px SF Pro Display Bold;
    letter-spacing: 0px;
    color: #ffffff;
    text-transform: uppercase;
  }
}

tbody {
  tr {
    background: #F2F3F5;
    padding-top: 10px;
    margin-bottom: 10px;
    td:not(:first-child) {
      text-align: center;
    }
  }
  color: #192440;
  td {
    padding: 20px 0px;
  }

  td:nth-child(1) {
    padding: 10px;
  }

  td:nth-child(3) {
    font-weight: bold;
  }

}

.el-row {
  margin-bottom: 5px;
}

.grid-content {
  min-height: 36px;
  &--box {
    min-height: 251px;
  }
}
.row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
}

@media (min-width: 550px) {
  .card-content {
    max-width: 521px;
    border-radius: 6px;
  }
}

@media (max-width: 550px) {
  .card {
    min-width: 376px;
  }
}
</style>
<style lang="scss">
// Override Element-UI inline style
.el-tabs__content {
  height: 371px;
  border-radius: 0px 0px 6px 6px;
}
</style>

<template>
	<div>
		<div>
		<span style="font-weight: bold">You could also run the analysis on the data from the specific date range</span><br>
		<span>From: </span>
		<Datepicker v-model="state.from" style="display: inline-block" :bootstrap-styling="true">
		</Datepicker>
		<span>To: </span>
		<Datepicker v-model="state.to" style="display: inline-block" :bootstrap-styling="true"></Datepicker>
		<button type="button" class="btn btn-success" @click="onSendAnalyzeOnDateRequest">Apply</button>
		</div>
		<div>
		<iframe src="http://localhost:808" width=1000 height=600></iframe>
		</div>
		<div>
		<button type="button" class="btn btn-secondary" @click="onBackToUpload">Back</button>
		</div>
    </div>
</template>

<script>
import Datepicker from 'vuejs-datepicker'
import { sendAnalyzeOnDateRequest } from '@/api/user'
import { getToken } from '@/utils/auth'
export default {
  name: 'plot',
  components: {
  	 Datepicker
  },

  data() {
	return {
	state: { from: new Date(), to: new Date() }
	};
  },

  methods: {
	  onSendAnalyzeOnDateRequest() {
	    this.$router.push({ name: "analyze" })
	    this.listLoading = true
	    sendAnalyzeOnDateRequest(getToken(), this.state.from, this.state.to).then(response => {
	        var token = response['token']

	        // if the response from the server indicating that it's running the analysis, then redirect to a loading view
	        if (token == 'success') {
	          this.$router.push({ name: "plot" })
	        }
	    })
	  },
	  onBackToUpload() {
	  	this.$router.push({ name: "Task" })
	  }
  }
}
</script>
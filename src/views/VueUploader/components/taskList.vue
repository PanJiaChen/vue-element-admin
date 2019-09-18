 <template>
  <div class="dropdown float-right">
    <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenu2" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
      {{ this.tasks[0].name }}
    </button>
    <div class="dropdown-menu" aria-labelledby="dropdownMenu2">
      <button class="dropdown-item" type="button" v-for="task in tasks" @click="currentTask = task.name" v-text="task.name"></button>
      <div class="dropdown-divider"></div>
      <form class="px-4 py-3">
        <div class="form-group">
          <label for="exampleDropdownFormEmail1">Task Name</label>
          <input class="form-control" id="exampleDropdownFormEmail1" v-model="newTaskName">
        </div>
        <button type="submit" class="btn btn-primary" @click="addNewTask()">+ Add new task</button>
        <button type="submit" class="btn btn-danger" @click="deleteTask">- Delete task</button>
      </form>
    </div>
  </div>
</template> 

<script>
  export default {
    data: function() {
      return {
        tasks: [{name: "Task 1"}],
        currentTask: "Task 1",
        newTaskName: "",
      }
    },

    methods: {
      setCurrentTask(name) {
        this.currentTask = name
      },
      addNewTask() {
        this.tasks.push({name: this.newTaskName})
      },
      deleteTask() {
        this.tasks.splice(this.tasks.indexOf({name: this.newTaskName}))
      }
    }
  }
</script>

<style scoped>
  .dropdown {
    display: inline;
  }
</style>

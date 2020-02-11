import { combineReducers } from 'redux';

const getAllTask = (state = {}, action) => {
    switch (action.type) {
        case "GET_TASKS_SUCCESS":
            return {
              tasks: action.tasks,
            }

        case "GET_TASKS_FAIL":
            return {
              tasks: null,
            }
        default:
          return state;
    }
}

const addTask = (state = {}, action) => {
    switch (action.type) {

      case "CREATE_TODO":
          return {
              isLoading: true,
              isError: false,
              isSuccess: false,
              errors: null,

          }

      case "CREATE_TODO_SUCCESS":
          return {
              isLoading: false,
              isError: false,
              isSuccess: true,
              task: action.task,
              errors: null
          }

      case "CREATE_TODO_FAIL":
          return {
              isLoading: false,
              isError: true,
              isSuccess: false,
              task: null,
              errors: action.payload
          }

      default:
        return state;
    }
}

const updateTask = (state = {}, action) => {
    switch (action.type) {

      case "UPDATE_TODO":
          return {
              isLoading: true,
              isError: false,
              isSuccess: false,
              errors: null
          }

      case "UPDATE_TODO_SUCCESS":
          return {
              isLoading: false,
              isError: false,
              isSuccess: true,
              errors: null,
          }

      case "UPDATE_TODO_FAIL":
          return {
              isLoading: false,
              isError: true,
              isSuccess: false,
              errors: action.payload
          }

      default:
        return state;
    }
}

const deleteTask = (state = {}, action) => {
    switch (action.type) {

      case "DESTROY_TODO":
          return {
              isLoading: true,
              isError: false,
              isSuccess: false,
              errors: null
          }

      case "DESTROY_TODO_SUCCESS":
          console.log("Working");
          return {
              isLoading: false,
              isError: false,
              isSuccess: true,
              errors: null,
          }

      case "DESTROY_TODO_FAIL":
          return {
              isLoading: false,
              isError: true,
              isSuccess: false,
              errors: action.payload
          }

      default:
        return state;
    }
}

export default combineReducers({
  getAllTask,
  addTask,
  updateTask,
  deleteTask
});
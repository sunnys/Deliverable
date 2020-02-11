import {fetchApi} from "../service/api";

export const getAllTasks = (payload) => {
    return async (dispatch) => {

        try {
          dispatch({
            type: "CREATE_TODO"
          });
          const response = await fetchApi("/tasks", "GET", payload, 200);

          if(response.success) {
            dispatch({
                type: "GET_TASKS_SUCCESS",
                tasks: response.responseBody,
            });
            return response;
          } else {
            throw response;
          }

        } catch (error) {
            dispatch({
                type: "GET_TASKS_SUCCESS",
                payload: error.responseBody
            });
            return error;
        }
    }
}

export const getTasksByDate = (date, payload) => {
    return async (dispatch) => {
        console.log(date);
        try {
          dispatch({
            type: "CREATE_TODO"
          });
          const response = await fetchApi("/tasks/by_date/" + date, "GET", payload, 200);

          if(response.success) {
            dispatch({
                type: "GET_TASKS_SUCCESS",
                tasks: response.responseBody,
            });
            return response;
          } else {
            throw response;
          }

        } catch (error) {
            dispatch({
                type: "GET_TASKS_SUCCESS",
                payload: error.responseBody
            });
            return error;
        }
    }
}

export const addTodo = (payload) => {
    return async (dispatch) => {

        try {
          dispatch({
            type: "CREATE_TODO"
          });
          const response = await fetchApi("/tasks", "POST", payload, 201);

          if(response.success) {
            dispatch({
                type: "CREATE_TODO_SUCCESS",
                task: response.responseBody
            });
            return response;
          } else {
            throw response;
          }

        } catch (error) {
            dispatch({
                type: "CREATE_TODO_FAIL",
                payload: error.responseBody
            });
            return error;
        }
    }
}

export const updateTodo = (task_id, payload) => {
    return async (dispatch) => {
        try {
          dispatch({
            type: "UPDATE_TODO"
          });
          const response = await fetchApi("/tasks/" + task_id, "PATCH", payload, 200);

          if(response.success) {
            dispatch({
                type: "UPDATE_TODO_SUCCESS"
            });
            return response;
          } else {
            throw response;
          }

        } catch (error) {
            dispatch({
                type: "UPDATE_TODO_FAIL",
                payload: error.responseBody
            });
            return error;
        }
    }
}

export const destroyTodo = (task_id) => {
    return async (dispatch, getState) => {
        const state = getState();
        try {
            const {authReducer: {authData: {token}}} = state;
            const response = await fetchApi("/tasks/" + task_id, "DELETE", null, 200, token);
            dispatch({
                type: "DESTROY_TODO_SUCCESS"
            });
        } catch (e) {
            console.log(e);
        }
    }
}
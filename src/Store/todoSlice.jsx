import { createSlice } from "@reduxjs/toolkit";

const TodoSlice = createSlice({
  name: "todo",
  initialState: {
    todos: [],
    isLoading: false,
    error: null,
  },
  reducers: {
    setLoading(state, action) {
      state.isLoading = action.payload;
    },
    addTodo(state, action) {
      state.todos = [...state.todos, action.payload];
    },
    // updateTodo(state, action) {
    //   const index = state.todos.findIndex(ele=>ele._id==action.payload.id)
    //   state.todos[index]=action.payload.data
    //   state.todos=[...state.todos]
    // }
    updateTodo(state, action) {
      const updatedTodos = state.todos.map((todo) => {
        if (todo._id === action.payload.id) {
          // Update the specific todo
          return action.payload.data;
        }
        // Return unchanged todos
        return todo;
      });
        //  console.log(updatedTodos)
      return {
        ...state,
        todos: updatedTodos,
      };
    },
    todoDeleted(state, action) {
      state.todos = state.todos.filter((todo) => todo.id!==action.payload.id);
    },
    initialTodo(state, action) {
      state.todos = action.payload;
    },
    setError(state, action) {
      state.error = action.payload;
    },
  },
});

export const {
  addTodo,
  todoDeleted,
  initialTodo,
  updateTodo,
  setLoading,
  setError,
} = TodoSlice.actions;
export default TodoSlice.reducer;

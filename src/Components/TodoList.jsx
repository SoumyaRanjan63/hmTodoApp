import React, { useState,useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addTodo, updateTodo } from "../Store/todoSlice";
import { editTodo, fetchData ,deleteTodo } from "../Store/actions/todoActions";
import { addTodos } from "../Store/actions/todoActions";




const TodoList = () => {
    const [input, setInput] = useState("");
    const [textEdit, setTextEdit] = useState("");
    const [idEdit, setIdEdit] = useState(null);
    const [showSearchList, setShowSearchList] = useState(false);

    const todos = useSelector(state => state.todos.todos);
 
    const dispatch = useDispatch();

    const handleSearch = () => {
        setShowSearchList(true);
    };

    const handleAddTask = () => {
        // console.log("working")
        dispatch(addTodos({
            todo: input
        }));
        setInput('');
    };

    
    const handleEdit = (id, text) => {
        console.log(textEdit)
        setTextEdit(text);
        setIdEdit(id);
    };

    const handleUpdate = () => {
        dispatch(editTodo({
            id: idEdit,
            newData: textEdit
             
        }));
        setTextEdit("");
        setIdEdit(null);
    };
    
    const handleRemove = (id) => {
        console.log("remove working");
       dispatch(deleteTodo(id))
    };

    useEffect(()=>{
        dispatch(fetchData());
        // console.log(" fetch data working ");
    },[])

    return (
        <div className="todo-container">
            <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Add new task..."
                className="main-input"
            />
            <button className="add-task-btn" onClick={handleAddTask}>Add task</button>
            <button className="search-btn" onClick={handleSearch}>Search</button>
            {showSearchList && (
                <ul className="search-list">
                    {todos.map(todo => (
                        <li key={todo._id}>{todo.todo}</li>
                    ))}
                </ul>
            )}

            <ul className="todo-list-container">
                {todos.map(todo => (
                    <li key={todo._id}>
                        <input type="checkbox" />
                        {idEdit === todo._id ?
                            <>
                                <input
                                    type="text"
                                    value={textEdit}
                                    onChange={e => setTextEdit(e.target.value)}
                                />
                                <button className="update-task-btn" onClick={handleUpdate}>Update</button>
                            </>
                            : (
                                <>
                                    <span>{todo.todo}</span>
                                    <div className="button-group">
                                        <button className="edit-task-btn" onClick={() => handleEdit(todo._id, todo.todo)}>Edit</button>
                                        <button className="delete-task-btn" onClick={() => handleRemove(todo._id)}>Delete</button>
                                    </div>
                                </>
                            )
                        }
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default TodoList;

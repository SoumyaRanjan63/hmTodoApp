import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { authFailure } from '../Store/userSlice';
import { signUp } from '../Store/actions/authActions';
import { useNavigate } from "react-router-dom";


const Signup = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        username: '',
        password: ''
    });

    const loading = useSelector(state => state.user.isLoading);
    const error = useSelector(state => state.user.error);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };


    const handleSubmit = (e) => {
        e.preventDefault();
        navigate('/Login')
        dispatch(signUp(formData), () => navigate('/Login'));
    };
    useEffect(() => {
        if (error) {
            alert(error);
            dispatch(authFailure(null))
        }
    }, [dispatch, error]);

    return (
        <div>
            {loading && <p>Loading...</p>}
            {error && <p>Error: {error}</p>}
            <form onSubmit={handleSubmit} method="POST">
                <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Name" />
                <br />
                <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" />
                <br />
                <input type="text" name="username" value={formData.username} onChange={handleChange} placeholder="Username" />
                <br />
                <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Password" />
                <br />
                <button type="submit" disabled={loading}>Register</button>
            </form>
        </div>
    );
}

export default Signup;

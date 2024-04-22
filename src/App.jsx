import { BrowserRouter as Router,Routes, Route, Link } from 'react-router-dom';
import TodoList from '../src/Components/TodoList';
import Signup from './Pages/Signup';
import Login from './Pages/Login';
import Dashboard from './Pages/Dashboard';

const App = () => {
    return (
        <Router>          
                <Routes>
                    <Route exact path="/" Component={TodoList} />
                    <Route  path="/Signup" Component={Signup} />
                    <Route  path="/Login" Component={Login} />
                    <Route  path="/Dashboard" Component={Dashboard} />
                </Routes>
                
        </Router>
    );
}

export default App;

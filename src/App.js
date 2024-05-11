
import './App.css';
import Signup from './components/signup/signup';
import { AuthProvider } from './context/AuthContext';
import { BrowserRouter  as Router, Routes, Route} from 'react-router-dom';
import Dashboard from './components/Dashboard/Dashboard';
import Login from './components/Login/Login';
import PrivateRoute from './components/Route/PrivateRoute';
import Employee from './pages/Employee';
import SalaryTable from './components/Salary/SalaryTable';

function App() {
  return (
    
          <Router>
            <AuthProvider>
              <Routes>
              
                <Route path='/dashboard'  element={
                <PrivateRoute>
                    <Dashboard />
                </PrivateRoute>
            }
            />
             <Route path='/employee'  element={
                <PrivateRoute>
                    <Employee />
                </PrivateRoute>
            }
            
            />

              <Route path='/salary'  element={
                <PrivateRoute>
                    <SalaryTable />
                </PrivateRoute>
                 }
              />
                <Route path='/signup' Component={Signup}/>
                <Route path='/' Component={Login}/>
              </Routes>
            </AuthProvider>
          </Router>
       
  );
}

export default App;

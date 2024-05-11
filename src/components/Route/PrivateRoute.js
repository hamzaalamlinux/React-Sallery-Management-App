
import {Outlet, useNavigate } from 'react-router-dom'
import { useAuth  } from '../../context/AuthContext'
import { useEffect } from 'react';
import BaseLayout from '../Layout/BaseLayout';

const   PrivateRoute = ({component, children}) => {
  const { currentUser } = useAuth();
  let navigate = useNavigate();
    
    useEffect(() => {
      if (!currentUser){
          return navigate("/");
      }
    },[currentUser, navigate]);

    return (
  <BaseLayout>
    {{children}}
  </BaseLayout>
    );
}

export default PrivateRoute
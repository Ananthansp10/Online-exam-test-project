'use client'

import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import axiosInstance from '../config/axiosConfig';

interface ProtectedRouteProps {
  allowedRoles: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles }) => {
  const [loading, setLoading] = useState(true);
  const [isAuth, setIsAuth] = useState(false);
  const [isExpired, setIsExpired] = useState(false);
  const [unauthorized, setUnauthorized] = useState(false);

  useEffect(() => {
    const verifyUser = async () => {
      try {
        const response = await axiosInstance.post('/user/verify', { allowedRoles });

        if (response.data.isExpired) {
          setIsExpired(true);
        } else if (!response.data.isAuth) {
          setUnauthorized(true);
        } else {
          setIsAuth(true);
        }
      } catch (err) {
        setUnauthorized(true);
      } finally {
        setLoading(false);
      }
    };

    verifyUser();
  }, [allowedRoles]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (isExpired) {
    return <Navigate to="/login" replace />;
  }

  if (unauthorized) {
    return <Navigate to="/unauthorized" replace />;
  }

  if (isAuth) {
    return <Outlet />;
  }

  return null;
};

export default ProtectedRoute;

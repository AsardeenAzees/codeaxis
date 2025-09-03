import React, { createContext, useContext, useReducer, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import toast from 'react-hot-toast'
import axios from 'axios'

// API endpoints
const API_URL = (import.meta?.env?.VITE_API_URL) || 'http://localhost:5000/api'

// Action types
const AUTH_ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  SET_USER: 'SET_USER',
  SET_ERROR: 'SET_ERROR',
  LOGOUT: 'LOGOUT',
  UPDATE_USER: 'UPDATE_USER',
  SET_FIRST_LOGIN: 'SET_FIRST_LOGIN'
}

// Initial state
const initialState = {
  user: null,
  loading: true,
  error: null,
  isFirstLogin: false
}

// Auth reducer
const authReducer = (state, action) => {
  switch (action.type) {
    case AUTH_ACTIONS.SET_LOADING:
      return { ...state, loading: action.payload }
    case AUTH_ACTIONS.SET_USER:
      return { 
        ...state, 
        user: action.payload, 
        loading: false, 
        error: null,
        isFirstLogin: action.payload?.isFirstLogin || false
      }
    case AUTH_ACTIONS.SET_ERROR:
      return { ...state, error: action.payload, loading: false }
    case AUTH_ACTIONS.LOGOUT:
      return { ...state, user: null, loading: false, error: null, isFirstLogin: false }
    case AUTH_ACTIONS.UPDATE_USER:
      return { ...state, user: { ...state.user, ...action.payload } }
    case AUTH_ACTIONS.SET_FIRST_LOGIN:
      return { ...state, isFirstLogin: action.payload }
    default:
      return state
  }
}

// Create context
const AuthContext = createContext()

// Auth provider component
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState)
  const navigate = useNavigate()
  const location = useLocation()

  // Check if user is authenticated on mount
  useEffect(() => {
    checkAuthStatus()
  }, [])

  // Check authentication status
  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem('accessToken')
      
      if (!token) {
        dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false })
        return
      }

      // Set default auth header
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`

      // Verify token with backend
      const response = await axios.get(`${API_URL}/auth/profile`)
      
      if (response.data.success) {
        dispatch({ type: AUTH_ACTIONS.SET_USER, payload: response.data.user })
        
        // Check if this is first login
        if (response.data.user.isFirstLogin) {
          dispatch({ type: AUTH_ACTIONS.SET_FIRST_LOGIN, payload: true })
          
          // Redirect to profile setup if not already there
          if (!location.pathname.includes('/admin/profile')) {
            navigate('/admin/profile', { replace: true })
          }
        }
      } else {
        // Token is invalid, remove it
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        localStorage.removeItem('user')
        delete axios.defaults.headers.common['Authorization']
        dispatch({ type: AUTH_ACTIONS.LOGOUT })
      }
    } catch (error) {
      console.error('Auth check failed:', error)
      
      // Remove invalid token
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      localStorage.removeItem('user')
      delete axios.defaults.headers.common['Authorization']
      dispatch({ type: AUTH_ACTIONS.LOGOUT })
    }
  }

  // Login function
  const login = async (credentials) => {
    try {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true })
      
      const response = await axios.post(`${API_URL}/auth/login`, credentials)
      
      if (response.data.success) {
        const { user, accessToken, refreshToken } = response.data
        
        // Store token
        localStorage.setItem('accessToken', accessToken)
        localStorage.setItem('refreshToken', refreshToken)
        localStorage.setItem('user', JSON.stringify(user))
        axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`
        
        // Update user state
        dispatch({ type: AUTH_ACTIONS.SET_USER, payload: user })
        
        // Check if first login
        if (user.isFirstLogin) {
          dispatch({ type: AUTH_ACTIONS.SET_FIRST_LOGIN, payload: true })
          navigate('/admin/profile', { replace: true })
          toast.success('Welcome! Please complete your profile setup.')
        } else {
          navigate('/admin', { replace: true })
          toast.success(`Welcome back, ${user.firstName}!`)
        }
        
        return { success: true }
      } else {
        dispatch({ type: AUTH_ACTIONS.SET_ERROR, payload: response.data.message })
        toast.error(response.data.message)
        return { success: false, message: response.data.message }
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed. Please try again.'
      dispatch({ type: AUTH_ACTIONS.SET_ERROR, payload: message })
      toast.error(message)
      return { success: false, message }
    }
  }

  // Logout function
  const logout = () => {
    // Remove token
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('user')
    delete axios.defaults.headers.common['Authorization']
    
    // Update state
    dispatch({ type: AUTH_ACTIONS.LOGOUT })
    
    // Navigate to home
    navigate('/', { replace: true })
    
    toast.success('Logged out successfully')
  }

  // Update user profile
  const updateProfile = async (profileData) => {
    try {
      const response = await axios.put(`${API_URL}/users/profile`, profileData)
      
      if (response.data.success) {
        dispatch({ type: AUTH_ACTIONS.UPDATE_USER, payload: response.data.user })
        
        // If this was first login, mark it as completed
        if (state.isFirstLogin) {
          dispatch({ type: AUTH_ACTIONS.SET_FIRST_LOGIN, payload: false })
          navigate('/admin', { replace: true })
          toast.success('Profile updated successfully! Welcome to CodeAxis.')
        } else {
          toast.success('Profile updated successfully!')
        }
        
        return { success: true }
      } else {
        toast.error(response.data.message)
        return { success: false, message: response.data.message }
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Profile update failed.'
      toast.error(message)
      return { success: false, message }
    }
  }

  // Change password
  const changePassword = async (passwordData) => {
    try {
      const response = await axios.put(`${API_URL}/users/change-password`, passwordData)
      
      if (response.data.success) {
        toast.success('Password changed successfully!')
        return { success: true }
      } else {
        toast.error(response.data.message)
        return { success: false, message: response.data.message }
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Password change failed.'
      toast.error(message)
      return { success: false, message }
    }
  }

  // Forgot password
  const forgotPassword = async (email, nic) => {
    try {
      const response = await axios.post(`${API_URL}/auth/forgot-password`, { email, nic })
      
      if (response.data.success) {
        toast.success('Password reset instructions sent to your email!')
        return { success: true }
      } else {
        toast.error(response.data.message)
        return { success: false, message: response.data.message }
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Password reset request failed.'
      toast.error(message)
      return { success: false, message }
    }
  }

  // Reset password
  const resetPassword = async (token, newPassword) => {
    try {
      const response = await axios.post(`${API_URL}/auth/reset-password`, { token, newPassword })
      
      if (response.data.success) {
        toast.success('Password reset successfully! Please login with your new password.')
        return { success: true }
      } else {
        toast.error(response.data.message)
        return { success: false, message: response.data.message }
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Password reset failed.'
      toast.error(message)
      return { success: false, message }
    }
  }

  // Check if user has permission
  const hasPermission = (permission) => {
    if (!state.user) return false
    
    switch (permission) {
      case 'main_admin':
        return state.user.role === 'main_admin'
      case 'admin':
        return ['main_admin', 'admin'].includes(state.user.role)
      case 'manage_users':
        return state.user.role === 'main_admin'
      case 'manage_settings':
        return state.user.role === 'main_admin'
      default:
        return false
    }
  }

  // Check if user can access resource
  const canAccess = (resource, resourceId = null) => {
    if (!state.user) return false
    
    // Main admin can access everything
    if (state.user.role === 'main_admin') return true
    
    // Regular admin can access most resources
    if (state.user.role === 'admin') {
      // Cannot access user management or settings
      if (['users', 'settings'].includes(resource)) return false
      
      // Can access their own resources
      if (resourceId && resourceId === state.user._id) return true
      
      return true
    }
    
    return false
  }

  // Context value
  const value = {
    ...state,
    login,
    logout,
    updateProfile,
    changePassword,
    forgotPassword,
    resetPassword,
    hasPermission,
    canAccess,
    checkAuthStatus
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext)
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  
  return context
}

export default AuthContext

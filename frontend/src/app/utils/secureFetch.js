'use client'

import axios from "axios"
import toast from "react-hot-toast"
import { redirect } from 'next/navigation'
import { logout } from "./auth"
export const secureFetch = async ({ url, method = 'GET', params = {}, data = {} }) => {
  const token = localStorage.getItem('accessToken')
  if (!token) {
    toast.error('Session expired. Please log in again.')
    window.location.href = '/login';
    return
  }

  try {
    const config = {
      method,
      url,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }

    if (method === 'GET') {
      config.params = params
    } else {
      config.data = data
    }

    const result = await axios(config)
    return result.data
  } catch (error) {
    if (error.response?.status === 401) {
      logout();
      toast.error('Session expired. Please log in again.')
      window.location.href = '/login';
    } else {
      return
    }
    throw error
  }
}

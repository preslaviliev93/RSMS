'use client'
import axios from "axios"
import toast from "react-hot-toast"


export const secureFetch = async ({url, params = {}}) => {
    const token = localStorage.getItem('accessToken')
    if(!token){
        toast.error('Session expired. Please log in again.')
        redirect('/login')
        return
    }

    try {
        const result = await axios.get(url, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        params,
        })
        return result.data
    }catch(error){
        if (error.response?.status === 401) {
            toast.error('Session expired. Please log in again.')
            redirect('/login')
          } else {
            toast.error('Failed to fetch data.')
          }
          throw error
        }
}

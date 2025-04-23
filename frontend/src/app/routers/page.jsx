'use client'
import React from 'react'
import RouterCard from '../components/RouterCard'
import { Router } from 'lucide-react'
import { useEffect, useState} from 'react'
import { useAuthGuard } from '../hooks/useAuthGuard'
import PaginationControls from '../components/PaginationControls'
import FilterResultsSeaching from '../components/FilterResultsSeaching'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import axios from 'axios'

export default function Routers() {
  const { user, loadingUser } = useAuthGuard()
  const [routers, setRouters] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(12)
  const [search, setSearch] = useState('')
  const [role, setRole] = useState('')
  const router = useRouter()
  const [userRole, setUserRole] = useState('')
  const API_URL = process.env.NEXT_PUBLIC_API_URL



  const fetchRouters = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem('accessToken')
      const response = await axios.get(`${API_URL}/routers/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            page_size: 9999,
            
          },
        }
      )
      setRouters(response.data.results)

    } catch(error){
            setError(error.response?.data?.message || 'An error occurred')
            toast.error('Failed to fetch routers.')
      }
      finally {
        setLoading(false)
      }
        }
  
    useEffect(() => {
      if(!user && !loadingUser){
        router.push('/login')
      }
      const userRole = JSON.parse(localStorage.getItem('userRole') || '{}').role || ""
      setUserRole(userRole)
      fetchRouters()
      console.log(`Fetched routers: ${routers}`)
    }, [user, API_URL])
  




  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {routers.map((router) => (
        <RouterCard key={router.id} router={router} />
      ))}
    </div>
  )
}

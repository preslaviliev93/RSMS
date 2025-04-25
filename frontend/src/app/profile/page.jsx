'use client'

import React, { useEffect, useState } from 'react'
import axios from 'axios'
import ToastMessage from '../components/ToastMessage'
import { useAuthGuard } from '../hooks/useAuthGuard'
import { useRouter } from 'next/navigation'

export default function ProfilePage() {
  const { user, loadingUser } = useAuthGuard()
  const [profile, setProfile] = useState(null)
  const [formData, setFormData] = useState({})
  const [editing, setEditing] = useState(false)
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [toast, setToast] = useState(null)
  const router = useRouter()
  const API_URL = process.env.NEXT_PUBLIC_API_URL

  useEffect(() => {
    if (!user && !loadingUser) {
        router.push('/login')
    }else{
        const fetchProfile = async () => {
            try {
              const token = localStorage.getItem('accessToken')
              const res = await axios.get(`${API_URL}/users/profile/`, {
                headers: { Authorization: `Bearer ${token}` },
              })
              setProfile(res.data)
              setFormData(res.data)
            } catch (err) {
              setToast({ type: 'error', message: 'Failed to fetch profile' })
            }
          }
          fetchProfile()
    }
  }, [])

  const handleProfileSave = async () => {
    try {
      const token = localStorage.getItem('accessToken')
      const res = await axios.put(`${API_URL}/users/profile/`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setProfile(res.data)
      setEditing(false)
      setToast({ type: 'success', message: 'Profile updated successfully' })
    } catch (err) {
      setToast({ type: 'error', message: 'Failed to update profile' })
    }
  }

  const handlePasswordChange = async () => {
    try {
      const token = localStorage.getItem('accessToken')
      await axios.put(`${API_URL}/users/profile/change-password/`, {
        old_password: oldPassword,
        new_password: newPassword,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setOldPassword('')
      setNewPassword('')
      setToast({ type: 'success', message: 'Password changed successfully' })
    } catch (err) {
        const errMsg =
        err.response?.data?.old_password?.[0] ||
        err.response?.data?.new_password?.[0] ||
        err.response?.data?.detail ||
        'Password change failed.'
      setToast({ type: 'error', message: errMsg })
    }
  }

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  return (
    <div className="min-h-screen p-6 text-gray-800 dark:text-gray-100">
      <div className="max-w-xl mx-auto bg-white dark:bg-[#1c1c1c] border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-md">
        <h1 className="text-2xl font-bold mb-4">My Profile</h1>

        {toast && (
          <div className="mb-4">
            <ToastMessage type={toast.type} message={toast.message} />
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Username</label>
            <input
              type="text"
              value={formData.username || ''}
              disabled
              className="w-full mt-1 px-3 py-2 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email || ''}
              disabled={!editing}
              onChange={handleInputChange}
              className={`w-full mt-1 px-3 py-2 rounded-md border ${
                editing
                  ? 'border-blue-500 bg-white dark:bg-gray-800'
                  : 'border-gray-300 bg-gray-100 dark:bg-gray-700'
              } text-gray-700 dark:text-gray-200`}
            />
          </div>

          <div>
            <label className="text-sm font-medium">Role</label>
            <input
              type="text"
              value={formData.role || ''}
              disabled
              className="w-full mt-1 px-3 py-2 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200"
            />
          </div>

          <div className="flex gap-4">
            {!editing ? (
              <button
                onClick={() => setEditing(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Edit Profile
              </button>
            ) : (
              <button
                onClick={handleProfileSave}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Save Changes
              </button>
            )}
          </div>
        </div>

        <hr className="my-6 border-gray-300 dark:border-gray-600" />

        <h2 className="text-xl font-bold mb-2">Change Password</h2>
        <div className="space-y-4">
          <input
            type="password"
            placeholder="Old Password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200"
          />
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200"
          />
          <button
            onClick={handlePasswordChange}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Change Password
          </button>
        </div>
      </div>
    </div>
  )
}

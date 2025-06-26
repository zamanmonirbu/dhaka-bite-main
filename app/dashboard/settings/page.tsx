"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Search, User, LayoutDashboard, CreditCard, Utensils, Settings, LogOut, Edit, Users } from "lucide-react"

export default function SettingsPage() {
  const router = useRouter()
  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [isEditingPersonal, setIsEditingPersonal] = useState(false)
  const [isEditingPassword, setIsEditingPassword] = useState(false)

  const [profileData, setProfileData] = useState({
    name: "Bessie Edwards",
    username: "@bessieedwards",
  })

  const [personalData, setPersonalData] = useState({
    firstName: "Bessie",
    lastName: "Edwards",
    area: "",
    address: "",
    email: "alma.lawson@example.com",
    phone: "(307) 555-0133",
  })

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  const handleLogout = () => {
    router.push("/")
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
    
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
       

        {/* Settings Content */}
        <main className="flex-1 p-8 bg-green-50">
          {/* Profile Section */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-20 h-20 bg-gray-300 rounded-full overflow-hidden">
                  <img
                    src="/placeholder.svg?height=80&width=80&query=profile picture of a person with glasses"
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">{profileData.name}</h2>
                  <p className="text-gray-600">{profileData.username}</p>
                </div>
              </div>
              <button
                onClick={() => setIsEditingProfile(!isEditingProfile)}
                className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-green-700"
              >
                <Edit className="w-4 h-4" />
                <span>Edit</span>
              </button>
            </div>
          </div>

          {/* Personal Information Section */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6 border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
              <button
                onClick={() => setIsEditingPersonal(!isEditingPersonal)}
                className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-green-700"
              >
                <Edit className="w-4 h-4" />
                <span>Edit</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                <input
                  type="text"
                  value={personalData.firstName}
                  onChange={(e) => setPersonalData({ ...personalData, firstName: e.target.value })}
                  disabled={!isEditingPersonal}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-50 disabled:bg-gray-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                <input
                  type="text"
                  value={personalData.lastName}
                  onChange={(e) => setPersonalData({ ...personalData, lastName: e.target.value })}
                  disabled={!isEditingPersonal}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-50 disabled:bg-gray-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Area</label>
                <input
                  type="text"
                  value={personalData.area}
                  onChange={(e) => setPersonalData({ ...personalData, area: e.target.value })}
                  placeholder="Enter area"
                  disabled={!isEditingPersonal}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-50 disabled:bg-gray-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                <input
                  type="text"
                  value={personalData.address}
                  onChange={(e) => setPersonalData({ ...personalData, address: e.target.value })}
                  placeholder="For example: House#124, Street#123, 3 Road, Banasree, Dhaka"
                  disabled={!isEditingPersonal}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-50 disabled:bg-gray-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                <input
                  type="email"
                  value={personalData.email}
                  onChange={(e) => setPersonalData({ ...personalData, email: e.target.value })}
                  disabled={!isEditingPersonal}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-50 disabled:bg-gray-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                <input
                  type="tel"
                  value={personalData.phone}
                  onChange={(e) => setPersonalData({ ...personalData, phone: e.target.value })}
                  disabled={!isEditingPersonal}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-50 disabled:bg-gray-100"
                />
              </div>
            </div>
          </div>

          {/* Change Password Section */}
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Change password</h3>
              <button
                onClick={() => setIsEditingPassword(!isEditingPassword)}
                className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-green-700"
              >
                <Edit className="w-4 h-4" />
                <span>Edit</span>
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                <input
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                  placeholder="############"
                  disabled={!isEditingPassword}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-50 disabled:bg-gray-100"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                  <input
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    placeholder="############"
                    disabled={!isEditingPassword}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-50 disabled:bg-gray-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                  <input
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                    placeholder="############"
                    disabled={!isEditingPassword}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-50 disabled:bg-gray-100"
                  />
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

// pages/dashboard.tsx
'use client'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import WalletConnection from '@/components/WalletConnection'

interface Project {
  id: string
  title: string
  fundingGoal: number
  currentFunding: number
  status: 'Pending' | 'Approved' | 'Funded' | 'Completed'
}

interface UserStats {
  totalStaked: number
  totalVotingPower: number
  projectsVotedOn: number
}

export default function Dashboard() {
  const [projects, setProjects] = useState<Project[]>([])
  const [userStats, setUserStats] = useState<UserStats | null>(null)

  useEffect(() => {
    fetchProjects()
    fetchUserStats()
  }, [])

  const fetchProjects = async () => {
    // Placeholder: Replace with actual API call
    const fetchedProjects: Project[] = [
      { id: '1', title: 'Project A', fundingGoal: 10000, currentFunding: 5000, status: 'Approved' },
      { id: '2', title: 'Project B', fundingGoal: 20000, currentFunding: 15000, status: 'Funded' },
    ]
    setProjects(fetchedProjects)
  }

  const fetchUserStats = async () => {
    // Placeholder: Replace with actual API call
    setUserStats({
      totalStaked: 5000,
      totalVotingPower: 5000,
      projectsVotedOn: 3,
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <WalletConnection />
        <h1 className="text-4xl font-bold text-white mb-8">Funder's Dashboard</h1>
        
        {userStats && (
          <motion.div 
            className="bg-white rounded-xl shadow-lg p-6 mb-8"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Your Stats</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-gray-600">Total Staked</p>
                <p className="text-2xl font-bold text-indigo-600">{userStats.totalStaked} tokens</p>
              </div>
              <div>
                <p className="text-gray-600">Voting Power</p>
                <p className="text-2xl font-bold text-indigo-600">{userStats.totalVotingPower}</p>
              </div>
              <div>
                <p className="text-gray-600">Projects Voted On</p>
                <p className="text-2xl font-bold text-indigo-600">{userStats.projectsVotedOn}</p>
              </div>
            </div>
          </motion.div>
        )}

        <h2 className="text-2xl font-semibold text-white mb-4">Your Funded Projects</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map(project => (
            <motion.div
              key={project.id}
              className="bg-white rounded-xl shadow-lg overflow-hidden"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{project.title}</h3>
                <p className="text-indigo-600 font-medium mb-4">Funding Goal: {project.fundingGoal} tokens</p>
                <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
                  <div 
                    className="bg-indigo-600 h-2.5 rounded-full" 
                    style={{ width: `${(project.currentFunding / project.fundingGoal) * 100}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-500 mb-2">
                  {project.currentFunding} / {project.fundingGoal} tokens funded
                </p>
                <p className={`text-sm font-semibold ${
                  project.status === 'Completed' ? 'text-green-600' :
                  project.status === 'Funded' ? 'text-blue-600' :
                  project.status === 'Approved' ? 'text-yellow-600' :
                  'text-gray-600'
                }`}>
                  Status: {project.status}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
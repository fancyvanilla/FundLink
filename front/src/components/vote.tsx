// pages/vote.tsx
'use client'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import WalletConnection from '../components/WalletConnection'

interface Project {
  id: string
  title: string
  description: string
  fundingGoal: number
  currentVotes: number
  totalVotes: number
}

export default function VotingInterface() {
  const [projects, setProjects] = useState<Project[]>([])
  const [userVotes, setUserVotes] = useState<{[key: string]: number}>({})

  useEffect(() => {
    // Fetch projects from your API or blockchain
    // This is a placeholder
    const fetchProjects = async () => {
      // const fetchedProjects = await getProjects()
      const fetchedProjects: Project[] = [
        { id: '1', title: 'Project A', description: 'Description A', fundingGoal: 1000, currentVotes: 50, totalVotes: 100 },
        { id: '2', title: 'Project B', description: 'Description B', fundingGoal: 2000, currentVotes: 30, totalVotes: 100 },
        // Add more projects as needed
      ]
      setProjects(fetchedProjects)
    }
    fetchProjects()
  }, [])

  const handleVote = async (projectId: string, voteAmount: number) => {
    // Implement blockchain interaction for voting
    // This is a placeholder function
    try {
      // await vote(projectId, voteAmount)
      setUserVotes(prev => ({...prev, [projectId]: (prev[projectId] || 0) + voteAmount}))
      setProjects(prev => prev.map(p => p.id === projectId ? {...p, currentVotes: p.currentVotes + voteAmount, totalVotes: p.totalVotes + voteAmount} : p))
    } catch (error) {
      console.error("Voting failed:", error)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <WalletConnection />
        <h1 className="text-4xl font-bold text-white mb-8">Vote on Projects</h1>
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
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">{project.title}</h2>
                <p className="text-gray-600 mb-4">{project.description}</p>
                <p className="text-indigo-600 font-medium mb-4">Funding Goal: {project.fundingGoal} tokens</p>
                <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
                  <div className="bg-indigo-600 h-2.5 rounded-full" style={{ width: `${(project.currentVotes / project.totalVotes) * 100}%` }}></div>
                </div>
                <p className="text-sm text-gray-500 mb-4">
                  {project.currentVotes} / {project.totalVotes} votes
                </p>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleVote(project.id, 1)}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-full hover:bg-indigo-700 transition duration-300"
                  >
                    Vote
                  </button>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={userVotes[project.id] || 0}
                    onChange={(e) => handleVote(project.id, parseInt(e.target.value) - (userVotes[project.id] || 0))}
                    className="border-2 border-indigo-600 rounded-full px-3 py-1 w-20 text-center"
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
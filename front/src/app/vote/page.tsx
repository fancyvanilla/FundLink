// pages/vote.tsx
'use client'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import WalletConnection from '@/components/WalletConnection'

interface Project {
  id: string
  title: string
  description: string
  fundingGoal: number
  currentVotes: number
  votingThreshold: number
}

export default function VotingInterface() {
  const [projects, setProjects] = useState<Project[]>([])
  const [userVotingPower, setUserVotingPower] = useState(0)
  const [userVotes, setUserVotes] = useState<{[key: string]: number}>({})

  useEffect(() => {
    // Fetch projects and user's voting power
    fetchProjects()
    fetchUserVotingPower()
  }, [])

  const fetchProjects = async () => {
    // Placeholder: Replace with actual API call
    const fetchedProjects: Project[] = [
      { id: '1', title: 'Project A', description: 'Description A', fundingGoal: 10000, currentVotes: 500, votingThreshold: 1000 },
      { id: '2', title: 'Project B', description: 'Description B', fundingGoal: 20000, currentVotes: 300, votingThreshold: 1000 },
    ]
    setProjects(fetchedProjects)
  }

  const fetchUserVotingPower = async () => {
    // Placeholder: Replace with actual API call to get user's staked tokens
    setUserVotingPower(1000)
  }

  const handleVote = async (projectId: string, voteAmount: number) => {
    // Placeholder: Replace with actual blockchain interaction
    try {
      // await voteOnProject(projectId, voteAmount)
      setUserVotes(prev => ({...prev, [projectId]: (prev[projectId] || 0) + voteAmount}))
      setProjects(prev => prev.map(p => p.id === projectId ? {...p, currentVotes: p.currentVotes + voteAmount} : p))
      setUserVotingPower(prev => prev - voteAmount)
    } catch (error) {
      console.error("Voting failed:", error)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <WalletConnection />
        <h1 className="text-4xl font-bold text-white mb-8">Vote on Projects</h1>
        <p className="text-xl text-white mb-8">Your Voting Power: {userVotingPower}</p>
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
                  <div 
                    className="bg-indigo-600 h-2.5 rounded-full" 
                    style={{ width: `${(project.currentVotes / project.votingThreshold) * 100}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-500 mb-4">
                  {project.currentVotes} / {project.votingThreshold} votes
                </p>
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    min="1"
                    max={userVotingPower}
                    placeholder="Votes"
                    className="border-2 border-indigo-600 rounded-full px-3 py-1 w-24 text-center"
                    onChange={(e) => {
                      const amount = parseInt(e.target.value);
                      if (!isNaN(amount) && amount <= userVotingPower) {
                        handleVote(project.id, amount);
                      }
                    }}
                  />
                  <button
                    onClick={() => handleVote(project.id, 1)}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-full hover:bg-indigo-700 transition duration-300"
                    disabled={userVotingPower === 0}
                  >
                    Vote
                  </button>
                </div>
                {userVotes[project.id] > 0 && (
                  <p className="text-sm text-green-600 mt-2">
                    Your votes: {userVotes[project.id]}
                  </p>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
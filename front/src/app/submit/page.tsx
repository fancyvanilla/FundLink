// pages/submit-project.tsx

"use client"
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import WalletConnection from '@/components/WalletConnection'

interface ProjectData {
  title: string
  description: string
  fundingGoal: number
  timeline: string
  category: string
  images: File[]
}

const SUBMISSION_FEE = 0.1 // Example fee in your platform's native token


export default function SubmitProject() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [feePaid, setFeePaid] = useState(false)
  const [projectData, setProjectData] = useState<ProjectData>({
    title: '',
    description: '',
    fundingGoal: 0,
    timeline: '',
    category: '',
    images: [],
  })

  const paySubmissionFee = async () => {
    // Implement blockchain interaction for fee payment
    // This is a placeholder function
    try {
      // await payFee(SUBMISSION_FEE)
      setFeePaid(true)
      nextStep()
    } catch (error) {
      console.error("Fee payment failed:", error)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setProjectData({ ...projectData, [e.target.name]: e.target.value })
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setProjectData({ ...projectData, images: Array.from(e.target.files) })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // Implement your blockchain submission logic here
    console.log('Submitting project:', projectData)
    // After successful submission:
    router.push('/submission-success')
  }

  const nextStep = () => setStep(step + 1)
  const prevStep = () => setStep(step - 1)

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl">
        <div className="p-8">
          <WalletConnection />
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Submit Your Project</h2>
          <motion.form onSubmit={handleSubmit} className="mt-8 space-y-6">
            {step === 1 && (
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
              >
                <input
                  type="text"
                  name="title"
                  value={projectData.title}
                  onChange={handleChange}
                  placeholder="Project Title"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                />
                <textarea
                  name="description"
                  value={projectData.description}
                  onChange={handleChange}
                  placeholder="Project Description"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                />
                <button
                  type="button"
                  onClick={nextStep}
                  className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 mt-4"
                >
                  Next
                </button>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
              >
                <input
                  type="number"
                  name="fundingGoal"
                  value={projectData.fundingGoal}
                  onChange={handleChange}
                  placeholder="Funding Goal"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                />
                <input
                  type="text"
                  name="timeline"
                  value={projectData.timeline}
                  onChange={handleChange}
                  placeholder="Project Timeline"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                />
                <select
                  name="category"
                  value={projectData.category}
                  onChange={handleChange}
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                >
                  <option value="">Select Category</option>
                  <option value="technology">Technology</option>
                  <option value="art">Art</option>
                  <option value="social">Social Impact</option>
                  {/* Add more categories as needed */}
                </select>
                <div className="flex justify-between mt-4">
                  <button
                    type="button"
                    onClick={prevStep}
                    className="group relative w-1/2 flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={nextStep}
                    className="group relative w-1/2 flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Next
                  </button>
                </div>
              </motion.div>
            )}
{step === 3 && (
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
              >
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                />
                <div className="flex justify-between mt-4">
                  <button
                    type="button"
                    onClick={prevStep}
                    className="group relative w-1/2 flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={nextStep}
                    className="group relative w-1/2 flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Next
                  </button>
                </div>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
              >
                <h3 className="text-lg font-medium text-gray-900 mb-4">Submission Fee</h3>
                <p className="text-sm text-gray-600 mb-4">
                  To submit your project, you need to pay a fee of {SUBMISSION_FEE} tokens.
                </p>
                <button
                  type="button"
                  onClick={paySubmissionFee}
                  disabled={feePaid}
                  className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${
                    feePaid ? 'bg-green-600' : 'bg-indigo-600 hover:bg-indigo-700'
                  } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
                >
                  {feePaid ? 'Fee Paid' : 'Pay Fee'}
                </button>
                {feePaid && (
                  <button
                    type="submit"
                    className="mt-4 group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Submit Project
                  </button>
                )}
              </motion.div>
            )}
          </motion.form>
        </div>
      </div>
    </div>
  )
}
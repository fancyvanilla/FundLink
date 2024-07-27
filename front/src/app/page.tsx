// pages/index.tsx
'use client'
import Head from 'next/head'
import Link from 'next/link'
import { motion } from 'framer-motion'
import WalletConnection from '@/components/WalletConnection'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600">
      <Head>
        <title>Modern Investing Platform</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container mx-auto px-4 py-20">
        <WalletConnection />
        
        <motion.h1 
          className="text-6xl font-bold text-white mb-10"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Revolutionize Your Investments
        </motion.h1>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <div className="bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg rounded-xl p-8 shadow-lg">
            <h2 className="text-3xl font-semibold text-white mb-4">Have an idea and broke?</h2>
            <p className="text-xl text-white mb-6">Share it with our community and bring your vision to life.</p>
            <Link href="/submit" className="bg-white text-purple-600 px-6 py-3 rounded-full font-semibold hover:bg-opacity-90 transition duration-300">
              Submit Your Idea
            </Link>
          </div>
          <div className="bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg rounded-xl p-8 shadow-lg">
            <h2 className="text-3xl font-semibold text-white mb-4">Have money and bored?</h2>
            <p className="text-xl text-white mb-6">Invest and track every step of your investment journey.</p>
            <Link href="/vote" className="bg-white text-purple-600 px-6 py-3 rounded-full font-semibold hover:bg-opacity-90 transition duration-300">
              Start Investing
            </Link>
          </div>
        </motion.div>

        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <Link href="/explore" className="text-white text-xl underline">
            Explore Trending Projects
          </Link>
        </motion.div>
      </main>
    </div>
  )
}
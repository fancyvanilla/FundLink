'use client'
// components/PetraWalletConnection.tsx
import { useState, useEffect } from 'react'

declare global {
    
  interface Window {
    aptos: any;
  }
}

const PetraWalletConnection = () => {
  const [address, setAddress] = useState<string | null>(null)
  const [publicKey, setPublicKey] = useState<string | null>(null)
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    checkConnection()
  }, [])

  const checkConnection = async () => {
    if (window.aptos) {
      try {
        const response = await window.aptos.isConnected()
        if (response) {
          setIsConnected(true)
          const accountResponse = await window.aptos.account()
          setAddress(accountResponse.address)
          setPublicKey(accountResponse.publicKey)
        }
      } catch (error) {
        console.error('Error checking connection:', error)
      }
    }
  }

  const connectWallet = async () => {
    if (window.aptos) {
      try {
        const response = await window.aptos.connect()
        setAddress(response.address)
        setPublicKey(response.publicKey)
        setIsConnected(true)
      } catch (error) {
        console.error('Error connecting to Petra wallet:', error)
      }
    } else {
      window.open('https://petra.app/', '_blank')
    }
  }

  const disconnectWallet = async () => {
    if (window.aptos) {
      await window.aptos.disconnect()
      setAddress(null)
      setPublicKey(null)
      setIsConnected(false)
    }
  }

  return (
    <div className="flex items-center justify-end p-4">
      {isConnected ? (
        <div className="flex items-center space-x-4">
          <span className="text-sm text-white">
            Connected: {address?.slice(0, 6)}...{address?.slice(-4)}
          </span>
          <button
            onClick={disconnectWallet}
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded transition duration-300"
          >
            Disconnect
          </button>
        </div>
      ) : (
        <button
          onClick={connectWallet}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-300"
        >
          Connect Petra Wallet
        </button>
      )}
    </div>
  )
}

export default PetraWalletConnection
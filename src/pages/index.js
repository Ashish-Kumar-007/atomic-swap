import Image from 'next/image'
import { Inter } from 'next/font/google'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import SwapPage from '@/components/SwapPage'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <main
    >
      <SwapPage />
    </main>
  )
}

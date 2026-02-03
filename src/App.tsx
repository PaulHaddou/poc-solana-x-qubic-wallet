import { WalletBalance } from './components/WalletBalance'

export default function App() {
  return (
    <main className="w-full max-w-[480px] mx-auto p-8 text-center">
      <h1 className="text-4xl font-semibold leading-tight tracking-tight">
        Wallet Solana POC
      </h1>
      <p className="text-neutral-500 dark:text-neutral-400 mb-8">
        Connectez votre wallet et consultez votre solde
      </p>
      <WalletBalance />
    </main>
  )
}

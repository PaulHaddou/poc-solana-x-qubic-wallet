import { useEffect, useState } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import { truncateAddress } from '../utils/truncateAddress';

export function WalletBalance() {
  const { connection } = useConnection();
  const { publicKey, connected, disconnect } = useWallet();

  const [balance, setBalance] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!connected || !publicKey) {
      setBalance(null);
      setError(null);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    connection
      .getBalance(publicKey)
      .then((lamports) => {
        if (!cancelled) {
          setBalance(lamports);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Erreur lors de la récupération du solde');
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [connection, publicKey, connected]);

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex items-center gap-3 flex-wrap justify-center">
        <WalletMultiButton />
        {connected && (
          <button
            type="button"
            onClick={() => disconnect()}
            className="px-4 py-2 text-sm bg-transparent border border-neutral-500 dark:border-neutral-400 text-inherit rounded-lg hover:border-red-600 hover:text-red-400 dark:hover:border-red-500 dark:hover:text-red-300 transition-colors"
          >
            Déconnecter
          </button>
        )}
      </div>

      {!connected && (
        <p className="text-neutral-500 dark:text-neutral-400 text-[0.95rem]">
          Connectez votre wallet Solana pour afficher votre solde.
        </p>
      )}

      {connected && publicKey && (
        <div className="text-left p-4 md:px-6 bg-neutral-100 dark:bg-white/5 rounded-lg w-full box-border border border-neutral-200/50 dark:border-neutral-700/50">
          <p className="address my-2">
            Adresse :{' '}
            <code
              title={publicKey.toBase58()}
              className="text-[0.9em] px-1.5 py-0.5 bg-black/20 dark:bg-white/10 rounded"
            >
              {truncateAddress(publicKey.toBase58())}
            </code>
          </p>
          {loading && (
            <p className="balance my-2 text-neutral-500 dark:text-neutral-400 italic">
              Chargement du solde…
            </p>
          )}
          {error && (
            <p className="balance my-2 text-red-600 dark:text-red-400">{error}</p>
          )}
          {!loading && !error && balance !== null && (
            <p className="balance my-2">
              Solde :{' '}
              <strong>{(balance / LAMPORTS_PER_SOL).toFixed(6)} SOL</strong>
            </p>
          )}
        </div>
      )}
    </div>
  );
}

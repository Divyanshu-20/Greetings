'use client';

import { useState, useEffect } from 'react';
import { ethers } from 'ethers';

export default function Home() {
  const [greetings, setGreetings] = useState<any[]>([]);
  const [newGreeting, setNewGreeting] = useState('');
  const [account, setAccount] = useState('');
  const [contract, setContract] = useState<any>(null);
  const [provider, setProvider] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Contract ABI
  const contractABI = [
    {
      "inputs": [{"internalType": "string", "name": "message", "type": "string"}],
      "name": "sendGreeting",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getGreetings",
      "outputs": [
        {
          "components": [
            {"internalType": "address", "name": "sender", "type": "address"},
            {"internalType": "string", "name": "message", "type": "string"},
            {"internalType": "uint256", "name": "timestamp", "type": "uint256"}
          ],
          "internalType": "struct Greeting.GreetingInfo[]",
          "name": "",
          "type": "tuple[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "anonymous": false,
      "inputs": [
        {"indexed": true, "internalType": "address", "name": "sender", "type": "address"},
        {"indexed": false, "internalType": "string", "name": "message", "type": "string"},
        {"indexed": false, "internalType": "uint256", "name": "timestamp", "type": "uint256"}
      ],
      "name": "Greeted",
      "type": "event"
    }
  ];

  const contractAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3';

  const connectWallet = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        setIsLoading(true);
        const accounts = await window.ethereum.request({
          method: 'eth_requestAccounts'
        });
        setAccount(accounts[0]);
        
        const provider = new ethers.BrowserProvider(window.ethereum);
        setProvider(provider);
        
        const signer = await provider.getSigner();
        const contract = new ethers.Contract(contractAddress, contractABI, signer);
        setContract(contract);
        
        await loadGreetings(contract);
        
        contract.on('Greeted', () => {
          loadGreetings(contract);
        });
      } catch (error) {
        console.error('Error connecting to wallet:', error);
      } finally {
        setIsLoading(false);
      }
    } else {
      alert('MetaMask is not installed!');
    }
  };

  const loadGreetings = async (contractInstance: any) => {
    try {
      const greetingsList = await contractInstance.getGreetings();
      setGreetings([...greetingsList].reverse());
    } catch (error) {
      console.error('Error loading greetings:', error);
    }
  };

  const sendGreeting = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contract || !newGreeting.trim()) return;
    
    try {
      setIsLoading(true);
      const tx = await contract.sendGreeting(newGreeting);
      await tx.wait();
      setNewGreeting('');
    } catch (error) {
      console.error('Error sending greeting:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  const formatDate = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) * 1000);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-emerald-900 to-slate-900">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%239C92AC\' fill-opacity=\'0.1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
      
      <div className="relative z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-emerald-500 to-green-500 rounded-2xl mb-6">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400">
                Blockchain Greetings
              </span>
            </h1>
            
            <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
              Send permanent messages to the blockchain. Every greeting becomes part of history.
            </p>

            {!account ? (
              <button
                onClick={connectWallet}
                disabled={isLoading}
                className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-white bg-gradient-to-r from-purple-600 to-pink-600 rounded-full hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 shadow-2xl"
              >
                <span className="absolute inset-0 w-full h-full rounded-full bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></span>
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                {isLoading ? 'Connecting...' : 'Connect Wallet'}
              </button>
            ) : (
              <div className="inline-flex items-center px-6 py-3 bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-full">
                <div className="w-3 h-3 bg-green-400 rounded-full mr-3 animate-pulse"></div>
                <span className="text-slate-300 font-mono">{formatAddress(account)}</span>
              </div>
            )}
          </div>

          {account && (
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Send Greeting Card */}
              <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8 shadow-2xl">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-green-500 rounded-xl flex items-center justify-center mr-4">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">Send a Greeting</h2>
                    <p className="text-slate-400 text-sm">Your message will live forever on the blockchain</p>
                  </div>
                </div>

                <form onSubmit={sendGreeting} className="space-y-6">
                  <div>
                    <label htmlFor="greeting" className="block text-sm font-medium text-slate-300 mb-2">
                      Your Message
                    </label>
                    <textarea
                      id="greeting"
                      value={newGreeting}
                      onChange={(e) => setNewGreeting(e.target.value)}
                      placeholder="Share your thoughts with the world..."
                      className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 resize-none"
                      rows={4}
                      maxLength={280}
                      required
                    />
                    <div className="text-right text-sm text-slate-400 mt-1">
                      {newGreeting.length}/280
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading || !newGreeting.trim()}
                    className="w-full relative group"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-green-600 rounded-xl blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
                    <div className="relative flex items-center justify-center px-6 py-3 bg-gradient-to-r from-emerald-600 to-green-600 rounded-xl text-white font-semibold transition duration-300">
                      {isLoading ? (
                        <>
                          <svg className="animate-spin w-5 h-5 mr-3" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Sending...
                        </>
                      ) : (
                        'Send to Blockchain'
                      )}
                    </div>
                  </button>
                </form>
              </div>

              {/* Greetings List */}
              <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8 shadow-2xl">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-xl flex items-center justify-center mr-4">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">Recent Greetings</h2>
                    <p className="text-slate-400 text-sm">{greetings.length} messages on the blockchain</p>
                  </div>
                </div>

                <div className="space-y-4 max-h-96 overflow-y-auto custom-scrollbar">
                  {greetings.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                        </svg>
                      </div>
                      <p className="text-slate-400">No greetings yet. Be the first to leave a message!</p>
                    </div>
                  ) : (
                    greetings.map((greeting, index) => (
                      <div key={index} className="bg-slate-900/50 rounded-xl p-4 border border-slate-700/50 hover:border-emerald-500/50 transition-all duration-300">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center">
                            <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full flex items-center justify-center mr-3">
                              <span className="text-white text-xs font-bold">
                                {greeting.sender.substring(2, 4).toUpperCase()}
                              </span>
                            </div>
                            <div>
                              <p className="text-sm font-mono text-purple-400">
                                {formatAddress(greeting.sender)}
                              </p>
                              <p className="text-xs text-slate-500">
                                {formatDate(greeting.timestamp)}
                              </p>
                            </div>
                          </div>
                          <div className="text-xs text-slate-500">
                            #{greetings.length - index}
                          </div>
                        </div>
                        <p className="text-slate-200 text-sm leading-relaxed">
                          {greeting.message}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {!account && (
            <div className="mt-16">
              <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8 text-center">
                <h3 className="text-2xl font-bold text-white mb-4">How It Works</h3>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-green-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <h4 className="text-lg font-semibold text-white mb-2">Connect Wallet</h4>
                    <p className="text-slate-400 text-sm">Link your MetaMask wallet to interact with the blockchain</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    </div>
                    <h4 className="text-lg font-semibold text-white mb-2">Send Greeting</h4>
                    <p className="text-slate-400 text-sm">Write your message and send it to the blockchain permanently</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-lime-500 to-green-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                    </div>
                    <h4 className="text-lg font-semibold text-white mb-2">View Messages</h4>
                    <p className="text-slate-400 text-sm">Read greetings from users around the world in real-time</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}

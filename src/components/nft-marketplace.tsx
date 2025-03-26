"use client"

import { useEffect, useState } from "react"
import { formatEther, parseEther } from "viem"
import { useAccount, useConnect, useDisconnect, useReadContract, useWriteContract, useBalance, useReadContracts } from "wagmi"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Wallet, Plus, RefreshCw } from "lucide-react"
import NFTCard from "@/components/nft-buy-card"
import { NFTMarketplaceABI, NftsABI } from "@/lib/abi"
import { NFT_CONTRACT_ADDRESS } from "@/lib/constants"
import { alchemy } from '@/lib/alchemyClient';
import MyNftsTab from "./my-nfts-tab"

export default function NFTMarketplace() {
    const [nfts, setNfts] = useState<any[]>([])
    const [myNfts, setMyNfts] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [price, setPrice] = useState("")
    const [tokenId, setTokenId] = useState("")

    const { address: userAddress, isConnected } = useAccount()
    const { connect, connectors } = useConnect()
    const { disconnect } = useDisconnect()

    useEffect(() => {
        if (!userAddress) return;

        const fetchNFTs = async () => {
            try {
                // Fetch NFTs for the provided wallet address.
                const response = await alchemy.nft.getNftsForOwner(userAddress);
                setNfts(response.ownedNfts);
            } catch (err: any) {
                console.error('Error fetching NFTs:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchNFTs();
    }, [userAddress]);

    const handleRefresh = () => {
        setLoading(true)
        // refetchMarketItems()
        // refetchMyItems()
        setLoading(false)
    }

    return (
        <div className="container mx-auto py-8 px-4">
            <div className="flex flex-col md:flex-row justify-between items-center mb-8">
                <h1 className="text-3xl font-bold mb-4 md:mb-0">NFT Marketplace</h1>
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon" onClick={handleRefresh} disabled={loading}>
                        <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
                    </Button>
                    {isConnected ? (
                        <Button onClick={() => disconnect()} variant="outline" className="flex items-center gap-2">
                            <Wallet className="h-4 w-4" />
                            {userAddress?.slice(0, 6)}...{userAddress?.slice(-4)}
                        </Button>
                    ) : (
                        <Button onClick={() => connect({ connector: connectors[0] })} className="flex items-center gap-2">
                            <Wallet className="h-4 w-4" />
                            Connect Wallet
                        </Button>
                    )}
                </div>
            </div>

            {isConnected ? (
                <Tabs defaultValue="marketplace" className="w-full">
                    <TabsList className="mb-6">
                        <TabsTrigger value="marketplace">Marketplace</TabsTrigger>
                        <TabsTrigger value="my-nfts">My NFTs</TabsTrigger>
                    </TabsList>

                    <TabsContent value="marketplace" className="space-y-4">
                        {loading ? (
                            <div className="text-center py-12">Loading NFTs...</div>
                        ) : nfts.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                {nfts.map((nft) => (
                                    <NFTCard
                                        key={nft.itemId}
                                        nft={nft}
                                        isBuyable={true}
                                        contractAddress={NFT_CONTRACT_ADDRESS}
                                        onSuccess={handleRefresh}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <p className="text-muted-foreground">No NFTs listed in the marketplace</p>
                            </div>
                        )}
                    </TabsContent>
                    <MyNftsTab />
                </Tabs>
            ) : (
                <div className="text-center py-20">
                    <h2 className="text-2xl font-semibold mb-4">Connect your wallet to view NFTs</h2>
                    <p className="text-muted-foreground mb-6">You need to connect your wallet to interact with the marketplace</p>
                    <Button onClick={() => connect({ connector: connectors[0] })} size="lg" className="flex items-center gap-2">
                        <Wallet className="h-5 w-5" />
                        Connect Wallet
                    </Button>
                </div>
            )}
        </div>
    )
}


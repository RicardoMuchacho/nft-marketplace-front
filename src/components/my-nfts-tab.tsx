import React, { useState, useEffect } from "react";
import { OwnedNft } from "alchemy-sdk";
import NFTOwnedCard from "./nft-owned-card";
import { TabsContent } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useAccount } from "wagmi";
import { alchemy } from '@/lib/alchemyClient';
import { Plus } from "lucide-react"
import ListNFTDialog from "./list-nft-dialog";

const MyNftsTab = () => {

    const [myNfts, setMyNfts] = useState<OwnedNft[]>([])
    const [selectedNft, setSelectedNft] = useState<OwnedNft | null>(null)
    const [loading, setLoading] = useState(true)

    const { address: userAddress, isConnected } = useAccount()

    useEffect(() => {
        if (!userAddress) return;

        const fetchNFTs = async () => {
            try {
                // Fetch NFTs for the provided wallet address.
                const response = await alchemy.nft.getNftsForOwner(userAddress);
                setMyNfts(response.ownedNfts);
            } catch (err: any) {
                console.error('Error fetching NFTs:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchNFTs();
    }, [userAddress]);

    const handleListNFT = (nft: OwnedNft) => {
        setSelectedNft(nft);
    }

    return (
        <TabsContent value="my-nfts" className="space-y-4">
            {loading ? (
                <div className="text-center py-12">Loading your NFTs...</div>
            ) : myNfts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {myNfts.map((nft) => (
                        <NFTOwnedCard nft={nft} handleListNFT={handleListNFT} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-12">
                    <p className="text-muted-foreground">You don't own any NFTs yet</p>
                </div>
            )}
            <ListNFTDialog nft={selectedNft} onSuccess={() => setSelectedNft(null)} onClose={() => setSelectedNft(null)} />
        </TabsContent>
    )
}


export default MyNftsTab
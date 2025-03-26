"use client"

import { useState } from "react"
import { parseEther } from "viem"
import { useWriteContract } from "wagmi"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { NFTMarketplaceABI } from "@/lib/abi"
import { OwnedNft } from "alchemy-sdk"

interface NFTOwnedCardProps {
    nft: OwnedNft;
}

export default function NFTOwnedCard({ nft }: NFTOwnedCardProps) {
    const [isLoading, setIsLoading] = useState(false)
    const [imageLoaded, setImageLoaded] = useState(false)

    // Write contract function
    const { writeContract, isPending } = useWriteContract()

    const handleList = () => {
        setIsLoading(true)
        // writeContract(
        //     {
        //         address: contractAddress as `0x${string}`,
        //         abi: NFTMarketplaceABI,
        //         functionName: "createMarketSale",
        //         args: [BigInt(nft.tokenId)],
        //         value: parseEther(nft.price),
        //     },
        //     {
        //         onSuccess: () => {
        //             setTimeout(() => {
        //                 setIsLoading(false)
        //                 if (onSuccess) onSuccess()
        //             }, 2000)
        //         },
        //         onError: () => {
        //             setIsLoading(false)
        //         },
        //     },
        // )
    }

    return (
        <Card className="overflow-hidden transition-all hover:shadow-md">
            <div className="relative aspect-square bg-muted">
                {!imageLoaded && <Skeleton className="absolute inset-0 h-full w-full" />}
                <img
                    src={nft?.image?.cachedUrl || nft?.image?.originalUrl || "/placeholder.svg"}
                    alt={nft.name}
                    className={`h-full w-full object-cover transition-opacity duration-300 ${imageLoaded ? "opacity-100" : "opacity-0"}`}
                    onLoad={() => setImageLoaded(true)}
                />
            </div>
            <CardHeader>
                <CardTitle className="text-lg">{nft.name}</CardTitle>
                <CardDescription className="line-clamp-2">{nft.description}</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex items-center justify-between">
                    <div>
                        <span className="text-sm text-muted-foreground flex items-center gap-1">
                            Token ID: <span className="font-medium text-foreground">#{nft.tokenId}</span>
                        </span>
                    </div>
                </div>
            </CardContent>
            <CardFooter>
                {true ? (
                    <Button className="w-full" onClick={handleList} disabled={isPending || isLoading}>
                        {isPending || isLoading ? "Processing..." : "List"}
                    </Button>
                ) : (
                    <Button variant="outline" className="w-full" disabled>
                        Owned by You
                    </Button>
                )}
            </CardFooter>
        </Card>
    )
}


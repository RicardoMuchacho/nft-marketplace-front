"use client"

import { useState } from "react"
import { parseEther } from "viem"
import { useWriteContract } from "wagmi"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { NFTMarketplaceABI } from "@/lib/abi"

interface NFTBuyCardProps {
    nft: {
        tokenId: string
        seller: string
        owner: string
        price: string
        image: string
        name: string
        description: string
    }
    isBuyable: boolean
    contractAddress: string
    onSuccess?: () => void
}

export default function NFTCard({ nft, isBuyable, contractAddress, onSuccess }: NFTBuyCardProps) {
    const [isLoading, setIsLoading] = useState(false)
    const [imageLoaded, setImageLoaded] = useState(false)

    // Write contract function
    const { writeContract, isPending } = useWriteContract()

    const handleBuy = () => {
        if (!isBuyable) return

        setIsLoading(true)
        writeContract(
            {
                address: contractAddress as `0x${string}`,
                abi: NFTMarketplaceABI,
                functionName: "createMarketSale",
                args: [BigInt(nft.tokenId)],
                value: parseEther(nft.price),
            },
            {
                onSuccess: () => {
                    setTimeout(() => {
                        setIsLoading(false)
                        if (onSuccess) onSuccess()
                    }, 2000)
                },
                onError: () => {
                    setIsLoading(false)
                },
            },
        )
    }

    return (
        <Card className="overflow-hidden transition-all hover:shadow-md">
            <div className="relative aspect-square bg-muted">
                {!imageLoaded && <Skeleton className="absolute inset-0 h-full w-full" />}
                <img
                    src={nft.image || "/placeholder.svg"}
                    alt={nft.name}
                    className={`h-full w-full object-cover transition-opacity duration-300 ${imageLoaded ? "opacity-100" : "opacity-0"}`}
                    onLoad={() => setImageLoaded(true)}
                />
            </div>
            <CardHeader className="p-4">
                <CardTitle className="text-lg">{nft.name}</CardTitle>
                <CardDescription className="line-clamp-2">{nft.description}</CardDescription>
            </CardHeader>
            <CardContent className="p-4 pt-0">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm text-muted-foreground">Price</p>
                        <p className="font-medium">{nft.price} ETH</p>
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground">Token ID</p>
                        <p className="font-medium">#{nft.tokenId}</p>
                    </div>
                </div>
            </CardContent>
            <CardFooter className="p-4 pt-0">
                {isBuyable ? (
                    <Button className="w-full" onClick={handleBuy} disabled={isPending || isLoading}>
                        {isPending || isLoading ? "Processing..." : "Buy Now"}
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


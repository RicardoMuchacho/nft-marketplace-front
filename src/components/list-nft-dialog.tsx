import React, { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { OwnedNft } from "alchemy-sdk";
import { useWriteContract } from "wagmi";
import { NFTMarketplaceABI } from "@/lib/abi";
import { parseEther } from "viem";

interface ListNFTDialogProps {
    nft: OwnedNft | null;
    onSuccess: () => void;
    onClose: () => void;
}

export default function ListNFTDialog({ nft, onSuccess, onClose }: ListNFTDialogProps) {

    const [price, setPrice] = useState<string>("");
    const [loading, setIsLoading] = useState<boolean>(false);


    // Write contract function
    const { writeContract, isPending } = useWriteContract()

    const handleList = () => {
        if (!nft) return;

        setIsLoading(true)
        writeContract(
            {
                address: nft?.contract.address as `0x${string}`,
                abi: NFTMarketplaceABI,
                functionName: "createMarketSale",
                args: [BigInt(nft.tokenId)],
                value: parseEther(price),
            },
            {
                onSuccess: () => {
                    setTimeout(() => {
                        setIsLoading(false)
                        // if (onSuccess) onSuccess()
                    }, 2000)
                },
                onError: () => {
                    setIsLoading(false)
                },
            },
        )
    }

    return (
        <Dialog open={!!nft} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="gap-1">
                <DialogHeader>
                    <DialogTitle>List your NFT</DialogTitle>
                    <DialogDescription>
                        Enter the price to list your NFT on the marketplace.
                    </DialogDescription>
                </DialogHeader>
                <div className="flex items-center gap-4 py-4">
                    <div className="flex-1">
                        <Label className="pb-2" htmlFor="price">Price (ETH)</Label>
                        <Input
                            id="price"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            placeholder="Enter price in ETH"
                            type="number"
                            step="0.001"
                            min="0"
                        />
                    </div>
                    <Button onClick={() => handleList} disabled={!price || isPending} className="mt-6">
                        {isPending ? "Processing..." : "List NFT"}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
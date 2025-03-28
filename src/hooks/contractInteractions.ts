import { NftMintingABI, NFTMarketplaceABI } from "@/lib/abi";
import { NFT_MINT_ADDRESS, MARKETPLACE_CONTRACT_ADDRESS } from "@/lib/constants";
import { useWriteContract } from "wagmi";
import { OwnedNft } from "alchemy-sdk";
import { parseEther } from "viem";


export default function useContractInteractions() {
    const { writeContract, isPending } = useWriteContract();

    const approveNFT = (nft: OwnedNft) => {
        writeContract({
            address: nft.contract.address as `0x${string}`,
            abi: NftMintingABI,
            functionName: "approve",
            args: [MARKETPLACE_CONTRACT_ADDRESS, nft.tokenId],
        },
    );
    };

    const mintTestNFT = () => {
        writeContract({
            address: NFT_MINT_ADDRESS,
            abi: NftMintingABI,
            functionName: "mint"
        });
    };

    const listNFT = (nft: OwnedNft, price: string, onSuccess?: () => void, onError?: (error: Error) => void) => {
        writeContract(
            {
                address: MARKETPLACE_CONTRACT_ADDRESS,
                abi: NFTMarketplaceABI,
                functionName: "listNFT",
                args: [nft.contract.address, BigInt(nft.tokenId), parseEther(price)],
            },
            {
                onSuccess,
                onError,
            }
        );
    }

    return { approveNFT, mintTestNFT, listNFT, isPending };
}
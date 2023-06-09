// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;
//import "hardhat/console.sol"; // Hardhat console log

import "erc721a/contracts/ERC721A.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "operator-filter-registry/src/DefaultOperatorFilterer.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";

contract TokenMasksLabs is ERC721A, Ownable, DefaultOperatorFilterer{

    string baseURI;

    string public baseExtension = ".json";
    // NFTの値段
    uint public cost = 0.001 ether;
    // 最大発行数
    uint public maxSupply = 10000;
    // 一回のMax購入数
    uint public maxMintAmount = 10;
    // saleの開始を制御する変数
    bool public paused = true;
    // マークルツリーのルート
    bytes32 public merkleRoot;

    constructor(
    ) ERC721A ('ETH MASKS','EM'){// コレクション名：　ETH MASKS、　トークンの名前：EM
        setBaseURI('https://bafybeidyeas3wcaxt4xdv3u4mh7h4db4p3wevajfrrpafanicmokccjzku.ipfs.nftstorage.link/');
    }

    // マークルツリーを利用したpreMint関数
    /**
    * @notice Mint from mint site(for WhiteList)
    * @param _mintAmount Amount of mint
    * @param _merkleProof for MerkleProof data
    */
    function preMint(uint256 _mintAmount,bytes32[] memory _merkleProof, uint256 alloc)public payable{
        if(paused) revert("the contract is paused");
        
        uint supply = totalSupply();
        
        if(!(_mintAmount > 0)) revert("Please specify 1 or more");
        
        if(_mintAmount > maxMintAmount) revert("max mint amount per session exceeded");
        
        if(supply + _mintAmount > maxSupply) revert("max NFT limit exceeded");

        // Owner also can mint.
        if (msg.sender != owner()) {
            require(msg.value >= cost * _mintAmount, "insufficient funds");

            // WhiteList check
            require(
                MerkleProof.verify(_merkleProof, merkleRoot, keccak256(abi.encodePacked(msg.sender,uint16(alloc)))),
                "You don't have a whitelist!"
            );

            require(balanceOf(msg.sender) + _mintAmount <= maxMintAmount,"Limit mint amount!");
        }

        _safeMint(msg.sender, _mintAmount);
    } 

    function mint(uint _mintAmount) public payable {
        if(paused) revert("the contract is paused");

        uint supply = totalSupply();

        if(!(_mintAmount > 0)) revert("Please specify 1 or more");

        if(_mintAmount > maxMintAmount) revert("max mint amount per session exceeded");

        if(supply + _mintAmount > maxSupply) revert("max NFT limit exceeded");
    
        if(msg.sender != owner()){
            if(msg.value < cost * _mintAmount) revert("insufficient funds");
        }

        _safeMint(msg.sender, _mintAmount);
    }

    function airdropMint(address[] calldata _airdropAddresses, uint[] memory _userMintAmount) public onlyOwner {
        uint supply = totalSupply();

        uint _mintAmount = 0;
        for(uint i = 0; i < _userMintAmount.length; i++){
            _mintAmount += _userMintAmount[i];
        }

        if(!(_mintAmount > 0)) revert("Please specify 1 or more");
        if(supply + _mintAmount > maxSupply) revert("max NFT limit exceeded");

        for(uint i = 0; i < _airdropAddresses.length;i++){
            _safeMint(_airdropAddresses[i], _userMintAmount[i]);
        }
    }

    function tokenURI(uint _tokenId) public view virtual override returns (string memory) {
        return string(abi.encodePacked(ERC721A.tokenURI(_tokenId), baseExtension));
    }

    function setCost(uint _newCost)public onlyOwner{
        cost = _newCost;
    }

    function setBaseURI(string memory _newBaseURI)public onlyOwner{
        baseURI = _newBaseURI;
    }
    function setPause(bool _state)public onlyOwner{
        paused = _state;
    }

    function setMaxSupply(uint _newMaxSupply)public onlyOwner{
        maxSupply = _newMaxSupply;
    }

    function withdraw() public payable onlyOwner {
        (bool os, ) = payable(owner()).call{value: address(this).balance}("");
        require(os);
    }

    function _startTokenId() internal view virtual override returns(uint) {
        return 1;
    }

    function _baseURI() internal view virtual override returns (string memory){
        return baseURI;
    }

    /**
    * @notice Set WhiteList's merkleRoot
    * @param _merkleRoot Set value
    */
    function setPresaleRoots(bytes32 _merkleRoot) external onlyOwner {
        merkleRoot = _merkleRoot;
    }

    ///////////////////////////////////////////////////////////////////////////
    // Transfer functions
    ///////////////////////////////////////////////////////////////////////////
    function transferFrom(
        address from,
        address to,
        uint256 tokenId
    ) public override payable onlyAllowedOperator(from) {
        super.transferFrom(from, to, tokenId);
    }

    function safeTransferFrom(
        address from,
        address to,
        uint256 tokenId
    ) public override payable onlyAllowedOperator(from) {
        super.safeTransferFrom(from, to, tokenId);
    }

    function safeTransferFrom(
        address from,
        address to,
        uint256 tokenId,
        bytes memory data
    ) public override payable onlyAllowedOperator(from) {
        super.safeTransferFrom(from, to, tokenId, data);
    }
    ///////////////////////////////////////////////////////////////////////////
    // Approve functions
    ///////////////////////////////////////////////////////////////////////////
    function setApprovalForAll(address operator, bool approved)
        public
        virtual
        override
        onlyAllowedOperatorApproval(operator)
    {
        super.setApprovalForAll(operator, approved);
    }

    function approve(address operator, uint256 tokenId)
        public
        virtual
        override
        payable
        onlyAllowedOperatorApproval(operator)
    {
        super.approve(operator, tokenId);
    }
}
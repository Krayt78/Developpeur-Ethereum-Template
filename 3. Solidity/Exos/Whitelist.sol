// SPDX-License-Identifier: MIT
pragma solidity 0.8.13;
import "../TP1-Voting/node_modules/@openzeppelin/contracts/access/Ownable.sol";
contract WhitelistBlacklist is Ownable{
   mapping(address=> AddressStatus) list;
   event StatusChanged(address _address, AddressStatus _addressStatus);

   enum AddressStatus{
       Default,
       Blacklist,
       Whitelist
   }
 
   function setAddressStatus(address _address, AddressStatus _addressStatus) public onlyOwner{
       list[_address]=_addressStatus;
       emit StatusChanged(_address,_addressStatus); // Triggering event
   }

   function getAddressStatus(address _address) public onlyOwner view returns(AddressStatus) {
      return list[_address];
   }
}
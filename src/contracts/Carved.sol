pragma solidity ^0.5.0;

import "./ERC721Full.sol";

contract Carved is ERC721Full {
   
  mapping(uint => bool) public _isExists;
  address payable admin;
  string public baseURI = "https://hidden-woodland-17457.herokuapp.com/api/nfts/id/";
  uint public price = 1E17;

  event feeTransfer(address indexed from, address indexed to, uint indexed tokenId);

  constructor() ERC721Full("Carved Token", "Carved") public {
    admin = msg.sender;
  }

  /** @dev Creates `id` token and assign it to `address`, increasing
     * the total supply.
     *@param _id unsigned integer of value 1-100
     */
  function mint(uint _id) public payable{

    require(
      !_isExists[_id],
      " Carved: Token id is already minted "
      );

    require(
      (_id > 0 && _id < 101),
      " Carved: Wrong token id passed "
      );  

    require(
      (msg.value == price),
      " Carved: Wrong amount send "
      );
    
    string memory _sid = toString(_id);
    string memory _tokenURI = concat(baseURI, _sid);

    admin.transfer(msg.value);
    _mint(msg.sender, _id);
    _setTokenURI(_id, _tokenURI);
    _isExists[_id] = true;

    emit feeTransfer(msg.sender, admin, _id);
  }


/**
  * To String
  * 
  * Converts an unsigned integer to the ASCII string equivalent value
  * 
  * @param _base The unsigned integer to be converted to a string
  * @return string The resulting ASCII string value
  */
  function toString(uint _base)
        internal
        pure
        returns (string memory) {
        bytes memory _tmp = new bytes(32);
        uint i;
        for(i = 0;_base > 0;i++) {
            _tmp[i] = byte(uint8((_base % 10) + 48));
            _base /= 10;
        }
        bytes memory _real = new bytes(i--);
        for(uint j = 0; j < _real.length; j++) {
            _real[j] = _tmp[i--];
        }
        return string(_real);
    }


  /**
    * Appends two strings together and returns a new value
    * 
    * @param _base When being used for a data type this is the extended object
    *              otherwise this is the string which will be the concatenated
    *              prefix
    * @param _value The value to be the concatenated suffix
    * @return string The resulting string from combinging the base and value
    */
    function concat(string memory _base, string memory _value)
        internal
        pure
        returns (string memory) {
        bytes memory _baseBytes = bytes(_base);
        bytes memory _valueBytes = bytes(_value);

        assert(_valueBytes.length > 0);

        string memory _tmpValue = new string(_baseBytes.length +
            _valueBytes.length);
        bytes memory _newValue = bytes(_tmpValue);

        uint i;
        uint j;

        for (i = 0; i < _baseBytes.length; i++) {
            _newValue[j++] = _baseBytes[i];
        }

        for (i = 0; i < _valueBytes.length; i++) {
            _newValue[j++] = _valueBytes[i];
        }

        return string(_newValue);
    }  

}

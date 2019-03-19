pragma solidity >=0.4.22 <0.6.0;
contract SampleStorage {
 string public name;
 event Set_name(
     string name
 );
 constructor() public {
     name = "John Doe";
}

 function set(string memory _name) public{
    name = _name;
    emit Set_name(_name);
 }

 function get() public view returns (string memory) {
    return name;
 }
}
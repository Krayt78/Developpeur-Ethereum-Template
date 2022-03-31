// SPDX-License-Identifier: MIT
pragma solidity 0.8.12;
contract Etudiant {
    struct Student{
        string name;
        uint note;
    } 

    mapping (address => Student) public StudentMap;
    Student [] public StudentArray;

    function deleter(address _address) public {
        Student memory student = Student("", 0);
        string memory studentName = StudentMap[_address].name;
        StudentMap[_address] = student;

        for(uint i; i< StudentArray.length; i++){
            if(keccak256(abi.encodePacked(StudentArray[i].name)) == keccak256(abi.encodePacked(studentName))){
                Student memory tempStudent = StudentArray[StudentArray.length-1];
                StudentArray[StudentArray.length-1] = StudentArray[i];
                StudentArray[i] = tempStudent;
                StudentArray.pop();
                //delete StudentArray[i];
            }
        }
    }

    function set(address _address, string calldata name, uint note)public{
        Student memory student = Student(name,note);
        StudentMap[_address] = student;
        StudentArray.push(student); 
    }

    function getArray(string calldata name) public view returns(string memory returnName, uint returnNote){
        
        for(uint i =0; i< StudentArray.length; i++){
            if(keccak256(abi.encodePacked(StudentArray[i].name)) == keccak256(abi.encodePacked(name))){
                returnName = StudentArray[i].name;
                returnNote = StudentArray[i].note;

                return (returnName,returnNote);
            }
        }
        
        return ("",0);
    }

    function getMap(address _address) public view returns(string memory name, uint note){
        return(StudentMap[_address].name,StudentMap[_address].note);
    }
}
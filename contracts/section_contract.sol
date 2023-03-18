// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

contract section_contract {

    // ■string型
    string stringA = "ethereum";
    string stringB = "solidity";

    // ■bool型
    bool boolA = true;
    bool boolB = false;

    // ■Array① 固定長配列
    string[3] arrayA; // 固定長配列の宣言

    // 配列の値を返す関数
    function setArray() public {
        arrayA[0] = "Apple";
        arrayA[1] = "Orange";
        arrayA[2] = "Pineapple";
    }

    // 配列の要素を返す関数
    function getArray(uint8 x) public view returns (string memory){
        return arrayA[x];
    }

    // Array② 可変長配列
    uint[] arrayB; //　可変長配列の宣言

    // 配列に追加する関数
    function addComponent(uint _num) public {
        arrayB.push(_num);
    }

    // 特定の値を返す関数
    function getIntValue(uint8 x) public view returns (uint){
        require(arrayB.length > 0, "arrayB is empty");
        return arrayB[x];
    }

    // array.lengthで配列の要素数を返す
    function returnLength() public view returns(uint){
        return arrayB.length;
    }

    // ■struct
    // struct特有の特徴として、struct内に複数の uintがある場合、
    // できる限り小さい単位の uintを使うことで、Solidityが変数を一つにまとめることができ、ストレージを小さくすることができます。
    struct User {
        string name;
        uint8 age;
    }
    User userA = User("test", 3);
    function getUser() public view returns (string memory name, uint8 age){
        return (userA.name, userA.age);
    }

    function setUser(string memory name, uint8 age) public returns(User memory) {
        return userA = User(name, age);
    }

    // ■Mapping
    //addressがkey、uintがvalue、balansesは格納する変数
    mapping(address => uint) public balances;

    //set関数により、key=addrとvalue=newBalanceを紐づけてbalancesに格納する
    function setMap(address addr,uint newBalance) public {
        balances[addr] = newBalance;
    }
    //readValue関数により、keyにaddrを入力しvalueを参照する
    function readValue(address addr) public view returns (uint) {
        return balances[addr];
    }
    
    // ⇨ifを使って条件分岐できるようになろう！
    function ifInspection(bool a) public pure returns (uint) {

        if (!a) {
            return 1;
        }
        return 2;
    }

    // ⇨else ifを使って複雑な条件分岐をできる様にしよう！
    function elseIfInspection(bool a, bool b) public pure returns (uint) {

        if (!a) {
            return 1;
        }else if(!b) {
            return 2;
        }
        return 3;
    }

    // ⇨if ~ elseを使って複雑な条件分岐をできる様にしよう！
    function ifElseInspection(bool a, bool b) public pure returns (uint) {
        if (!a) {
            return 1;
        }else if(!b) {
            return 2;
        }else{
            return 3;
        }
    }

    // ⇨while文を使用してループできる様になろう
    function whileInspection(uint loopCount) public pure returns (uint) {
        uint a;
        while(loopCount < 5) {
            a +=loopCount;
            loopCount++;
        }
        return a;
    }
    // ⇨while のbreak continueを使ってループを制御しよう！
    function whileBreakInspection(uint loopCount) public pure returns (uint) { 
        uint a;
        while(loopCount < 5) {
            
            if(loopCount == 4){
                break;
            }
            loopCount++;
            a +=loopCount;
        }
        return a;
    }

    // ⇨for文使い方ループについて学ぼう
    function forInspection(uint a) public pure returns (uint) {  
        for(uint loopCount = 1; loopCount < 5; loopCount++) {
            a +=loopCount;
        }
        return a;
    }

    // ⇨for のbreak continueでループを制御しよう！
    function forContinueInspection(uint a) public pure returns (uint) { 
        for(uint loopCount = 1; loopCount < 5; loopCount++) {
            if(loopCount == 2){
                continue;
            }
            
            if(loopCount == 4){
                break;
            }
            a +=loopCount;
        }
        return a;
    }

      // ■bool比較演算を理解して条件を制御しよう！
    // && (logical conjunction, “and”)
    function getBool1(bool a, bool b) public pure returns (bool) {
        
        if (b && a) {
            return true;
        }
        return false;
    }

    // || (logical disjunction, “or”)
    function getBool2(bool a, bool b) public pure returns (bool) {

        if (b || a) {
            return true;
        }
        return false;
    }

    // == (equality)
    function getBool3(bool a, bool b) public pure returns (bool) {

        if (b == a) {
            return true;
        }
        return false;
    }

    // != (inequality)
    function getBool4(bool a, bool b) public pure returns (bool) {
        
        // aとbが同じでないことでifの中身が処理される
        if (b != a) {
            return true;
        }
        return false;
    }

    // ■算術演算を理解して計算をできる様にしよう！
    //算術演算子。+単項演算子-、*、/、%（モジュロ）、**（指数）。
   function getNumber1(uint a, uint b) public pure returns (uint){
        return a + b;
    }

    function getNumber2(uint a, uint b) public pure returns (uint){
        return a - b;
    }

    function getNumber3(uint a, uint b) public pure returns (uint){
        return a * b;
    }

    function getNumber4(uint a, uint b) public pure returns (uint){
        return a / b;
    }

    function getNumber5(uint a, uint b) public pure returns (uint){
        return a % b;
    }

    function getNumber6(uint a, uint b) public pure returns (uint){
        return a ** b;
    }
}

var ES6Char2 = {
   init: function(){
      this.letVarial();
      this.forTest();
      this.funcTop();
      this.otherTest();
   },
   /*
   let：用来声明变量，类似于var，但是所声明的变量，只有let命令所在的代码块有效
   */
   letVarial: function(){
      {
         let b = 1;
         var a = 10;
         console.log(b);//1
      }
      console.log(a);//10
      //console.log(b);//b is not defined
   },
   forTest: function(){
      var a = [];
      for(var i=0;i<10;i++){
         a[i] = function(){
            console.log(i);
         };
      }
      a[6]();//10
      /*let只在所在的代码块中有效*/
      var b = [];
      for(let i=0;i<10;i++){
         b[i] = function(){
            console.log(i);
         };
      }
      b[6]();//6
      //函数内部的白能量和外部的变量是分离的
      for (let i = 0; i < 3; i++) {
         let j = 'abc';
         console.log(i);
         console.log(j);
      }
   },
   //let命令不存在函数提升
   funcTop: function(){
      console.log('var--'+foo);//undefined
      var foo = 2;
      console.log('let---'+bar);//undefined
      let bar = 2;
   },
   otherTest: function(){
      /************************************************************************/
      //暂时性死区：在变量声明之前，不允许使用这个变量，否则就会报错
      //暂时性死区的本质：只要一进入当前作用域，所要使用的变量就已经存在了，但是不可获取，只有等到声明变量的那一行代码出现，才可以获取和使用该变量。
      if (true) {
        // TDZ开始
        //tmp = 'abc'; // ReferenceError
        //console.log(tmp); // ReferenceError
        //typeof tmp; // ReferenceError
        let tmp; // TDZ结束
        console.log(tmp); // undefined

        tmp = 123;
        console.log(tmp); // 123
      }
      /*************************************/
      //比较隐蔽的‘死区’
      function bar(x=y,y=2){
         console.log([x,y]);
      }
      //bar();//报错，因为y未定义
      /*************************************/
      //let不允许在在相同的作用域内重复声明同一个变量
      // 报错
      function fun() {
        let a = 10;
        //var a = 1;
      }
      //fun();//报错：Identifier 'a' has already been declared
      // 报错
      function fun1() {
        let a = 10;
        //let a = 1;
      }
      //fun1();//报错：Identifier 'a' has already been declared
      /***********************************************************************/
      //块级作用域：ES5中不允许在块级中新建函数，但是ES6中允许在块中建立函数
      //考虑到环境导致的行为差异太大，应该避免在块级作用域内声明函数。如果确实需要，也应该写成函数表达式，而不是函数声明语句。
      'use strict'
      if(true){
         function f(){}
      }
      /*****************************************************************************/
      function f() { console.log('I am outside!'); }
      (function () {
        if (false) {
          // 重复声明一次函数f
          function f() { console.log('I am inside!'); }
        }

        f();//老版chrome报错
      }());
      //ES5:I am inside!
      function f() { console.log('I am outside!'); }
      (function () {
        function f() { console.log('I am inside!'); }
        if (false) {
        }
        f();
      }());
      //ES6:I am outside!
      function f() { console.log('I am outside!'); }
      (function () {
        f();
      }());
      /******************************************************************************/
      //const定义常量，只可读不可写
      //const与let相同，也是块作用域内有效
      //const定义对象时，只能保证指向对象的地址不变，不能保证对象不变
      const foo = {};
      foo.prop = 123;

      foo.prop;// 123

      //foo = {}; // TypeError: "foo" is read-only
   }

}
ES6Char2.init();

//ES6中声明变量的方式：var, function, const, let, import, class 6种
//var 和function申明的全局变量属于顶层对象的属性；
//const, let, class申明的全局变量不属于顶层对象的属性




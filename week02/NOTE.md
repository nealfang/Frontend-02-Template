学习笔记

---

装箱转换和拆箱转换

- 装箱转换

  - 定义：将基本数据类型转换为对应的引用类型操作（在此过程需要用到基本包装类型：String、Number、Boolean，使用new关键字调用）

  - 分类

    - 隐式装箱

      - 执行的过程

        - 读取一个基本类型值时，js后台自动调用对应的基本包装类型对象；
        - 在这个基本类型的对象上调用方法，其实就是在这个基本类型对象上调用方；
        - 这个基本类型的对象是临时的，它只存在于方法调用那一行代码执行的瞬间，执行方法后立即被销毁

      - 举例

        ```
        const a = 'call_me_R' // 隐式调用了 String()
        const b = a.toString()
        ```

        

    - 显式装箱

      ```js
      const a = String('call_me_R') // 显式调用了 String()
      const b = a.toString()
      ```

      

- 拆箱转换

  - 把引用类型转换成基本的数据类型，js内部调用了ToPrimitive函数进行转换

  - 通常通过引用类型的valueOf()和toString()方法来实现

  - 举例

    ```js
    const objectNum = new Number(1)
    ocnst objectStr = new String('1')
    // 拆箱, 由代码主动调用
    console.log(typeof objectNum.valueOf())
    console.log(typeof objectStr.toString())
    ```

    

- 对象到String和Number的转换都遵循“先拆箱再转换”的规则

  	> 通过拆箱转换，把对象变成基本类型，再从基本类型转换为对应的 String 或者 Number;
  	>
  	> 拆箱转换会尝试调用 valueOf 和 toString 来获得拆箱后的基本类型。如果 valueOf 和 toString 都不存在，或者没有返回基本类型，则会产生类型错误 TypeError;

  > 例如

  ```js
  
      var o = {
          valueOf : () => {console.log("valueOf"); return {}},
          toString : () => {console.log("toString"); return {}}
      }
  
      o * 2
      // valueOf
      // toString
      // TypeError
  ```

  
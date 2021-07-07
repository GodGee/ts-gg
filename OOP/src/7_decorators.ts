// 1.类装饰器
////////////////////////////////////////////////////////////////
;(function () {
  // 普通装饰器（无法传参）
  function logClass(params: any) {
    // paramss 就是当前类
    console.log('params: ', params)
    params.prototype.apiUrl = '动态扩展的属性'
    params.prototype.run = function () {
      console.log('动态方法')
    }
  }

  @logClass
  class HttpClient {
    constructor() {}
    getData() {}
  }

  let hc: any = new HttpClient()
  console.log('hc.apiUrl: ', hc.apiUrl)
  hc.run()
})()
////////////////////////////////////////////////////////////////
;(function () {
  // 装饰器工厂（可传参）
  function logClass(params: any) {
    console.log('params: ', params) // params就是目前传参
    return function (target: any) {
      console.log('target: ', target) //target 就是当前类
      target.prototype.apiUrl = params
    }
  }
  @logClass('https://www.baidu.com')
  class HttpClient {
    constructor() {}
    getData() {}
  }
  let http: any = new HttpClient()
  console.log(http.apiUrl)
})()
////////////////////////////////////////////////////////////////
;(function () {
  // 类装饰器重载构造函数
  function logClass(target: any) {
    return class extends target {
      apiUrl: any = '我是修改后的属性' // 重构属性
      getData() {
        // 重构方法
        this.apiUrl = this.apiUrl + '-----'
        console.log('类装饰器重载构造函数this.apiUrl: ', this.apiUrl)
      }
    }
  }
  @logClass
  class HttpClient {
    public apiUrl: string | undefined
    constructor() {
      this.apiUrl = '我是构造函数里面的apiUrl'
    }
    getData() {
      console.log('类this.apiUrl: ', this.apiUrl)
    }
  }

  let http: any = new HttpClient()
  http.getData()
})()
// 2.属性装饰器
;(function () {
  // 属性装饰器表达式会在运行时当作函数被调用，传入下列2个参数：
  // 2.1、对于静态成员来说是类的构造函数，对于实例成员是类的原型对象。
  // 2.2、成员的名字。
  function logProperty(params: any) {
    return function (target: any, attr: any) {
      target[attr] = params
    }
  }
  class HttpClient {
    @logProperty('https://www.baidu.com/') //此处调用
    public apiUrl: string | undefined

    constructor() {}
    getData() {
      console.log('apiUrl: ', this.apiUrl)
    }
  }

  var http = new HttpClient()
  http.getData() // https://www.baidu.com/
})()
// 3、方法装饰器
;(function () {
  // 它会被应用到方法的 属性描述符上，可以用来监视，修改或者替换方法定义。
  // 方法装饰会在运行时传入下列3个参数：
  // 3.1、对于静态成员来说是类的构造函数，对于实例成员是类的原型对象。
  // 3.2、成员的名字。
  // 3.3、成员的属性描述符。
  function get(params: any) {
    return function (target: any, methodName: any, desc: any) {
      //修改装饰器的方法  把装饰器方法里面传入的所有参数改为string类型
      //1、保存当前的方法
      var oMethod = desc.value
      //2、修改当前的方法
      desc.value = function (...args: any[]) {
        args = args.map((value) => {
          return String(value)
        })
        oMethod.apply(this, args) // 合并当前新增的方法，没有这个就是直接替换此方法
      }
    }
  }

  class HttpClient {
    public url: any | undefined
    constructor() {}
    @get('https://www.baidu.com/')
    getData(...args: any[]) {
      console.log('我是getData里面的方法')
    }
  }

  var http = new HttpClient()
  http.getData(123, 'xxx')
})()
// 4、方法参数装饰器
;(function () {
  // 参数装饰器表达式会在运行时当作函数被调用，可以使用参数装饰器为类的原型增加一些元素数据 ，传入下列3个参数：
  // 4.1、对于静态成员来说是类的构造函数，对于实例成员是类的原型对象。
  // 4. 2、方法的名字。
  // 4.3、参数在函数参数列表中的索引。
  function logParams(params: any) {
    return function (target: any, methodName: any, paramsIndex: any) {
      target.apiUrl = params
    }
  }

  class HttpClient {
    public url: any | undefined
    constructor() {}
    getData(@logParams('xxxxx') uuid: any) {
      console.log(uuid)
    }
  }

  var http: any = new HttpClient()
  http.getData(123456)
  console.log(http.apiUrl)
})()
// 5.装饰器执行顺序
;(function () {
  //属性》方法》方法参数》类

  // 如果有多个同样的装饰器，它会先执行后面的

  function logClass1(params: string) {
    return function (target: any) {
      console.log('类装饰器1')
    }
  }

  function logClass2(params: string) {
    return function (target: any) {
      console.log('类装饰器2')
    }
  }

  function logAttribute1(params?: string) {
    return function (target: any, attr: any) {
      console.log('属性装饰器1')
    }
  }

  function logAttribute2(params?: string) {
    return function (target: any, attr: any) {
      console.log('属性装饰器2')
    }
  }

  function logMethod1(params?: string) {
    return function (target: any, methodName: any, desc: any) {
      console.log('方法装饰器1')
    }
  }
  function logMethod2(params?: string) {
    return function (target: any, methodName: any, desc: any) {
      console.log('方法装饰器2')
    }
  }

  function logParams1(params?: string) {
    return function (target: any, methodName: any, paramsIndex: any) {
      console.log('方法参数装饰器1')
    }
  }

  function logParams2(params?: string) {
    return function (target: any, methodName: any, paramsIndex: any) {
      console.log('方法参数装饰器2')
    }
  }

  @logClass1('http://www.itying.com/api')
  @logClass2('xxxx')
  class HttpClient {
    @logAttribute1()
    @logAttribute2()
    public apiUrl: string | undefined
    constructor() {}
    @logMethod1()
    @logMethod2()
    getData() {
      return true
    }

    setData(@logParams1() attr1: any, @logParams2() attr2: any) {}
  }

  var http: any = new HttpClient()
  // 属性装饰器2
  // 属性装饰器1
  // 方法装饰器2
  // 方法装饰器1
  // 方法参数装饰器2
  // 方法参数装饰器1
  // 类装饰器2
  // 类装饰器1
})()
// 应用场景：类装饰器 可以注入到类、方法、属性参数上来扩展类、属性、方法、参数的功能;
// 执行顺序：属性-》方法-》方法参数-》类,同类型的从后到前（参数为从右到左）

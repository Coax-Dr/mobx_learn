import { observable, toJS, extendObservable, action, intercept, observe } from 'mobx';

/**
 * toJS:递归的将observable对象、数组、映射、原始类型转化为js结构
 * extendObservable:用于向已经存在的目标对象添加observable属性，使用时需要注意，查看mobx文档的注意
 * intercept:在变化作用于observable之前检测和修改变化
 * observa:在observable变化之后拦截改变
 */

const obj = observable({
  x: 1
})

const clone = toJS(obj); // 转化

///////////////////////////////////////////////////////////////////

const person = function (firstName, lastName) {
  extendObservable(this, {
    firstName: firstName,
    lastName: lastName,
    get fullName() {
      return this.firstName + ' ' + this.lastName;
    },
    setFirstName(firstName) {
      this.firstName = firstName;
    }
  }, {
    setFirstName: action
  })
}

const matthew = new person("Matthew", "Henry");

// 为observable对象添加observable属性
extendObservable(matthew, {
  age: 23
})

////////////////////////////////////////////////////////////////////////
/**
 * intercept(target, propertyName?, interceptor)
 * target: 监测的observable
 * propertyName: 可选参数，用于指定某个属性的拦截
 * interceptor: 在每次变化作用于observable后调用的回调函数，接受一个用来描述变化的对象
 */

const theme = observable({
  backgroundColor: "#ffffff"
})

const disposer = intercept(theme, 'backgroundColor', change => {
  if (!change.newValue) {
    return null; // 使不符合校验规则的变化可以被忽略而不被应用
  }
  if (change.newValue.length === 7) {
    // 可以获取到observable改变之前的新值，当observable数据改变时，会进行自动的拦截
    return change; // 对改变后的符合校验规则的新值原样返回
  }
})


///////////////////////////////////////////////////////////////////

/**
 * observe(target, propertyName?, listener, invokeImmediately?)
 * target: 观察的observable
 * propertyName: 可选参数，用来指定某个属性进行观察
 * listener: 在每次变化作用于observable后调用的回调函数
 * invokeImmediately: 默认是false, 是否直接使用observable的值，不等到其第一次变化之前
 */

 const person = observable({
   firstName: "Maarten",
   lastName: "Luther"
 })

 const disposer = observe(person, (change) => {
   console.log("旧值", change.oldValue, "新值", change.newValue);
 })

 person.firstName = "li"; 
 // 旧值 Maarten 新值 li
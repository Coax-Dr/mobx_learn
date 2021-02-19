import { observable, toJS, extendObservable, action } from 'mobx';

/**
 * toJS:递归的将observable对象、数组、映射、原始类型转化为js结构
 * extendObservable:用于向已经存在的目标对象添加observable属性，使用时需要注意，查看mobx文档的注意
 */

 const obj = observable({
   x: 1
 })

 const clone = toJS(obj); // 转化

 ///////////////////////////////////////////////////////////////////

 const person = function(firstName, lastName) {
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
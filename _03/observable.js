import { observable, computed, decorate, autorun } from 'mobx';
/**
 * computed与autorun
 * 如果想响应式的产生一个可以被其他observer的值，请使用@computed
 * 如果想要到达一个效果，请使用@autorun，例如网络请求，打印日志
 * 如果计算属性不在被观察，即在ui中不在使用，mobx将会自动将其垃圾回收
 * 但是autorun则需要手动清理才行
 */

class OrderLine {
    @observable price = 0;
    @observable amount = 0;
    constructor(price) {
        this.price = price;
    }
    @computed get total() {
        return this.price * this.amount;
    }
}

// class OrderLine {
//     price = 0;
//     amount = 1;
//     constructor(price) {
//         this.price = price;
//     }
//     get total() {
//         return this.price * this.amount;
//     }
// }
/**
 * 装饰器语法
 */
// decorate(OrderLine, {
//     price: observable,
//     amount: observable,
//     total: computed
// })

/**
 * computed直接当函数来使用
 */
const name = observable.box('li');
const upperCaseName = computed(() => {
    name.get().toUpperCase();
});
const disposer = upperCaseName.observe_(change => console.log(change.newValue));
name.set('yang');

const numbers = observable([1,2,3])

const sum = computed(() => numbers.reduce((a,b) => a + b, 0));

const disposer = autorun(() => console.log(sum.get()));

// 打印：6，首次使用autorun函数时会触发一次调用

numbers.push(4); // 改变了observable的值，就会触发autorun函数的变化

// 打印：10，当改变被观察的数组时，就会再次触发一次

numbers.push(5); // 改变observable的值，触发autorun函数

disposer(); // 执行autorun函数会返回一个参数，执行该参数会清除该autorun函数

numbers.push(8); // 由于autorun函数已经被清除，所以不会有任何打印

///////////////////////////////////////////////////////////////////////////////////////
// autorun函数的第二个参数

autorun(() => {
    // 一些与后端发送请求的操作
}, { 
    delay: 300, // 防抖操作
    name: 'anturun', // 事件名称，用于在spy事件中区分是哪个事件在执行 
    onError: () => {
        // 错误处理
    }
 })


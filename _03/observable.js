import { observable, computed, decorate, autorun, reaction } from 'mobx';

 /**
  * autorun：响应式函数，函数本身不会存在观察者。
  * 使用场景：当其依赖的observable状态发生变化时，会产生一些副作用。
  * 执行时机：当函数第一次被创建时就会自执行一次，在所依赖的observable状态发生变化后，以后发生变化。
  * 垃圾回收：在autorun执行以后，会返回一个当前的reaction，可以使用该reaction清理掉autorun。
  */

 /**
  * computed: 计算值，可以根据现有的observable状态或者计算值衍生出来的值。
  * 使用场景：当需要根据observable状态或者其他的计算值产生一个新的计算值时，该函数是一个纯函数，不会产生副作用。
  * 执行时机：当计算值所依赖的observable状态发生变化时执行，在首次创建时不会自执行。
  * 优化策略：如果前后两次的计算所依赖的数据没用发生变化，计算值将不会重新执行，避免了不必要的重复执行。
  * 垃圾回收：当计算值不再被使用，就会被mobx当作垃圾回收掉。例如：计算值不被其他的reaction使用，使用该计算值的UI不存在了。不需要我们手动进行回收。
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


 ////////////////////////////////////////////////////////////////////////////////////////////

 /**
  * reaction(() => data, (data, reaction) => { sideEffect }, options?): 是autorun的升级版，提供了更细粒度的监听。
  * 第一个数据函数用于追踪observable的变化，并进行计算，其返回的值将作为第二个参数的输入。
  * 第二个参数将会接受两个参数，第一个参数第一个参数为函数参数的，第二个参数为reaction清理函数，用于在函数执行期间清除reaction。
  * 与autorun的不同：autorun在被创建以后就会被执行，而reaction在创建以后不会被执行。
  */
 const todos = observable([
     {
         title: 'Make coffee',
         done: true
     },
     {
         title: 'Find biscuit',
         done: false
     }
 ])

 const reaction1 = reaction(() => todos.length, length => console.log('length', length))

 //////////////////////////////////////////////////////////////////////////////////////////////

 /**
  * when(predicate: () => boolean, effect?: () => viod, options?): 观察predicate函数所依赖的observable状态
  * 执行机制：when观察并执行
  */
import { observable, computed, decorate } from 'mobx';
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

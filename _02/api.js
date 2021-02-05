import { observable, computed, observe, autorun } from 'mobx';

/**
 * observable
 */

class OrderLine {

    @observable price = 0;

    @observable amount = 1;

    @computed get total() {
        return this.price * this.amount;
    }
}

/**
 * observable.box(value, options?)
 * 在js中所有原始类型的值都是不可变的，因此不可以被观察到。使用observable.box(原始值)，可以使其被观测。
 */

const cityName = observable.box("Wuhan");

console.log(cityName.get()); // 使用get获取值

const formatCityName = intercept(cityName, (change) => {
    // 拦截
})

cityName.observe((change) => { // 监听值的更新
    console.log('旧的值:', change.oldValue, '新的值:', change.newValue);
})

cityName.set('Guangzhou') // 使用set更新值

/////////////////////////////////////////
/**
 * 对observable进行监测
 */
const theme = observable({
    backgroundColor: '#fff'
});

const disposer = intercept(theme, "backgroundColor", change => {
    // 可以获取到改变之前的值以及改变之后的值,可以对值进行拦截
    if (!change.newValue) {
        return null;
    }
    if (change.newValue.length === 6) {
        change.newValue = '#' + change.newValue;
        return change;
    }
    if (change.newValue.length === 7) {
        return change;
    }
})

/**
 * 对observable进行观察
 */

const person = {
    firstName: 'WeiEn',
    lastName: 'Rooney'
};

const disposer1 = observe(person, (change) => {
    // 当person发生改变时执行
});

const disposer2 = observe(person, 'lastName', () => {
    // 监听某个单一属性
})


//////////////////////////////////////////////////////////////////////////////

/**
 * observable.object 对没有原型的对象进行观察， 对有原型的对象进行观察时，需要在定时构造函数时使用@observable
 */

const person = observable({
    name: 'John',
    age: 42,
    showAge: false,
    // 计算属性
    get labelText() {
        return this.showAge ? `${this.name}(age:${this.age})` : this.name;
    },
    setAge(age) {
        this.age = age;
    }
}, {
    setAge: action
});

autorun(() => console.log(person.labelText)); // 实时监听

person.name = 'Rooney'; // 更新

person.setAge(23);

//////////////////////////////////////////////////////////////////////////
/**
 * observable.array(value, options?) 提供一个可观测的(observable)数组，如果不想对数组中的值进行观测，请使用{deep: false}
 */


const todos = observable([ // 等价于装饰器observable.deep, 将对数组进行深拷贝，使每个元素可以被观察。
    { title: 'Tea', completed: true },
    { title: 'coffee', completed: true }
]);

autorun(() => {
    // 当observable变化时执行
})

todos[0].completed = false; // 更新可观测对象

const disposer1 = intercept(todos, (change) => {
    // 拦截改变
})

const disposer2 = observe(todos, (change) => {
    // 观察改变
}) 

///////////////////////////////////////////////////////////////////////////////

/**
 * observable.map(values?)创建一个动态的observable映射，values可以是对象、数组、或者字符串健的es6 map
 */


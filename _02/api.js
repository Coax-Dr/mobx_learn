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

 const map = observable(new Map());
//  @observable map = new Map();

// 被设置为observable的映射具有普通映射的方法
map.set('name', 'li'); // 给映射设置键值对
map.get('name'); // 获取值
map.has('name'); // 判断值是否存在
map.keys() // 获取所有存在的key
map.values() // 获取所有的值
map.delete('name') // 删除某个键值对
map.clear() // 清空映射
map.size // 获得映射的长度

// mobx定义的映射新增的属性


map.toJS() // 将observable映射转化为普通映射
map.toJSON() // 返回此对象浅式普通对象表示
map.intercept() // 同对象数组
map.observe() // 同对象数组
map.merge(values) // 将values拷贝到映射中

////////////////////////////////////////////////////////////////////////////////

/**
 * 装饰器
 * 创建的observable对象自动调用obdervable.deep调节器
 * 浅拷贝： observable.shallow
 * 对于不由自己管理的不可变对象，可以使用observable.ref调节器，只会追踪对象的引用
 */



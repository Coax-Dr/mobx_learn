import { observable, decorate, computed, autorun, set, get } from 'mobx';

// observable state 可观察的状态
class Todo {
  id = Math.random();
  @observable title = ''; // 使title成为可以被观察的对象
  @observable finished = false; // 同上
}


// computed 计算值 产生一个新的值
class TodoList {
  @observable todos = []; // 使todos可以被观察
  @computed get unfinishedTodoCount() { // 当todos或者其内部的属性发生变化时触发
    return this.todos.filter(todo => !todo.finished).length;
  }
}

// Reactions 反应 产生副作用
/**
 * 装饰器在不支持装饰器语法时
*/
// decorate(Todo, {
//   title: observable,
//   finished: observable
// });

/////////////////////////////////////////////////////////////////////////////////////////////////////////

let message = observable({
  title: 'Foo',
  author: {
    name: 'Michel'
  },
  likes: [
    'John', 'Sara'
  ]
})

const disposer = autorun(() => {
  /**
   * 使用追踪函数追踪可观测变量的改变需要注意的点：
   * 1、在追踪函数内部追踪可观测对象的改变需要引用该属性
   * 2、跟踪函数只会跟踪在其执行期间才会执行的引用，异步的访问数据不会被跟踪到
   * 3、mobx不会追踪不存在的数组的索引，不会追踪不存在的属性
   * 4、mobx只会追踪被定义为observable的属性
   * 5、追踪函数包括: computed, observer组件的render()方法，when, reaction，autorun的第一个参数
   */
  console.log(message.title); // 追踪引用
  console.log(message.likes.join(',')) // 追踪数组方法
  console.log(message.likes) // 如果数组likes的引用没有发生改变，就不会被追踪到
  console.log(get(message, 'age')) // 对于未被定义为observeable的属性，可以使用set定义，使用get追踪
  trace(); // 检测追踪函数在追踪什么
})

message.title = 'Bar';
// 当title被改变时，会被autorun追踪函数检测到

message.likes[2] = 'li';

set(message, 'age', 'li'); // 对于未被定义为observeable的属性，可以使用set定义，使用get追踪

//////////////////////////////////////////////////////////////////////////////////////////////////////////////

const collection = observable.map({
  // 创建一个动态健集合，其内部的属性将会动态修改，对于动态键集合，总是使用observable集合
  'name': 'li'
})

autorun(() => {
  console.log(collection.get('age'));
})

collection.set('age', 10) // 动态的为collection对象添加一个属性

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

版本 > Mobx4
const collection = observable.object({
  'name': 'li'
})

autorun(() => {
  console.log(get(collection, 'age'));
})

set(collection, { 'age' : 11 });
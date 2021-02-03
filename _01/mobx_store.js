import { observable, decorate, computed, autorun } from 'mobx';

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
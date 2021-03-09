import React from 'react';
/**
 * 引入mobx-react
 *  如果项目将要使用函数式组件，请使用mobx-react-lite。
 */

import { observable } from 'mobx';
import { inject, observer, Observer, useLocalObservable, inject, Provider } from 'mobx-react';

/**
 * observer：observer(组件)，将组件转化为响应式组件，被转化的组件将会跟踪observales值的改变，当跟踪的值发生变化时，observer将会使视图重新刷新。
 * 对于类组件：类组件的props以及state将被转化为observable
 * */

/**
 * 注意：observer不会转化react.memo返回的组件。
 * 对于类组件被observer转化，shouldComponentUpdate 将不会被支持。建议使用React.PureComponent。
 */

const TodoView = observer(
    class TodoView extends React.Component {
        render() {
            return <div>{ this.props.todo.title }</div>
        }
    }
)

// 转化类组件
@observer
class TodoView extends React.Component {
    render() {
        return <div>{ this.props.todo.title }</div>
    }
}

// 转化函数式组件

const TodoView = observer(({ todo }) => <div>{todo.title}</div>)

/**
 * Observer：作用与oberver相同，可以当标签使用，被其包裹的区域中使用的数据将会成为响应式的。
 */


// 转化函数式组件
class App extends React.Component {
    render() {
        return (
            <div>
                {this.props.person.name}
                <Observer>{() => <div>{this.props.person.name}</div>}</Observer>
            </div>
        )
    }
}

const person = observable({ name: 'li' });
person.name = 'cai'; 

// 转化类组件

class App extends React.Component {
    render() {
        return (
            <div>
                {this.props.person.name}
                <Observer render={() => <div>{this.props.person.name}</div>} />
            </div>
        )
    }
}

/**
 * useLocalObservable：用于在组件中创建局部而非全局的可观察对象，可用于替代React中的state(this.state以及useState)
 */

const Todo = () => {
    const todo = useLocalObservable(() => ({
        title: "TEST",
        done: true,
        toggle() {
            this.done = !this.done
        }
    }))

    return (
        <Observer>
            {
                () => {
                    <h1 onClick={todo.toggle}>
                        {todo.title} {todo.done ? '[DONE]' : '[TODO]'}
                    </h1>
                }
            }
        </Observer>
    )
}

/**
 * Provider：使用React的Context机制将数据传递给深层组件。
 * inject(注入)：获取Provider提供的数据。
 */

@inject("color")
@observer
class Button extends React.Component {
    render() {
        return <button style={{ background: this.props.color }}>{ this.props.children }</button>
    }
}

class Message extends React.Component {
    render() {
        return (
            <div>{this.props.text}<Button>Delete</Button></div>
        )
    }
}

class MessageList extends React.Component {
    render() {
        const children = this.props.messages.map(message => <Message text={message.text} />)
        return (
            <Provider>
                <div>{children}</div>
            </Provider>
        )
    }
}


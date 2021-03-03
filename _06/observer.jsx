/**
 * observer：用于将React组件转变为响应式组件。
 * 机制：使用mobx.autorun包装render函数，这样就确保了observable状态在变化时，视图可以自动刷新。observer只会对引用类型的数据做出反应，而不会对原始值做出反应
 * 
 */
import ReactDOM from 'react';
import { observable } from 'mobx';
import { observer, observer } from 'mobx-react';

const timerData = observable({
    secondsPassed: 0
})

setInterval(() => {
    timerData.secondsPassed++
}, 1000);

@observer class Timer1 extends React.Component {
    render() {
        return (
            <span>
                Second passed: { this.props.timerData.secondsPassed}
            </span>
        )
    }
}

ReactDOM.render(<Timer1 timerData={timerData} />, document.body);
// 不能使用原始值，需要使用引用值。否则，mobx将不会做出反应。

/**
 * 可观察的组件状态：除了普通的类以外，也可以在React组件内部使用observerable定义状态。
 * 
 */

 @observer class Timer2 extends React.Component {
     @observable secondsPassed = 0 // 替代state

     componentWillUpdate() {
         setInterval(() => {
             this.secondsPassed ++
         }, 1000)
     }

     render() {
         return (
             <span>Second passed: { this.secondsPassed }</span>
         )
     }
 }

 ReactDOM.render(<Timer2 />, document.body);

 /**
  * 待续...
  */


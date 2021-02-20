import { observable } from 'mobx';
import { observer } from 'mobx-react-lite';
import { fromPromise, observer } from 'mobx-utils';
const fetchResult = fromPromise((resolve) => {
    setTimeout(() => {
        resolve('ok')
    }, 1000);
})

const myComponent = observer(({ fetchResult }) => {
    // switch(fetchResult.state) {
    //     case "pending": return 'Loading';
    //     case "rejecte": return 'Ooops';
    //     case "fulfilled": return 'Gotche';
    // }
    // 使用case代替switch
    fetchResult.case({
        pending: () => 'Loading',
        rejected: error => error,
        fulfilled: value => value
    })
})
import { observable, action, autorun, configure, runInAction, flow } from 'mobx';
class Ticker {
  @observable tick = 0;

  @action.bound
  increment() {
    this.tick++
  }

  @autorun
  listent() {
    console.log('监听', this.tick);
  }
}

const ticker = new Ticker();
setInterval(ticker.increment, 1000);

///////////////////////////////////////////////

configure({ enforceActions: true });
class Store {
  @observable githubProjects = [];
  @observable state = "pending"; // 'pending' 'done' 'error'
  /**
   * 在action内部，如果存在在函数内部调用异步函数改变observable的情况，将不会做出反应。
   * 因为action只会应用于当前栈。
   * 
   */
  // @action
  // fetchProjects() {
  //   this.githubProjects = [];
  //   this.state = "pending";
  //   fetchGithubProjrctsSomehow().then(
  //     projects => {
  //       const filteredProjects = somePerprocessing(projects);
  //       this.githubProjects = filteredProjects;
  //       this.state = 'done';
  //     },
  //     error => {
  //       this.state = 'error';
  //     }
  //   )
  // }
  // 正确的打开方式其一: 将回调函数事先定义好，这样回调函数就会成为动作的一部分
  // @action
  // fetchProjects() {
  //   this.githubProjects = [];
  //   this.state = "pending";
  //   fetchGithubProjectsSomehow().then(this.fetchProjectsSuccess, this.fetchProjectsError);
  // }

  // @action.bound
  // fetchProjectsSuccess(projects) {
  //   // 请求成功的操作
  // }

  // @action.bound
  // fetchProjectsError(error) {
  //   // 请求失败的操作
  // }
  /**
   * 这样回调函数成为了fetchProjects动作的一部分，就可以对动作后的值修改做出反映了。
   */
  // @action
  // fetchProjects() {
  //   this.githubProjects = [];
  //   this.state = "pending";
  //   fetchGithubProjectsSomehow().then(
  //     action("fetchSuccess", projects => {
  //       // 请求成功的操作
  //     }),
  //     action("fetchError", error => {
  //       // 请求失败的操作
  //     })
  //   )
  // }
  @action
  fetchProjects() {
    this.githubProjects = [];
    this.state = "pending";
    fetchGithubProjectsSomehow.then(
      project => {
        runInAction(() => {
          // 成功的操作
        })
      },
      error => {
        runInAction(() => {
          // 失败的操作
        })
      }
      /**
       * 使用runInAction工具函数的好处就是，不用将整个回调函数作为动作的一部分，只需要对改变状态的部分使用。
       */
    )
  }
}

/////////////////////////////////////////

// 基于async/await使用

class Store {
  @observable githubProjects = [];
  @observable state = "pending";

  @action
  async fetchProjects() {
    this.githubProjects = [];
    this.state = "pending";
    try {
      const projects = await fetchGithubProjectsSomehow();
      runInAction(() => {
        // 成功的操作
      })
    } catch (error) {
      runInAction(() => {
        // 失败的操作
      })
    }
  }
}

// 使用flow，对async函数进行追踪

class House {
  @observable members = [];
  @observable absence = false;

  fetchMembersInfo = flow(function* () {
    this.members = [];
    this.absence = false;
    try {
      const members = yield fetchMembersInfoSomeHow()
      // 直接进行修改状态的操作, 而不需要使用action进行包装
      this.members = members;
      this.absence = false;
    } catch (error) {
      // 直接进行修改状态的操作, 而不需要使用action进行包装
      this.absence = true;
    }
  })
}

/**
 * 使用flow的好处就是可以摆脱使用action，并且其用法也和async/await基本相同
 */
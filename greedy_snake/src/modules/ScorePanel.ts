// 定义表示记分牌的类
class ScorePanel {
  //1.属性 公共属性，无需设置get set
  // score和level用来记录分数和等级
  score = 0
  level = 1
  // 分数和等级所在的元素，在构造函数中进行初始化
  scoreEle: HTMLElement
  levelEle: HTMLElement
  // 设置一个变量限制等级
  maxLevel: number
  // 设置一个变量表示多少分时升级
  upScore: number
  constructor(maxLevel: number = 10, upScore: number = 10) {
    this.scoreEle = document.getElementById('score')!
    this.levelEle = document.getElementById('level')!
    this.maxLevel = maxLevel
    this.upScore = upScore
  }
  //2.方法
  //设置一个加分的方法
  addScore() {
    // 使分数自增
    this.scoreEle.innerHTML = ++this.score + ''
    // 判断分数是多少
    if (this.score % this.upScore === 0) {
      this.levelUp()
    }
  }
  // 提升等级的方法
  levelUp() {
    // 避免使用字面量，不好扩展，以参数形式设置
    if (this.level < this.maxLevel) {
      this.levelEle.innerHTML = ++this.level + ''
    }
  }

  //问题：
  // 等级是否有上线 速度不可能无限制增加 参数
  // 什么时候升级 满足什么条件，有加分来控制
}

// 测试代码
// const scorePanel = new ScorePanel(100, 10)
// for (let i = 0; i < 200; i++) {
//   scorePanel.addScore()
// }

export default ScorePanel

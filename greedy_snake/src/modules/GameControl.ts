// 引入其他的类
import Snake from './Snake'
import Food from './Food'
import ScorePanel from './ScorePanel'

// 游戏控制器，控制其他的所有类
class GameControl {
  // 1.定义三个属性
  // 蛇
  snake: Snake
  // 食物
  food: Food
  // 记分牌
  scorePanel: ScorePanel
  // 4.创建一个属性来存储蛇的移动方向（也就是按键的方向） 什么时候改变
  direction: string = ''

  // 创建一个属性用来记录游戏是否结束
  isLive = true

  constructor() {
    this.snake = new Snake()
    this.food = new Food()
    this.scorePanel = new ScorePanel(10, 1)

    this.init()
  }

  // 2.方法
  // 初始化
  init() {
    //键盘移动上下左右可以移动 禁用字面量function () {}
    // document.addEventListener('keydown', function () {})
    document.addEventListener('keydown', this.keydownHandler.bind(this))
    // 调用run方法，使蛇移动 只加载一次，利用settimeout
    this.run()
  }
  /*
        Chrome       IE
        ArrowUp      Up
        ArrowDown    Down
        ArrowLeft    Left
        ArrowRight   Right
    */

  // 3.创建一个键盘按下的响应函数(鼠标点击贪吃蛇界面+键盘上下左右配合才会触发)---> 存储用户按键方向
  keydownHandler(event: KeyboardEvent) {
    // 需要检查event.key的值是否合法（用户是否按了正确的按键）
    // 5.修改direction属性 谁调用this指向谁
    console.log(this, event.key)
    this.direction = event.key
  }
  // 6.蛇动起来
  // 创建一个控制蛇移动的方法
  run() {
    /*
     *   根据方向（this.direction）来使蛇的位置改变
     *       向上 top  减少
     *       向下 top  增加
     *       向左 left 减少
     *       向右 left 增加
     */

    // 获取蛇现在坐标
    let X = this.snake.X
    let Y = this.snake.Y

    // 根据按键方向来计算X值和Y值（未更新）
    switch (this.direction) {
      case 'ArrowUp':
      case 'Up':
        // 向上移动 top 减少
        Y -= 10
        break
      case 'ArrowDown':
      case 'Down':
        // 向下移动 top 增加
        Y += 10
        break
      case 'ArrowLeft':
      case 'Left':
        // 向左移动 left 减少
        X -= 10
        break
      case 'ArrowRight':
      case 'Right':
        // 向右移动 left 增加
        X += 10
        break
    }

    // 检查蛇是否吃到了食物
    this.checkEat(X, Y)

    //修改蛇的X和Y值
    try {
      this.snake.X = X
      this.snake.Y = Y
    } catch (e) {
      // 进入到catch，说明出现了异常，游戏结束，弹出一个提示信息
      alert(e.message + ' GAME OVER!')
      // 将isLive设置为false
      this.isLive = false
    }

    this.isLive &&
      setTimeout(() => {
        this.run()
      }, 300 - (this.scorePanel.level - 1) * 30)
  }

  // 7.定义一个方法，用来检查蛇是否吃到食物
  checkEat(x: number, y: number) {
    //吃到食物后，需要 --->食物的位置要进行重置 --->分数增加 ---> 蛇要增加一节
    if (x === this.food.X && y === this.food.Y) {
      // 食物的位置要进行重置
      this.food.change()
      // 分数增加
      this.scorePanel.addScore()
      // 蛇要增加一节
      this.snake.addBody()
    }
  }
  // 问题
  // 1.this指向 bind创建新函数，this指向我们自己绑定的
  // 2.按键兼容，按键的范围
  // 3.撞墙 异常捕获
  // 4.吃到食物 触发后续操作
  // 5.蛇身体移动 后一个移动前一个
  // 6.掉头 蛇头坐标是否和第二个蛇身体重合
  // 7.撞到自己 蛇头的坐标和每一个身体坐标是否重复
}

export default GameControl

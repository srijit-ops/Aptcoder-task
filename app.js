const field = document.querySelectorAll(".field")[0]
const scoreDiv = document.getElementById("score")
let applePositions = []
let score = 0
let gameOver = false

var toolbox = {
  "kind": "flyoutToolbox",
  "contents": [
    {
      "kind": "block",
      "type": "game"
    },
  ]
}
Blockly.Blocks['game'] = {
  init: function () {
    this.appendDummyInput()
      .appendField("Setup simulation with");
    this.appendDummyInput()
      .appendField(new Blockly.FieldImage("https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Doushouqi-dog.svg/512px-Doushouqi-dog.svg.png", 25, 25, { alt: "*", flipRtl: "FALSE" }));
    this.appendDummyInput()
      .appendField("Collecting");
    this.appendDummyInput()
      .appendField(new Blockly.FieldNumber(5), "apple_no")
      .appendField(new Blockly.FieldImage("https://pngset.com/images/apple-free-to-use-clipart-clipart-cute-apple-plant-fruit-food-cherry-transparent-png-2539838.png", 25, 25, { alt: "*", flipRtl: "FALSE" }));
    this.setColour(230);
    this.setTooltip("");
    this.setHelpUrl("");
  }
};

var workspace = Blockly.inject('blocklyDiv',
  {
    toolbox: toolbox,
    move: {
      scrollbars: {
        horizontal: true,
        vertical: true
      },
      drag: true,
      wheel: false
    }
  });

document.querySelectorAll(".start")[0].addEventListener("click", runGame)
function runGame() {
  if(workspace.blockDB.size!==0){
    document.querySelector(".start").style.display="none"
  document.querySelector(".restart").style.display="block"
    window.LoopTrap = 1000;
  Blockly.JavaScript.INFINITE_LOOP_TRAP = 'if( — window.LoopTrap == 0) throw “Infinity loop”;\n'
  var code = Blockly.JavaScript.workspaceToCode(workspace);
  Blockly.JavaScript.INFINITE_LOOP_TRAP = null;
  try {
    eval(code)

  } catch (e) {
    alert(e)
  }
  }else{
    alert("Add a block in workspace to start the game")
  } 
}
Blockly.JavaScript['game'] = function (block) {
  var number_apple_no = block.getFieldValue('apple_no');
  // TODO: Assemble JavaScript into code variable.
  var code = 'game(' + number_apple_no + ');\n';
  return code;
};

function randomIntFromInterval(min, max) { // min and max included 
  return Math.floor(Math.random() * (max - min + 1) + min)
}

function generateRandomCoordinate(min, max) {
  return { x: randomIntFromInterval(min, max), y: randomIntFromInterval(min, max) }
}

function generateApplePositions(num) {
  let randomApplePositonArray = []
  while (randomApplePositonArray.length !== num) {
    const data = generateRandomCoordinate(1, 10)
    if (randomApplePositonArray.every(item => {
      return item.x !== data.x && item.y !== data.y
    })) {

      randomApplePositonArray.push({ ...data })
    }
  }
  return [...randomApplePositonArray];
}

function drawApple(applePositions) {
  for (let item of applePositions) {
    const div = document.createElement('div');
    div.classList.add('apple', `x${item.x}-y${item.y}`)
    div.style.gridRowStart = item.x;
    div.style.gridColumnStart = item.y;
    field.append(div)
  }
}


let secUntilLastRender = 0
const framePerSecond = 5

function drawDog() {
  document.querySelectorAll(".dog").forEach(dog => dog.remove())
  const dogPosition = generateRandomCoordinate(1, 10)
  const div = document.createElement("div");
  div.classList.add('dog');
  div.style.gridRowStart = dogPosition.x;
  div.style.gridColumnStart = dogPosition.y;
  field.append(div)
  if (applePositions.some(item => item.x === dogPosition.x && item.y === dogPosition.y)) {
    score += 1
    scoreDiv.innerText = score;
    document.querySelectorAll(`.x${dogPosition.x}-y${dogPosition.y}`).forEach(item => {
      item.remove()
    })
    const newArr = applePositions.filter(item => item.x !== dogPosition.x && item.y !== dogPosition.y)
    applePositions = [...newArr]
    if (!applePositions.length) {
      gameOver = true
    }
  }
}

function gameLoop(currentTime) {
  if (gameOver) {
    alert("Game over. Restart to play again.")
    return;
  }
  if (currentTime / 1000 - secUntilLastRender >= 1 / framePerSecond) {
    secUntilLastRender = currentTime / 1000;
    drawDog()
  }
  requestAnimationFrame(gameLoop)
}

function game(num) {
  applePositions = generateApplePositions(num)
  drawApple(applePositions)
  requestAnimationFrame(gameLoop)
}





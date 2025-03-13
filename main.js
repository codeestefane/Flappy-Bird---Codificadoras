const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
const janelaUsuario = document.querySelector("body");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

ctx.fillStyle = "#cb6ce6";
ctx.fillRect(0, 0, canvas.width , canvas.height);

let flappyBirdSprite = new Image();
let birdAxisY = canvas.height/2 - 14;
let birdAxisX = canvas.width/2;
let posicaoOriginalY = birdAxisY;
let direcao = "";

flappyBirdSprite.src = "flappyBirdSprite.png";

let start = false;

function drawBird(i){
    ctx.drawImage(flappyBirdSprite, 28 * i, 512 - 28, 23, 23, birdAxisX, birdAxisY, 96, 96);
    // ctx.fillStyle = "red";
    // ctx.fillRect(birdAxisX, birdAxisY, 96, 96);
}

function drawBackground(){
    ctx.fillStyle = "#E0BFB8";
    
    for(let i = 0; i < 6; i++){
        // ctx.beginPath();
        // ctx.rect(canvas.width - incrementoBackground + 280 * i, canvas.height - alturaPipe[i], 80, alturaPipe[i]);
        // ctx.rect(canvas.width + 280 * i - incrementoBackground, 0, 80, 580 - alturaPipe[i]);
        // ctx.stroke();
        // ctx.fill();
        if(posicaoPipe[i] < -80) posicaoPipe[i] = canvas.width;
        ctx.drawImage(flappyBirdSprite, 84, 512 - 194, 26, 164, posicaoPipe[i], canvas.height - alturaPipe[i], 80, alturaPipe[i]);
        ctx.drawImage(flappyBirdSprite, 56, 512 - 188, 26, 164, posicaoPipe[i], 0, 80, 580 - alturaPipe[i]);
        posicaoPipe[i] = posicaoPipe[i] - 1;
    }
}

let incremento = 7;

function effectFlyBird(){
    if(birdAxisY > posicaoOriginalY + 7){
        incremento = -7;
    } else if(birdAxisY < posicaoOriginalY - 7){
        incremento = 7;
    }

    birdAxisY += incremento;
}

let indexBird = 0;

flappyBirdSprite.addEventListener('load', () => {
    drawBird(0);
});

// setInterval(() => {
//     if(indexBird === 3) indexBird = 0;
//     ctx.fillStyle = "#cb6ce6";
//     ctx.fillRect(0, 0, canvas.width , canvas.height);
//     drawBird(indexBird);
//     if(direcao === "") effectFlyBird();
//     indexBird++;
// }, 120);

let tempo = 0;
let tempoPulo = 0;

let anima = setInterval(() => {
    ctx.fillStyle = "#cb6ce6";
    ctx.fillRect(0, 0, canvas.width , canvas.height);
    if(indexBird === 3) indexBird = 0;
    if(direcao === "cima"){
        // direcao = ""
        birdAxisY -= 2;
    } else if(direcao === "baixo"){
        birdAxisY += 2;
        // direcao = ""
    }

    if(jump) jumpBird();
    else if(start) birdAxisY += 4;

    if(colisao){
        birdAxisY = canvas.height - 26;
        birdAxisX = 26;
    }
    
    drawBird(indexBird);
    
    if(tempo % 120 === 0 && !start){
        if(!start) effectFlyBird();
        indexBird += 1;
    }
    
    drawBackground();
    tempo += 10;
    verificaColisao();
}, 10);

let alturaPipe = []
let posicaoPipe = []

function atualizaCenario(){
    for(let i = 0; i < 10; i++){
        alturaPipe[i] = Math.round(Math.random() * (580 - 40) + 40);
        posicaoPipe[i] = canvas.width + 260 * i;
        // while(i !== 0 && !(alturaPipe[i - 1] - 40 <= alturaPipe[i] <= alturaPipe[i - 1] + 40)){
        //     alturaPipe[i] = Math.round(Math.random() * (580 - 40) + 40);
        // }
    }
}

function jumpBird(){
    birdAxisY -= 4;
    if(tempo - tempoPulo > 240){
        tempoPulo = 0;
        jump = false;
    }
}

let colisao = false;

function verificaColisao(){
    for(let i = 0; i < 6; i++){
        if(posicaoPipe[i] <= birdAxisX + 80 && birdAxisX <= posicaoPipe[i] + 80 &&
           (0 <= birdAxisY && birdAxisY <= 580 - alturaPipe[i])
        ){
                // console.log("aaaaaaa");
                colisao = true;
                clearInterval(anima);
        }
    }
}

atualizaCenario();

let jump = false;

janelaUsuario.addEventListener("keypress", (evento) => {
    if(evento.keyCode === 115) direcao = "baixo";
    else if(evento.keyCode === 119) direcao = "cima";
    else if(evento.keyCode === 32) {
        start = true;
        jump = true;
        tempoPulo = tempo;
    }
});

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
const janelaUsuario = document.querySelector("body");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

ctx.fillStyle = "#cb6ce6";
ctx.fillRect(0, 0, canvas.width , canvas.height);

let birdAxisY = canvas.height/2 - 14;
let birdAxisX = canvas.width/2 - 20;
let posicaoOriginalY = birdAxisY;
let pontuacao = -1;

let start = false;

function drawBird(i){
    ctx.fillStyle = "white";
    if(colisao) ctx.fillStyle = "#F00";
    ctx.beginPath();
    ctx.arc(birdAxisX, birdAxisY, 20, 0, 2 * Math.PI);
    // ctx.stroke();
    ctx.fill();
}

function drawBackground(){
    ctx.fillStyle = "#ff66c4";
    
    for(let i = 0; i < 6; i++){
        if(posicaoPipe[i] < -80) posicaoPipe[i] = canvas.width;
        ctx.beginPath();
        ctx.rect(posicaoPipe[i], canvas.height - alturaPipe[i], 80, alturaPipe[i]);
        ctx.rect(posicaoPipe[i], 0, 80, 550 - alturaPipe[i]);
        ctx.stroke();
        ctx.fill();
        if(!colisao) posicaoPipe[i] = posicaoPipe[i] - 1;
    }
}

let incremento = 10;

function effectFlyBird(){
    if(birdAxisY > posicaoOriginalY + 10){
        incremento = -10;
    } else if(birdAxisY < posicaoOriginalY - 10){
        incremento = 10;
    }

    birdAxisY += incremento;
}

let indexBird = 0;

let tempo = 0;
let tempoPulo = 0;
let inicio;
let anima;
let colisao = false;
let alturaPipe = []
let posicaoPipe = []
desenhaTelaInicio();

function desenhaTelaInicio(){
    pontuacao = -1;
    start = false;
    colisao = false;
    birdAxisY = canvas.height/2 - 14;
    inicio = setInterval(() => {
        atualizaCenario();
        ctx.fillStyle = "#cb6ce6";
        ctx.fillRect(0, 0, canvas.width , canvas.height);
        drawBird(indexBird);
        effectFlyBird();
        desenhaMensagemPressStart();
    
        if(start){
            clearInterval(inicio);
            iniciaJogo();
        }
    }, 60);
}

function desenhaMensagemPressStart(){
    ctx.fillStyle = "#FFF";
    ctx.font = "24px Arial";
    ctx.fillText("Press space to start...", canvas.width/2 - 120, canvas.height/2 + 80);
}

function desenhaScore(color = "#FFF"){
    ctx.fillStyle = color;
    if(colisao) ctx.fillStyle = "red";
    ctx.font = "24px Arial";
    ctx.fillText("Score: " + pontuacao, canvas.width - 200, 30);
}

function iniciaJogo(){
    pontuacao = 0;
    anima = setInterval(() => {
        ctx.fillStyle = "#cb6ce6";
        ctx.fillRect(0, 0, canvas.width , canvas.height);
    
        if(jump && !colisao) jumpBird();
        else if(start) {
            if(colisao) birdAxisY += 6;
            else birdAxisY += 4;
        }

        if(!colisao){
            drawBird(indexBird);
            drawBackground();
        } else {
            drawBackground();
            drawBird(indexBird);
        }

        tempo += 10;
        desenhaScore();
        verificaColisao();

        if(birdAxisY > canvas.height + 20){
            clearInterval(anima);
            desenhaTelaInicio();
        }

    }, 10);
}

function atualizaCenario(){
    for(let i = 0; i < 10; i++){
        alturaPipe[i] = Math.round(Math.random() * (550 - 40) + 40);
        posicaoPipe[i] = canvas.width + 260 * i;
    }
}

function jumpBird(){
    birdAxisY -= 4;
    if(tempo - tempoPulo > 240){
        tempoPulo = 0;
        jump = false;
    }
}

function verificaColisao(){
    for(let i = 0; i < 6; i++){
        if(posicaoPipe[i] < birdAxisX + 20 && birdAxisX - 20 < posicaoPipe[i] + 80 &&
           (birdAxisY - 20 < 550 - alturaPipe[i] || (birdAxisY + 20 > canvas.height - alturaPipe[i]))
        ){
            colisao = true;
        }

        if(birdAxisX === posicaoPipe[i] + 80 ){
            pontuacao += 1; 
        }
    }
}

atualizaCenario();

let jump = false;

janelaUsuario.addEventListener("keypress", (evento) => {
    if(evento.keyCode === 32) {
        start = true;
        jump = true;
        tempoPulo = tempo;
    }
});

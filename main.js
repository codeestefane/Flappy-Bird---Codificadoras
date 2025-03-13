const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let circleAxisY = canvas.height/2 - 14;
let circleAxisX = canvas.width/2 - 20;
let posicaoOriginalY = circleAxisY;
let pontuacao;
let start = false;
let tempo = 0;
let tempoPulo = 0;
let inicio;
let anima;
let colisao;
let alturaPipe = [];
let posicaoPipe = [];
let incremento = 10;
let jump = false;

desenhaTelaInicio();

function drawCircle(){
    ctx.fillStyle = "white";
    if(colisao) ctx.fillStyle = "#F00";
    ctx.beginPath();
    ctx.arc(circleAxisX, circleAxisY, 20, 0, 2 * Math.PI);
    ctx.fill();
}

function drawBackground(){
    ctx.fillStyle = "#ff66c4";
    
    for(let i = 0; i < 6; i++){
        if(posicaoPipe[i] < -80) posicaoPipe[i] = canvas.width;
        ctx.beginPath();
        ctx.rect(posicaoPipe[i], canvas.height - alturaPipe[i], 80, alturaPipe[i]);
        ctx.rect(posicaoPipe[i], 0, 80, 560 - alturaPipe[i]);
        ctx.stroke();
        ctx.fill();
        if(!colisao) posicaoPipe[i] = posicaoPipe[i] - 1;
    }
}

function effectFlycircle(){
    if(circleAxisY > posicaoOriginalY + 10){
        incremento = -10;
    } else if(circleAxisY < posicaoOriginalY - 10){
        incremento = 10;
    }

    circleAxisY += incremento;
}

function desenhaTelaInicio(){
    start = false;
    colisao = false;
    circleAxisY = canvas.height/2 - 14;

    inicio = setInterval(() => {
        atualizaCenario();
        ctx.fillStyle = "#cb6ce6";
        ctx.fillRect(0, 0, canvas.width , canvas.height);
        drawCircle();
        effectFlycircle();
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

function desenhaScore(){
    ctx.fillStyle = "#FFF";
    if(colisao) ctx.fillStyle = "red";
    ctx.font = "24px Arial";
    ctx.fillText("Score: " + pontuacao, canvas.width - 200, 30);
}

function iniciaJogo(){
    pontuacao = 0;

    anima = setInterval(() => {
        ctx.fillStyle = "#cb6ce6";
        ctx.fillRect(0, 0, canvas.width , canvas.height);
    
        if(jump) jumpCircle();
        else if(colisao) circleAxisY += 6;
        else circleAxisY += 4;

        if(!colisao){
            drawCircle();
            drawBackground();
        } else {
            drawBackground();
            drawCircle();
        }

        tempo += 10;

        desenhaScore();
        verificaColisao();
        calculaPontuacao();

        if(circleAxisY > canvas.height + 20){
            clearInterval(anima);
            desenhaTelaInicio();
        }

    }, 10);
}

function atualizaCenario(){
    for(let i = 0; i < 6; i++){
        alturaPipe[i] = Math.round(Math.random() * (560));
        posicaoPipe[i] = canvas.width + 260 * i;
    }
}

function jumpCircle(){
    circleAxisY -= 4;
    if(tempo - tempoPulo > 240){
        jump = false;
        tempoPulo = 0;
    }
}

function verificaColisao(){
    for(let i = 0; i < 6; i++){
        if(posicaoPipe[i] < circleAxisX + 20 && circleAxisX - 20 < posicaoPipe[i] + 80 &&
           (circleAxisY - 20 < 560 - alturaPipe[i] || (circleAxisY + 20 > canvas.height - alturaPipe[i]))
        ){
            jump = false;
            colisao = true;
        }
    }
}

function calculaPontuacao(){
    for(let i = 0; i < 6; i++){
        pontuacao += 1;
    }
}

// identifica quando o usuário aperta space: começa jogo/faz bolinha pular
document.addEventListener("keypress", (evento) => {
    if(evento.keyCode === 32) {
        start = true;
        jump = true;
        tempoPulo = tempo;
    }
});

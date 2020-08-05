//vetor que guarda o valor de x q foi aleatóriamente gerado para ser avaliado
xArray = Array.apply(null, Array(10)).map(function () {});
yArray = Array.apply(null, Array(10)).map(function () {});

//vetores que guardam os valores para se plotar a função
var xSpace = Array.apply(null, Array(50)).map(function () {});
var ySpace = Array.apply(null, Array(50)).map(function () {});
var z = new Array(50);
for(i=0; i<50; i++){
        z[i] = new Array(50);
}

//vetor que guarda o fitness (no caso é o valor avaliado da função)
fitness = Array.apply(null, Array(10)).map(function () {});

bestFit = 0.0; //guardo o maior fitness, o valor do melhor indíviduo da geração
besti  = 0; //guarda o indice do melhor individuo
i = j = g = 0; //iteradores, o g guarda o valor da geração

leftBoundNumber = -10; //intervalo esquerdo da função
rightBoundNumber = 10; //intervalo direito da função
mutationRate = execJison("10^-5"); //taxa de mutação

inputText = document.querySelector("#inputText")
leftBoundInput = document.querySelector("#leftBoundInput")
rightBoundInput = document.querySelector("#rightBoundInput")
mutationRateInput = document.querySelector("#mutationRateInput")

function execJison (input) {
    return parser.parse(input);
}

function run(input, min, max){
    start(min, max);
    loop(input);
}

function start(){
    evaluateFunction()
    g = 0;
    clear();
    generatePopulation();
}

// função que limpa os dados
function clear(){
    document.querySelector("#generation").innerHTML = 0;
    document.querySelector("#max-fitness").innerHTML = 0;
    document.querySelector("#best-individual").innerHTML = 0;
    for (i=0;i<10;i++){
      document.querySelector(`#population-fitness-${i}`).innerHTML = 0;
    }
}

function printResults(){
    document.querySelector("#generation").innerHTML = g;
    document.querySelector("#max-fitness").innerHTML = bestFit;
    document.querySelector("#best-individual").innerHTML = besti+1;
    for (i=0;i<10;i++){
      document.querySelector(`#population-fitness-${i}`).innerHTML = fitness[i];
    }
}

function setLeftBound() {
    if (leftBoundInput.value == "") {
        leftBoundNumber = -10
    }
    leftBoundNumber = parseFloat(leftBoundInput.value)
}

function setRightBound(){
    if (rightBoundInput.value == "") {
        rightBoundNumber = -10
    }
    rightBoundNumber = parseFloat(rightBoundInput.value)
}

function setMutationRate(){
    if (mutationRateInput.value == "") {
        mutationRate = execJison("10^-5")
    }
    mutationRate = execJison(mutationRateInput.value)
}

function loop() {
    g++;
    evaluateFitness();
    bestFitness();

    printResults();
    plotMarker();
    crossOver();

    //a cada 10 gerações jogamos o pior fora
    if(( g % 10 ) == 0) naturalSelection();
}

//função que inicializa a população
function generatePopulation(){
    for (i=0;i<10;i++){
        xArray[i] = (Math.random() * (rightBoundNumber - leftBoundNumber) + leftBoundNumber);
        yArray[i] = (Math.random() * (rightBoundNumber - leftBoundNumber) + leftBoundNumber);
    }
}

//função que busca o indivíduo com maior fitness e salva o valor e seu indice
function bestFitness(){
    bestFit = fitness[0];
    besti = 0;

    for (i=1; i<10; i++){
        if (fitness[i]>bestFit){
            bestFit = fitness[i];
            besti = i;
        }
    }
}

//função fitness avalia o quão bom cada individuo da população é.
//como queremos o máximo da função ele avalia o valor da função nos pontos gerados
function evaluateFitness(){
   var x = 0.0;
   var y = 0.0;

   var input = inputText.value

   input = input.replace(/(x\^\d+(.\d+)?)/g,'($1)').replace(/(y\^\d+(.\d+)?)/g,'($1)');

   for (i=0; i<10; i++){
        x=xArray[i];
        y=yArray[i];

        fitness[i] = execJison(replaceVars(input, x, y));
        //console.log(fitness[i]);
    }
}

function replaceVars(input, x ,y) {
    return input.replace(/x(?!p)/g, x).replace(/y/g, y)
}

// usa o melhor indivíduo para gerar a próxima geração cruzando os genes dele com os demais.
// pega o melhor ponto e soma com cada um dos outros e divide por 2, tirando a média.
// quanto maior a mutação mais aleatório fica o filho
function crossOver(){
    for (i=0;i<10;i++){
        var auxX = 0;
        var auxY = 0;
        if (i==besti)
            continue;

        xArray[i] = (xArray[i] + xArray[besti])/ 2.0;
        yArray[i] = (yArray[i] + yArray[besti])/ 2.0;

        auxX = xArray[i];
        auxY = yArray[i];

        mutation = ((Math.random() * 2 - 1)*mutationRate);
        xArray[i] = xArray[i] + (mutation);
        mutation = ((Math.random() * 2 - 1)*mutationRate);
        yArray[i] = yArray[i] + (mutation);
        if(xArray[i] > rightBoundNumber) 
            xArray[i] = auxX;
        if(yArray[i] > rightBoundNumber) 
            yArray[i] = auxY;
        
    }
}

// função que mata o pior individuo e aleatoriamente cria um novo ponto,
// isso faz com que o algoritmo consiga sair de máximos globais e não fique preso em máximos locais
function naturalSelection(){
    worstFit = fitness[0];
    worsti = 0;
    for (i=0;i<3;i++){
        for (j=0;j<10;j++){
            if (fitness[j]<worstFit){
                worstFit = fitness[j];
                worsti = j;
            }
        }
        xArray[i] = (Math.random() * (rightBoundNumber - leftBoundNumber) + leftBoundNumber);
        yArray[i] = (Math.random() * (rightBoundNumber - leftBoundNumber) + leftBoundNumber);
    }
}

// função que calcula os pontos a serem plotados no grafico
function evaluateFunction(){
    var axisRange = rightBoundNumber - leftBoundNumber;
    var axisSpace = axisRange/50;
    var input = inputText.value
    input = input.replace(/(x\^\d+(.\d+)?)/g,'($1)').replace(/(y\^\d+(.\d+)?)/g,'($1)');

    for(i=0; i<50; i++){
        xSpace[i] = leftBoundNumber + i*axisSpace;
        ySpace[i] = leftBoundNumber + i*axisSpace;
    }

    for(i=0; i<50; i++){
        for(j=0; j<50; j++){
            z[i][j] = execJison(replaceVars(input, xSpace[j], ySpace[i]));
        }  
    }

    var data_z1 = {x: xSpace, y: ySpace, z: z, type: 'surface', showscale: true};
    Plotly.newPlot('plot-container', [data_z1]);
}

function plotMarker(){
    var data_z1 = {x: xSpace, y: ySpace, z: z, type: 'surface', showscale: true};
    console.log(xArray[besti] + " " + yArray[besti] + " " + bestFit)
    
    var data_z2 = {
        x: [xArray[besti]], 
        y: [yArray[besti]], 
        z: [bestFit],   
        mode: 'markers',
        marker: {
            size: 10,
            opacity: 1,
            color:  'rgb(73, 235, 52)',
        },
        type: 'scatter3d'
    };
    var data_z3 = {
        x: xArray, 
        y: yArray, 
        z: fitness,   
        mode: 'markers',
        marker: {
            size: 10,
            opacity: 1,
            color:  'rgb(52, 58, 235)',
        },
        type: 'scatter3d'
    };
    Plotly.newPlot('plot-container', [data_z1, data_z3, data_z2]);
}


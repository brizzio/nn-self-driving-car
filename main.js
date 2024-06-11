const carCanvas = document.getElementById("carCanvas")
const networkCanvas = document.getElementById("networkCanvas")
networkCanvas.width = 300

carCanvas.height = window.innerHeight;
carCanvas.width = 200;

const carCtx = carCanvas.getContext("2d")
const networkCtx = networkCanvas.getContext("2d")

const road = new Road(carCanvas.width/2, carCanvas.width*0.9)
const N =1000
const cars = generateCars(N)
let bestCar = cars[0]
if(localStorage.getItem("bestBrain")){
    for (let i = 0; i < cars.length; i++) {
        cars[i].brain=JSON.parse(
            localStorage.getItem("bestBrain")
        );
        if(i!=0){
            NeuralNetwork.mutate(cars[i].brain,0.4)
        }
        
    }
}

const traffic=[
    new Car(road.getLaneCenter(1),-100,30,50,"DUMMY",2),
    new Car(road.getLaneCenter(0),-300,30,50,"DUMMY",2),
    new Car(road.getLaneCenter(2),-300,30,50,"DUMMY",2),
    new Car(road.getLaneCenter(0),-500,30,50,"DUMMY",2),
    new Car(road.getLaneCenter(1),-500,30,50,"DUMMY",2),
    new Car(road.getLaneCenter(1),-700,30,50,"DUMMY",2),
    new Car(road.getLaneCenter(2),-700,30,50,"DUMMY",2),
    new Car(road.getLaneCenter(0),-900,30,50,"DUMMY",2)
];

animate()

function save(){
    localStorage.setItem("bestBrain",
        JSON.stringify(bestCar.brain)
    )
}

function discard(){
    localStorage.removeItem("bestBrain")
}

function generateCars(N){
    let cars=[]
    for (let i = 0; i < N; i++) {
        cars.push(new Car(road.getLaneCenter(1),100,30,50,"AI"))
    }
    return cars
}

function animate(time){
    for (let i = 0; i < traffic.length; i++) {
        traffic[i].update(road.borders, []);  
    }

    for (let i = 0; i < cars.length; i++) {
        cars[i].update(road.borders, traffic);
    }
    
    bestCar=cars.find(
        c=>c.y==Math.min(...cars.map(cc=>cc.y))
    );

    const maxY = Math.max(...cars.map(car => car.y));
    const index = cars.findIndex(car => car.y === maxY);

   /*  if (cars.length != 1 && index > -1) {
        cars.splice(index, 1);
    } */

    carCanvas.height = window.innerHeight;
    networkCanvas.height=window.innerHeight;

    carCtx.save()
    carCtx.translate(0, -cars[0].y + carCanvas.height * 0.7)
    road.draw(carCtx)
    for (let i = 0; i < traffic.length; i++) {
        traffic[i].draw(carCtx, "red");  
    }

    //draw Cars
    carCtx.globalAlpha=0.2;
    for (let i = 0; i < cars.length; i++) {
        cars[i].draw(carCtx, "blue");
    }
    carCtx.globalAlpha=1;

    //maximize alpha to the first car and draw sensors in it
    bestCar.draw(carCtx, "blue", true);

    networkCtx.lineDashOffset = -time/50
    Visualizer.drawNetwork(networkCtx, bestCar.brain)
    requestAnimationFrame(animate)
}

let fittedCar = {
    "levels": [
        {
            "inputs": [
                0.43618316520320255,
                0,
                0,
                0,
                0
            ],
            "outputs": [
                1,
                1,
                0,
                1,
                0,
                0
            ],
            "biases": [
                -0.46624027378306193,
                0.38938539084471324,
                -0.011743489304354676,
                -0.3854230534639363,
                0.3808739538509312,
                -0.04890541283874171
            ],
            "weights": [
                [
                    0.8613995426447825,
                    0.8933073279097656,
                    -0.34276383350542616,
                    0.7783511335397546,
                    -0.26438595944796095,
                    -0.16414622268160706
                ],
                [
                    0.23846403724836795,
                    0.7384636802498319,
                    -0.3306553161921628,
                    -0.6150139026010417,
                    -0.11767361676153554,
                    -0.9524936008829874
                ],
                [
                    -0.8875256846619219,
                    -0.08434403196934115,
                    0.5488194799334387,
                    -0.20685223624597038,
                    -0.6728912495144641,
                    -0.5164274110030012
                ],
                [
                    -0.5253612613451581,
                    -0.09226025167454921,
                    -0.40780567821268443,
                    0.7004852055859883,
                    0.6872442416631408,
                    -0.6501738702864359
                ],
                [
                    -0.09240351699954985,
                    -0.12601513489213767,
                    -0.45793357625097775,
                    -0.5586099449874422,
                    -0.516449152514403,
                    0.1800741130398258
                ]
            ]
        },
        {
            "inputs": [
                1,
                1,
                0,
                1,
                0,
                0
            ],
            "outputs": [
                1,
                0,
                1,
                0
            ],
            "biases": [
                0.03357443887963439,
                0.3228456955833347,
                -0.3344318298989012,
                -0.34872939017795834
            ],
            "weights": [
                [
                    0.7331200597717826,
                    0.36256615954136295,
                    -0.9917446498846698,
                    -0.00009445789823470108
                ],
                [
                    0.6267365652992889,
                    -0.1676674435819816,
                    0.5374697432659361,
                    -0.29905629904983
                ],
                [
                    0.8774207655672992,
                    -0.49169137244549965,
                    -0.2639470254882723,
                    -0.5403067712266001
                ],
                [
                    0.11913512262302417,
                    0.07819992296124934,
                    0.5930265922431279,
                    -0.9586955861762809
                ],
                [
                    0.40907680521915335,
                    -0.6229630696209107,
                    0.4369044787677234,
                    0.6650458151078769
                ],
                [
                    0.5436724790906005,
                    -0.029877084672032428,
                    0.4264941356848806,
                    -0.5286116684520956
                ]
            ]
        }
    ]
}
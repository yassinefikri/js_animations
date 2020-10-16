/*-----------------------------------------------------------------------------|
|                     WindTurbines Background Animation                        |
|                           Author : Yassine Fikri                             |
|               MIT license: http://opensource.org/licenses/MIT                |
|          More Works : https://github.com/yassinefikri/js_animations          |
------------------------------------------------------------------------------*/

var values= {
    grass_lng: 5,
    windTurbine_length: 250,
    windTurbine_Speed: 1,
    bgcolor: "linear-gradient(180deg, rgba(0,0,50,1) 0%, rgba(0,100,250,1) 100%)",
    g: 0,
    g2: 100,
    incg: 1,
    dirg: 1,
    sposx: [],
    sposy: [],
    nstars: 20,
    timeSpeed: 1
};
var guival={
    Grass_Length: 5,
    WindTurbine_Speed: 1,
    Stars_Count: 20,
    Time_Speed: 1
};
var ww= 0; 
var wh= 0;

//Setting Canvas Height & Width
function size(){
    wh=canvas.offsetHeight;
    ww=canvas.offsetWidth;
    canvas.height=wh;
    canvas.width=ww;
}

var canvas= document.querySelector("canvas");
canvas.style.width="100%";
canvas.style.height="100%";
canvas.style.background=values.bgcolor;
size();
var c= canvas.getContext("2d");

for(var i=0;i<values.nstars;i++){
    values.sposx.push(parseInt(Math.random()*ww));
    values.sposy.push(parseInt(Math.random()*wh/3));
}

values.windTurbine_length= Math.min(2*wh/5,300);
countWindTurbines= parseInt(ww/(values.windTurbine_length*4/3));

function drawPay(){
    c.beginPath();
    //c.fillStyle="#003f00";
    c.fillStyle="rgba(0,"+(20+values.g/2)+",0,1)";
    c.fillRect(0,7*wh/8,ww,wh);
    if(values.g2<100){
        for(var i=0;i<values.nstars;i++){
            c.beginPath();
            c.ellipse(values.sposx[i],values.sposy[i],(100-values.g2)/100,(100-values.g2)/100,0,0,Math.PI*2,true);
            c.fillStyle="white";
            c.fill();
        }
    }
}

function Grass(){
    this.init= function(posx,posy){
        this.posx=posx;
        this.posy=posy;
        this.opa=Math.random()*100;
        this.dx=Math.random()*6 -3;
        this.dir=1;
    }
    this.draw= function(){
        c.beginPath();
        c.moveTo(this.posx,this.posy);
        c.lineTo(this.posx+this.dx,this.posy-values.grass_lng);
        //c.strokeStyle="#003f00";
        c.strokeStyle="rgba(0,"+(20+values.g/2)+",0,1)";
        c.stroke();
    }
    this.update= function(){
        if(this.dir==1){
            this.dx+=0.2;
        }
        else{
            this.dx-=0.2;
        }
        if(this.dx>=3){
            this.dir=0;
        }
        if(this.dx<=-3){
            this.dir=1;
        }
        this.draw();
    }
}

function WindTurbine(){
    this.init= function(posx,lng){
        this.posx= posx;
        this.ang=parseInt(Math.random()*360);
        this.lng=lng;
    }
    this.draw= function(){
        c.beginPath();
        //c.fillStyle="#e6e6e6";
        c.fillStyle= "rgba("+(150+values.g)+","+(150+values.g)+","+(150+values.g)+",1)";
        c.fillRect(this.posx,7*wh/8-this.lng,5,this.lng);
        c.beginPath();
        c.ellipse(this.posx+2.5,7*wh/8-this.lng,6,6,0,0,2*Math.PI,true);
        c.fill();
        temp_ang=this.ang;
        for(var i=0;i<3;i++){
            c.beginPath();
            c.moveTo(this.posx+2.5+Math.cos((temp_ang-37.5)*(Math.PI/180))*6,7*wh/8-this.lng+Math.sin((temp_ang-37.5)*(Math.PI/180))*6);
            c.lineTo(this.posx+2.5+Math.cos((temp_ang+37.5)*(Math.PI/180))*6,7*wh/8-this.lng+Math.sin((temp_ang+37.5)*(Math.PI/180))*6);
            c.lineTo(this.posx+2.5+Math.cos(temp_ang*(Math.PI/180))*this.lng/2,7*wh/8-this.lng+Math.sin(temp_ang*(Math.PI/180))*this.lng/2);
            c.fill();
            temp_ang+=120;
        }
    }
    this.update= function(){
        this.draw();
        this.ang-=values.windTurbine_Speed;
        if(this.ang==-1){
            this.ang=359;
        }
    }
}

function changeBackground(){
    values.bgcolor="linear-gradient(180deg, rgba(0,"+values.g+","+(50+2*values.g)+",1) 0%, rgba(0,"+values.g2+","+(50+2*values.g2)+",1) 100%)";
    canvas.style.background= values.bgcolor;
    if(values.incg==1){
        values.g+=values.timeSpeed/4;
    }
    else if(values.incg==2){
        values.g-=values.timeSpeed/4;
    }
    else if(values.incg==3){
        values.g2-=values.timeSpeed/4;
    }
    else{
        values.g2+=values.timeSpeed/4;
    }
    if(parseInt(values.g)>=100){
        values.incg=2;
        values.dirg=0;
    }
    if(parseInt(values.g2)<=0){
        values.incg=0;
        values.dirg=1;
    }
    if(parseInt(values.g)<=0 || parseInt(values.g2)>=100){
        if(values.dirg==1){
            values.incg=1;
        }
        else{
            values.incg=3;
        }
    }
}

windTurbinesArr=[];
for(var i=0;i<countWindTurbines;i++){
    windTurbinesArr.push(new WindTurbine());
    windTurbinesArr[i].init((i+1)*ww/(countWindTurbines+1),values.windTurbine_length);
}
grassArr= [];
var grassCounter=0;
for(var i=0;i<ww;i++){
    grassArr.push(new Grass());
    grassArr[grassCounter].init(i,7*wh/8);
    grassCounter++;
    grassArr.push(new Grass());
    grassArr[grassCounter].init(i,7*wh/8+values.grass_lng/2);
    grassCounter++;
}
stopp=false;
function animate(){
    if(stopp) return;
    requestAnimationFrame(animate);
    c.clearRect(0,0,ww,wh);
    drawPay();
    for(var i=0;i<countWindTurbines;i++){
        windTurbinesArr[i].update();
    }
    for(var i=0;i<grassCounter;i++){
        grassArr[i].update();
    }
    changeBackground();
}
animate();

function initCan(){
    drawPay();
    values.sposx=[];
    values.sposy=[];
    for(var i=0;i<values.nstars;i++){
        values.sposx.push(parseInt(Math.random()*ww));
        values.sposy.push(parseInt(Math.random()*wh/3));
    }
    values.windTurbine_length= Math.min(2*wh/5,300);
    countWindTurbines= parseInt(ww/(values.windTurbine_length*4/3));
    windTurbinesArr=[];
    for(var i=0;i<countWindTurbines;i++){
        windTurbinesArr.push(new WindTurbine());
        windTurbinesArr[i].init((i+1)*ww/(countWindTurbines+1),values.windTurbine_length);
    }
    grassArr= [];
    grassCounter=0;
    for(var i=0;i<ww;i++){
        grassArr.push(new Grass());
        grassArr[grassCounter].init(i,7*wh/8);
        grassCounter++;
        grassArr.push(new Grass());
        grassArr[grassCounter].init(i,7*wh/8+values.grass_lng/2);
        grassCounter++;
    }
}

//Resizing the Canvas when Resizing Window
window.onresize = resize;
function resize() {
    size();
    initCan();
}

window.onload= function(){
    var gui= new dat.GUI();
    gui.add(guival,'Grass_Length',1,10,1).onChange(setValue);
    gui.add(guival,'WindTurbine_Speed',-5,5,1).onChange(setValue);
    gui.add(guival,'Stars_Count',5,50,1).onChange(setValue);
    gui.add(guival,'Time_Speed',1,5,1).onChange(setValue);
}
function setValue(){
    stopp= true;
    values.grass_lng= guival.Grass_Length;
    values.windTurbine_Speed= guival.WindTurbine_Speed;
    values.nstars= guival.Stars_Count;
    values.timeSpeed= guival.Time_Speed;
    initCan();
    stopp= false;
}
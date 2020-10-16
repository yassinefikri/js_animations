/*-----------------------------------------------------------------------------|
|                          Snow Background Animation                           |
|                           Author : Yassine Fikri                             |
|               MIT license: http://opensource.org/licenses/MIT                |
|          More Works : https://github.com/yassinefikri/js_animations          |
------------------------------------------------------------------------------*/


var bgcolor="linear-gradient(180deg, rgba(58,147,207,1) 0%, rgba(199,235,255,1) 100%)";
var m1color="#4589ca";
var m2color="#82bde5";
var whiteposx=[];
var whiteposy=[];
var wwhiteposx=[];
var wwhiteposy=[];
var ones=[-1,1];
var m1posx=[];
var m1posy=[];
var m2posx=[];
var m2posy=[];
var stopp=false;
var values={
    nsnow: 1000,
    snowspeed: 2
};
var guival={
    Snow_Particules: 1000,
    Snow_Speed: 2
};

var canvas= document.querySelector("canvas");
canvas.style.background=bgcolor;
canvas.style.width="100%";
canvas.style.height="100%";
size();
var c= canvas.getContext("2d");

//Setting Canvas Height & Width
function size(){
    ww= canvas.offsetWidth; 
    wh= canvas.offsetHeight;
    canvas.height=wh;
    canvas.width=ww;
    mh=Math.min(wh/3,500);
    mh2=0.85*mh;
    nm=ww/25;
}

function inittab1(){
    whiteposx=[];
    whiteposy=[];
    whiteposx.push(0);
    whiteposy.push(7*wh/8);
    for(var i=1;i<8;i++){
        if(i%2==1) whiteposx.push(whiteposx[i-1]+((1+Math.random())*ww/16));
        else whiteposx.push(i*ww/8);
        whiteposy.push(whiteposy[i-1]+Math.random()*wh*ones[parseInt(Math.random()*2)]/100);
    }
    whiteposx[7]=ww;
}

function inittabw(){
    wwhiteposx=[];
    wwhiteposy=[];
    wwhiteposx.push(0);
    wwhiteposy.push(15*wh/16);
    for(var i=1;i<8;i++){
        if(i%2==1) wwhiteposx.push(wwhiteposx[i-1]+((1+Math.random())*ww/16));
        else wwhiteposx.push(i*ww/8);
        wwhiteposy.push(wwhiteposy[i-1]+Math.random()*wh*ones[parseInt(Math.random()*2)]/100);
    }
    wwhiteposx[7]=ww;
}

function initmonts(){
    m1posx=[];
    m1posy=[];
    m2posx=[];
    m2posy=[];
    for(var i=0;i<nm;i++){
        m1posx.push(Math.random()*ww);
        m2posx.push(Math.random()*ww);
        m1posy.push(parseInt(wh-(0.8+Math.random()*0.2)*mh2));
        m2posy.push(parseInt(wh-(0.8+Math.random()*0.2)*mh));
    }
}

//Draw Mountains
function drawmonts(){
    drawmont(m2color,m2posx,m2posy,10,50);
    drawmont(m1color,m1posx,m1posy,15,50);
}
function drawmont(col,tabx,taby,p1,p2){
    c.fillStyle=col;
    for(var i=0;i<nm;i++){
        c.beginPath();
        c.moveTo(tabx[i],taby[i]);
        c.lineTo(tabx[i]-ww/p1,7*wh/8-wh/p2);
        c.lineTo(tabx[i]+ww/p1,7*wh/8-wh/p2);
        c.lineTo(tabx[i],taby[i]);
        c.closePath();
        c.fill();
    }
}

// Draw Snow Grounds
function drawgrounds(){
    c.fillStyle="#c9e5ff";
    c.fillRect(0,7*wh/8-wh/50,ww,wh);

    c.beginPath();
    c.fillStyle="#e0f1ff";
    c.moveTo(whiteposx[0],whiteposy[0]);
    for(var i=1;i<8;i++){
        c.lineTo(whiteposx[i],whiteposy[i]);
    }
    c.lineTo(ww,wh);
    c.lineTo(0,wh);
    c.lineTo(whiteposx[0],whiteposy[0]);
    c.closePath();
    c.fill();

    c.beginPath();
    c.fillStyle="#ffffff";
    c.moveTo(wwhiteposx[0],wwhiteposy[0]);
    for(var i=1;i<8;i++){
        c.lineTo(wwhiteposx[i],wwhiteposy[i]);
    }
    c.lineTo(ww,wh);
    c.lineTo(0,wh);
    c.lineTo(wwhiteposx[0],wwhiteposy[0]);
    c.closePath();
    c.fill();
}

function drawPay(){
    drawmonts();
    drawgrounds();
}

function Snow(){
    this.init=function(col,limy,ray){
        this.posx=Math.random()*ww;
        this.posy=Math.random()*limy;
        this.limy=limy;
        this.col=col;
        this.ray=ray
    }
    this.draw=function(){
        c.fillStyle=this.col;
        c.beginPath();
        c.ellipse(this.posx,this.posy,this.ray,this.ray,0,0,Math.PI*2,false);
        c.fill();
        c.closePath();
    }
    this.update=function(){
        if(this.posy-this.ray>=this.limy) {
            this.reset();
            return ;
        }
        this.posy+=values.snowspeed;
        this.draw();
    }
    this.reset=function(){
        this.posx=Math.random()*ww;
        this.posy=0;
    }
}

function initCan(){
    inittabw();
    inittab1();
    initmonts();
    initsnow();
}

var snowarr = [];
initsnow(snowarr);
function initsnow(){
    snowarr= [];
    for(var i=0;i<values.nsnow;i++){
        snowarr.push(new Snow());
        if(i<values.nsnow/3) snowarr[i].init("#c9e5ff",7*wh/8-wh/50,1);
        else if(i<2*values.nsnow/3) snowarr[i].init("#e0f1ff",7*wh/8,1.5);
        else snowarr[i].init("#ffffff",wh,2);
    }
}

function animate(){
    if(stopp) return;
    requestAnimationFrame(animate);
    c.clearRect(0,0,ww,wh);
    drawPay();
    for(var i=0;i<values.nsnow;i++){
        snowarr[i].update();
    }
}
initCan();
animate();

//Resizing the Canvas when Resizing Window
window.onresize = resize;
function resize() {
    size();
    initCan();
}

window.onload= function(){
    var gui= new dat.GUI();
    gui.add(guival,'Snow_Particules',100,5000,100).onChange(setValue);
    gui.add(guival,'Snow_Speed',1,4,0.5).onChange(setValue);
}
function setValue(){
    stopp= true;
    values.nsnow= guival.Snow_Particules;
    values.snowspeed= guival.Snow_Speed;
    initCan();
    stopp= false;
}
/*-----------------------------------------------------------------------------|
|                     WindTurbines Background Animation                        |
|                           Author : Yassine Fikri                             |
|               MIT license: http://opensource.org/licenses/MIT                |
|          More Works : https://github.com/yassinefikri/js_animations          |
------------------------------------------------------------------------------*/

var grass_lng=5;
var windTurbine_length= 250;
var windTurbine_Speed= 1;
var bgcolor="linear-gradient(180deg, rgba(0,0,50,1) 0%, rgba(0,100,250,1) 100%)";
var g=0;
var g2=100;
var incg=1;
var dirg=1;
var sposx=[];
var sposy=[];
var nstars=20;
var timeSpeed=1;

function size(){
    cw= canvas.offsetWidth; 
    ch= canvas.offsetHeight;
    canvas.height=ch;
    canvas.width=cw;
}

//Setting Canvas Height & Width
var canvas= document.querySelector("canvas");
canvas.style.width="100%";
canvas.style.height="100%";
canvas.style.background=bgcolor;
size();
var c= canvas.getContext("2d");

for(var i=0;i<nstars;i++){
    sposx.push(parseInt(Math.random()*cw));
    sposy.push(parseInt(Math.random()*ch/3));
}

windTurbine_length= Math.min(2*ch/5,300);
countWindTurbines= parseInt(cw/(windTurbine_length*4/3));

function drawPay(){
    c.beginPath();
    c.fillStyle="rgba(0,"+(20+g/2)+",0,1)";
    c.fillRect(0,7*ch/8,cw,ch);
    if(g2<100){
        for(var i=0;i<nstars;i++){
            c.beginPath();
            c.ellipse(sposx[i],sposy[i],(100-g2)/100,(100-g2)/100,0,0,Math.PI*2,true);
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
        c.lineTo(this.posx+this.dx,this.posy-grass_lng);
        c.strokeStyle="rgba(0,"+(20+g/2)+",0,1)";
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
        c.fillStyle= "rgba("+(150+g)+","+(150+g)+","+(150+g)+",1)";
        c.fillRect(this.posx,7*ch/8-this.lng,5,this.lng);
        c.beginPath();
        c.ellipse(this.posx+2.5,7*ch/8-this.lng,6,6,0,0,2*Math.PI,true);
        c.fill();
        temp_ang=this.ang;
        for(var i=0;i<3;i++){
            c.beginPath();
            c.moveTo(this.posx+2.5+Math.cos((temp_ang-37.5)*(Math.PI/180))*6,7*ch/8-this.lng+Math.sin((temp_ang-37.5)*(Math.PI/180))*6);
            c.lineTo(this.posx+2.5+Math.cos((temp_ang+37.5)*(Math.PI/180))*6,7*ch/8-this.lng+Math.sin((temp_ang+37.5)*(Math.PI/180))*6);
            c.lineTo(this.posx+2.5+Math.cos(temp_ang*(Math.PI/180))*this.lng/2,7*ch/8-this.lng+Math.sin(temp_ang*(Math.PI/180))*this.lng/2);
            c.fill();
            temp_ang+=120;
        }
    }
    this.update= function(){
        this.draw();
        this.ang-=windTurbine_Speed;
        if(this.ang==-1){
            this.ang=359;
        }
    }
}

function changeBackground(){
    bgcolor="linear-gradient(180deg, rgba(0,"+g+","+(50+2*g)+",1) 0%, rgba(0,"+g2+","+(50+2*g2)+",1) 100%)";
    canvas.style.background= bgcolor;
    if(incg==1){
        g+=timeSpeed/4;
    }
    else if(incg==2){
        g-=timeSpeed/4;
    }
    else if(incg==3){
        g2-=timeSpeed/4;
    }
    else{
        g2+=timeSpeed/4;
    }
    if(parseInt(g)>=100){
        incg=2;
        dirg=0;
    }
    if(parseInt(g2)<=0){
        incg=0;
        dirg=1;
    }
    if(parseInt(g)<=0 || parseInt(g2)>=100){
        if(dirg==1){
            incg=1;
        }
        else{
            incg=3;
        }
    }
}

windTurbinesArr=[];
for(var i=0;i<countWindTurbines;i++){
    windTurbinesArr.push(new WindTurbine());
    windTurbinesArr[i].init((i+1)*cw/(countWindTurbines+1),windTurbine_length);
}
grassArr= [];
var grassCounter=0;
for(var i=0;i<cw;i++){
    grassArr.push(new Grass());
    grassArr[grassCounter].init(i,7*ch/8);
    grassCounter++;
    grassArr.push(new Grass());
    grassArr[grassCounter].init(i,7*ch/8+grass_lng/2);
    grassCounter++;
}

function animate(){
    requestAnimationFrame(animate);
    c.clearRect(0,0,cw,ch);
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
    sposx=[];
    sposy=[];
    for(var i=0;i<nstars;i++){
        sposx.push(parseInt(Math.random()*cw));
        sposy.push(parseInt(Math.random()*ch/3));
    }
    windTurbine_length= Math.min(2*ch/5,300);
    countWindTurbines= parseInt(cw/(windTurbine_length*4/3));
    windTurbinesArr=[];
    for(var i=0;i<countWindTurbines;i++){
        windTurbinesArr.push(new WindTurbine());
        windTurbinesArr[i].init((i+1)*cw/(countWindTurbines+1),windTurbine_length);
    }
    grassArr= [];
    grassCounter=0;
    for(var i=0;i<cw;i++){
        grassArr.push(new Grass());
        grassArr[grassCounter].init(i,7*ch/8);
        grassCounter++;
        grassArr.push(new Grass());
        grassArr[grassCounter].init(i,7*ch/8+grass_lng/2);
        grassCounter++;
    }
}

//Resizing the Canvas when Resizing Window
window.onresize = resize;
function resize() {
    size();
    initCan();
}
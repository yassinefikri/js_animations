/*-----------------------------------------------------------------------------|
|                       Fireworks Background Animation                         |
|                           Author : Yassine Fikri                             |
|               MIT license: http://opensource.org/licenses/MIT                |
|          More Works : https://github.com/yassinefikri/js_animations          |
------------------------------------------------------------------------------*/


var bgcolor = "linear-gradient(180deg, rgba(0,0,0,1) 24%, rgba(33,30,48,1) 73%)"; //Background
var nrain= 750; //Number of Rain Drops

function size(){
    cw= document.body.clientWidth;
    ch= window.innerHeight;
    canvas.height=ch;
    canvas.width=cw;
}
var canvas = document.querySelector("canvas");
var c= canvas.getContext("2d");
canvas.style.backgroundImage= bgcolor;
size();

function Rain(){
    this.init= function(posx,posy){
        this.posx=posx;
        this.posy=posy;
        this.opa= Math.random()*0.5;
        this.lng= Math.random()*2+20;
        this.dx= Math.random()*cw/1920;
        this.dy=(ch/50)*(0.75+Math.random()*0.25);
        this.r=1;
        this.limy=ch*(0.75+Math.random()*0.2);
        this.limr=3*(1+Math.random());
    }
    this.draw= function(){
        c.beginPath();
        c.fillStyle="rgba(255,255,255,"+this.opa+")";
        c.rect(this.posx,this.posy,1,this.lng);
        c.fill();
    }
    this.update= function(){
        if(this.posy+this.lng>=this.limy) {
            this.boom();
            this.r+=0.5;
        }
        else{
            this.posx+=this.dx;
            this.posy+=this.dy;
            this.draw();
        }
        if(this.r>this.limr){
            this.reset(Math.random()*cw,0);
        }
    }
    this.reset= function(posx,posy){
        this.posx=posx;
        this.posy=posy;
        this.r=1;
    }
    this.boom=function(){
        c.beginPath();
        c.ellipse(this.posx, this.posy+this.lng, this.r, 2*this.r/3,0, 0, Math.PI*2);
        c.strokeStyle="rgba(255,255,255,"+this.opa+")";
        c.stroke();
    }
}

//Creating the Rain
var rains = new Array(nrain);
for(var i=0;i<nrain;i++){
    rains[i]= new Rain();
    rains[i].init(Math.random()*cw,Math.random()*ch);
}

function animate(){
    requestAnimationFrame(animate);
    c.clearRect(0,0,cw,ch);
    for(var i=0;i<nrain;i++){
        rains[i].update();
    }
}
animate();

window.onresize= resize;
function resize(){
    size();
    for(var i=0;i<nrain;i++) {
        rains[i].init(Math.random()*cw,Math.random()*ch);
    }
}
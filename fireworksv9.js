/*-----------------------------------------------------------------------------|
|                       Fireworks Background Animation                         |
|                           Author : Yassine Fikri                             |
|               MIT license: http://opensource.org/licenses/MIT                |
|          More Works : https://github.com/yassinefikri/js_animations          |
------------------------------------------------------------------------------*/

// Set your Favorite Values
var values= {
npar : 50, //Set Number of Particules per Firework default[50]
parsize : 2, //Set Size of Particules default[2]
nmis : 4, //Set Number of Fireworks default[4]
missize : 3, //Set Size of Fireworks default[3]
mislen : 1, //Firework Height default[1]
multicolmis : false, //Mono Color Firework [false] | Multi Color Firework [true]
gravity : 0.01, //Gravity default[0.01]
bgcolor : "linear-gradient(180deg, rgba(0,0,0,1) 24%, rgba(10,1,17,1) 47%, rgba(2,9,32,1) 73%)"
};

var miss;
//Set Random Colors to Fireworks
function getRandomColor(){
    var values='0123456789ABCDEF';
    var color='#';
    for (var i=0;i<6;i++){
        color+=values[Math.floor(Math.random()*16)];
    }
    return color;
}

//Set Canvas Height & Width
var canvas = document.querySelector("canvas");
var wh=window.innerHeight;
var ww=document.body.clientWidth;
canvas.width= ww;
canvas.height= wh;
canvas.style.backgroundImage= values.bgcolor;
var c= canvas.getContext("2d");

//Particules
function partc(){
    //Initialisation
    this.init= function(posx,posy,col){
        this.posx=posx;
        this.posy=posy;
        this.ray= values.parsize;
        this.col=col;
        this.dx=(Math.random()-0.5)*Math.min(wh,ww)/70;
        this.dy=(Math.random()-0.5)*Math.min(wh,ww)/70;
        this.grav=values.gravity;
    }
    this.draw= function(){
        if (values.multicolmis== true) c.strokeStyle=getRandomColor();
        else c.strokeStyle=this.col;
        c.lineWidth=this.ray;
        c.beginPath();
        c.moveTo(this.posx,this.posy);
        c.lineTo(this.lastposx,this.lastposy);
        c.stroke();
    }
    this.update= function(){
        if(this.ray==0) this.rdy=1;
        else{
            this.lastposx=this.posx;
            this.lastposy=this.posy;
            this.posx+=this.dx;
            this.posy+=this.dy;
            this.dy+=this.grav;
            this.grav+=0.008*wh/1080;
            if(this.ray>0.1) this.ray-=0.015*values.parsize;
            this.draw();
        }
    }
}

// Fireworks
function mis(color){
    //Initialisation of Particules for A Firework 
    this.partcs= [];
    for(var i=0;i<values.npar;i++) {
        this.partcs.push(new partc());
        this.partcs[i].init(color);
    }
    //Initialisation Firework
    this.init= function(){
        this.col="#ffffff";
        this.posx= Math.random()*ww/2 + ww/4;
        this.posy= wh-5;
        this.lastposx=this.posx;
        this.lastposy=this.posy;
        this.dx= (Math.random()-0.5)*ww/800;
        this.dy= wh/200;
        this.maxy= Math.random()*wh/2+wh/4;
        this.boom=0;
        this.rdm=Math.random();
        if(this.rdm>0.573 && this.rdm<0.58) this.active=1;
        else this.active=0;
    }
    this.draw= function(){
        if(this.active==1){
            c.beginPath();
            c.lineWidth=values.missize;
            c.strokeStyle="white";
            c.moveTo(this.posx,this.posy);
            c.lineTo(this.lastposx,this.lastposy+values.mislen*100/wh);
            c.stroke();
        }
    }
    this.update= function(){
        if(this.active==1){
            if(this.posy>this.maxy && this.boom==0) {
                this.lastposx=this.posx;
                this.lastposy=this.posy+this.dy;
                this.posx+=this.dx;
                this.posy-=this.dy;
                this.draw();
            }
            else{
                if(this.boom==0){
                    this.launchpartc();
                    this.boom=1;
                    this.rdy=0;
                }
                else{
                    this.checkrdy();
                    if(this.rdy==1){
                        this.init();
                    } 
                }
            }
        }
        if(this.active==0) this.init();
        if(this.active==1){
            this.checkrdy();
        }
    }
    //Check if Particules ready
    this.checkrdy= function(){
        this.rdy=1;
        for(var i=0;i<values.npar;i++){
            if(this.partcs[i].rdy==0){
                this.rdy=0;
                break;
            }
        }
    }
    //Launch Particules
    this.launchpartc= function(){
        this.col=getRandomColor();
        for(var i=0;i<values.npar;i++){
            this.partcs[i].init(this.posx,this.posy,this.col);
        }
    }
}

//Creating Fireworks
function createFireworks(){
    miss= [];
    for(var i=0;i<values.nmis;i++){
        miss.push(new mis(getRandomColor()));
        miss[i].init();
    }
}
createFireworks();


function animate(){
    requestAnimationFrame(animate);
    c.clearRect(0,0,ww,wh);
    for(var i=0;i<values.nmis;i++){
        miss[i].update();
        for(var j=0;j<values.npar;j++) miss[i].partcs[j].update();
    }
}
animate();

//Canvas Resize on Winwdow Resize
window.onresize = resize;
function resize() {
    ww= document.body.clientWidth; 
    wh= window.innerHeight;
    canvas.height=wh;
    canvas.width=ww;
    createFireworks();
}
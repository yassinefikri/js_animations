/*-----------------------------------------------------------------------------|
|                       Fireworks Background Animation                         |
|                           Author : Yassine Fikri                             |
|               MIT license: http://opensource.org/licenses/MIT                |
|          More Works : https://github.com/yassinefikri/js_animations          |
------------------------------------------------------------------------------*/

//-----------------------------------------------------------------------------------------------------------------------\\
//Set Your Values
var npar = 50;  //Set Number of Particules per Firework default[50]
var parsize = 2;  //Set Size of Particules default[2]
var nmis = 4;  //Set Number of Fireworks default[4]
var missize = 3;  //Set Size of Fireworks default[3]
var mislen = 0.01;  //Firework Height default[0.01]
var multicolmis = 0;  //Mono Color Firework [0] | Multi Color Firework [1]
var gravity = 0.01  //Gravity default[0.01]
var bgcolor = "linear-gradient(180deg, rgba(0,0,0,1) 24%, rgba(10,1,17,1) 47%, rgba(2,9,32,1) 73%)"; //Set The Background
//-----------------------------------------------------------------------------------------------------------------------\\

//Set Random Colors to Fireworks
function getRandomColor() {
    var values='0123456789ABCDEF';
    var color='#';
    for (var i=0;i<6;i++) {
        color+=values[Math.floor(Math.random()*16)];
    }
    return color;
}
var colors= new Array(nmis); 
for(var i=0;i<nmis;i++) colors[i]= getRandomColor(); 

//Set Canvas Height & Width
function size(){
    cw= window.innerWidth;
    ch= window.innerHeight;
    canvas.height=ch;
    canvas.width=cw;
}
var canvas = document.querySelector("canvas");
canvas.style.backgroundImage= bgcolor;
var c= canvas.getContext("2d");
size();

//Particules
function partc(){
    //Initialisation
    this.init= function(posx,posy,col){
        this.posx=posx;
        this.posy=posy;
        this.ray= parsize;
        this.col=col;
        this.dx=(Math.random()-0.5)*Math.min(ch,cw)/70;
        this.dy=(Math.random()-0.5)*Math.min(ch,cw)/70;
        this.grav=gravity;
    }
    this.draw= function(){
        if (multicolmis== 1) c.strokeStyle=getRandomColor();
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
            this.grav+=0.008*ch/1080;
            if(this.ray>0.1) this.ray-=0.015*parsize;
            this.draw();
        }
    }
}

// Fireworks
function mis(col,click){
    this.click=click;
    //Initialisation of Particules for A Firework 
    this.partcs = new Array(npar);
    for(var i=0;i<npar;i++) {
        this.partcs[i]= new partc();
        this.partcs[i].init(col);
    }
    //Initialisation Firework
    this.init= function(){
        this.col="#ffffff";
        this.posx= Math.random()*cw/2 + cw/4;
        this.posy= ch-5;
        this.lastposx=this.posx;
        this.lastposy=this.posy;
        this.dx= (Math.random()-0.5)*cw/800;
        this.dy= ch/200;
        this.maxy= Math.random()*ch/2+ch/4;
        this.boom=0;
        this.rdm=Math.random();
        if(this.rdm>0.573 && this.rdm<0.58 && this.click==0) this.active=1;
        else this.active=0;
    }
    this.initclick = function(click){this.click=click;}
    this.draw= function(){
        if(this.active==1){
            c.beginPath();
            c.lineWidth=missize;
            c.strokeStyle="white";
            c.moveTo(this.posx,this.posy);
            c.lineTo(this.lastposx,this.lastposy+mislen*this.dy);
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
                    if(this.rdy==1 && this.click==0){
                        this.init();
                    } 
                }
            }
        }
        if(this.active==0 && this.click==0) this.init();
        if(this.click==1 && this.active==1){
            this.checkrdy();
            if(this.rdy==1) this.active=0;
        }
    }
    //Check if Particules ready
    this.checkrdy= function(){
        this.rdy=1;
        for(var i=0;i<npar;i++){
            if(this.partcs[i].rdy==0){
                this.rdy=0;
                break;
            }
        }
    }
    //Launch Particules
    this.launchpartc= function(){
        this.col=getRandomColor();
        for(var i=0;i<npar;i++){
            this.partcs[i].init(this.posx,this.posy,this.col);
        }
    }
}


//Creating Fireworks
var miss= new Array(nmis);
for(var i=0;i<nmis;i++){
    miss[i]=new mis(colors[i],0);
    miss[i].init();
}

function animate(){
    requestAnimationFrame(animate);
    c.clearRect(0,0,cw,ch);
    for(var i=0;i<nmis;i++){
        miss[i].update();
        for(var j=0;j<npar;j++) miss[i].partcs[j].update();
    }
}
animate();

//Canvas Resize on Winwdow Resize
window.onresize = resize;
function resize() {
    size();
    for(var i=0;i<nmis;i++) {
        miss[i].init();
    }
}
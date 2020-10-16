/*-----------------------------------------------------------------------------|
|                       Fireworks Background Animation                         |
|                           Author : Yassine Fikri                             |
|               MIT license: http://opensource.org/licenses/MIT                |
|          More Works : https://github.com/yassinefikri/js_animations          |
------------------------------------------------------------------------------*/

var values= {
npar : 50,
parsize : 2,
nmis : 4,
missize : 3,
mislen : 1,
multicolmis : false,
gravity : 0.01,
bgcolor : "linear-gradient(180deg, rgba(0,0,0,1) 24%, rgba(10,1,17,1) 47%, rgba(2,9,32,1) 73%)"
};
var guival={
    Particules_Per_Missile : 50,
    Pärticules_Size : 2,
    Max_Missiles : 4,
    Missile_Size : 3,
    Missile_Length : 1, 
    Multi_Color_Missile : false
};
var miss;
var active = true;
//Set Random Colors to Fireworks
function getRandomColor(){
    var values='0123456789ABCDEF';
    var color='#';
    for (var i=0;i<6;i++){
        color+=values[Math.floor(Math.random()*16)];
    }
    return color;
}

var wh=0;
var ww=0;
function size(){
    ww= canvas.offsetWidth; 
    wh= canvas.offsetHeight;
    canvas.height=wh;
    canvas.width=ww;
}
//Set Canvas Height & Width
var canvas = document.querySelector("canvas");
canvas.style.width="100%";
canvas.style.height="100%";
canvas.style.backgroundImage= values.bgcolor;
size();
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
    if(!active) return;
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
    size();
    createFireworks();
}
window.onload= function(){
    var gui= new dat.GUI();
    var fold1= gui.addFolder('Firework Missile');
    fold1.open();
    var fold2= gui.addFolder('Firework Particules');
    fold2.open();
    fold1.add(guival,'Multi_Color_Missile').onChange(setValue);
    fold1.add(guival,'Missile_Length',1,100).onChange(setValue);
    fold1.add(guival,'Missile_Size',2,4).onChange(setValue);
    fold1.add(guival,'Max_Missiles',1,20,1).onChange(setValue);
    fold2.add(guival,'Particules_Per_Missile',10,100,1).onChange(setValue);
    fold2.add(guival,'Pärticules_Size',1,4).onChange(setValue);
}
function setValue(){
    active= false;
    values.multicolmis= guival.Multi_Color_Missile;
    values.mislen= guival.Missile_Length;
    values.missize= guival.Missile_Size;
    values.nmis= guival.Max_Missiles;
    values.parsize= guival.Pärticules_Size;
    values.npar= guival.Particules_Per_Missile;
    createFireworks();
    active= true;
}
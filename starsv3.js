/*-----------------------------------------------------------------------------|
|                      Space Moving Background Animation                       |
|                           Author : Yassine Fikri                             |
|               MIT license: http://opensource.org/licenses/MIT                |
|          More Works : https://github.com/yassinefikri/js_animations          |
------------------------------------------------------------------------------*/

var nstar= 300; // Set the Number of Stars , default [300]
var backgroundcolor= "radial-gradient(#000000,#090c12)"; // Set Background Color default["radial-gradient(#000000,#090c12)"]
var starsz = 0.045 // Set stars size increase , default [0.045]


function size(){
    cw= document.body.clientWidth; 
    ch= window.innerHeight;
    canvas.height=ch;
    canvas.width=cw;
}
var canvas= document.querySelector("canvas");
canvas.style.backgroundImage= backgroundcolor;
size();
var c= canvas.getContext("2d");

function Star(){
    this.init= function(posx,posy){
        //Coordonnees
        this.posx= posx;
        this.posy= posy; 
        this.ray= 0; //Rayon
        this.opc= Math.random(); //Opacity
        this.dx= (this.posx-cw/2)/50;
        this.dy= (this.posy-ch/2)/50;
        this.dr=starsz;
        if(Math.abs(this.dx)<3 && Math.abs(this.dy)<3){
            if(this.dx<0){
                this.dx-=3;
            }
            else{
                this.dx+=3;
            }
            if(this.dy<0){
                this.dy-=3;
            }
            else{
                this.dy+=3;
            }
        }
    }
    this.draw= function(){
        c.beginPath();
        c.fillStyle="rgba(255,255,255,"+this.opc+")";
        c.rect(this.posx,this.posy,this.ray,this.ray);
        c.fill();
    }
    this.update= function(){
        this.posx+=this.dx;
        this.posy+=this.dy;
        if(this.ray>3) this.dr*=0.9;
        this.ray+=this.dr;
        this.draw();
        if(this.posx-this.ray>cw || this.posx+this.ray<0) this.reset();
        if(this.posy-this.ray>ch || this.posy+this.ray<0) this.reset();
    }
    this.reset= function(){
        this.posx=cw/2;
        this.posy=ch/2;
        this.ray=0;
        this.dr=starsz;
    }
}

//Creating the Stars
var stars = new Array(nstar);
for(var i=0;i<nstar;i++){
    stars[i]= new Star();
    stars[i].init(Math.random()*cw,Math.random()*ch);
}

function animate(){
    requestAnimationFrame(animate);
    c.clearRect(0,0,cw,ch);
    for(var i=0;i<nstar;i++){
        stars[i].update();
    }
}
animate();

//Resizing the Canvas when Resizing Window
window.onresize = resize;
function resize() {
    size();
    for(var i=0;i<nstar;i++) {
        stars[i].init(Math.random()*cw,Math.random()*ch);
    }
}
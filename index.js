console.log('Hello World!!');

// Cache the canvas from the index.html document
var canvas = document.getElementById('canvas');

canvas.width = canvas.scrollWidth;
canvas.height = canvas.scrollHeight;

var ctx = canvas.getContext('2d');

var image = new Image();
image.src = './Images/ghost.png';

function draw(ctx, image){
    if(!image.complete){
        setTimeout(function(){
            draw(ctx, image);
        }, 50);
        return;
    }
    ctx.drawImage(image, 20, 20, 300, 300);
}
// draw(ctx, image);

var generator = new MazeGenerator(25, 25);
generator.generate();

function drawLoop(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    generator.draw();
    requestAnimationFrame(drawLoop);
}

requestAnimationFrame(drawLoop);

var bgm;
var ohch;
var die;
function initAudio(){
	bgm = document.getElementById("bgm");
	ohch = document.getElementById("ohch");
	die = document.getElementById("die");
}

function getShader(gl, id) {
	var shaderScript = document.getElementById(id);
	if (!shaderScript) {
		return null;
	}

	var str = "";
	var k = shaderScript.firstChild;
	while (k) {
		if (k.nodeType == 3) {
			str += k.textContent;
		}
		k = k.nextSibling;
	}

	var shader;
	if (shaderScript.type == "x-shader/x-fragment") {
		shader = gl.createShader(gl.FRAGMENT_SHADER);
	} else if (shaderScript.type == "x-shader/x-vertex") {
		shader = gl.createShader(gl.VERTEX_SHADER);
	} else {
		return null;
	}

	gl.shaderSource(shader, str);
	gl.compileShader(shader);

	if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
		alert(gl.getShaderInfoLog(shader));
		return null;
	}

	return shader;
}


var shaderProgram;

function initShaders() {
	var fragmentShader = getShader(gl, "shader-fs");
	var vertexShader = getShader(gl, "shader-vs");

	shaderProgram = gl.createProgram();
	gl.attachShader(shaderProgram, vertexShader);
	gl.attachShader(shaderProgram, fragmentShader);
	gl.linkProgram(shaderProgram);

	if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
		alert("Could not initialise shaders");
	}

	gl.useProgram(shaderProgram);

	shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
	gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);
	
	shaderProgram.textureCoordAttribute = gl.getAttribLocation(shaderProgram, "aTextureCoord");
	gl.enableVertexAttribArray(shaderProgram.textureCoordAttribute);

	shaderProgram.pMatrixUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
	shaderProgram.mvMatrixUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
	shaderProgram.samplerUniform = gl.getUniformLocation(shaderProgram, "uSampler");
	shaderProgram.colorUniform = gl.getUniformLocation(shaderProgram, "uColor");
}


function loadImage(url, callback) {
  var image = new Image();
  image.src = url;
  image.onload = callback;
  return image;
}

function loadImages(urls, callback,num,textures,initNewTex) {
  var images = [];
  var imagesToLoad = urls.length;
 
  // Called each time an image finished
  // loading.
  var onImageLoad = function() {
	--imagesToLoad;
	// If all the images are loaded call the callback.
	if (imagesToLoad == 0) {
	  callback(images,num,textures,initNewTex);
	  
	}
  };
 
  for (var ii = 0; ii < imagesToLoad; ++ii) {
	var image = loadImage(urls[ii], onImageLoad);
	images.push(image);
  }
}

function handleLoadedMultiTexture(images,num,textures,initNewTex)
{
	for(var ii=0;ii<num;++ii)
	{
		var texture = gl.createTexture();
		gl.bindTexture(gl.TEXTURE_2D, texture);
		gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
		
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, images[ii]);
		gl.bindTexture(gl.TEXTURE_2D, null);
		
		textures.push(texture);
 
	}
	initNewTex();
}

/////////////////////////////////////////////////
///////////////init background texture

var backgroundTextures =  Array();
function handleLoadedMultiBackgroudTexture(images,num,textures)
{
	for(var ii=0;ii<num;++ii)
	{
		var texture = gl.createTexture();
		gl.bindTexture(gl.TEXTURE_2D, texture);
		gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
		// Prevents s-coordinate wrapping (repeating).
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
		// Prevents t-coordinate wrapping (repeating).
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
		
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, images[ii]);
		gl.bindTexture(gl.TEXTURE_2D, null);
		
		textures.push(texture);
 
	}
	initMarioTexture();
}

function initBackgroudTexture()
{
	var backgroundImages = ["img/stone1.png","img/stone2.png","img/stone3.png","img/stone4.png","img/stone5.png"];
	loadImages(backgroundImages,handleLoadedMultiBackgroudTexture,5,backgroundTextures);
}

//https://gitcafe.com/mute/goto100/blob/master/assert/brick/brick1.png

///////////////////////////////////////////////////
////////////////init mario texture

var marioTextures = Array();

var initMarioTexture=function()
{
	var marioImages = ["assert/mario/mario1.png","assert/mario/mario2.png","assert/mario/mario3.png","assert/mario/mario4.png",
						"assert/mario/mario5.png","assert/mario/mario6.png","assert/mario/mario7.png","assert/mario/mario8.png"];
	loadImages(marioImages,handleLoadedMultiTexture,8,marioTextures,initBrickTexture);
}
/////////////////////////////////////////////////////////
///////////init brick textures

var brickTextures;

function handleLoadedBrickTexture(texture){
	gl.bindTexture(gl.TEXTURE_2D, texture);
	gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture.image);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S,  gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T,  gl.CLAMP_TO_EDGE);
	gl.bindTexture(gl.TEXTURE_2D, null);
}

var initBrickTexture=function(){

	brickTextures = gl.createTexture();
	brickTextures.image = new Image();
	brickTextures.image.onload = function(){
		handleLoadedBrickTexture(brickTextures);
		initSpringTexture();
	}
	
	brickTextures.image.src = "assert/brick/brick1.png";

}

var springTextures = Array();

function initSpringTexture(){
	var springImages=["assert/brick2/spring1.png","assert/brick2/spring2.png","assert/brick2/spring3.png","assert/brick2/spring4.png"];
	loadImages(springImages,handleLoadedMultiTexture,4,springTextures,initStabTexture);
}

var stabTexture;
function initStabTexture(){
	stabTexture = gl.createTexture();
	stabTexture.image = new Image();
	stabTexture.image.onload = function(){
		handleLoadedBrickTexture(stabTexture);
		initSandTexture();
	}
	
	stabTexture.image.src = "assert/brick1/stab.png";
}

var sandTexture;
function initSandTexture(){
	sandTexture = gl.createTexture();
	sandTexture.image = new Image();
	sandTexture.image.onload = function(){
		handleLoadedBrickTexture(sandTexture);
		initNumberTexture();
	}
	
	sandTexture.image.src = "assert/brick3/sand.png";
}

var numberTextures = Array();


function initNumberTexture(){

	var numberImages=["assert/score/n0.png","assert/score/n1.png","assert/score/n2.png","assert/score/n3.png",
						"assert/score/n4.png","assert/score/n5.png","assert/score/n6.png","assert/score/n7.png",
						"assert/score/n8.png","assert/score/n9.png"];
	loadImages(numberImages,handleLoadedMultiTexture,10,numberTextures,initLifeTexture);
	
}


var lifeTextures = Array();
function initLifeTexture(){
	var lifeImages=["assert/mario/life0.png","assert/mario/life1.png","assert/mario/life2.png","assert/mario/life3.png",
					"assert/mario/life4.png","assert/mario/life5.png","assert/mario/life6.png","assert/mario/life7.png","assert/mario/life8.png"];

	loadImages(lifeImages,handleLoadedMultiTexture,9,lifeTextures,initGameoverTexture);
	
}

var gameoverTexture;
function initGameoverTexture(){
	gameoverTexture = gl.createTexture();
	gameoverTexture.image = new Image();
	gameoverTexture.image.onload = function(){
		handleLoadedBrickTexture(gameoverTexture);
		initDarkTexture();
	}
	
	gameoverTexture.image.src = "assert/gameover/gameover.png";
}

var darkTexture;
function initDarkTexture(){
	darkTexture = gl.createTexture();
	darkTexture.image = new Image();
	darkTexture.image.onload = function(){
		handleLoadedBrickTexture(darkTexture);
		window.cancelAnimationFrame(cancelId)	;
		webGLStart();
	}
	
	darkTexture.image.src = "assert/mario/dark.png";
}

var mvMatrix = mat4.create();
var pMatrix = mat4.create();
var mvMatrixStack=[];

function mvPushMatrix() {
	var copy = mat4.create();
	mat4.set(mvMatrix, copy);
	mvMatrixStack.push(copy);
}

function mvPopMatrix() {
	if (mvMatrixStack.length == 0) {
		throw "Invalid popMatrix!";
	}
	mvMatrix = mvMatrixStack.pop();
}

function setMatrixUniforms() {
	gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, pMatrix);
	gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, mvMatrix);
}


var backgroundFVertexPositionBuffer;
var backgroundFVertexTextureCoordBuffer;
var backgroundFVertexIndexBuffer;

var backgroundSVertexPositionBuffer;
var backgroundSVertexTextureCoordBuffer;
var backgroundSVertexIndexBuffer;

var marioVertexPositionBuffer;
var marioRightVertexTextureCoordBuffer;
var marioLeftVertexTextureCoordBuffer;

var brickVertexPositionBuffer;
var brickVertexTextureCoordBuffer;

var stabVertexPositionBuffer;
var stabVertexTextureCoordBuffer;

var numberVertexPositionBuffer;
var numberVertexTextureCoordBuffer;

var lifeVertexPositionBuffer;
var lifeVertexTextureCoordBuffer;

var gameoverVertexPositionBuffer;
var gameoverVertexTextureCoordBuffer;

var darkVertexPositionBuffer;
var darkVertexTextureCoordBuffer;


function initBuffers() {

	///////////////////////////////////////////////
	////////mario
	
	marioVertexPositionBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, marioVertexPositionBuffer);
	var vertices = [
		0.02, 0.04, 0.0,
		-0.02, 0.04, 0.0,
		0.02, -0.04, 0.0,
		-0.02, -0.04, 0.0,
	];
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
	marioVertexPositionBuffer.itemSize = 3;
	marioVertexPositionBuffer.numItems = 4;
	
	marioRightVertexTextureCoordBuffer = gl.createBuffer();  
	gl.bindBuffer(gl.ARRAY_BUFFER, marioRightVertexTextureCoordBuffer);
	textureCoordsRight = [
		1.0, 1.0,
		0.0, 1.0,
		1.0, 0.0,
		0.0, 0.0
	];
	
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoordsRight), gl.STATIC_DRAW);
	marioRightVertexTextureCoordBuffer.itemSize=2;
	marioRightVertexTextureCoordBuffer.numItems=4;
	
	marioLeftVertexTextureCoordBuffer = gl.createBuffer();  
	gl.bindBuffer(gl.ARRAY_BUFFER, marioLeftVertexTextureCoordBuffer);
	textureCoordsLeft = [
		0.0, 1.0,
		1.0, 1.0,
		0.0, 0.0,
		1.0, 0.0
	];
	
	
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoordsLeft), gl.STATIC_DRAW);
	marioLeftVertexTextureCoordBuffer.itemSize=2;
	marioLeftVertexTextureCoordBuffer.numItems=4;
	
	//////////////////////////////////////////////////////
	//////background
	
	backgroundFVertexPositionBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, backgroundFVertexPositionBuffer);
	vertices = [
		 0.4,  1.0,  0.0,
		-0.4,  1.0,  0.0,
		 0.4, -1.0,  0.0,
		-0.4, -1.0,  0.0
	];
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
	backgroundFVertexPositionBuffer.itemSize = 3;
	backgroundFVertexPositionBuffer.numItems = 4;
	
	
	backgroundFVertexTextureCoordBuffer = gl.createBuffer();  
	gl.bindBuffer(gl.ARRAY_BUFFER, backgroundFVertexTextureCoordBuffer);
	textureCoords = [
		4.0, 10.0,
		0.0, 10.0,
		4.0, 0.0,
		0.0, 0.0
	];
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoords), gl.STATIC_DRAW);
	backgroundFVertexTextureCoordBuffer.itemSize=2;
	backgroundFVertexTextureCoordBuffer.numItems=4;
	
	backgroundFVertexIndexBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, backgroundFVertexIndexBuffer);
	var squareVertexIndices = [
		0, 1, 2,      1, 2, 3    // Front face
	];
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(squareVertexIndices), gl.STATIC_DRAW);
	backgroundFVertexIndexBuffer.itemSize = 1;
	backgroundFVertexIndexBuffer.numItems = 6;
	
	
	backgroundSVertexPositionBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, backgroundSVertexPositionBuffer);
	vertices = [
		 0.4,  1.0,  0.0,
		-0.4,  1.0,  0.0,
		 0.4, -1.0,  0.0,
		-0.4, -1.0,  0.0
	];
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
	backgroundSVertexPositionBuffer.itemSize = 3;
	backgroundSVertexPositionBuffer.numItems = 4;
	
	
	backgroundSVertexTextureCoordBuffer = gl.createBuffer();  
	gl.bindBuffer(gl.ARRAY_BUFFER, backgroundSVertexTextureCoordBuffer);
	textureCoords = [
		4.0, 10.0,
		0.0, 10.0,
		4.0, 0.0,
		0.0, 0.0
	];
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoords), gl.STATIC_DRAW);
	backgroundSVertexTextureCoordBuffer.itemSize=2;
	backgroundSVertexTextureCoordBuffer.numItems=4;
	
	backgroundSVertexIndexBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, backgroundSVertexIndexBuffer);
	var squareVertexIndices = [
		0, 1, 2,      1, 2, 3    // Front face
	];
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(squareVertexIndices), gl.STATIC_DRAW);
	backgroundSVertexIndexBuffer.itemSize = 1;
	backgroundSVertexIndexBuffer.numItems = 6;
	
	////////////////////////////////////
	///brick
	
	brickVertexPositionBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, brickVertexPositionBuffer);
	var vertices = [
		0.06, 0.0075, 0.0,
		-0.06, 0.0075, 0.0,
		0.06, -0.0075, 0.0,
		-0.06, -0.0075, 0.0,
	];
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
	brickVertexPositionBuffer.itemSize = 3;
	brickVertexPositionBuffer.numItems = 4;
	
	brickVertexTextureCoordBuffer = gl.createBuffer();  
	gl.bindBuffer(gl.ARRAY_BUFFER, brickVertexTextureCoordBuffer);
	textureCoords = [
		1.0, 1.0,
		0.0, 1.0,
		1.0, 0.0,
		0.0, 0.0
	];
	
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoords), gl.STATIC_DRAW);
	brickVertexTextureCoordBuffer.itemSize=2;
	brickVertexTextureCoordBuffer.numItems=4;
	
	////////////////////////////////////////
	///////stab
	
	stabVertexPositionBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, stabVertexPositionBuffer);
	var vertices = [
		0.06, 0.0225, 0.0,
		-0.06, 0.0225, 0.0,
		0.06, -0.0075, 0.0,
		-0.06, -0.0075, 0.0,
	];
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
	stabVertexPositionBuffer.itemSize = 3;
	stabVertexPositionBuffer.numItems = 4;
	
	stabVertexTextureCoordBuffer = gl.createBuffer();  
	gl.bindBuffer(gl.ARRAY_BUFFER, stabVertexTextureCoordBuffer);
	textureCoords = [
		1.0, 1.0,
		0.0, 1.0,
		1.0, 0.0,
		0.0, 0.0
	];
	
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoords), gl.STATIC_DRAW);
	stabVertexTextureCoordBuffer.itemSize=2;
	stabVertexTextureCoordBuffer.numItems=4;
	
	/////////////////////////////////////
	////init numberTextures
	
	numberVertexPositionBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, numberVertexPositionBuffer);
	var vertices = [
		0.015, 0.03, 0.0,
		-0.015, 0.03, 0.0,
		0.015, -0.03, 0.0,
		-0.015, -0.03, 0.0,
	];
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
	numberVertexPositionBuffer.itemSize = 3;
	numberVertexPositionBuffer.numItems = 4;
	
	numberVertexTextureCoordBuffer = gl.createBuffer();  
	gl.bindBuffer(gl.ARRAY_BUFFER, numberVertexTextureCoordBuffer);
	textureCoords = [
		1.0, 1.0,
		0.0, 1.0,
		1.0, 0.0,
		0.0, 0.0
	];
	
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoords), gl.STATIC_DRAW);
	numberVertexTextureCoordBuffer.itemSize=2;
	numberVertexTextureCoordBuffer.numItems=4;
	
	/////////////////////////////////
	////init life buffer

	lifeVertexPositionBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, lifeVertexPositionBuffer);
	var vertices = [
		0.1, 0.03, 0.0,
		-0.1, 0.03, 0.0,
		0.1, -0.03, 0.0,
		-0.1, -0.03, 0.0,
	];
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
	lifeVertexPositionBuffer.itemSize = 3;
	lifeVertexPositionBuffer.numItems = 4;
	
	lifeVertexTextureCoordBuffer = gl.createBuffer();  
	gl.bindBuffer(gl.ARRAY_BUFFER, lifeVertexTextureCoordBuffer);
	textureCoords = [
		1.0, 1.0,
		0.0, 1.0,
		1.0, 0.0,
		0.0, 0.0
	];
	
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoords), gl.STATIC_DRAW);
	lifeVertexTextureCoordBuffer.itemSize=2;
	lifeVertexTextureCoordBuffer.numItems=4;
	
	//////////////////////////////////////////
	/////init gameover
	
	gameoverVertexPositionBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, gameoverVertexPositionBuffer);
	var vertices = [
		0.24, 0.06, 0.0,
		-0.24, 0.06, 0.0,
		0.24, -0.06, 0.0,
		-0.24, -0.06, 0.0,
	];
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
	gameoverVertexPositionBuffer.itemSize = 3;
	gameoverVertexPositionBuffer.numItems = 4;
	
	gameoverVertexTextureCoordBuffer = gl.createBuffer();  
	gl.bindBuffer(gl.ARRAY_BUFFER, gameoverVertexTextureCoordBuffer);
	textureCoords = [
		1.0, 1.0,
		0.0, 1.0,
		1.0, 0.0,
		0.0, 0.0
	];
	
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoords), gl.STATIC_DRAW);
	gameoverVertexTextureCoordBuffer.itemSize=2;
	gameoverVertexTextureCoordBuffer.numItems=4;
	
	//////////////////////////////////////////
	/////init dark
	
	darkVertexPositionBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, darkVertexPositionBuffer);
	var vertices = [
		1.1, 2.2, 0.0,
		-1.1, 2.2, 0.0,
		1.1, -2.2, 0.0,
		-1.1, -2.2, 0.0,
	];
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
	darkVertexPositionBuffer.itemSize = 3;
	darkVertexPositionBuffer.numItems = 4;
	
	darkVertexTextureCoordBuffer = gl.createBuffer();  
	gl.bindBuffer(gl.ARRAY_BUFFER, darkVertexTextureCoordBuffer);
	textureCoords = [
		1.0, 1.0,
		0.0, 1.0,
		1.0, 0.0,
		0.0, 0.0
	];
	
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoords), gl.STATIC_DRAW);
	darkVertexTextureCoordBuffer.itemSize=2;
	darkVertexTextureCoordBuffer.numItems=4;
	
	
}


var mario;
var score;
var bricks = [];
var bg1=-0.5;
var bg2=-2.5;
var bLayer1=0;
var bLayer2=0;
var toBLayer=0;

var backgroundmove=0;
function drawScene() {
	gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	mat4.perspective(45, gl.viewportWidth / gl.viewportHeight, 0.1, 100.0, pMatrix);
	gl.uniform3f(shaderProgram.colorUniform, 1.0, 1.0, 1.0);

	//gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
	gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
	gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
	gl.enable(gl.BLEND);
	mat4.identity(mvMatrix);
	
	
	/////////////////////////////////////////////////////////////
	///////background
	
	
	mvPushMatrix();
	mat4.translate(mvMatrix, [0.0, bg1, -1.0]);
	
	gl.bindBuffer(gl.ARRAY_BUFFER, backgroundFVertexPositionBuffer);
	gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, backgroundFVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);
	
	gl.bindBuffer(gl.ARRAY_BUFFER, backgroundFVertexTextureCoordBuffer);
	gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, backgroundFVertexTextureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);

	gl.activeTexture(gl.TEXTURE0);
	gl.bindTexture(gl.TEXTURE_2D, backgroundTextures[bLayer1]);
	gl.uniform1i(shaderProgram.samplerUniform, 0);
	
	
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, backgroundFVertexIndexBuffer);
	setMatrixUniforms();
	gl.drawElements(gl.TRIANGLES, backgroundFVertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0); 
	mvPopMatrix();
	
	
	mvPushMatrix();
	mat4.translate(mvMatrix, [0.0, bg2, -1.0]);
	
	gl.bindBuffer(gl.ARRAY_BUFFER, backgroundSVertexPositionBuffer);
	gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, backgroundSVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);
	
	gl.bindBuffer(gl.ARRAY_BUFFER, backgroundSVertexTextureCoordBuffer);
	gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, backgroundSVertexTextureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);

	gl.activeTexture(gl.TEXTURE0);
	gl.bindTexture(gl.TEXTURE_2D, backgroundTextures[bLayer2]);
	gl.uniform1i(shaderProgram.samplerUniform, 0);
	
	
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, backgroundSVertexIndexBuffer);
	setMatrixUniforms();
	gl.drawElements(gl.TRIANGLES, backgroundSVertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0); 
	mvPopMatrix();
	
	
	for(var i = 0; i < bricks.length; i++)
		bricks[i].draw();
	
	if(mario.life == 0)
	{
		gameover.draw();
		mario.destory();
	}
	else{
		mario.draw();
		score.draw();
	}
	
}


var currentlyPressedKeys = {};
var keyPress=false;
var pause=false;
var restart=false;
var dark=false;
var easy=true;


function handleKeyDown(event) {
	currentlyPressedKeys[event.keyCode] = true;

}

function handleKeyUp(event) {
	currentlyPressedKeys[event.keyCode] = false;
}
function sleep(delay)
{
    var start = new Date().getTime();
    while (new Date().getTime() < start + delay);
}


function handleKeys() {
	if (currentlyPressedKeys[37]) {
		// left
		mario.direction = -1;


	}else
	if (currentlyPressedKeys[39]){
		// right
		mario.direction = 1;

	}else{
		mario.direction=0;

	}
	
	if(currentlyPressedKeys[80])
	{
		sleep(30);
		if(currentlyPressedKeys[80])
			pause = !pause;
		//console.log("pause");
	}
	if(currentlyPressedKeys[82])
		restart = true;
	
	if(currentlyPressedKeys[38])
	{
		dark=false;
	}
	if(currentlyPressedKeys[40])
	{
		dark=true;
	}
	if(currentlyPressedKeys[32])
	{
		keyPress=true;
		//console.log("press");
	}
}
/*
function handleKeyPress(event) {
	keyPress=true;
}
*/
var layer=0;
//brick stab spring sand
var types = new Array([1.0,0.0,0.0,0.0],
					  [0.9,0.0,0.1,0.0],
					  [0.8,0.1,0.1,0.0],
					  [0.7,0.1,0.1,0.1],
					  [0.6,0.1,0.2,0.1],
					  [0.5,0.1,0.2,0.2],
					  [0.5,0.2,0.2,0.1],
					  [0.5,0.2,0.1,0.2],
					  [0.4,0.2,0.2,0.2],
					  [0.3,0.2,0.2,0.3]);
	
function initBrickObject(){
	var x = Math.random();
	x =  (x - 0.5) * 0.68;
	
	var temp=layer/5;
	var i = parseInt(temp.toString());
	if(i > 9) i=9;
	var type = Math.random();
	if(type < types[i][0])
		bricks.push(new Brick(x, -0.5));
	else if(type < (types[i][0] + types[i][1]))
		bricks.push(new Stab(x, -0.5));
	else if(type < (types[i][0] + types[i][1] + types[i][2]))
		bricks.push(new Spring(x, -0.5));
	else
		bricks.push(new Sand(x, -0.5));
}


var lastTime=0;
var timelast=0;
var brickinterval=0;
var speed = 0.20;

function restartGame(){
	restart = false;
	backgroundmove=0;
	speed = 0.20;
	mario.x = 0;
	mario.y = 0;
	mario.life = 8;
	mario.odie=false;
	gameover.y=0.5;
	gameover.v=0;
	bricks = [];
	bricks.push(new Brick(0,-0.5));
}

//destory i brick
function destoryBrick(i)
{
	bricks[i] = null;
	bricks.splice(i,1);
}
var fLayer=true;
function animate(){
	var timeNow = new Date().getTime();
	//console.log("jg "+(timeNow-timelast));
	
	var elapsed = 20;
	if(pause)
	{
		elapsed = 0;
		//console.log("animate pause");
	}
	
	backgroundmove += (speed*elapsed) / 1000.0;
	//console.log(backgroundmove);
	
	bg1 += (speed*elapsed) / 1000.0;
	bg2 += (speed*elapsed) / 1000.0;
	
	if(bg1>1.5) { bg1 = bg2 - 2; bLayer1 = toBLayer;}
	if(bg2>1.5) { bg2 = bg1 - 2; bLayer2 = toBLayer;}
	
	
	brickinterval += (speed*elapsed) / 1000.0;
	if(brickinterval > 0.14){
		initBrickObject();
		brickinterval = 0;
	}
	if(bricks[0])
		if(bricks[0].y > 0.5){
			bricks[0] = null;
			bricks.shift();
		}
	
	for(var i = 0; i < bricks.length; i++)
	{				
	
		bricks[i].animate(elapsed,speed);
		
	}
	
	//console.log(backgroundmove);
	
	mario.onBrick = false;
	
	for(var i = 0; i < bricks.length; i++){
		
		//console.log(mario.y);
		//console.log(bricks[i].y);
		if((mario.y - bricks[i].y - 0.04 - 0.0075) < -0.02) continue;
		if((mario.y - bricks[i].y - 0.04 - 0.0075) < 0.004)
		{
			
			if((mario.x > (bricks[i].x - 0.06 - 0.02)) && (mario.x < (bricks[i].x + 0.06 + 0.02)))
			{
				mario.onBrick = true;
				mario.y = bricks[i].y + 0.0075 + 0.04;
				mario.touched = bricks[i].att;
				bricks[i].ontouched=true;
				//
				if(mario.onsandTime == 15)
					destoryBrick(i);
			}
			else mario.onBrick = false;
			break;
		}
	}
	layer = parseInt(m=backgroundmove.toString()*2);
	if(layer < 16) toBLayer=0;
	else if(layer < 36) toBLayer=1;
	else if(layer < 56) toBLayer=2;
	else if(layer < 76) toBLayer=3;
	else toBLayer=4;
	
	//console.log(bLayer);
	
	if(layer%10==0 && fLayer)
	{
		speed += 0.01;
		fLayer=false;
		console.log("speed up");
	}
	if(layer%10!=0) fLayer=true;
	//console.log(speed);
	
	//console.log("mario:"+mario.y);
	//console.log("brick:"+bricks[0].y);
	
	if(mario.life == 0)
	{
		gameover.animate(elapsed);
		//mario=null;
		mario.destory();
		if(restart) restartGame();
	}else
	{
		mario.animate(elapsed,speed);
		score.animate(backgroundmove);
	}
	timelast = timeNow;
	
}


function tick() {
	
	var timeNow = new Date().getTime();
	
	restart=false;
	requestAnimFrame(tick);
	handleKeys();
	animate();
	drawScene();
	
	var timelast = new Date().getTime();
	//if(timelast-timeNow>2)
	//	console.log((timelast-timeNow));
	
}

function startGame(){
	
	
	var id=requestAnimFrame(startGame);
	handleKeys();
	startDraw(dark);
	
	if(keyPress)
	{
		console.log("keyPress");
		window.cancelAnimationFrame(id);
		tick();
	}
}


function webGLStart() {
	
	initAudio();
	bgm.play();
	bgm.volume = 0.0;
	
	var timeNow = new Date().getTime();

	initShaders();
	
	var timelast = new Date().getTime();

	console.log("initGL "+(timelast-timeNow));
	var timeNow = new Date().getTime();
	
	initStart();
	var timelast = new Date().getTime();
	console.log("initstart "+(timelast-timeNow));

	var timeNow = new Date().getTime();
	
	initBuffers();
	
	var timelast = new Date().getTime();
	console.log("initbuff "+(timelast-timeNow));
	var timeNow = new Date().getTime();
	
	//initTexture();
	
	/*
	initBackgroudTexture();
	initMarioTexture();
	
	initBrickTexture();
	initSpringTexture();
	initStabTexture();
	initSandTexture();
	initNumberTexture();
	initLifeTexture();
	initGameoverTexture();
	*/
	var timelast = new Date().getTime();
	console.log("inittexture "+(timelast-timeNow));
	var timeNow = new Date().getTime();
	
	
	gameover = new Gameover();
	
	score = new Score();
	mario = new Mario(0,0.0);
	bricks.push(new Brick(0,-0.5));
	
	
	document.onkeydown = handleKeyDown;
	document.onkeyup = handleKeyUp;
	//document.onkeypress = handleKeyPress;
	
	var timelast = new Date().getTime();
	console.log("new "+(timelast-timeNow));
	var timeNow = new Date().getTime();
	

	gl.clearColor(0.0, 0.0, 0.0, 1.0);
	//gl.enable(gl.DEPTH_TEST);

	
	
	startGame();
	
	//setTimeout(initobject,300);
	//console.log("test");
	
	var timelast = new Date().getTime();
	console.log("start "+(timelast-timeNow));
	
	
	//tick();
}
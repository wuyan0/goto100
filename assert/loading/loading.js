
var canvas = document.getElementById("g_canvas");
var gl;
try {
	gl = canvas.getContext("webgl");
	gl.viewportWidth = canvas.width;
	gl.viewportHeight = canvas.height;
} catch (e) {
}
if (!gl) {
	alert("Could not initialise WebGL, sorry :-(");
}



function myCompileShader(src, shaderType) {
	var shader = gl.createShader(shaderType);
	gl.shaderSource(shader, src);
	gl.compileShader(shader);
	var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
	if (!success) {
		throw "could not compile shader:" + gl.getShaderInfoLog(shader);
	}
	return shader;
}

function myCompileProgram(vertexShader, fragmentShader) {
	var program = gl.createProgram();
	gl.attachShader(program, myCompileShader(vertexShader,gl.VERTEX_SHADER));
	gl.attachShader(program, myCompileShader(fragmentShader,gl.FRAGMENT_SHADER));
	gl.linkProgram(program);
	var success = gl.getProgramParameter(program, gl.LINK_STATUS);
	if (!success) {
		throw ("program filed to link:" + glGetProgramInfoLog (program));
	}
	return program;
}


function create2D(fscode){

	var svert="\
	attribute vec2 a_position;\n\
	attribute vec2 aTextureCoord;\n\
	varying vec2 vTextureCoord;\n\
	void main(){\n\
		gl_Position = vec4(a_position, 0, 1);\n\
		vTextureCoord = aTextureCoord;\n\
	}"
	var sfrag="\
	precision mediump float;\n\
	uniform float t;\n\
	varying vec2 vTextureCoord;\n\
	uniform sampler2D uSampler;\n\
	void main(){\n\
		vec4 textureColor = texture2D(uSampler, vec2(vTextureCoord.s, vTextureCoord.t));\n\
		"+fscode+"\n\
	}"

	var shaderProgram=myCompileProgram(svert,sfrag);

	//gl.useProgram(shaderProgram);
	shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "a_position");
	gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);
	shaderProgram.tUniform=gl.getUniformLocation(shaderProgram, "t");
	shaderProgram.textureCoordAttribute = gl.getAttribLocation(shaderProgram, "aTextureCoord");
	gl.enableVertexAttribArray(shaderProgram.textureCoordAttribute);
	shaderProgram.samplerUniform = gl.getUniformLocation(shaderProgram, "uSampler");
	
	return shaderProgram;
}

function loadImage(url, callback) {
	  var image = new Image();
	  image.src = url;
	  image.onload = callback;
	  return image;
}

function loadImages(urls, callback,num,textures) {
  var images = [];
  var imagesToLoad = urls.length;
 
  // Called each time an image finished
  // loading.
  var onImageLoad = function() {
	--imagesToLoad;
	// If all the images are loaded call the callback.
	if (imagesToLoad == 0) {
	  callback(images,num,textures);
	}
  };
 
  for (var ii = 0; ii < imagesToLoad; ++ii) {
	var image = loadImage(urls[ii], onImageLoad);
	images.push(image);
  }
}

function handleLoadedMultiTexture(images,num,textures)
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
}

var loadingTextures=Array();
var loadingimage=["assert/loading/loading.png","assert/loading/shine.png"];
loadImages(loadingimage,handleLoadedMultiTexture,2,loadingTextures);

lfscode="gl_FragColor = textureColor;";
var loadingSP=create2D(lfscode);
sfscode="\
		float tt=(sin(t)+1.0)*0.5;\n\
		gl_FragColor = textureColor*vec4(tt,tt,tt,1.0);"
var shineSP=create2D(sfscode);

var loadindBuffer=gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, loadindBuffer);
gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([
        -0.4, -0.4,
        -0.4,  0.4,
         0.4, -0.4,
		 0.4,  0.4]),
    gl.STATIC_DRAW);


loadingVertexTextureCoordBuffer = gl.createBuffer();  
gl.bindBuffer(gl.ARRAY_BUFFER, loadingVertexTextureCoordBuffer);
textureCoords = [
	0.0, 0.0,
	0.0, 1.0,
	1.0, 0.0,
	1.0, 1.0
];
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoords), gl.STATIC_DRAW);

var shineBuffer=gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, shineBuffer);
gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([
        -0.4, -0.4,
        -0.4,  0.4,
         0.4, -0.4,
		 0.4,  0.4]),
    gl.STATIC_DRAW);


shineVertexTextureCoordBuffer = gl.createBuffer();  
gl.bindBuffer(gl.ARRAY_BUFFER, shineVertexTextureCoordBuffer);
textureCoords = [
	0.0, 0.0,
	0.0, 1.0,
	1.0, 0.0,
	1.0, 1.0
];
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoords), gl.STATIC_DRAW);


// draw
var tt=0.0;
var cancelId=0;
function onrender(img){
	gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
	gl.enable(gl.BLEND);
		
	
	gl.useProgram(loadingSP);
	gl.bindBuffer(gl.ARRAY_BUFFER, loadindBuffer);
	gl.vertexAttribPointer(loadingSP.vertexPositionAttribute, 2, gl.FLOAT, false, 0, 0);

	gl.bindBuffer(gl.ARRAY_BUFFER, loadingVertexTextureCoordBuffer);
	gl.vertexAttribPointer(loadingSP.textureCoordAttribute,2, gl.FLOAT, false, 0, 0);
	gl.activeTexture(gl.TEXTURE0);
	gl.bindTexture(gl.TEXTURE_2D, loadingTextures[0]);
	gl.uniform1i(loadingSP.samplerUniform, 0);
	
	gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
	
	gl.useProgram(shineSP);
	gl.bindBuffer(gl.ARRAY_BUFFER, shineBuffer);
	gl.vertexAttribPointer(shineSP.vertexPositionAttribute, 2, gl.FLOAT, false, 0, 0);

	gl.bindBuffer(gl.ARRAY_BUFFER, loadingVertexTextureCoordBuffer);
	gl.vertexAttribPointer(shineSP.textureCoordAttribute,2, gl.FLOAT, false, 0, 0);
	gl.activeTexture(gl.TEXTURE0);
	gl.bindTexture(gl.TEXTURE_2D, loadingTextures[1]);
	gl.uniform1i(shineSP.samplerUniform, 0);
	
	gl.uniform1f(shineSP.tUniform,tt);
	gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
	
	
	cancelId=requestAnimationFrame(onrender);
	tt+=0.03;
}
gl.clearColor(0.0, 0.0, 0.0, 1.0);
onrender();

function loadjs(file){
    var script=document.createElement('script');
    script.src=file;
    script.type='text/javascript';
	script.async = true;
    script.onload=function(){
		window.cancelAnimationFrame(cancelId);
		loaded=1;
		webGLStart();
		};
    
    document.body.appendChild(script);
}
//loadjs("js/index.js");

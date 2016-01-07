//start
var startEasyTextrue;
var startHardTextrue;
var startVertexPositionBuffer;
var startVertexTextureCoordBuffer;


function handleLoadedStartTexture(texture){
	gl.bindTexture(gl.TEXTURE_2D, texture);
	gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture.image);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S,  gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T,  gl.CLAMP_TO_EDGE);
	gl.bindTexture(gl.TEXTURE_2D, null);

}



function initStart()
{
	
	startEasyTextrue = gl.createTexture();
	startEasyTextrue.image = new Image();
	startEasyTextrue.image.onload = function(){
		handleLoadedStartTexture(startEasyTextrue)
	}
	
	startEasyTextrue.image.src = "assert/start/easy.png";
	
	startHardTextrue = gl.createTexture();
	startHardTextrue.image = new Image();
	startHardTextrue.image.onload = function(){
		handleLoadedStartTexture(startHardTextrue)
	}
	
	startHardTextrue.image.src = "assert/start/hard.png";
	
	
	startVertexPositionBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, startVertexPositionBuffer);
	var vertices = [
		0.3, 0.15, 0.0,
		-0.3, 0.15, 0.0,
		0.3, -0.15, 0.0,
		-0.3, -0.15, 0.0,
	];
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
	startVertexPositionBuffer.itemSize = 3;
	startVertexPositionBuffer.numItems = 4;
	
	startVertexTextureCoordBuffer = gl.createBuffer();  
	gl.bindBuffer(gl.ARRAY_BUFFER, startVertexTextureCoordBuffer);
	textureCoords = [
		1.0, 1.0,
		0.0, 1.0,
		1.0, 0.0,
		0.0, 0.0
	];
	
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoords), gl.STATIC_DRAW);
	startVertexTextureCoordBuffer.itemSize=2;
	startVertexTextureCoordBuffer.numItems=4;
	
	
}

var timelast=0;
function startDraw(dark)
{	
	var timeNow = new Date().getTime();
	//console.log(timeNow-timelast);
	
	
	gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	mat4.perspective(45, gl.viewportWidth / gl.viewportHeight, 0.1, 100.0, pMatrix);
	gl.uniform3f(shaderProgram.colorUniform, 1.0, 1.0, 1.0);

	//gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
	gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
	gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
	gl.enable(gl.BLEND);
	mat4.identity(mvMatrix);
	if(dark)
	{
		mvPushMatrix();
		mat4.translate(mvMatrix, [0.0, 0.0, -1.0]);
		gl.bindBuffer(gl.ARRAY_BUFFER, startVertexPositionBuffer);
		gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, startVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);
		
		gl.bindBuffer(gl.ARRAY_BUFFER, startVertexTextureCoordBuffer);
		gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, startVertexTextureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);
		
		gl.activeTexture(gl.TEXTURE0);
		gl.bindTexture(gl.TEXTURE_2D, startHardTextrue);
		gl.uniform1i(shaderProgram.samplerUniform, 0);
		
		setMatrixUniforms();
		gl.drawArrays(gl.TRIANGLE_STRIP, 0, startVertexPositionBuffer.numItems);
		mvPopMatrix();
		easy=false;
	}else{
		mvPushMatrix();
		mat4.translate(mvMatrix, [0.0, 0.0, -1.0]);
		gl.bindBuffer(gl.ARRAY_BUFFER, startVertexPositionBuffer);
		gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, startVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);
		
		gl.bindBuffer(gl.ARRAY_BUFFER, startVertexTextureCoordBuffer);
		gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, startVertexTextureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);
		
		gl.activeTexture(gl.TEXTURE0);
		gl.bindTexture(gl.TEXTURE_2D, startEasyTextrue);
		gl.uniform1i(shaderProgram.samplerUniform, 0);
		
		setMatrixUniforms();
		gl.drawArrays(gl.TRIANGLE_STRIP, 0, startVertexPositionBuffer.numItems);
		mvPopMatrix();
		easy=true;
	}
	timelast=timeNow;
	
	console.log("start");
	
	
}
function Score(){
	this.n=0;
	this.ten=0;
	this.hundred=0;
	this.score=0;
}

Score.prototype.draw=function(){
	//个位
	mvPushMatrix();
	mat4.translate(mvMatrix, [0.37, 0.37, -1.0]);
	gl.bindBuffer(gl.ARRAY_BUFFER, numberVertexPositionBuffer);
	gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, numberVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);
	
	gl.bindBuffer(gl.ARRAY_BUFFER, numberVertexTextureCoordBuffer);
	gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, numberVertexTextureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);
	
	gl.activeTexture(gl.TEXTURE0);
	gl.bindTexture(gl.TEXTURE_2D, numberTextures[this.n]);
	gl.uniform1i(shaderProgram.samplerUniform, 0);
	
	setMatrixUniforms();
	gl.drawArrays(gl.TRIANGLE_STRIP, 0, numberVertexPositionBuffer.numItems);
	mvPopMatrix();
	//十位
	mvPushMatrix();
	mat4.translate(mvMatrix, [0.34, 0.37, -1.0]);
	gl.bindBuffer(gl.ARRAY_BUFFER, numberVertexPositionBuffer);
	gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, numberVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);
	
	gl.bindBuffer(gl.ARRAY_BUFFER, numberVertexTextureCoordBuffer);
	gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, numberVertexTextureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);
	
	gl.activeTexture(gl.TEXTURE0);
	gl.bindTexture(gl.TEXTURE_2D, numberTextures[this.ten]);
	gl.uniform1i(shaderProgram.samplerUniform, 0);
	//百位
	setMatrixUniforms();
	gl.drawArrays(gl.TRIANGLE_STRIP, 0, numberVertexPositionBuffer.numItems);
	mvPopMatrix();
	
	mvPushMatrix();
	mat4.translate(mvMatrix, [0.31, 0.37, -1.0]);
	gl.bindBuffer(gl.ARRAY_BUFFER, numberVertexPositionBuffer);
	gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, numberVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);
	
	gl.bindBuffer(gl.ARRAY_BUFFER, numberVertexTextureCoordBuffer);
	gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, numberVertexTextureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);
	
	gl.activeTexture(gl.TEXTURE0);
	gl.bindTexture(gl.TEXTURE_2D, numberTextures[this.hundred]);
	gl.uniform1i(shaderProgram.samplerUniform, 0);
	
	setMatrixUniforms();
	gl.drawArrays(gl.TRIANGLE_STRIP, 0, numberVertexPositionBuffer.numItems);
	mvPopMatrix();
}

Score.prototype.animate = function(move){
	this.score = parseInt(move.toString() * 10);
	this.hundred = parseInt((this.score / 100).toString());
	this.ten = parseInt(((this.score - this.hundred * 100) / 10).toString());
	this.n = parseInt((this.score - this.hundred * 100 - this.ten * 10).toString());
	//console.log(this.n);
}
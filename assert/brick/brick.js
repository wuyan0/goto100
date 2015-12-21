function Brick(positionX,positionY){
	this.att = "normal"
	this.x = positionX;
	this.y = positionY;
}

Brick.prototype.draw = function(){
	mvPushMatrix();
	mat4.translate(mvMatrix, [this.x, this.y, -1.0]);
	gl.bindBuffer(gl.ARRAY_BUFFER, brickVertexPositionBuffer);
	gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, brickVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);
	
	gl.bindBuffer(gl.ARRAY_BUFFER, brickVertexTextureCoordBuffer);
	gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, brickVertexTextureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);
	
	gl.activeTexture(gl.TEXTURE0);
	gl.bindTexture(gl.TEXTURE_2D, brickTextures);
	gl.uniform1i(shaderProgram.samplerUniform, 0);
	
	setMatrixUniforms();
	gl.drawArrays(gl.TRIANGLE_STRIP, 0, brickVertexPositionBuffer.numItems);
	mvPopMatrix();
}

Brick.prototype.animate = function(elapsedTime,ySpeed){
	this.y += (ySpeed*elapsedTime) / 1000.0;
	
	//console.log("brick:"+(ySpeed*elapsedTime) / 1000.0);
}

Brick.prototype.destroy = function(){

}
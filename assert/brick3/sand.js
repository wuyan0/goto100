function Sand(positionX,positionY){
	this.att = "sand"
	this.x = positionX;
	this.y = positionY;
}

Sand.prototype.draw = function(){
	mvPushMatrix();
	mat4.translate(mvMatrix, [this.x, this.y, -1.0]);
	gl.bindBuffer(gl.ARRAY_BUFFER, brickVertexPositionBuffer);
	gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, brickVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);
	
	gl.bindBuffer(gl.ARRAY_BUFFER, brickVertexTextureCoordBuffer);
	gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, brickVertexTextureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);
	
	gl.activeTexture(gl.TEXTURE0);
	gl.bindTexture(gl.TEXTURE_2D, sandTexture);
	gl.uniform1i(shaderProgram.samplerUniform, 0);
	
	setMatrixUniforms();
	gl.drawArrays(gl.TRIANGLE_STRIP, 0, brickVertexPositionBuffer.numItems);
	mvPopMatrix();
}

Sand.prototype.animate = function(elapsedTime,ySpeed){
	this.y += (ySpeed*elapsedTime) / 1000.0;
}

Sand.prototype.destroy = function(){

}
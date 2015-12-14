function Stab(positionX,positionY){
	this.att = "stab"
	this.x = positionX;
	this.y = positionY;
}

Stab.prototype.draw = function(){
	mvPushMatrix();
	mat4.translate(mvMatrix, [this.x, this.y, -1.0]);
	gl.bindBuffer(gl.ARRAY_BUFFER, stabVertexPositionBuffer);
	gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, stabVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);
	
	gl.bindBuffer(gl.ARRAY_BUFFER, stabVertexTextureCoordBuffer);
	gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, stabVertexTextureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);
	
	gl.activeTexture(gl.TEXTURE0);
	gl.bindTexture(gl.TEXTURE_2D, stabTexture);
	gl.uniform1i(shaderProgram.samplerUniform, 0);
	
	setMatrixUniforms();
	gl.drawArrays(gl.TRIANGLE_STRIP, 0, stabVertexPositionBuffer.numItems);
	mvPopMatrix();
}

Stab.prototype.animate = function(elapsedTime,ySpeed){
	this.y += (ySpeed*elapsedTime) / 1000.0;
}

Stab.prototype.destroy = function(){

}
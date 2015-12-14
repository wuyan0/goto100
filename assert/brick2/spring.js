function Spring(positionX,positionY){
	this.att = "spring";
	this.x = positionX;
	this.y = positionY;
	this.ontouched = false;
	this.drawcount=0;
}

Spring.prototype.draw = function(){
	mvPushMatrix();
	mat4.translate(mvMatrix, [this.x, this.y, -1.0]);
	gl.bindBuffer(gl.ARRAY_BUFFER, brickVertexPositionBuffer);
	gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, brickVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);
	
	gl.bindBuffer(gl.ARRAY_BUFFER, brickVertexTextureCoordBuffer);
	gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, brickVertexTextureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);
	
	gl.activeTexture(gl.TEXTURE0);
	gl.bindTexture(gl.TEXTURE_2D, springTextures[this.drawcount]);
	gl.uniform1i(shaderProgram.samplerUniform, 0);
	
	setMatrixUniforms();
	gl.drawArrays(gl.TRIANGLE_STRIP, 0, brickVertexPositionBuffer.numItems);
	mvPopMatrix();
}

Spring.prototype.animate = function(elapsedTime,ySpeed){
	this.y += (ySpeed*elapsedTime) / 1000.0;
	if(this.ontouched)
	{
		this.drawcount = this.drawcount + 1;
	}
	if(this.drawcount == 5)
	{
		this.drawcount = 0;
		this.ontouched = 0;
	}
}

Spring.prototype.destroy = function(){

}
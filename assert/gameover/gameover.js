function Gameover(){
	this.y = 0.5;
	this.v = 0;
}

Gameover.prototype.draw = function()
{
	if(!easy)
	{
		/////////////////////////////////////////////////////
		/////////////draw dark
		mvPushMatrix();
		mat4.translate(mvMatrix, [0, 0, -1.0]);
		gl.bindBuffer(gl.ARRAY_BUFFER, darkVertexPositionBuffer);
		gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, darkVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);
		
		gl.bindBuffer(gl.ARRAY_BUFFER, darkVertexTextureCoordBuffer);
		gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, darkVertexTextureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);
		
		gl.activeTexture(gl.TEXTURE0);
		gl.bindTexture(gl.TEXTURE_2D, darkTexture);
		gl.uniform1i(shaderProgram.samplerUniform, 0);
		
		setMatrixUniforms();
		gl.drawArrays(gl.TRIANGLE_STRIP, 0, darkVertexPositionBuffer.numItems);
		mvPopMatrix();
	}
	mvPushMatrix();
	mat4.translate(mvMatrix, [0, this.y, -1.0]);
	gl.bindBuffer(gl.ARRAY_BUFFER, gameoverVertexPositionBuffer);
	gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, gameoverVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);
	
	gl.bindBuffer(gl.ARRAY_BUFFER, gameoverVertexTextureCoordBuffer);
	gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, gameoverVertexTextureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);
	
	gl.activeTexture(gl.TEXTURE0);
	gl.bindTexture(gl.TEXTURE_2D, gameoverTexture);
	gl.uniform1i(shaderProgram.samplerUniform, 0);
	
	setMatrixUniforms();
	gl.drawArrays(gl.TRIANGLE_STRIP, 0, gameoverVertexPositionBuffer.numItems);
	mvPopMatrix();
}

Gameover.prototype.animate = function(elapsedTime)
{
	if(Math.abs(this.y) < 0.01)
	{
		if(this.v < 4){
			this.v = 0;
			this.y = 0;
			
		}else
		{
			this.v = -this.v+3;
			this.y += this.y + 0.02;
		}
		//if()
	}else
	{
		this.v += 10 * elapsedTime / 1000;
		this.y = this.y - this.v * 0.1 * elapsedTime / 1000.0;
	}
	//console.log(this.y);
}


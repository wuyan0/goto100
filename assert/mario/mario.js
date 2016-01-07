
function Mario(positionX,positionY){
	this.x=positionX;
	this.y=positionY;
	this.v=0;
	this.onBrick=true;
	this.mariowalk=7;
	this.direction = 0;
	this.o_direction = 1;
	this.mariowalkTime=0;
	this.touched="normal";
	this.onsandTime=0;
	this.redCount=0;
	this.red=false;
	this.life=8;
	this.oOnstab=false;
	this.odie=false;
	this.onStab=false;
	this.lifeRecoverTime = 1000; //the frame needed to add life 1
	this.toRecoverCount = 0;
}


Mario.prototype.draw = function(){
	
	if(!easy){
		/////////////////////////////////////////////////////
		/////////////draw dark
		mvPushMatrix();
		mat4.translate(mvMatrix, [this.x, this.y, -1.0]);
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
	
	////////////////////////////////////////
	//////////draw mario
	mvPushMatrix();
	mat4.translate(mvMatrix, [this.x, this.y, -1.0]);
	gl.bindBuffer(gl.ARRAY_BUFFER, marioVertexPositionBuffer);
	gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, marioVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

	if(this.direction == 1)
	{
		gl.bindBuffer(gl.ARRAY_BUFFER, marioRightVertexTextureCoordBuffer);
		this.o_direction = 1;
	}
	else if(this.direction == -1)
	{
		gl.bindBuffer(gl.ARRAY_BUFFER, marioLeftVertexTextureCoordBuffer);
		this.o_direction = 0;
	}else
	{
		if(this.o_direction) gl.bindBuffer(gl.ARRAY_BUFFER, marioRightVertexTextureCoordBuffer);
		else gl.bindBuffer(gl.ARRAY_BUFFER, marioLeftVertexTextureCoordBuffer);
	}
	gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, marioRightVertexTextureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);
		
	
	gl.activeTexture(gl.TEXTURE0);
	gl.bindTexture(gl.TEXTURE_2D, marioTextures[this.mariowalk]);
	gl.uniform1i(shaderProgram.samplerUniform, 0);
	if(this.red)
		gl.uniform3f(shaderProgram.colorUniform, 1.0, 0.0, 0.0);
	
	setMatrixUniforms();
	gl.drawArrays(gl.TRIANGLE_STRIP, 0, marioVertexPositionBuffer.numItems);
	gl.uniform3f(shaderProgram.colorUniform, 1.0, 1.0, 1.0);
	mvPopMatrix();
	
	/////////////////////////////////////////////////////
	/////////////draw life
	mvPushMatrix();
	mat4.translate(mvMatrix, [-0.31, 0.37, -1.0]);
	gl.bindBuffer(gl.ARRAY_BUFFER, lifeVertexPositionBuffer);
	gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, lifeVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);
	
	gl.bindBuffer(gl.ARRAY_BUFFER, lifeVertexTextureCoordBuffer);
	gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, lifeVertexTextureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);
	
	gl.activeTexture(gl.TEXTURE0);
	gl.bindTexture(gl.TEXTURE_2D, lifeTextures[8 - this.life]);
	gl.uniform1i(shaderProgram.samplerUniform, 0);
	
	setMatrixUniforms();
	gl.drawArrays(gl.TRIANGLE_STRIP, 0, lifeVertexPositionBuffer.numItems);
	mvPopMatrix();
	
	
}
	
Mario.prototype.animate=function(elapsedTime,ySpeed){
	
	this.red = false;
	this.onStab = false;
	if(this.life == 0){
		this.life = 8;
	}
	
	if(this.y < -0.5 || this.y > 0.5)
		this.life = 0;
	
	if(this.x < -0.4 + 0.02) this.x = 0.4 - 0.02;
	if(this.x > 0.4 - 0.02) this.x = -0.4 + 0.02;
	
	this.mariowalkTime += elapsedTime / 1000.0;
	if(this.mariowalkTime > 0.05)
	{
		this.mariowalk = (this.mariowalk + 1) % 8;
		this.mariowalkTime = 0;
	}
	if(this.direction != 0)
	{
		this.x += this.direction*(0.2*elapsedTime) / 1000.0;
	}else
		this.mariowalk = 7;
	
	if(this.onBrick) {
		switch(this.touched){
			case "normal":
				this.y = this.y + (ySpeed*elapsedTime) / 1000.0;
				this.v = 0;
				break;
			case "spring":
				this.v = -200 * elapsedTime / 1000;
				this.y = this.y + (ySpeed*elapsedTime) / 1000.0 + 0.02;
				break;
			case "stab":
				this.onStab = true;
				this.y = this.y + (ySpeed*elapsedTime) / 1000.0;
				this.v = 0;
				if(!this.oOnstab)
				{
					ohch.play();
					this.life--;
					this.oOnstab = true;
				}
				if(this.redCount<5)
				{
					//gl.uniform3f(shaderProgram.colorUniform, 1.0, 0.0, 0.0);
					this.red = true;
				}
				this.redCount = (this.redCount + 1) % 10;
				break;
			case "sand":
				if(this.onsandTime < 15)
				{
					this.y = this.y + (ySpeed*elapsedTime) / 1000.0;
					this.v = 0;
					this.onsandTime++;
				}else this.onsandTime = 0;
				break;
		}
	}else{
		this.oOnstab = false;
		this.v += 10 * elapsedTime / 1000;
		this.y = this.y - this.v * 0.1 * elapsedTime / 1000.0;
		this.onsandTime = 0;
	}
	
	if(!this.onStab) this.toRecoverCount++;
	else this.toRecoverCount = 0;
	
	if(this.toRecoverCount == this.lifeRecoverTime && this.life < 8)
	{
		this.life++;
		this.toRecoverCount=0;
	}
	
}

Mario.prototype.destory = function(){
	if(!this.odie)
	{
		die.play();//死时的声音
		this.odie=true;
	}
}
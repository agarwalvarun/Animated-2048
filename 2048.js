var game = (function (){
	var mat=[[-1,-1,-1,-1],[-1,-1,-1,-1],[-1,-1,-1,-1],[-1,-1,-1,-1]];
	var mat1=[[-1,-1,-1,-1],[-1,-1,-1,-1],[-1,-1,-1,-1],[-1,-1,-1,-1]];
	var mat_prev=[[-1,-1,-1,-1],[-1,-1,-1,-1],[-1,-1,-1,-1],[-1,-1,-1,-1]];
	var el,score=0,flag_undo,flag_down,flag_right,flag_game_over,flag_check,start,flag_speech;
	function redraw(){
		for(var i=0;i<4;i++){
			for(var j=0;j<4;j++){
				var x=4*i+j;
				el=document.getElementById(+x);
				if (mat[i][j]!=-1){
					//el.innerHTML = mat[i][j];
					if(mat[i][j]<=2048){
						var class_name=' _'+mat[i][j];
						el.className='tile';
						el.className += class_name;
					}
					else{
						el.className='tile_big';
					}
				}
				else{
					el.innerHTML = "";
					el.className='tile';
				}
			}
		}
		document.getElementById('score').innerHTML="Score = "+score;
	}
	function can_move_down(){
		flag_down=false;
		for(var j=0;j<4;j++){
			for (var i=0;i<4;i++){
				if((i!=3 && mat[i][j]===mat[i+1][j]) || mat[i][j]===-1){
					flag_down=true;
					break;
				}
			}
			if(flag_down){
				break;
			}
		}
	}
	function can_move_right(){
		flag_right=false;
		for(var i=0;i<4;i++){
			for (var j=0;j<4;j++){
				if((mat[i][j]===mat[i][j+1] && j!=3) || mat[i][j]===-1){
					flag_right=true;
					break;
				}
			}
			if(flag_right){
				break;
			}
		}
	}
	function is_game_over(){
		flag_game_over=false;
		can_move_down();
		can_move_right();
		if(!flag_right && !flag_down){
			flag_game_over=true;
		}
	}
	function copy(){
		for(var i=0;i<4;i++){
			for(var j=0;j<4;j++){
				mat1[i][j]=mat[i][j];
			}
		}
	}
	function copy_prev_mat(){
		for(var i=0;i<4;i++){
			for(var j=0;j<4;j++){
				mat_prev[i][j]=mat[i][j];
			}
		}
	}
	function check(){
		flag_check=false;
		for(var i=0;i<4;i++){
			for(var j=0;j<4;j++){
				if(mat1[i][j]!==mat[i][j]){
					flag_check=true;
					break;
				}
				if(flag_check){
					break;
				}
			}
		}
	}
	function shiftDown(){
        var i,j;
        for(j=0;j<4;j++){
            var start=0, list_zeroes=[],check=false;
            for(i=3;i>=0;i--){
                if(mat[i][j]===-1){
                    check = true;
                    list_zeroes.push(i);
                }
                else if(mat[i][j] && check){
                    mat[list_zeroes[start]][j] = mat[i][j];
                    mat[i][j]=-1;
                    list_zeroes.push(i);
                    start++;
                }
            }
        }
    }
	function move_down(){
		copy();
		for (var j=0;j<4;j++){
			for (var i=3;i>=0;i--){
				if (mat[i][j]!=-1){
					for (var k=i-1;k>=0;k--){
						if (mat[i][j]===mat[k][j]){
							mat[i][j]=2*mat[k][j];
							mat[k][j]=-1;
							score+=mat[i][j];
							i=k;
							break;
						}
						else if(mat[k][j]!=-1){
							break;
						}
					}
				}
			}
		}
		shiftDown();
		check();
		if(flag_check){
			fillRandomEmptyCell();				
		}
	}
	function transpose(){
		for ( var i = 0; i < 4; i++ ) {
        	for ( var j = i + 1; j < 4; j++ ) {
            	var tmp = mat[i][j];
            	mat[i][j] = mat[j][i];
            	mat[j][i] = tmp;
       		}
    	}
	}
	function row_reverse(){
		for(var i=0;i<4;i++){
			var temp=mat[i][0];
			mat[i][0]=mat[i][3];
			mat[i][3]=temp;
			temp=mat[i][1];
			mat[i][1]=mat[i][2];
			mat[i][2]=temp;
		}
	}
	function col_reverse(){
		for(var j=0;j<4;j++){
			var temp=mat[0][j];
			mat[0][j]=mat[3][j];
			mat[3][j]=temp;
			temp=mat[1][j];
			mat[1][j]=mat[2][j];
			mat[2][j]=temp;
		}
	}
	function fillRandomEmptyCell(){
		var x = Math.floor((Math.random()*4));
		var y = Math.floor((Math.random()*4));
		while(mat[x][y]!=-1){
			x = Math.floor((Math.random()*4));
			y = Math.floor((Math.random()*4));
		}
		var value = Math.random();
		if (value<=.7){
			value=2;
		}
		else{
			value=4;
		}
		mat[x][y]=value;
	}
	function reset(){
		document.getElementById('over').style.height="0%";
		score=0;
		mat=[[-1,-1,-1,-1],[-1,-1,-1,-1],[-1,-1,-1,-1],[-1,-1,-1,-1]];
		fillRandomEmptyCell();
		fillRandomEmptyCell();
		redraw();
	}
	function move(e){
		e.preventDefault();
		flag_undo=true;
		copy_prev_mat();
		localStorage['prev_mat']=JSON.stringify(mat_prev);
		if(e.keyCode===37 || flag_speech===1){
			transpose();
			col_reverse();
			move_down();							
			transpose();
			row_reverse();
		}
		if(e.keyCode===38 || flag_speech===2){
			transpose();
			row_reverse();
			transpose();
			row_reverse();
			move_down();				
			transpose();
			col_reverse();
			transpose();
			col_reverse();
		}
		if(e.keyCode===39 || flag_speech===3){
			transpose();
			row_reverse();
			move_down();				
			transpose();
			col_reverse();
		}
		if(e.keyCode===40 || flag_speech===4){
			move_down();				
		}
		flag_speech=0;
		redraw();
		is_game_over();
		if(flag_game_over){
			document.getElementById('over').style.height="100%";
		}
	}
	function move_speech(){
		if(flag_speech===1){
			transpose();
			col_reverse();
			move_down();							
			transpose();
			row_reverse();
		}
		if(flag_speech===2){
			transpose();
			row_reverse();
			transpose();
			row_reverse();
			move_down();				
			transpose();
			col_reverse();
			transpose();
			col_reverse();
		}
		if(flag_speech===3){
			transpose();
			row_reverse();
			move_down();				
			transpose();
			col_reverse();
		}
		if(flag_speech===4){
			move_down();				
		}
		flag_speech=0;
		redraw();
		is_game_over();
		if(flag_game_over){
			document.getElementById('over').style.height="100%";
		}
	}
	function undo(){
		if(flag_undo){
			var prev=JSON.parse(localStorage['prev_mat']);
			for(var i=0;i<4;i++){
				for(var j=0;j<4;j++){
					mat[i][j]=prev[i][j];
				}
			}
			redraw();
			flag_undo=false;
		}
		else{
			document.getElementById('invalid-undo').style.height="100%";
		}
	}
	function initial_matrix(){
		
	}
	function init(id){
		console.log('hi in init');
		flag_speech=0;
		flag_undo=false;
		reset();
		var el1 = document.getElementById(id);
		el1.addEventListener('click',reset);
		document.getElementById('try-again').addEventListener('click',reset);
		document.getElementById('undo').addEventListener('click',undo);
		document.getElementById('ok').addEventListener('click',function(){
		document.getElementById('invalid-undo').style.height="0%";
		});		
		document.body.addEventListener('keydown',move);
		if(annyang){
			var commands = {
				'left' : function(){
					flag_speech=1;
					move_speech();
			    },
			    'up' : function(){
					flag_speech=2;
					move_speech();
			    },
			    'right' : function(){
					flag_speech=3;
					move_speech();
			    },
			    'down' : function(){
					flag_speech=4;
					move_speech();
			    },
			    'undo' : function(){
			    	undo();
			    }
            };
			annyang.addCommands(commands);
			annyang.debug();
			annyang.start();
		}
		else{
			console.log('error annyang');
		}
	}
	return {
		init: init
	};
})();
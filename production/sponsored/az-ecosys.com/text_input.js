/** TODO, make it independent of the parent, <a-entity geometry="primitive: plane; height: 0.5" position="0 1 -1" text-input="placeHolder: Enter text...!" material="opacity: 0.79; color: #ea5757" rplane="radius: 0.25" value="|" id="ttt"></a-entity>  because it is not wrapped in a-plane or a-rplane parent, it is faulty */
AFRAME.registerComponent('text-input',{
	schema:{placeHolder:{type:'string',default:'Enter text...'}},
	init:function(){
		const tI=this.el, tBg=tI.parentNode;
		if(!tI||!tBg){return}
		const bgP=tBg.getAttribute('position');
		if(bgP){const adjustedX=bgP.x-0.4, adjustedZ=bgP.z+0.01;tI.setAttribute('position',`${adjustedX} ${bgP.y} ${adjustedZ}`)}
		const bgWidth=parseFloat(tBg.getAttribute('width')),bgHeight=parseFloat(tBg.getAttribute('height')),textWidth=bgWidth*0.8,textHeight=bgHeight*0.8;
		tI.setAttribute('width',textWidth);
		tI.setAttribute('height',textHeight);
		let pH=null;
		const pHV=tI.getAttribute('place-holder')||this.data.placeHolder;
		if(pHV){pH=document.createElement('a-text');[['id','placeholder-text'],['value',pHV],['color',tI.getAttribute('color')||'#888'],['opacity','0.5'],['align',tI.getAttribute('align')||'left'],['position',tI.getAttribute('position')||'0 0 0.01'],['width',textWidth],['height',textHeight]].forEach(([a,v])=>pH.setAttribute(a,v));tBg.appendChild(pH)}
		sTI(tI,tBg,pH)
	}
});
function sTI(tI,tBg,pH){
	let isA=!1,cursorPosition=0,tC="",vLV=!0,cI;
	uTD();
	function startCursorBlink(){if(cI)clearInterval(cI);cI=setInterval(()=>{vLV=!vLV;uTD()},500)}
	function stopCursorBlink(){isA=!1;clearInterval(cI);vLV=isA;if(vLV)uTD()}
	function uTD(){
		const beforeCursor=tC.substring(0,cursorPosition),afterCursor=tC.substring(cursorPosition);
		let dT;
		if(isA){dT=beforeCursor+(vLV?"|":"")+afterCursor}
		else{if(tC.length>0){dT=tC}else{if(pH)pH.setAttribute('visible',!0)}}
		if(isA){tI.setAttribute('value',dT);if(pH)pH.setAttribute('visible',!1)}
		if(!isA&&tC.length>0){tI.setAttribute('value',dT);stopCursorBlink();if(pH)pH.setAttribute('visible',!1)}
	}
	tBg.addEventListener('click',e=>{if(!isA){isA=!0;startCursorBlink()}});
	document.addEventListener('keydown',e=>{
		if(isA&&e.key==='Backspace'||e.key==='Delete'||e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault()}
		if(isA&&e.key==='Backspace'&&cursorPosition>0){tC=tC.substring(0,cursorPosition-1)+tC.substring(cursorPosition);cursorPosition--}
		else if(isA&&e.key==='Delete'&&cursorPosition<tC.length){tC=tC.substring(0,cursorPosition)+tC.substring(cursorPosition+1)}
		else if(isA&&e.key==='ArrowLeft'&&cursorPosition>0){cursorPosition--}
		else if(isA&&e.key==='ArrowRight'&&cursorPosition<tC.length){cursorPosition++}
		else if(e.key==='Escape'){stopCursorBlink()}
		else if(isA&&e.key.length===1){tC=tC.substring(0,cursorPosition)+e.key+tC.substring(cursorPosition);cursorPosition++}
		vLV=isA;clearInterval(cI);startCursorBlink();uTD()
	});
	document.addEventListener('mousedown',e=>{if(isA){const clickedEl=e.target;let bgC=!1;if(clickedEl===tBg.object3D.el||clickedEl===tI.object3D.el){bgC=!0}if(!bgC){isA=!1;stopCursorBlink()}}})
}
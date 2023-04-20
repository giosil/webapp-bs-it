jQuery.fn.exists=function(){return this.length>0;}
jQuery.fn.clearForm=function(){$(this).find("input, select").val("");}
jQuery.validator.addMethod("date",function(val,ele){
	let bits=val.match(/(\d+)/gi),str;
	if(!bits)return this.optional(ele) || false;
	if(bits[0].length==4){
		str=bits[0]+'-'+bits[1]+'-'+bits[2];
	}else{
		str=bits[1]+'/'+bits[0]+'/'+bits[2];
	}
	return this.optional(ele) || !/Invalid|NaN/.test(new Date(str));
},'Inserire una data valida');
jQuery.validator.addMethod("pwd",function(val,ele){
	if(this.optional(ele)) return true;
	if(val.length<8) return false;
	let ll=false,lu=false,nu=false,sy=false;
	for(let i=0; i<val.length; i++){
		let c=val.charCodeAt(i);
		if(c>=97 && c<=122) ll=true; else if(c>=65 && c<=90) lu=true; else if(c>=48 && c<=57) nu=true; else sy=true;
	}
	if (!(ll || lu) || !nu || !sy) return false;
	return true;
},'Inserire password valida (lung=8, lettere, numeri e simboli)');
jQuery.validator.addMethod("piva",function(val,ele){
	if(this.optional(ele) && !val) return true;
	if(val.length<11 || val.length>14) return false;
	val=val.toUpperCase();
	let c0=val.charCodeAt(0);
	if(c0>=48 && c0<=57){
		if(val.length!=11) return false;
		for(let i=0; i<val.length; i++){
			let c=val.charCodeAt(i);
			if(c<48 || c>57) return false;
		}
	}
	else if(c0>=65 && c0<=90){
		let c1=val.charCodeAt(1);
		if(c1>=65 && c1<=90) {
			if(c0 == 73 && c1 == 84 && val.length!=13) return false;
			for(let i=2; i<val.length; i++){
				let c=val.charCodeAt(i);
				if(c<48 || c>57) return false;
			}
		}
		else{
			return false;
		}
	}
	else{
		return false;
	}
	return true;
},'Partita IVA non valida');
jQuery.validator.addMethod("codfis",function(val,ele){
	if(this.optional(ele) && !val) return true;
	if(val.length<11) return false;
	val=val.toUpperCase();
	if(val.length==11){
		for(let i=0; i<val.length; i++){
			let c=val.charCodeAt(i);
			if(c<48 || c>57) return false;
		}
		return true;
	}
	else if(val.length==16){
		let l = [0,1,2,3,4,5,8,11,15];
		for(let i=0; i<val.length; i++){
			let c=val.charCodeAt(i);
			if(l.indexOf(i) >= 0) {
				if(c<65 || c>90) return false;
			}
			else {
				if(c<48 || c>57) return false;
			}
		}
		return true;
	}
	return false;
},'Codice Fiscale non valido');
jQuery.validator.addMethod("notEqualTo",function(val,ele,par){
	if(this.optional(ele))return true;
	if(par && par.indexOf('#')==0)return val!=$(par).val();
	return val!=par;
},'Valore digitato non ammesso');
jQuery.validator.classRuleSettings.notEqualTo={notEqualTo:true};

function showHidePassword(s) {
	if($(s + ' input').attr("type") == "text"){
		$(s + ' input').attr('type', 'password');
		$(s + ' i').addClass("fa-eye-slash" );
		$(s + ' i').removeClass("fa-eye" );
	}
	else if($(s + ' input').attr("type") == "password"){
		$(s + ' input').attr('type', 'text');
		$(s + ' i').removeClass("fa-eye-slash" );
		$(s + ' i').addClass("fa-eye" );
	}
}

$.fn.select2.defaults.set('language','it');
$.fn.modal.Constructor.prototype.enforceFocus=function(){}; // Fix for select2 in modal

toastr.options={
	"closeButton":false,"debug":false,"progressBar":false,"preventDuplicates":false,
	"positionClass":"toast-top-right","onclick":null,
	"hideDuration":"1000","timeOut":"4000","extendedTimeOut":"1000",
	"showEasing":"swing","hideEasing":"linear",
	"showMethod":"fadeIn","hideMethod":"fadeOut"
};
function _showMessage(msg,title,type,dlg){
	if(dlg){
		swal({title:title,type:type,text:msg});
		return;
	}
	if(type===undefined || type===null || type==='' || type==='info'){
		toastr.info(msg, title);
	}
	else
	if(type=='success'){toastr.success(msg,title);} else
	if(type=='warning'){toastr.warning(msg,title);} else
	if(type=='error'){toastr.error(msg,title);} else {toastr.info(msg, title);}
}
function _showInfo(msg,title,dlg,f){
	if(!title)title="Informazioni";
	if(dlg){
		swal({title:title,text:msg},f);
	}
	else{
		toastr.info(msg,title);
	}
}
function _showSuccess(msg,title,dlg){
	if(!title)title="Informazioni";
	if(dlg){
		swal({title:title,type:"success",text:msg});
	}
	else{
		toastr.success(msg,title);
	}
}
function _showWarning(msg,title,dlg){
	if(!title)title="Attenzione";
	if(dlg){
		swal({title:title,type:"warning",text:msg});
	}
	else{
		toastr.warning(msg,title);
	}
}
function _showError(msg,title,dlg){
	if(!title)title="Errore";
	if(dlg){
		swal({title:title,type:"error",text:msg});
	}
	else{
		toastr.error(msg,title);
	}
}
function _confirm(msg,f){
	if(typeof f==='function'){
		swal({title:"Conferma",type:"warning",text:msg,confirmButtonText:"Si",cancelButtonText:"No",confirmButtonColor:"#dd6b55",showCancelButton:true,closeOnConfirm:true,closeOnCancel:true},f);
	}
	else{
		return window.confirm(msg);
	}
}
function _getInput(msg,f,d) {
	if(typeof f==='function'){
		swal({title:"Inserisci",type:"input",inputValue:d,text:msg,showCancelButton:true},f);
	}
	else{
		return window.prompt(msg);
	}
}

$(function(){DevExpress.ui.dxOverlay.baseZIndex(3000);});
function fixDataGridHeightInsideModal(e){
if (e.element.hasAncestor('.modal')) {
	let windowHeight = parseInt($(window).height());
	let initialDataGridHeight = parseInt(e.element.height());
	let $modal = e.element.closest('.modal');
	let $modalDialog = $modal.find('.modal-dialog');
	let $modalHeader = $modal.find('.modal-header');
	let $modalBody = $modal.find('.modal-body');
	let $modalFooter = $modal.find('.modal-footer');
	let $tableActions = $modal.find('.table-actions');
	let pixelsToBeRemoved = 0;
	pixelsToBeRemoved += parseInt($modalDialog.css("margin-top"));
	pixelsToBeRemoved += parseInt($modalDialog.css("margin-bottom"));
	pixelsToBeRemoved += parseInt($modalBody.css("padding-top"));
	pixelsToBeRemoved += parseInt($modalBody.css("padding-bottom"));
	if ($modalHeader.exists()) {
		pixelsToBeRemoved += parseInt($modalHeader.outerHeight(true));
	}
	if ($modalFooter.exists()) {
		pixelsToBeRemoved += parseInt($modalFooter.outerHeight(true));
	}
	if ($tableActions.exists()) {
		pixelsToBeRemoved += parseInt($tableActions.outerHeight(true));
		pixelsToBeRemoved -= parseInt($modalBody.css("padding-top"));
	}
	pixelsToBeRemoved += parseInt(5);
	if (windowHeight - pixelsToBeRemoved < initialDataGridHeight){
		e.component.option("height", windowHeight - pixelsToBeRemoved);
	}
}}

let $wuxwp = $('#wux-waitpls');
if(!$wuxwp.length) {
	$('<div id="wux-waitpls" class="waitpls"></div>').appendTo('body');
}

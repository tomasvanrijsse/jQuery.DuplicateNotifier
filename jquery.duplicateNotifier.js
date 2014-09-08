/* INSTALLATION NOTES
Put this piece of code somewhere in your html between <html> ... </html>

<script type="text/javascript">
	$(document).ready(function(){
		$('body').duplicateNotifier(true);
		// $( ) within this element will be searched for duplicate ids
		// findDoubleIds( boolean) the boolean indicated wether you get alert message(default) or red prompts on the position of the duplicate ID's
	});
</script>

*/

(function($){
		  
$.fn.duplicateNotifier = function(showPrompts){
	return this.each(function(){
		var allids = $.duplicateNotifier.collectids(this);
		if(showPrompts){
			for(id in allids){
				if(allids[id]>1){
					$.duplicateNotifier.buildPrompt(allids[id],id);
				}
			}
		} else {
			var message ="";
			for(id in allids){
				if(allids[id]>1){
					message += allids[id]+' x '+id+'\n';
				}
			}
			if(message!=""){
				alert('There are double ids on this page:\n'+message);	
			}
		}
		allids = undefined;
	});
}

$.duplicateNotifier = {
	collectids : function (element){
		var allids = new Array();
		if($(element).children().length > 0){
			$(element).children().each(function(){
				newids = $.duplicateNotifier.collectids(this);								
				allids = $.duplicateNotifier.mergeArrays(newids,allids);
			});
		} 
		
		var id = $(element).attr('id');
		if(id !== undefined){
			if(allids.hasOwnProperty(id)){
				allids[id] = allids[id]+1;
			} else {
				allids[id] = 1;
			}
		}
		return allids;
	},
	mergeArrays: function(one,two){
		var three = one;
		for(id in two){
			if(three.hasOwnProperty(id)){
				three[id] = three[id]+two[id];
			} else {
				three[id] = two[id];
			}
		}
		return three;
	},
	buildPrompt : function(amount,id,element){
		if(element===undefined){
			element = $('body');	
		}
		if($(element).attr('id')==id){
			//$('body').append('<div class="doubleid_'+id+'">'+amount+' x '+id+'</div>');	
			var divDoubleError = document.createElement('div');
			var content = document.createElement('div');
			var arrow = document.createElement('div');
			$("body").append(divDoubleError);
			if($(element).is(':visible')){
				$(divDoubleError).addClass("doubleIdError").append(content).append(arrow).css({"top":$(element).offset().top-$(element).height()-15,"left":$(element).offset().left,"opacity":0,"position":"absolute"});
			} else {
				var bool = true
				var testel = $(element);
				while(bool != false){
					testel = $(testel).parent();
					if($(testel).is(':visible')){bool = false;}
				}
				$(divDoubleError).addClass("doubleIdError").append(content).append(arrow).css({"top":$(testel).offset().top-15,"left":$(testel).offset().left,"opacity":0,"position":"absolute"});
			}
			$(content).html(amount+' x '+id).css({'background-color':'#FF0000','border':'2px solid #DDDDDD','color':'#FFFFFF','padding':'4px 10px'});
			for(i = 0;i<8;i++){$(arrow).append('<div class="line"><!-- -->');}$(arrow).append('<div style="width:3px;background-color:#DDD;height:1px;margin:0 auto;"></div><div style="width:1px;background-color:#DDD;height:1px;margin:0 auto;"></div>')
			$(arrow).css({'margin':'-2px 0 0 5px','width':8*2+3+'px'})
			.find('.line').css({'background-color':'#FF0000','height':'1px','margin':'0 auto','border-left':'2px solid #DDDDDD','border-right':'2px solid #DDDDDD'}).each(function(index){$(this).css({'width':(($(arrow).find('.line').size()*2-1)-2*index)+'px'});});
			$(divDoubleError).animate({"opacity":0.87},function(){return true;});
		}
		if($('.doubleid_'+id).length != amount-1 && $(element).children().length > 0){
			$(element).children().each(function(){
				$.duplicateNotifier.buildPrompt(amount,id,this);
			});
		}
	}
}
})(jQuery)

$('body').duplicateNotifier();
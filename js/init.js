/* 
* @author     Chanaka Mannapperuma <irusri@gmail.com>
* @date       2013-08-20
* @version    Beta 1.0
* @usage      Expression view create new elements
* @licence    GNU GENERAL PUBLIC LICENSE
* @link       http://irusri.com
*/
//Basic parameters
var data; 
var maxRatio=0; 
var legenditems=11;
var private_mode="";
var private_view="";
var private_id="";
var errorboolean=false;
var notloaded=false;
var get_zoom=1;

//Setcookies input txt onchange
function setCookietxtChange(){
	
	private_id=document.getElementById('input_id').value
var txtchangevalue=document.getElementById('input_id').value;
setCookie("cookie_input_id",txtchangevalue,10);
}

//Init method to $_GET url parameters from remote call or cookies
function init(){
	if(notloaded==false ){
		if(get_from=="gp"){
			setTimeout(function() { init(); }, 500);
			notloaded=true;
		}
	}
	
	if(get_zoom!=""){document.body.style.zoom = get_zoom*100+"%";document.body.style.WebkitTransform = "scale("+get_zoom*100+"%"+")";document.body.style['transform'] = "scale("+get_zoom+")";document.body.style.MozTransformOrigin = "0 0";}	
	
	if(get_allcontrols=="false"){
		document.getElementById("header_exptable").style.visibility="hidden";
		document.getElementById("inputtoolbox").style.visibility="hidden";
		document.getElementById("newtable_2").style.visibility="hidden";
		document.getElementById("newtable_3","header").style.visibility="hidden";
		document.getElementById("header").style.visibility="hidden";
		}	
	if(get_download=="true"){document.getElementById("download").style.visibility="visible";}	
		
	if(get_id==""){
		var cookie_input_id=getCookie("cookie_input_id");
		if(cookie_input_id!=null && cookie_input_id != undefined){private_id=cookie_input_id;}else{private_id="POPTR_0001s01300";}
	}else{
		private_id=get_id;
	}
	
	if(get_view==""){
		var cookie_view=getCookie("cookie_view");
		if(cookie_view!=null && cookie_view != undefined){private_view=cookie_view;}else{private_view="plant";}
	}else{
		private_view=get_view;
	}
	
	if(get_mode==""){
		var cookie_mode=getCookie("cookie_mode");
		if(cookie_mode!=null && cookie_mode != undefined){private_mode=cookie_mode;}else{private_mode="relative";}
	}else{
		private_mode=get_mode;
	}
	changeview(private_view);
	

} 
	
//Change views method using corresponding mode values to load SVG
function changeview(tmpview){
	
	
	
	removerootsvg();
	var b1 = document.getElementById('b1');
	var b2 = document.getElementById('b2');
	var b3 = document.getElementById('b3');
	if(tmpview=="plant"){
		b1.className="button_selected";
		b2.className="button";
		b3.className="button";
		chanaka.xml("svg/plant.svg", "image/svg+xml", function(xml) {
		var importedNode = document.importNode(xml.documentElement, true);
		chanaka.select("#viz").node().appendChild(xml.documentElement);});
	}else if(tmpview=="20leaves"){
		b1.className="button";
		b2.className="button_selected";
		b3.className="button";
		chanaka.xml("svg/20leaves.svg", "image/svg+xml", function(xml) {
		var importedNode = document.importNode(xml.documentElement, true);
		chanaka.select("#viz").node().appendChild(xml.documentElement);});
	}else if(tmpview=="asp201"){
		b1.className="button";
		b2.className="button";
		b3.className="button_selected";		 
		chanaka.xml("svg/asp201.svg", "image/svg+xml", function(xml) {
		var importedNode = document.importNode(xml.documentElement, true);
		chanaka.select("#viz").node().appendChild(xml.documentElement);});
	}
	//console.log(tmpview);
	private_view=tmpview;
	if(private_view=="plant"){
	document.getElementById("sourcetxt").innerHTML="Microarray data"
	}else{
	document.getElementById("sourcetxt").innerHTML="RNASeq data"
	}
	retrievedata();
	
	
}
//Change radio button mode to Relative or Absolute
function rgbchecked(){
	var ele = document.getElementsByName('modergb');
	if(ele[0].checked){
		mode="relative";
	}else{
		mode="absolute";
	}
	private_mode=mode;
	setCookie("cookie_mode",private_mode,10);
	retrievedata();
}
//JSON GET data using popapi AJAX call 
function retrievedata() {
	var ele = document.getElementsByName('modergb');
	if(private_mode=="relative"){
		ele[0].checked=true;
	}else{
		ele[1].checked=true;;
	}
	
	
	document.getElementById('input_id').value=private_id;	
	setCookie("cookie_input_id",private_id,10);
	setCookie("cookie_mode",private_mode,10);
	setCookie("cookie_view",private_view,10);
	
	var data; 
	chanaka.json("service/eplant.php?primaryGene="+private_id+"&view="+private_view, function(error, json) {
	if (error) return console.warn(error);
	data = json;

	if(data.popdata==null){
		errorboolean=true;
		callerror();
		return;
	}else{ 
		errorboolean=false;	
		if(get_exlink=="true"){document.getElementById('externallink').innerHTML="Populus ePlant data for <a target='_blank' href='http://v3.popgenie.org/content/eplant-0?popid=" +private_id+"&mode=relative&view="+private_view+"'>"+private_id+"</a>";}
		if(private_view=="plant" && get_exlink!="true"){document.getElementById('externallink2').innerHTML="<a target='_blank' href='http://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSE6422'>Tissue Comparison GEO: GSE6422</a><br><a target='_blank' href='http://www.ncbi.nlm.nih.gov/pubmed/18775973'>Yang et al. 2008</a><br>";
		}else{
			document.getElementById('externallink2').innerHTML="";
			}
	
	}

	getthemaxvalue(data);
	if(get_exptable!="false" && get_allcontrols !="false"){
		createexpressiontable(data)}else{
			
		}
	});
	
//console.log(getthemaxvalue(data));

}
//Color the objects using data signals
function colourobjects(sample,colorvalue,value) {
//	console.log(private_id+'-'+private_view+'-'+private_mode);
//	console.log('painting start');
var tip_value=private_mode.charAt(0).toUpperCase() + private_mode.slice(1)+' mode</br>Value: '+roundNumber(value,2)+"</br>"+
		sample.charAt(0).toUpperCase() + sample.slice(1);
	if(private_view=="20leaves"){
		for(var i=1;i<18;i++){
			if(i<10){var ki='0'+i;}
			if(sample=="leaf-"+ki){
			var leaf = chanaka.select(document.getElementById("viz")).selectAll("svg").selectAll("g#leaf"+i).selectAll("path");;
			leaf.attr("fill", colorvalue);
			show_tooltips(leaf,tip_value);
			}
		}
		if(sample=="alidhem"){
			var alidhem = chanaka.select(document.getElementById("viz")).selectAll("svg").selectAll("g#leaf18").selectAll("path");;
			alidhem.attr("fill", colorvalue);
			show_tooltips(alidhem,tip_value);
		}
		if(sample=="ersboda"){
			var ersboda = chanaka.select(document.getElementById("viz")).selectAll("svg").selectAll("g#leaf19").selectAll("path");;
			ersboda.attr("fill", colorvalue);
			show_tooltips(ersboda,tip_value);
		}
		if(sample=="sculPark"){
			var sculPark = chanaka.select(document.getElementById("viz")).selectAll("svg").selectAll("g#leaf20").selectAll("path");;
			sculPark.attr("fill", colorvalue);
			show_tooltips(sculPark,tip_value);
		}
	}
	if(private_view=="asp201"){
		var test=chanaka.select(document.getElementById("viz")).selectAll("svg");
		if(sample=="Roots-Control"){var RootsControl = test.selectAll("g#roots").selectAll("path");;RootsControl.attr("fill", colorvalue);show_tooltips(RootsControl,tip_value);}
		if(sample=="Seeds-Mature"){var seedsmature = test.selectAll("g#matureseeds").selectAll("path");seedsmature.attr("fill", colorvalue);show_tooltips(seedsmature,tip_value);}
		if(sample=="Suckers-Whole-Sucker"){var suckerswholesucker = test.selectAll("g#sucker").selectAll("path");;suckerswholesucker.attr("fill", colorvalue);show_tooltips(suckerswholesucker,tip_value);}
		if(sample=="Cambium-Phloem-Dormant"){var cambiumphloemdormant = test.selectAll("g").selectAll("path#wood");;cambiumphloemdormant.style("fill", colorvalue);show_tooltips(cambiumphloemdormant,tip_value);}	
		
		if(sample=="Leaves-Drought"){var leavesdrought = test.selectAll("g#drought").selectAll("path");;leavesdrought.attr("fill", colorvalue);show_tooltips(leavesdrought,tip_value);}
		if(sample=="Leaves-Beetle-Damaged"){var beetle = test.selectAll("g#beetle").selectAll("path");;beetle.attr("fill", colorvalue);show_tooltips(beetle,tip_value);}
		if(sample=="Leaves-Mechanical-Damage"){var mechanical = test.selectAll("g#mechanical").selectAll("path");;mechanical.attr("fill", colorvalue);show_tooltips(mechanical,tip_value);}	
		if(sample=="Leaves-Control"){var leavescontrol = test.selectAll("g#control").selectAll("path");;leavescontrol.attr("fill", colorvalue);show_tooltips(leavescontrol,tip_value);}	
		
		if(sample=="Buds-Dormant"){var budsdormant = test.selectAll("g#dormantbuds").selectAll("path");;budsdormant.attr("fill", colorvalue);show_tooltips(budsdormant,tip_value);}	
		if(sample=="Buds-Pre-chilling"){var budsprechilling = test.selectAll("g#prechillingbuds").selectAll("path");;budsprechilling.attr("fill", colorvalue);show_tooltips(budsprechilling,tip_value);}	
		if(sample=="Leaves-Young-Expanding"){var leavesyoungexpanding = test.selectAll("g#youngexpandingbuds").selectAll("path");;leavesyoungexpanding.attr("fill", colorvalue);show_tooltips(leavesyoungexpanding,tip_value);}	
		if(sample=="Leaves-Freshly-Expanded"){var leavesfreshlyexpanded = test.selectAll("g#youngexpandedleaves").selectAll("path");;leavesfreshlyexpanded.attr("fill", colorvalue);show_tooltips(leavesfreshlyexpanded,tip_value);}
		if(sample=="Leaves-Mature"){var matureleavess = test.selectAll("g#matureleaves").selectAll("path");;matureleavess.attr("fill", colorvalue);show_tooltips(matureleavess,tip_value);}
			
		if(sample=="Flowers-Dormant"){var fowersdormant = test.selectAll("g#dormantflower").selectAll("path");;fowersdormant.attr("fill", colorvalue);show_tooltips(fowersdormant,tip_value);}	
		if(sample=="Flowers-Expanding"){var flowersexpanding = test.selectAll("g#expandingflower").selectAll("path");;flowersexpanding.attr("fill", colorvalue);show_tooltips(flowersexpanding,tip_value);}	
		if(sample=="Flowers-Expanded"){var flowersexpanded = test.selectAll("g#expandedflower").selectAll("path");;flowersexpanded.attr("fill", colorvalue);show_tooltips(flowersexpanded,tip_value);}			
	}
		
	if(private_view=="plant"){
		if(sample=="mature-leaves"){
			var mature_leavesl = chanaka.select(document.getElementById("viz")).selectAll("svg").selectAll("g#mature_leavesl").selectAll("path");;
			var mature_leavesr = chanaka.select(document.getElementById("viz")).selectAll("svg").selectAll("g#mature_leavesr").selectAll("path");;
			mature_leavesl.attr("fill", colorvalue);
			mature_leavesr.attr("fill", colorvalue);
			show_tooltips(mature_leavesl,tip_value);
			show_tooltips(mature_leavesr,tip_value);}
	   
		if(sample=="nodes"){
			var node = chanaka.select(document.getElementById("viz")).selectAll("svg").selectAll("path#node");
			node.attr("fill", colorvalue);
			show_tooltips(node,tip_value);}
	   
		if(sample=="internodes"){
			var internode = chanaka.select(document.getElementById("viz")).selectAll("svg").selectAll("line#internode");
			internode.attr("stroke", colorvalue);
			internode.attr("fill", colorvalue);
			show_tooltips(internode,tip_value);}
			
		if(sample=="young-leaves"){
			var young_leavesr1 = chanaka.select(document.getElementById("viz")).selectAll("svg").selectAll("g#young_leavesr1").selectAll("path");;
			var young_leavesr2 = chanaka.select(document.getElementById("viz")).selectAll("svg").selectAll("g#young_leavesr2").selectAll("path");;
			var young_leavesl1 = chanaka.select(document.getElementById("viz")).selectAll("svg").selectAll("g#young_leavesl1").selectAll("path");;
			young_leavesr1.attr("fill", colorvalue);
			young_leavesr2.attr("fill", colorvalue);
			young_leavesl1.attr("fill", colorvalue);
			show_tooltips(young_leavesr1,tip_value);
			show_tooltips(young_leavesr2,tip_value);
			show_tooltips(young_leavesl1,tip_value);}
		
		if(sample=="roots"){
			var roots = chanaka.select(document.getElementById("viz")).selectAll("svg").selectAll("g#roots").selectAll("g").selectAll("path");;
			roots.attr("fill", colorvalue);
			show_tooltips(roots,tip_value);}
		}
  
}

//An error call
function callerror(){
	removexpressiontable();
	removerootsvg();
	chanaka.xml("svg/error.svg", "image/svg+xml", function(xml) {
		var importedNode = document.importNode(xml.documentElement, true);
		chanaka.select("#viz").node().appendChild(xml.documentElement);});
}

//toggle gene list
function toggleMe(){
  var e=document.getElementById('newtable_3');
  if(!e)return true;
  if(e.style.display=="none"){
  //  e.style.display="block"
	document.getElementById('newtable_3').style.display="block"
	document.getElementById('newtable_2').style.display="none"
  } else {
    document.getElementById('newtable_3').style.display="none"
	document.getElementById('newtable_2').style.display="block"
  }
  return true;
}

//select id from gene list
function selectidfromlist(id){
	private_id=id;
	if(errorboolean==true){
		changeview(private_view);
	}else{
		retrievedata();
	}
}

/** 
*This function will show/hide tool tips according the mouse events
**/
function show_tooltips(element_id,values){
	console.log('ss'+get_zoom);
	if(get_zoom>0.6 || get_zoom==""){
	
	var tooltip = chanaka.select("body")
	.append("viz")
	//.className("tooltip")
	.attr("class", "tooltip")
	.style("position", "absolute")
	.style("z-index", "10")
	.style("visibility", "hidden")
	.html(values);
element_id.on("mouseover", function(){return tooltip.style("visibility", "visible");})
element_id.on("mousemove", function(){return tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+16)+"px");})
element_id.on("mouseout", function(){return tooltip.style("visibility", "hidden");});	
	}
}


/**
* trimTail function trims the ending , after row reading ends
*/
function trimTail(str){
                var tail = str.substring(0,str.length-1);  return tail;
            }
/**
* main function that is to be called to read table content before saving
*/
function readTable(t){
                var table = document.getElementById(t);
                var rowLength = table.rows.length;
                var colLength = table.rows[0].cells.length;
                var header = "";
                var body = "";                
                for(var i=0;i<colLength;i++){
                    header = header+table.rows[0].cells[i].innerHTML+",";
                }
                header = trimTail(header);                
                for(var j=1;j<rowLength;j++){
                    for(var k=0;k<colLength;k++){// reading content of each column
                        body = body+table.rows[j].cells[k].innerHTML+",";
                    }                    
                    body = trimTail(body)+'\r\n';
                }                
                body = header+ '\r\n'+body;
                saveFile(body);
            }
/**
*saving option as per browser
*/
  function saveFile(str){
                 if (navigator.appName != 'Microsoft Internet Explorer'){
                    window.open('data:text/csv;charset=utf-8,' + escape(str));
                }  else{
                    var popup = window.open('','csv','');
                    popup.document.body.innerHTML = '<pre>' + str + '</pre>';
                }
            }
var images = new Array()

function preload() {
	for (i = 0; i < preload.arguments.length; i++) {
		images[i] = new Image()
		images[i].src = preload.arguments[i]
	}
}
preload(
	"img/splash.jpg",
	"img/inicio-inactivo.jpg",
	"img/cancionero-activo.jpg",
	"img/menu-activo.jpg",
	"img/fotos-activo.jpg",
	"img/info-activo.jpg"
)

var promos;
var slides;
/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // `load`, `deviceready`, `offline`, and `online`.
    bindEvents: function() {
//        document.addEventListener('deviceready',this.onDeviceReady, false);
		document.addEventListener('deviceready',this.start, false);
//        document.getElementById('encode').addEventListener('click', this.encode, false);
    },

    // deviceready Event Handler
    //
    // The scope of `this` is the event. In order to call the `receivedEvent`
    // function, we must explicity call `app.receivedEvent(...);`
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },

    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    },

    start: function() {		
		var searching = false;
		navigator.splashscreen.hide();
		updateMyApp("inicio");
		setTimeout(function(){
			$('#splash').fadeOut(function(){
				StatusBar.overlaysWebView(true);
				StatusBar.show();
			});
			search_all();
		},3000);
		
		slides = $('#slides').bxSlider({
			controls: false,
			snap:true,
			onSliderLoad: function(){
			  setTimeout(function(){
					$('.bx-wrapper:nth-child(1),#slides').animate({opacity:1},'slow');
			  },800);
			}
		});
		promos = $('#promos').bxSlider({
		  minSlides: 2,
		  maxSlides: 2,
		  slideWidth: 305,
		  slideMargin: 35,
		  controls:false,
		  onSliderLoad: function(){
			  setTimeout(function(){
					$('.bx-wrapper:nth-child(2),#promos').animate({opacity:1},'slow');
			  },800);
			}
		});

		function updateMyApp(page) {
		  if(page=="") page="inicio";
		  $('nav a').removeClass('active');
		  $('#nav_'+page).addClass('active');
  			$('.page.active').fadeOut('10',function(){
				$('.page.active').removeClass('active');
				$('#page_'+page).addClass('active');
				$('#page_'+page).fadeIn('10',function(){
					switch(page){
						case 'inicio':
							setup_inicio();
						break;
						case 'cancionero':
							setup_cancionero();
						break;
						case 'fotos':
							if($('#photo_show').css('background-image')=="none"){
								setup_fotos();		
							}
							//Checar si hay fotos después del último id recuperado, si es positivo insertar (preppend), setup_fotos();
							//$('#photo_list').append('<img class="lazy" data-original="img/1.jpg" />');
							
						break;
					}
				});
			});
			setLocationHash(page);
		}
		var alphabet = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","Ñ","O","P","Q","R","S","T","U","V","W","X","Y","Z"];
		var current = "";
		function setup_cancionero(){
			covers = new IScroll('#covers_section',{click: true,probeType:3,scrollbars: true,interactiveScrollbars: true,shrinkScrollbars: 'scale',fadeScrollbars: true});
			covers.scrollTo(0,0,1500);
			covers.on('scrollEnd', function(){
				$("img.lazy2").lazyload();
				if (this.y == this.maxScrollY){
				}
			});
			$('#menu_cancionero ul li').click(function(e) {
				if($(this).hasClass('active')){
					$('#menu_cancionero ul li').removeClass('active');
				}else{
					$('#menu_cancionero ul li').removeClass('active');
					$(this).addClass('active');
				}
            });
			$('#alphabet ul').on('touchstart',function(e){
				$(this).css('opacity',1);
				$('#alphabet span').css('opacity',1);
				$('#alphabet span').css('color','#bbb');
			});
			$('#alphabet span').on('touchstart',function(e){
				$('#alphabet ul').css('opacity',1);
				$(this).css('opacity',1);
			});
			$('#alphabet ul').on('touchmove',function(e){
				posX = e.originalEvent.touches[0].pageX;
				width = $('#alphabet ul').width();
				if(posX>0&&posX<width){
					pos = Math.floor(posX/20);
					selected = alphabet[pos];
					if(current!=selected){
						$('#alphabet ul li').css('color','#bbb');
						$('#alphabet ul li').css('font-size','15px');
						$('#alphabet span').css('color','#bbb');
						$('#alphabet span').css('font-size','15px');
						current = selected;
						$('#alphabet ul li:nth-child('+(pos+1)+')').css('color','#fff');
						$('#alphabet ul li:nth-child('+(pos+1)+')').css('font-size','18px');
					}
				}
			});
			$('#alphabet ul').on('touchend',function(e){
				console.log(current);
				setTimeout(function(){$('#alphabet ul').animate({opacity:0.4},'slow');$('#alphabet span').animate({opacity:0.4},'slow');},200);
			});
			$('#alphabet span').on('touchend',function(e){
				setTimeout(function(){$('#alphabet ul').animate({opacity:0.4},'slow');$('#alphabet span').animate({opacity:0.4},'slow');},200);
			});
			$('#alphabet span').click(function(e) {
				$('#alphabet ul li').css('color','#bbb');
				$('#alphabet ul li').css('font-size','15px');
				$(this).css('color','#fff');
				$(this).css('font-size','17px');
			});
			$('#alphabet ul li').click(function(e) {
				$('#alphabet span').css('color','#bbb');
				$('#alphabet span').css('font-size','15px');
				$('#alphabet ul li').css('color','#bbb');
				$('#alphabet ul li').css('font-size','15px');
				current = $(this).html();
				console.log(current);
				$(this).css('color','#fff');
				$(this).css('font-size','18px');
            });
			
			
			//Search handler
			$('#search_button').click(function(e){
				$('#search_section form').submit();
			});
			$('#search_section form').submit(function(e) {
                e.preventDefault();
				search_text = $('#search').val();
				alert(search_text);
				alert(searching);
				if(search_text!=""&&!searching){
					$('#search').blur();
					alert("searching");
					searching = true;
					$("#covers_section .scroller").html("");
					type = $('#search_section form input[name="radio"]:checked').val();
					//Setting search_name and sliding down search name text
					$('#search_name span').html(search_text.toUpperCase());
					$('#search_name').slideDown('slow');
					//Resetting alphabet and select TODOS
					$('#alphabet span').css('color','#fff');
					$('#alphabet span').css('font-size','18px');
					$('#alphabet ul li').css('color','#bbb');
					$('#alphabet ul li').css('font-size','15px');
					//Search on server
					result = "";
					$.ajax({
						url: "http://www.tuquinielita.com/lacantadabar/getSongs.php",
						dataType: "jsonp",
						data: {type:type,search:search_text},
						success: function (response) {
							alert("response");
							if(response.success){
								alert("success");
								count = response.items.length;
								$.each(response.items,function (i,item) {
									result+="<div class='cover'><img class='lazy2' data-original='http://www.tuquinielita.com/lacantadabar/" + item.cover_path+ "'></img><div class='song_name'>"+item.song+"</div><div class='artist_name'>"+item.artist+"</div></div>";
									if (!--count) {
											$("#covers_section .scroller").prepend(result);
											covers.refresh();
											$("img.lazy2").lazyload({effect : "fadeIn",container: $('#covers_section')});
											searching=false;
									}
								});
							}else{
								alert("sucess false");
								searching=false;
							}
						},
						error: function(){
							alert("error");
							searching=false;
						}
					});
				}
            });
			//Setting BORRAR BÚSQUEDA click
			$('#search_name div').click(function(e) {
				//Sliding up search name and resetting the search name text to empty
                $('#search_name').slideUp('slow',function(){
					$('#search_name span').html("");
				});
				//Deleting text on search bar input
				$('#search_section .clear_input').click();
				search_all();
            });
			$('.deleteable').clearSearch();
		}
		function search_all(){
			search_text = "";
			if(!searching){
				$("#covers_section .scroller").html("");
				searching = true;
				type = $('#search_section form input[name="radio"]:checked').val();
				//Resetting alphabet and select TODOS
				$('#alphabet span').css('color','#fff');
				$('#alphabet span').css('font-size','18px');
				$('#alphabet ul li').css('color','#bbb');
				$('#alphabet ul li').css('font-size','15px');
				//Search on server
				result = "";
				$.ajax({
					url: "http://www.tuquinielita.com/lacantadabar/getSongs.php",
					dataType: "jsonp",
					data: {type:type,search:search_text},
					success: function (response) {
						if(response.success){
							count = response.items.length;
							$.each(response.items,function (i,item) {
								result+="<div class='cover'><img class='lazy2' data-original='http://www.tuquinielita.com/lacantadabar/" + item.cover_path+ "'></img><div class='song_name'>"+item.song+"</div><div class='artist_name'>"+item.artist+"</div></div>";
								if (!--count) {
										$("#covers_section .scroller").prepend(result);
										covers.refresh();
										$("img.lazy2").lazyload({effect : "fadeIn",container: $('#covers_section')});
										searching=false;
										alert("success");
								}
							});
						}else{
							searching=false;
							alert("false");
						}
					},
					error: function(){
						alert("error");
						searching=false;
					}
				});
			}
		}
		function setup_inicio(){			
			if(check_refresh("setup_inicio")){
				checarSlides("slides");
				checarSlides("promos");
			}
			if(!$("#slides li").length){
				checarSlides("slides");
			}
			if(!$("#promos li").length){
				checarSlides("promos");
			}
		}
		function check_refresh(variable){
			console.log("Checando "+variable+"...");
			now = Date.now();
			if(!localStorage.getItem(variable)||((parseInt(now)-parseInt(localStorage.getItem(variable)))/1000)>10){
				localStorage.setItem('setup_inicio',now);
				console.log("Actualizando "+variable+"...");
				return true;
			}
			console.log("No actualizar "+variable+" actualizada.");
			return false;
		}
		function checarSlides(target){
			var prepend="";
			if(target=="slides"){
				type="1";
			}else{
				type="2";
			}
			$.ajax({
				url: "http://www.tuquinielita.com/lacantadabar/getAds.php",
				dataType: "jsonp",
				data: {type:type},
				success: function (response) {
					count = response.items.length;
					$.each(response.items,function (i,item) {
						prepend+="<li><img src='http://www.tuquinielita.com/lacantadabar/" + item.path+ "'></img></li>";
						if (!--count) {
							//Si no se tiene previamente guardado en localStorage || locaStorage es diferente a lo obtenido o está vacío || no hay nada (ocurre al refresh)
							if(!localStorage.getItem(target)||localStorage.getItem(target)!=prepend||!$("#"+target+" li").length){
								localStorage.setItem(target,prepend);
								$("#"+target).html("");
								$("#"+target).prepend(prepend);
								setTimeout(function(){if(target=="slides"){slides.reloadSlider();}else{promos.reloadSlider();}},100);
							}
							
						}
					});
				},
				error: function(){
					alert("error");
					setTimeout(function(){if(target=="slides"){slides.reloadSlider();}else{promos.reloadSlider();}},100);
				}
			});
		}
		function setup_fotos(){
			//Setup lazyload on img.lazy and photo list container
			$("img.lazy").lazyload({
				effect : "fadeIn",
				container: $('#photo_list')
			});
			
			//Setup click action on img.lazy
			$("img.lazy").click(function(e) {
				var data = $(this).attr('data-original');
				$('#photo_show').animate({opacity:0},'10',function(){
					$('#photo_show').css('background-image','url('+data+')');
					$('#photo_show').animate({opacity:1},'10');
				});
			});
			
			//Setup Photo List iScroll
			loading = false;
			photolist = new IScroll('#photo_list',{click: true,probeType:3,scrollbars: true,interactiveScrollbars: true,shrinkScrollbars: 'scale',fadeScrollbars: true});
			photolist.on('scroll', function(){
				if(!loading&&this.y<this.maxScrollY){
					loading = true;
					$('#photo_list .scroller').append('<img class="lazy" data-original="http://tuquinielita.com/lacantadabar/img/photos/1.jpg" /><img class="lazy" data-original="http://tuquinielita.com/lacantadabar/img/photos/2.jpg" /><img class="lazy" data-original="http://tuquinielita.com/lacantadabar/img/photos/3.jpg" /><img class="lazy" data-original="http://tuquinielita.com/lacantadabar/img/photos/4.jpg" /><img class="lazy" data-original="http://tuquinielita.com/lacantadabar/img/photos/5.jpg" />');
					photolist.refresh();
					setTimeout(function(){
						loading = false;
						//Setup click action on img.lazy
						$("img.lazy").click(function(e) {
							var data = $(this).attr('data-original');
							$('#photo_show').animate({opacity:0},'10',function(){
								$('#photo_show').css('background-image','url('+data+')');
								$('#photo_show').animate({opacity:1},'10');
							});
						});
					},2500);
				}
			});
			photolist.on('scrollEnd', function(){
				$("img.lazy").lazyload();
				if (this.y == this.maxScrollY){
				}
			});
			
			//Onload load first image by clicking on it
			$('#photo_list img:first-child').click();
		}
		function getLocationHash () {
		  return window.location.hash.substring(1);
		}
		
		function setLocationHash(str) {
		  window.location.hash = str;
		}
		
		window.onhashchange = function(e) {
		  updateMyApp(getLocationHash());
		};
		
		window.onload = function(e){
			updateMyApp(getLocationHash());
		};
    }
};

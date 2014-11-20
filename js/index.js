var images = new Array()
var covers_loading = false;
var covers;
var search_text = "";
var drinks = false;
var limit = 0;
var searching = false;
function preload() {
	for (i = 0; i < preload.arguments.length; i++) {
		images[i] = new Image()
		images[i].src = preload.arguments[i]
	}
}
preload(
	"img/splash.jpg",
	"img/popup.png",
	"img/popup1.png",
	"img/inicio-inactivo.jpg",
	"img/cancionero-activo.jpg",
	"img/menu-activo.jpg",
	"img/fotos-activo.jpg",
	"img/info-activo.jpg",
	"img/menu/botonesmenuactiv01.png",
	"img/menu/botonesmenuactiv02.png",
	"img/menu/botonesmenuactiv03.png",
	"img/menu/botonesmenuactiv4.png",
	"img/menu/botonesmenuactiv5.png",
	"img/menu/botonesmenuactiv6.png",
	"img/menu/botonesmenuactiv7.png",
	"img/menu/botonesmenuactiv8.png",
	"img/menu/botonesmenuactiv9.png",
	"img/menu/botonesmenuactiv10.png",
	"img/menu/botonesmenuactiv11.png",
	"img/menu/botonesmenuactiv12.png",
	"img/menu/botonesmenuactiv13.png",
	"img/menu/botonesmenuactiv14.png",
	"img/menu/botonesmenuactiv15.png"
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
		navigator.splashscreen.hide();
		updateMyApp("inicio");
		$('#menu_cancionero ul li').noClickDelay();
		$('#lyrics_button').noClickDelay();
		$('#popup_lyrics').noClickDelay();
		$('#alphabet span').noClickDelay();
		$('#alphabet ul li').noClickDelay();
		$('#close_lyrics').noClickDelay();
		$('#popup_close').noClickDelay();
		$('.scroller li').noClickDelay();
		
		$(document).ajaxError(function(statusCode, errorThrown) {
			if (statusCode.status == 0) {
				$('#noconnection').fadeIn('fast');
				setTimeout(function(){$('#noconnection').fadeOut('fast');},1000);
			}
		});
		drinks = false;
		setTimeout(function(){
			$('#splash').fadeOut(function(){
				StatusBar.overlaysWebView(true);
				StatusBar.show();
			});
			setup_cancionero();
			setTimeout(function(){search_all();},1000);
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
		//Lyrics
		lyrics = new IScroll('#lyrics',{click: true,scrollbars: true,interactiveScrollbars: true,shrinkScrollbars: 'scale',fadeScrollbars: true});
		$('#lyrics_button').click(function(e) {
			$('#lyrics_wrapper').animate({left:0},'fast');
			lyrics.scrollTo(0,0,1500);
        });
		$('#popup_lyrics').click(function(e) {
			$('#lyrics_wrapper').animate({left:0},'fast');
			lyrics.scrollTo(0,0,1500);
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
						case 'menu':
							setup_menu();
						break;
						case 'info':
							setup_info();
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
		var y=0;
		function setup_cancionero(){
			covers = new IScroll('#covers_section',{click: true,probeType:3,scrollbars: true,interactiveScrollbars: true,shrinkScrollbars: 'scale',fadeScrollbars: true});
			covers.scrollTo(0,y);
			covers.on('scroll', function(){
				y=this.y;
				if(!covers_loading&&limit!=-1&&this.y<this.maxScrollY){
					covers_loading = true;
					search_song(search_text);
				}
			});
			$('#menu_cancionero ul li').click(function(e) {
				if($(this).hasClass('active')){
					$(this).removeClass('active');
					search_all();
				}else{
					$('#menu_cancionero ul li').removeClass('active');
					getSongsByCategory($(this).attr('data-category'));
					setTimeout(function(){$(this).addClass('active');},500);
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
				$('#menu_cancionero ul li').removeClass('active');
				limit=0;
				search_song(search_text, current);
				setTimeout(function(){$('#alphabet ul').animate({opacity:0.4},'slow');$('#alphabet span').animate({opacity:0.4},'slow');},200);
			});
			$('#alphabet span').on('touchend',function(e){
				setTimeout(function(){$('#alphabet ul').animate({opacity:0.4},'slow');$('#alphabet span').animate({opacity:0.4},'slow');},200);
				current="";
			});
			$('#alphabet span').click(function(e) {
				$('#menu_cancionero ul li').removeClass('active');
				$('#alphabet ul li').css('color','#bbb');
				$('#alphabet ul li').css('font-size','15px');
				$(this).css('color','#fff');
				$(this).css('font-size','17px');
				limit=0;
				search_song(search_text, "")
			});
			$('#alphabet ul li').click(function(e) {
				$('#alphabet span').css('color','#bbb');
				$('#alphabet span').css('font-size','15px');
				$('#alphabet ul li').css('color','#bbb');
				$('#alphabet ul li').css('font-size','15px');
				current = $(this).html();
				$(this).css('color','#fff');
				$(this).css('font-size','18px');
            });
			
			$('#close_lyrics').click(function(e) {
                $('#lyrics_wrapper').animate({left:'100%'},'fast');
            });
			
			//Search handler
			$('#search_button').click(function(e){
				$('#search_section form').submit();
			});

			$('#search_section form').submit(function(e) {
                e.preventDefault();
				if(navigator.onLine){
					limit = 0;
					$('#menu_cancionero ul li').removeClass('active');
					search_text = $('#search').val().replace(/\u00F1|\u00D1/g, 'n');
					if(search_text!=""&&!searching){
						$('#search').blur();
						searching = true;
						$("#covers_section .scroller").html("");
						type = $('#search_section form input[name="radio"]:checked').val();
						var tipo = " EN TODOS";
						switch(type){case "1": tipo = " EN ARTISTA"; break; case "2": tipo = " EN CANCIONES"; break;}
						//Setting search_name and sliding down search name text
						$('#search_name span').html("<i>"+search_text.toUpperCase()+"</i>&nbsp;"+tipo);
						$('#search_name').slideDown('slow');
						//Resetting alphabet and select TODOS
						$('#alphabet span').css('color','#fff');
						$('#alphabet span').css('font-size','18px');
						$('#alphabet ul li').css('color','#bbb');
						$('#alphabet ul li').css('font-size','15px');
						//Search on server
						search_song(search_text);
					}
				}else{
					$('#noconnection').fadeIn('fast');
					setTimeout(function(){$('#noconnection').fadeOut('fast');},1000);
				}
            });
			function search_song(search_text, letter){
				letter = typeof letter !== 'undefined' ? letter : '';
				if(limit==0){$("#covers_section .scroller").html("");covers.scrollTo(0,2,500);}
				result = "";
				$.ajax({
					url: "http://www.tuquinielita.com/lacantadabar/getSongs.php",
					dataType: "jsonp",
					data: {type:type,search:search_text,limit:limit, letter: letter},
					success: function (response) {
						if(response.success){
							count = response.items.length;
							$.each(response.items,function (i,item) {
								result+="<li data-id='"+item.idSong+"' data-artist='"+item.artist+"' data-song='"+item.song+"' data-km3='"+item.km3_code+"' data-cover='"+item.cover_path+"'>"+item.artist+"  -  <span>"+item.song+"</span></li>";
								//result+="<div class='cover'><img src='http://www.tuquinielita.com/lacantadabar/" + item.cover_path+ "' onerror='this.src=\"img/cover.jpg\"'></img><div class='song_name'>"+item.song+"</div><div class='artist_name'>"+item.artist+"</div></div>";
								if (!--count) {
									$("#covers_section .scroller").append(result);
									covers.refresh();
									//Setting clic on album cover action (TO DO)
									cover_click_setup();
									searching=false;
									setTimeout(function(){covers_loading = false;},2000);
									if(response.count>(limit+100)){limit+=100;}else{limit=-1}
								}
							});
						}else{
							searching=false;
							setTimeout(function(){covers_loading = false;},2000);
						}
					},
					error: function(){
						setTimeout(function(){covers_loading = false;},2000);
						searching=false;
					}
				});
			}
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
			limit = 0;
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
					data: {type:type,search:search_text, limit:0},
					success: function (response) {
						if(response.success){
							count = response.items.length;
							$.each(response.items,function (i,item) {
								result+="<li data-id='"+item.idSong+"' data-artist='"+item.artist+"' data-song='"+item.song+"' data-km3='"+item.km3_code+"' data-cover='"+item.cover_path+"'>"+item.artist+"  -  <span>"+item.song+"</span></li>";
								//result+="<div class='cover'><img src='http://www.tuquinielita.com/lacantadabar/" + item.cover_path+ "' onerror='this.src=\"img/cover.jpg\"'></img><div class='song_name'>"+item.song+"</div><div class='artist_name'>"+item.artist+"</div></div>";
								if (!--count) {
										$("#covers_section .scroller").html(result);
										cover_click_setup();
										searching=false;
										if(covers){covers.refresh();covers.scrollTo(0,0,1500);}
										setTimeout(function(){covers.refresh();},2500);
										if(response.count>(limit+100)){limit+=100;}else{limit=-1}
								}
							});
						}else{
							searching=false;
						}
					},
					error: function(){
						searching=false;
					}
				});
			}
		}
		function setup_menu(){
			menu = new IScroll('#menu_target_list',{click: true,scrollbars: true,interactiveScrollbars: true,shrinkScrollbars: 'scale',fadeScrollbars: true});
			searching_drinks = false;
			$('.category').click(function(e) {
				if(!searching_drinks){
					drinks = true;
					searching_drinks=true;
					$('.category').removeClass('active');
					$(this).addClass('active');
					//Search on server
					result = "<li><span>VOLUMEN</span><span>NOMBRE</span><span>BOTELLA</span><span>COPEO</span></li>";
					$("#menu_target_list .scroller").html(result);
					search_drink=$(this).attr('id');
					$.ajax({
						url: "http://www.tuquinielita.com/lacantadabar/getProductsByType.php",
						dataType: "jsonp",
						data: {type:search_drink},
						success: function (response) {
							if(response.success){
								searching_drinks=false;
								count = response.items.length;
								$.each(response.items,function (i,item) {
									result+="<li><span>"+item.volume+"ml</span><span>"+item.name+"</span><span>"+item.price+"</span><span>"+item.drink+"</span></li>";
									if (!--count) {
											$("#menu_target_list .scroller").html(result);
											$('#menu_target .title').html(search_drink);
											if(menu){menu.refresh();menu.scrollTo(0,0,1500);}
									}
								});
							}else{
								searching_drinks=false;
							}
						},
						error: function(){
							searching_drinks=false;
						}
					});
				}
            });
			if(!drinks){
				$('.category:first').click();
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
								$("#"+target).html(prepend);
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
			result ="";
			$.ajax({
						url: "http://www.tuquinielita.com/lacantadabar/getPics.php",
						dataType: "jsonp",
						success: function (response) {
							count = response.items.length;
							$.each(response.items,function (i,item) {
								result+="<img src='"+item.path+"'></img>";
								if (!--count) {
									$("#photo_list .scroller").append(result);
									$("#photo_list .scroller img").click(function(e) {
										var data = $(this).attr('src');
										$('#photo_show').animate({opacity:0},'10',function(){
											$('#photo_show').css('background-image','url('+data+')');
											$('#photo_show').animate({opacity:1},'10');
										});
									});
									photolist.refresh();
									//Onload load first image by clicking on it
									$('#photo_list .scroller img:first-child').click();
								}
							});
						},
						error: function(){
							alert("error");
							setTimeout(function(){if(target=="slides"){slides.reloadSlider();}else{promos.reloadSlider();}},100);
						}
					});
			//Setup lazyload on img.lazy and photo list container
			/*$("img.lazy").lazyload({
				effect : "fadeIn",
				container: $('#photo_list')
			});
			*/
			//Setup click action on img.lazy
			
			
			//Setup Photo List iScroll
			loading = false;
			photolist = new IScroll('#photo_list',{click: true,probeType:3,scrollbars: true,interactiveScrollbars: true,shrinkScrollbars: 'scale',fadeScrollbars: true});
			/*photolist.on('scroll', function(){
				if(!loading&&this.y<this.maxScrollY){
					loading = true;
					result="";
					$.ajax({
						url: "http://www.tuquinielita.com/lacantadabar/getPics.php",
						dataType: "jsonp",
						success: function (response) {
							count = response.items.length;
							$.each(response.items,function (i,item) {
								result+="<li><img src='"+item.path+"'></img></li>";
								if (!--count) {
										$("#photo_list .scroller").append(result);
										photolist.refresh();
								}
							});
						},
						error: function(){
							alert("error");
							setTimeout(function(){if(target=="slides"){slides.reloadSlider();}else{promos.reloadSlider();}},100);
						}
					});
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
				if (this.y == this.maxScrollY){
				}
			});*/
			
		}
		function setup_info(){
			$.ajax({
				url: "http://www.tuquinielita.com/lacantadabar/getInfo.php",
				dataType: "jsonp",
				data:{branch:1},
				success: function (response) {
					if(response.success){
						if($('#branch_description').html()!=response.description)
							$('#branch_description').html(response.description);
						if($('#branch_location').html()!=response.location)
							$('#branch_location').html(response.location);
						if($('#branch_schedule').html()!=response.schedule)
							$('#branch_schedule').html(response.schedule);
						if($('#branch_phones').html()!=response.phones)
							$('#branch_phones').html(response.phones);
						if($('#branch_image').attr('src')!="http://tuquinielita.com/lacantadabar/"+response.image_path)
							$('#branch_image').attr('src',"http://tuquinielita.com/lacantadabar/"+response.image_path);
					}
				},
				error: function(){
					alert("error");
					setTimeout(function(){if(target=="slides"){slides.reloadSlider();}else{promos.reloadSlider();}},100);
				}
			});
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
function cover_click_setup(){
	$("#covers_section .scroller li").click(function(e) {
		$('#popup_lyrics').hide();
		artista = $(this).attr('data-artist');
		cancion = $(this).attr('data-song');
		updateSongSelection($(this).attr('data-id'));
		km3 = $(this).attr('data-km3');
		$('#popup_artist').html(artista);
		$('#popup_name').html(cancion);
		$('#popup_km3').html(km3);
		$('#popup_cover').css('background-image',"url(http://www.tuquinielita.com/lacantadabar/"+$(this).attr('data-cover')+")");
		$("#popup").fadeIn();
		$.ajax({
			url: "http://www.tuquinielita.com/lacantadabar/getLyrics.php",
			dataType: "jsonp",
			data: {artist:artista,song:cancion},
			success: function (response) {
				if(response.LyricChecksum){
					$('#popup_lyrics').fadeIn();
					$('#lyrics .scroller').html(response.Lyric.replace(/\n/g,"<br>"));
					lyrics.refresh();
					lyrics.scrollTo(0,0,1500);
				}else{
					$('#popup_lyrics').fadeOut();
					console.log('entro false');
					$('#lyrics .scroller').html("");
				}
			},
			error: function(){
				$('#lyrics_button').fadeOut();
				alert("error");
			}
		});
	});
	$(".cover").click(function(e) {
		$('#lyrics_button').hide();
		artista = $(this).find('.artist_name').html();
		cancion = $(this).find('.song_name').html();
		$('#nowplaying h2').html(artista);
		$('#nowplaying h1').html(cancion);
		$('#cover').css('background-image',"url("+$(this).find('img').attr('src')+")");
		$.ajax({
			url: "http://www.tuquinielita.com/lacantadabar/getLyrics.php",
			dataType: "jsonp",
			data: {artist:artista,song:cancion},
			success: function (response) {
				if(response.LyricChecksum){
					$('#lyrics_button').fadeIn();
					$('#lyrics .scroller').html(response.Lyric.replace(/\n/g,"<br>"));
					lyrics.refresh();
					lyrics.scrollTo(0,0,1500);
				}else{
					$('#lyrics_button').fadeOut();
					console.log('entro false');
					$('#lyrics .scroller').html("");
				}
			},
			error: function(){
				$('#lyrics_button').fadeOut();
				alert("error");
			}
		});
	});
}
function imgError(image){
	//image.onerror = "";
	source = image.src;
	if(source==null){
		image.src = "img/cover.jpg"; //Reemplazar con imagen del hashtag
		//$(image).attr("src","http://www.hashtagalbum.com/images/no_image.jpg");
	}else if(source.substr(source.length-3,source.length)=="234"){
		image.src = "img/cover.jpg"; //Reemplazar con imagen del hashtag
		//$(image).attr("src","http://www.hashtagalbum.com/images/no_image.jpg");
	}else{
		image.src = source+"?1234";
		//$(image).attr("src",source+"?234");			
	}
	return true;
}

function getSongsByCategory(category){
	if(!searching){
		$("#covers_section .scroller").html("");
		searching = true;
		//Resetting alphabet and select TODOS
		$('#alphabet span').css('color','#fff');
		$('#alphabet span').css('font-size','18px');
		$('#alphabet ul li').css('color','#bbb');
		$('#alphabet ul li').css('font-size','15px');
		//Resetting search bar
		$('#search_name div').click();		
		//Search on server
		result = "";
		if(category=="3"){
			$.ajax({
				url: "http://www.tuquinielita.com/lacantadabar/getSongsByCategory.php",
				dataType: "jsonp",
				data: {category:category},
				success: function (response) {
					if(response.success){
						count = response.items.length;
						$.each(response.items,function (i,item) {
							//result+="<div class='cover'><img src='http://www.tuquinielita.com/lacantadabar/" + item.cover_path+ "' onerror='this.src=\"img/cover.jpg\"'></img><div class='song_name'>"+item.song+"</div><div class='artist_name'>"+item.artist+"</div></div>";
							result+="<li data-id='"+item.idSong+"' data-artist='"+item.artist+"' data-song='"+item.song+"' data-km3='"+item.km3_code+"' data-cover='"+item.cover_path+"'>"+item.artist+"  -  <span>"+item.song+"</span></li>";
							if (!--count) {
									$("#covers_section .scroller").append(result);
									cover_click_setup();
									searching=false;
									if(covers){covers.refresh();covers.scrollTo(0,2,1500);}
									limit=-1;
							}
						});
					}else{
						searching=false;
					}
				},
				error: function(){
					searching=false;
				}
			});
		}else if(category=="1"){
			$.ajax({
				url: "http://www.tuquinielita.com/lacantadabar/getTop100.php",
				dataType: "jsonp",
				success: function (response) {
					if(response.success){
						count = response.items.length;
						$.each(response.items,function (i,item) {
							//result+="<div class='cover'><img src='http://www.tuquinielita.com/lacantadabar/" + item.cover_path+ "' onerror='this.src=\"img/cover.jpg\"'></img><div class='song_name'>"+item.song+"</div><div class='artist_name'>"+item.artist+"</div></div>";
							result+="<li data-id='"+item.idSong+"' data-artist='"+item.artist+"' data-song='"+item.song+"' data-km3='"+item.km3_code+"' data-cover='"+item.cover_path+"'>"+item.artist+"  -  <span>"+item.song+"</span></li>";
							if (!--count) {
									$("#covers_section .scroller").append(result);
									cover_click_setup();
									searching=false;
									if(covers){covers.refresh();covers.scrollTo(0,2,1500);}
									limit=-1;
							}
						});
					}else{
						searching=false;
					}
				},
				error: function(){
					searching=false;
					alert();
				}
			});
		}else{
			$.ajax({
				url: "http://www.tuquinielita.com/lacantadabar/getDestacadas.php",
				dataType: "jsonp",
				success: function (response) {
					if(response.success){
						count = response.items.length;
						$.each(response.items,function (i,item) {
							//result+="<div class='cover'><img src='http://www.tuquinielita.com/lacantadabar/" + item.cover_path+ "' onerror='this.src=\"img/cover.jpg\"'></img><div class='song_name'>"+item.song+"</div><div class='artist_name'>"+item.artist+"</div></div>";
							result+="<li data-id='"+item.idSong+"' data-artist='"+item.artist+"' data-song='"+item.song+"' data-km3='"+item.km3_code+"' data-cover='"+item.cover_path+"'>"+item.artist+"  -  <span>"+item.song+"</span></li>";
							if (!--count) {
									$("#covers_section .scroller").append(result);
									cover_click_setup();
									searching=false;
									if(covers){covers.refresh();covers.scrollTo(0,2,1500);}
									limit=-1;
							}
						});
					}else{
						searching=false;
					}
				},
				error: function(){
					searching=false;
					alert();
				}
			});
		}
	}	
}
function updateSongSelection(idSong){
	$.ajax({
		url: "http://www.tuquinielita.com/lacantadabar/updateSongSelection.php",
		dataType: "jsonp",
		data: {idSong:idSong},
		success: function (response) {
			if(response.success){
			}
		},
		error: function(){
		}
	});
}
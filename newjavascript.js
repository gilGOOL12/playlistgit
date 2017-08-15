/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */




function buildPlaylists(url) {
    var AllSongsName=[];
    $.get(url,function (playlist){
    console.log(playlist.data.length);
   
        for (let i = 0, max = playlist.data.length; i < max; i++) {
            
            $("<div>").attr("id",playlist.data[i].id).addClass("playlist").fadeIn("slow").appendTo("main");
            $("<div>").addClass("songRow").attr("id","control"+i).text(playlist.data[i].name).appendTo("#"+playlist.data[i].id);
            var playlistsName=[];
            playlistsName.push(playlist.data[i].name);
            
              console.log(playlistsName);
             $("#control"+i).circleType({radius: 250});
            $("<div>").addClass("hover").attr("id","edit"+i).on("click" ,function(){
                editPlaylist(playlist.data[i].id);
                console.log(playlist.data[i].id);
            }).appendTo("#control"+i);
            $("<div>").addClass("hover2").attr("id","delete"+i).on("click" , function(){
                deletePlaylist(playlist.data[i].id,playlist.data[i].name);
            }).appendTo("#control"+i);
            
            
            $("#"+playlist.data[i].id).css('background-image', 'url(' + playlist.data[i].image+ ')');
            $.get("api/playlist/"+(playlist.data[i].id)+"/songs",function(song){
                console.log(playlist.data[i].id);
                console.log(song.data.songs.length);
                console.log(song);
           
              console.log(i);
             
            for (let j = 0, max = song.data.songs.length; j < max; j++) {
                console.log(song.data.songs[j].name);
                
               AllSongsName.push({"name": song.data.songs[j].name, "id":playlist.data[i].id ,"src" : song.data.songs[j].url}); 
              
                
                    $("<div>").addClass("songRow").attr("id",j).text(song.data.songs[j].name).on("click",function(e){
                       var src = parseInt(e.target.parentNode.id);
                       console.log(src);
                   
                      getSong(src,e.target.id);
                     
                    }).appendTo("#"+playlist.data[i].id);
                }
            } );
        }
       
        console.log(playlist.data.length);
         console.log( AllSongsName);
         $("#input").keyup(function (){
            $(".displayMatch").remove();
             search(AllSongsName,playlistsName);
         });
    });
}
   
 

function buildPlayer(startSong,songName,playlistId){

    console.log(songName);
     
    $.get("api/playlist/"+(playlistId) , function(data){
        var image=data.data.image;
     console.log(image);
        $(".playingNow").css("background-image", 'url(' + image + ')');
     
   });
    
      $("#playingNow2").html(""); 
      $("<p>").attr("id","para").text(songName).appendTo("#playingNow2");
      
      blink('.audiowindow');
     $(".audiowindow").text("");
     $(".audiowindow").attr("id",(playlistId));
     $("<audio>").attr("id","audio").attr("controls","controls").attr("src" , startSong).appendTo(".audiowindow");
     var play=2;
     $("#audio")[0].play();
     $(".playingNow").addClass("square");
   
   
     $("#playingNow2").text(songName);
     
      
       
       
     $(".audiowindow").on("click" , function (){
       
 
         if (play===1){
             
        console.log(play);
        $("#audio")[0].play();
       $(".playingNow").addClass("square");
  
   
      play = 2;
       console.log(play);
   }else if (play===2){
           console.log(play);
       $("#audio")[0].pause();
       $(".playingNow").removeClass("square");
      
        play = 1;
   } 
   }
           
   
            );
    $('#audio').on('ended', function(e) {
        
       console.log(e.target.parentNode.id); //playlistid
       console.log(e.target.currentSrc);//src 
       var currentSrc=e.target.currentSrc;
      var currentPlaylist=e.target.parentNode.id;
 $.get("api/playlist/"+(e.target.parentNode.id)+"/songs",function(song){
     console.log(song);
            for (var i = 0, max = song.data.songs.length; i < max; i++) {
           console.log(song.data.songs[i].url);
           console.log(currentSrc);
                if (song.data.songs[i].url===currentSrc){
                    var songLocation=i+1;
                    console.log(songLocation);
                };
            }
         getSong(currentPlaylist,songLocation);   
 });
 
    }
    );

   
         
    

 
console.log("dddd");


};


var show=true; 
function displayPlayer(){
    console.log("display");
  if ( show===true){
     $("header").hide(); 
      show=false;
  }else if ( show===false){
       $("header").show(); 
       show=true;
  }
}


buildPlayer();
 buildPlaylists("api/playlist");
 


 function blink(selector){
$(selector).fadeOut('slow', function(){
    $(this).fadeIn('slow', function(){
       
        blink(this);
    });
});
}
function getSong(playlistId,songNumber){
     $.get("api/playlist/"+(playlistId)+"/songs" , function(item){
                           console.log(item.data.songs[songNumber].url);
                           var startSong=item.data.songs[songNumber].url;
                           var songName=item.data.songs[songNumber].name;
                          
                           console.log(songName);
                           console.log(item);
                         
                            
                           buildPlayer(startSong,songName,playlistId);
                           
                           if((item.data.songs.length)<songNumber){
                               buildPlayer(startSong,songName,(playlistId+1));
                           }
                       });
}


function popupWindow(){
   
        /*$("<div>").addClass("popup").attr("id","popup").on("click" , function(e){
            console.log(e.currentTarget);
            if (e.target===e.currentTarget){
                $(".popup").remove(); 
                displayPlayer();}
        }).appendTo("body");*/
    $("<div>").addClass("popup").attr("id","popup").appendTo("main");
     $("<div>").addClass("popupContent") .appendTo("#popup");
    $("<button>").addClass("button").text("close").on("click" , function(){    
                $(".popup").remove(); 
         
    }).appendTo(".popup");
       
        console.log("popup window active");
   
    
}
function createDataPlaylist(){
    $("#addPlaylist").on("click" , function(){
        console.log("add playlist");
       popupWindow(); 
    
       addInfo();
       
      addSongs();
      
      createData("newPlaylist");
      
    
    });
    
}

createDataPlaylist();

function sendNewPlaylist(url,data){
             $.ajax({
  type: "POST",
  url: url,
  data: data ,
   success: function(){  
       
                     $(".popupContent").text("playlist created");
                setInterval(function(){
             
                $(".popup").fadeOut("slow"); 
            }, 2000);
                },
          
    error :function(){ /* 
                    
                     $(".popupContent").text("error happend fill in details");
               setInterval(function(){
             
                $(".popup").fadeOut("slow"); 
                
            }, 2000);
             setInterval(function(){
             
                $(".popup").remove; 
                
            }, 3000);
           
                */}
    }  );};  


   function addInfo(){
       $('<span>').text("playlist name : ").appendTo('.popupContent');
       $('<input>').attr({ type: 'text',id:'playlistName'}).appendTo('.popupContent');
       $('<span>').text("playlist image url : ").appendTo('.popupContent');
       $('<input>').attr({ type: 'text',id:'playlistImage'}).appendTo('.popupContent');
   };
    function addSongs(){
       $('<div>').addClass("row").appendTo(".popupContent");
       $('<div>').addClass("innerWindow").appendTo(".popupContent");
        num=0;
         $('<button>').addClass('button').text("add song").on("click" , function(){
             
         $('<span>').text("song name : ").appendTo('.innerWindow');
         $('<input>').attr({ type: 'text',id:'songname'+num,placeholder:num}).appendTo('.innerWindow');
         $('<span>').text("song url : ").appendTo('.innerWindow');
         $('<input>').attr({ type: 'text',id:'songurl'+num,placeholder:num}).appendTo('.innerWindow');
         num++;
       }).appendTo(".row");
   };
     function createData(action,playlistNum){
       $('<button>').addClass("button").text("create playlist").attr({type:'submit'}).on("click" , function (e){
           e.preventDefault;
          // validateFields();
           var playlistName=$("#playlistName").val();
           var playlistUrl=$("#playlistImage").val();
           var songs=[];
            if (action==="newPlaylist"){
            for (var i = 0, max = num; i < max; i++) {
                var songName=$("#songname"+i).val();
                var songurl=$("#songurl"+i).val();
                
                songs[i]= {"name":songName , "url":songurl };
                console.log(songs);
               
            }
           
            var data = {"name":playlistName , "image":playlistUrl , "songs":songs};
            sendNewPlaylist("api/playlist",data);
        }else if (action==="editPlaylistInfo"){
           var data = {"name":playlistName , "image":playlistUrl };
            sendNewPlaylist("api/playlist/"+playlistNum,data); 
        }
              
             
       }).appendTo(".popupContent");
   };
   function editPlaylist(playlistNum){
        popupWindow(); 
    
       addInfo();
       console.log(playlistNum);
        createData("editPlaylistInfo",playlistNum);
       
   };
   function deletePlaylist(playlistNum,playlistName){
       popupWindow();
        $('<div>').addClass("innerWindow").appendTo(".popupContent");
        $('.innerWindow').text("delete playlist "+playlistName+" ?");
        $('<button>').addClass('button').text("yes").on("click" , function (){
           $.ajax({
  type: "DELETE",
  url: "api/playlist/"+playlistNum,
   success: function(){  
                     $(".popupContent").text("playlist "+playlistName+" deleted");
                setInterval(function(){
             
                $(".popup").fadeOut("slow"); 
            }, 2000);
                },
          
    error : function(){  
                     $(".popupContent").text("error happend not deleted");
                setInterval(function(){
             
                $(".popup").fadeOut("slow"); 
            }, 2000);
                }
}); 
        }).appendTo(".innerWindow");
        $('<button>').text("no").on("click" , function(){
            $(".popup").remove();
        }).appendTo(".innerWindow");
   }
   
  function search(names,playlistsName){
      console.log(names);
      var search=$("#input").val();
      var match=[];
      
      for (var i = 0, max = names.length; i < max; i++) {
          var n = (names[i].name).indexOf(search);
         //var m= (playlistsName[i]).indexOf(search);
          if (n>(-1)){
            
                
           
          match.push(names[i]); 
             
          };
        /* if (m>(-1)){
            
                
           
          match.push(names[i]); 
             
          };*/
      } 
        
   console.log(match);
  if (search!=="") {
        for (let i = 0, max = match.length; i < max; i++) {
            
       
  $("<div>").addClass("displayMatch").html(i+ " ." + match[i].name).on("click" , function(){
      buildPlayer(match[i].src,match[i].name,match[i].id);
     // $(".displayMatch").remove();
  }).appendTo(".options") ;
}
} else {
    $(".displayMatch").html("");
    match = [];
}; 

$("#submit").on("click" ,function (){
  buildPlayer(match[0].src,match[0].name,match[0].id);
  //search(names);
  
   });
  
 }
 
 
$("#displayHeader").on("click" ,function (){
    displayPlayer();
});

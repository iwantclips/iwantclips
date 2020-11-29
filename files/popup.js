$(document).ready(function() {
  bindPopover();
});

function bindPopover() {
  //Rebind add to cart
  initAddToCart();
  //For Clip Popup
  $('.clip .clip-thumb, .clip .clip-popup .pop-hitarea').hover(function() {
    var video = $('#video-' + $(this).data('id'));
    var thumb = $('#thumb-' + $(this).data('id') + ' .pop-preview');
    $(this).parent().parent().find('.clip-popup').stop().fadeTo(300, 1, function() {
      thumb.attr('src', thumb.attr('data-original'));
      if (typeof video[0] !== "undefined") {
        if (typeof videojs !== "undefined") {
          mplayer = videojs($(video).attr('id'));
          mplayer.play();
        } else {
          video[0].play();
        }
      }
    }).css('z-index', 2);
    
  },
   function() {
    $(this).parent().parent().find('.clip-popup').stop().fadeTo(300, 0, function() {
      var video = $('#video-' + $(this).data('id'));
      $(this).css('display', 'none');
      if (typeof video[0] !== "undefined") {
        if (typeof videojs !== "undefined") {
          mplayer = videojs($(video).attr('id'));
          mplayer.pause();
        } else {
          video[0].pause();
        }
      }
    }).css('z-index', 1);
  });
  //End Clip Popup
}

if (typeof videojs !== "undefined") {
  $(".video-js").each(function (videoIndex) {
      var videoId = $(this).attr("id");
      videojs(videoId).ready(function(){
          this.on("play", function(e) {
              //pause other video
              $(".video-js").each(function (index) {
                  if (videoIndex !== index) {
                    //if(this.player && this.player.pause) {
                        this.player.pause();
                    //}
                  }
              });
          });
      });
  });
}
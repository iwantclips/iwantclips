  (function( $ ) {
 
    $.fn.cslider = function( options ) {

      return this.each(function() {
          var slider = $(this);
          
          var defaults = {
            cs_count: 0,
            cs_page_size: 4,
            cs_current_page: 1,
            cs_max_page: 0,
            fade_speed: 300,
          };

          var settings = $.extend( {}, defaults, options );
          var clips = slider.find('.clip');

          //Add buttons
          slider.append('<div class="col-xs-12 cs-pag text-center"><a href="#" class="btn btn-primary cs-prev-btn pull-left"><i class="fa fa-chevron-left"></i></a><span class="cs-pag-num">Showing...</span><a href="#" class="btn btn-primary cs-next-btn pull-right"><i class="fa fa-chevron-right"></i></a></div>');

          var pag_text = slider.find('.cs-pag-num');
          var nextBtn = slider.find('.cs-next-btn');
          var prevBtn = slider.find('.cs-prev-btn');

          //Bind buttons
          nextBtn.click(function(e) {
            e.preventDefault();
            $.fn.cslider.next(slider, clips, settings, pag_text);
          });
          prevBtn.click(function(e) {
            e.preventDefault();
            $.fn.cslider.prev(slider, clips, settings, pag_text);
          });

          //Window Resize
          $(window).resize(function() {
            var width = $( window ).width();
            var responsive = settings;

            //detect responsive size
            if(width >= 1200) { //lg
              responsive.cs_count = 0;
              responsive.cs_page_size = settings.cs_page_size;
              responsive.cs_max_page =0;
              $.fn.cslider.init(clips, responsive, pag_text);
            } else if(width >= 992) { //md
              responsive.cs_count = 0;
              responsive.cs_page_size = 3;
              responsive.cs_max_page = 0;
              
              $.fn.cslider.init(clips, responsive, pag_text);
            } else if (width >= 768) { //sm
              responsive.cs_count = 0;
              responsive.cs_page_size = 2;
              responsive.cs_max_page = 0;
              $.fn.cslider.init(clips, responsive, pag_text);
            } else { //xs
              responsive.cs_count = 0;
              responsive.cs_page_size = 1;
              responsive.cs_max_page = 0;
              $.fn.cslider.init(clips, responsive, pag_text);
            }
          });

          //Init Slider with triggering window size
          $(window).trigger('resize');
       });
    };

    $.fn.cslider.init = function(clips, settings, pag_text) {

      clips.each(function() {
          //Setup ids
          $(this).attr('data-index', settings.cs_count);
          //Setup page numbers
          var page = Math.floor(settings.cs_count / settings.cs_page_size) + 1;
          $(this).attr('data-page', page);
          //Set max page
          settings.cs_max_page = page;
          
          //hide other pages
          if($(this).attr('data-page') != settings.cs_current_page) {
            $(this).hide().removeClass('cs-active');
          } else {
            $(this).show().addClass('cs-active');
          }
          //Increment Index
          settings.cs_count++;
        });
        //Check if current page > max page
        if(settings.cs_current_page > settings.cs_max_page) settings.cs_current_page = settings.cs_max_page;
        pag_text.text('Showing ' + settings.cs_current_page + ' of ' + settings.cs_max_page);
    }

    $.fn.cslider.next = function(slider, clips, settings, pag_text) {
      if(settings.cs_max_page > 1) {
        if(settings.cs_current_page < settings.cs_max_page) {
          //change page
          settings.cs_current_page++;
          //change page display
          pag_text.text('Showing ' + settings.cs_current_page + ' of ' + settings.cs_max_page);
          //trigger lazy loder
          var thumbs = slider.find('.lazy');
          if(thumbs) {
              thumbs.lazyload({
                event : 'csload'
              });
              thumbs.trigger("csload");
          }
          //fade
          slider.find('.cs-active').fadeOut(settings.fade_speed, function() {
            //fade in new page
            slider.find('.clip[data-page="' + settings.cs_current_page + '"]').fadeIn(settings.fade_speed).addClass('cs-active');
          }).removeClass('cs-active');

        } else {
          settings.cs_current_page = 1;
          //change page display
          pag_text.text('Showing ' + settings.cs_current_page + ' of ' + settings.cs_max_page);
          //trigger lazy loder
          var thumbs = slider.find('.lazy');
          if(thumbs) {
              thumbs.lazyload({
                event : 'csload'
              });
              thumbs.trigger("csload");
          }
          //fade
          slider.find('.cs-active').fadeOut(settings.fade_speed, function() {
            //fade in new page
            slider.find('.clip[data-page="' + settings.cs_current_page + '"]').fadeIn(settings.fade_speed).addClass('cs-active');
          }).removeClass('cs-active');

        }
        return false;
      }
    }

    $.fn.cslider.prev = function(slider, clips, settings, pag_text) {
      if(settings.cs_max_page > 1) {
        if(settings.cs_current_page > 1) {
          //change page
          settings.cs_current_page--;
          //change page display
          pag_text.text('Showing ' + settings.cs_current_page + ' of ' + settings.cs_max_page);
          //Fade
          slider.find('.cs-active').fadeOut(settings.fade_speed, function() {
            //fade in new page
            slider.find('.clip[data-page="' + settings.cs_current_page + '"]').fadeIn(settings.fade_speed).addClass('cs-active');
          }).removeClass('cs-active');
        } else {
          //change page
          settings.cs_current_page = settings.cs_max_page;
          //change page display
          pag_text.text('Showing ' + settings.cs_current_page + ' of ' + settings.cs_max_page);
          //Fade
          slider.find('.cs-active').fadeOut(settings.fade_speed, function() {
            //fade in new page
            slider.find('.clip[data-page="' + settings.cs_current_page + '"]').fadeIn(settings.fade_speed).addClass('cs-active');
          }).removeClass('cs-active');
        }
        return false;
      }
    }

})( jQuery );
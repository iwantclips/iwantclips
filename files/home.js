$(document).ready(function() {

  // disable video right click / save video. Also works on .gif videos
	$('.video-js, .videoPlayer, .pop-preview, .clip-thumb .lazy, .pop-video, video').bind('contextmenu',function() { return false; });

  $.fn.randomize = function(selector){
    var $elems = selector ? $(this).find(selector) : $(this).children(),
        $parents = $elems.parent();

    $parents.each(function(){
        $(this).children(selector).sort(function(){
            return Math.round(Math.random()) - 0.5;
        }).detach().appendTo(this);
    });

    return this;
  };

  var whatPage = parseInt($('.anchorLinkN').attr('data-page') - 1);
  var totalPage = parseInt($('.total-pages').text());

  if(whatPage == totalPage) {
    $('.anchorLinkN').addClass('hidden');
  }

  // randomize the slides and then call slick
  $('#featured-stores').find('.featured-slider').randomize('.featured-item');

  $('.featured-slider').slick({
      centerMode: true,
      slidesToShow: 3,
      variableWidth: true,
      slidesToScroll: 1,
      autoplay: true,
      autoplaySpeed: 5000,
      arrows: true,
      adaptiveHeight: true,
      prevArrow: $('.prev'),
      nextArrow: $('.next')
  });

  //content slider
  $('.clip-scroll').cslider();

  //For button group toggle
  $('.toggle-group .btn').click(function() {
    $('.toggle-group .btn .fa').addClass('fa-circle-o');
    $(this).find('.fa').addClass('fa-check');
    $(this).find('.fa').removeClass('fa-circle-o');
  })
  //end button group toggle

  //Previous
  if ($('.anchorLinkP').attr('data-page') == 0) {
    $('.anchorLinkP').addClass('hidden');
  }


  $('.anchorLinkP').click(function(e) {
    e.preventDefault();
    //Get Category
    var category = $('#select-category').val();
    if ($('.anchorLinkP').attr('data-page') != 0) {
      $('.anchorLinkP').prop('disabled', true);
      $('.anchorLinkP').html('<div class="loader"><div class="loader-inner ball-beat"><div></div><div></div><div></div></div></div>');
      var offset = $('.anchorLinkP').attr('data-page');
      var pageNo = $('.anchorLinkP').attr('data-page');
      var nextOffset = $('.anchorLinkN').attr('data-page');
      $('#home-clips-container').css('opacity', 0.3).css('pointer-events', 'none');
      $.ajax({
        type: 'post',
        data: {'offset': offset, 'category': category},
        dataType: 'html',
        url: base_url + 'home/ajax_load_more',
        success: function(data) {
          $('#home-clips-container').css('opacity', 1).css('pointer-events', 'auto');
          $('#home-clips-container').hide().html('<div class="col-md-6"><h2 class="top-selling-header"><i class="fa-icon fa fa-asterisk"></i>Newest Content</h2></div>' + data).fadeIn(500);
          bindPopover();
          $('img.lazy').lazyload();
          offset--;
          nextOffset--;
          $('.anchorLinkP').attr('data-page', offset);
          $('.anchorLinkN').attr('data-page', nextOffset);
          $('.anchorLinkP').prop('disabled', false);
          $('.anchorLinkP').html('Previous');
          $('.pageNo').val(pageNo);
          if ($('.anchorLinkP').attr('data-page') == 0) {
            $('.anchorLinkP').addClass('hidden');
          }
          if(pageNo != $('.total-pages').text()) {
            $('.anchorLinkN').removeClass('hidden');
          }

          if(pageNo != $('.total-pages-mobile').text()) {
            $('.anchorLinkN').removeClass('hidden');
          }
          $('html, body').animate({
            scrollTop: $( $('.anchorLinkP').attr('href') ).offset().top-60
        }, 500);
        return false;
        },
        error: function(data) {
          $('.anchorLinkP').prop('disabled', false);
          $('.anchorLinkP').html('Previous');
        }
      });
    } else {
      $('.anchorLinkP').addClass('hidden');
    }
  });
  //end Previous

  //Next
  $('.anchorLinkN').click(function(e) {
    e.preventDefault();
    //Get Category
    var category = $('#select-category').val();
    $('.anchorLinkN').prop('disabled', true);
    $('.anchorLinkN').html('<div class="loader"><div class="loader-inner ball-beat"><div></div><div></div><div></div></div></div>');
    var offset = $('.anchorLinkN').attr('data-page');
    var pageNo = $('.anchorLinkN').attr('data-page')-1;
    var previousOffset = $('.anchorLinkP').attr('data-page');
    $('#home-clips-container').css('opacity', 0.3).css('pointer-events', 'none');
    $.ajax({
      type: 'post',
      data: {'offset': offset, 'category': category},
      dataType: 'html',
      url: base_url + 'home/ajax_load_more',
      success: function(data) {
        $('#home-clips-container').css('opacity', 1).css('pointer-events', 'auto');
        $('#home-clips-container').hide().html('<div class="col-md-6"><h2 class="top-selling-header"><i class="fa-icon fa fa-asterisk"></i>Newest Content</h2></div>' + data).fadeIn(500);
        bindPopover();
        $('img.lazy').lazyload();
        offset++;
        previousOffset++;
        pageNo++;
        $('.anchorLinkN').attr('data-page', offset);
        $('.anchorLinkP').attr('data-page', previousOffset);
        $('.anchorLinkN').prop('disabled', false);
        $('.anchorLinkN').html('Next');
        $('.pageNo').val(pageNo);

        if ($('.anchorLinkP').attr('data-page') != 0) {
          $('.anchorLinkP').removeClass('hidden');
        }

        if(pageNo == $('.total-pages').text()) {
          $('.anchorLinkN').addClass('hidden');
        }

        if(pageNo == $('.total-pages-mobile').text()) {
          $('.anchorLinkN').addClass('hidden');
        }
        $('html, body').animate({
            scrollTop: $( $('.anchorLinkN').attr('href') ).offset().top-60
        }, 500);
        return false;
      },
      error: function(data) {
        $('.anchorLinkN').prop('disabled', false);
        $('.anchorLinkN').html('Next');
      }
    });
  });
  //end Next

  $('.pageNo').blur(function(e) {
    e.preventDefault();
    paginate();
  });

  $('.pageNo').bind("enterKey",function(e){
    $('.pageNo').blur();
  });

  $('.pageNo').keyup(function(e){
      if(e.keyCode == 13)
      {
          $(this).trigger("enterKey");
      }
  });

    $('.pageNoSelect').change(function(e) {
        $('.pageNo').val($('.pageNoSelect').val());
        e.preventDefault();
        paginate();
    });

    function updateDrop(pageNo, totalPage) {
        var before = pageNo - 11;
        var after = parseFloat(pageNo) + parseFloat(11);
        var option = '';
        $('.pageNoSelect').children().remove();
        for (var i=before; i <pageNo;i++){
            if(i > 0) {
                option += '<option value="' + i + '">' + i + '</option>';
            }
        }
        option += '<option value="'+ pageNo + '" SELECTED>' + pageNo + '</option>';
        for (var t=pageNo ; t < after;t++){
            if(t != pageNo) {
                if(t <= totalPage) {
                    option += '<option value="' + t + '">' + t + '</option>';
                }

            }
        }
        $('.pageNoSelect').append(option);
    }

  function paginate() {
    var whatPage = parseInt($('.pageNo').val());
    var totalPage = parseInt($('.total-pages').text());

    if($('.pageNo').val() <= 0 && $('.pageNo').val() != '') {
      $('.pageNo').val(1);
    }
    if(whatPage > totalPage) {
      $('.pageNo').val(totalPage);
    }
    if($('.pageNo').val() != '') {
      var category = $('#select-category').val();
      var offset = $('.pageNo').val();
      var pageNo = offset;
      var previousOffset = offset
      $('#home-clips-container').css('opacity', 0.3).css('pointer-events', 'none');
      $.ajax({
        type: 'post',
        data: {'offset': offset, 'category': category},
        dataType: 'html',
        url: base_url + 'home/ajax_load_more',
        success: function(data) {
          offset++;
          previousOffset--;
          $('#home-clips-container').css('opacity', 1).css('pointer-events', 'auto');
          $('#home-clips-container').hide().html('<div class="col-md-6"><h2 class="top-selling-header"><i class="fa-icon fa fa-asterisk"></i>Newest Content</h2></div>' + data).fadeIn(500);
          bindPopover();
          $('img.lazy').lazyload();
          $('.anchorLinkN').attr('data-page', offset);
          $('.anchorLinkP').attr('data-page', previousOffset);
          $('.anchorLinkN').prop('disabled', false);
          $('.anchorLinkN').html('Next');
          $('.pageNo').val(pageNo);
            updateDrop(pageNo, totalPage);

          if ($('.anchorLinkP').attr('data-page') != 0) {
            $('.anchorLinkP').removeClass('hidden');
          } else {
            $('.anchorLinkP').addClass('hidden');
          }

          if(pageNo == $('.total-pages').text() || pageNo == $('.total-pages').text()) {
            $('.anchorLinkN').addClass('hidden');
          } else {
            $('.anchorLinkN').removeClass('hidden');
          }
          $('html, body').animate({
              scrollTop: $( $('.anchorLinkN').attr('href') ).offset().top-60
          }, 500);

          return false;
        },
        error: function(data) {
          $('.anchorLinkN').prop('disabled', false);
          $('.anchorLinkN').html('Next');
          $('.anchorLinkP').prop('disabled', false);
          $('.anchorLinkP').html('Previous');
        }
      });
    }
  }

  if ($('input#signup').val()== true) {
    $('#join-btn').click();
  }

});

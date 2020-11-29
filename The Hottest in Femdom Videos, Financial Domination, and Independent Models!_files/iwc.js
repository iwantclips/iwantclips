$(document).ready(function() {

    //banner code
    function display_rotation_banner($rotation_banner, banner_number)
     {
      var banners = $rotation_banner.data('banners');
       var banner = banners[banner_number];

      if (banner !== undefined && $rotation_banner !== undefined) {
        $rotation_banner.html(banner.html);
        $rotation_banner.find('img').addClass('img-responsive');

         banner_number++;

         setTimeout(function()
         {
          display_rotation_banner($rotation_banner, banner_number);
         }, banner.frequency * 1000);
       }
     }

  $('.rotation_banner').each(function(key, item)
   {
    var $rotation_banner = $(item);
     $.ajax({
      url: base_url + 'Home/get_banners/' + $rotation_banner.data('location'),
      type: 'post',
       data: {
        page: $rotation_banner.data('page'),
        location: $rotation_banner.data('location')
       },
      dataType: 'json',
       success: function(banners)
       {
        $rotation_banner.data('banners', banners);
        display_rotation_banner($rotation_banner, 0);
       }
     });
   });

    //hover over menu to activate
    $('#dropdownMenu1').mouseenter(function() {
      $('.dropdown-menu-right').show();
    });

    $('.dropdown-menu-right').on('mouseleave blur click', function() {
      $('.dropdown-menu-right').hide();
    });

  //Form Validation Defaults Move to Main
    $.validator.setDefaults({
      showErrors: function(errorMap, errorList) {
      $.each(this.successList, function(index, value) {
        $(this).removeClass('errorInput');
        return $(value).popover("hide");
      });
      return $.each(errorList, function(index, value) {
        var _popover;
        _popover = $(value.element).popover({
          trigger: "focus",
          placement: "top",
          content: value.message,
          template: "<div class=\"popover popover-error\"><div class=\"arrow\"></div><div class=\"popover-inner\"><div class=\"popover-content\"><p></p></div></div></div>"
        });
        // Bootstrap 3.x :
        _popover.data("bs.popover").options.content = value.message;
        $(this.element).addClass('errorInput');
        return $(value.element).popover("show");
      });
    }
    });

    // if($('input').attr('aria-describedby') != '') {
    //   $('input').css('color', 'red');
    // }

    //search by letter in fetish/store dropdowns
  $('.letter').click(function(e) {
    e.preventDefault();
    var padding = 35;
    var locale = $(this).attr('data-id');
    $('#browse-categories .big-list').scrollTop(($('#browse-categories .big-list').scrollTop() + $('#browse-categories .big-list #list-anchor-' + locale).position().top) - padding);
  })

  $('.storeLetter').click(function(e) {
    e.preventDefault();
    var padding = 35;
    var locale = $(this).attr('data-id');


    $('#browse-stores .big-list').scrollTop(($('#browse-stores .big-list').scrollTop() + $('#browse-stores .big-list #list-anchor-' + locale).position().top) - padding);
  })

  //lazyload
  $('img.lazy').lazyload();

  //For Subnav Drop Downs
  function showMenu(menu) {
    //Hide all menus
    $('.dropdown-box').hide();
    $('.sub-drop').removeClass('active');
    $('#' + menu).show();
  }
  $('.sub-drop, .dropdown-hit').hover(function() {
    var dropdown = $(this).data('drop');
    if (dropdown)
      showMenu(dropdown);
    $('#sub-dropdown').stop().fadeTo('fast', 1);
    $(this).addClass('active');
    $("body").css('overflow','hidden');
  }, function() {
    $('#sub-dropdown').stop().fadeTo('fast', 0, function() {
      $(this).hide();
      $('.sub-drop').removeClass('active');
      $("body").css('overflow','inherit');
    });
  });
  //End Subnav Drop Downs

  //Mobile Menu
  $('.navbar-toggle').click(function() {
    $('#menuWrapper').modal('toggle');
    return false;
  });

  $('.nav-link').click(function() {
    if($('#menuWrapper .m-btn').siblings('.m-body').hasClass('open')) {
      var button = $('#menuWrapper .m-btn');
      $('#menuWrapper .m-btn').siblings('.m-body.open').css('height', 'auto').css('max-height', ($(window).height() - ($('#menuWrapper .m-btn').height() + 20))).show();
      $('#menuWrapper .modal-content').animate({
            scrollTop: button.offset().top
        }, 200);
    } else {
      $('#menuWrapper .m-btn').siblings('.m-body').slideUp(300).removeClass('open');
    }
  })

  $('#menuWrapper .m-btn').click(function() {
    if(!$(this).siblings('.m-body').hasClass('open')) {
      var button = $(this);
      $('#menuWrapper .open').hide().removeClass('open');
      $(this).siblings('.m-body').css('height', 'auto').css('max-height', ($(window).height() - ($(this).height() + 20))).show().addClass('open');
      $('#menuWrapper .modal-content').animate({
          scrollTop: button.offset().top
      }, 200);
    } else {
      $(this).siblings('.m-body').slideUp(300).removeClass('open');
    }
  });
  $('.addFundsMobile').click(function() {
    $('.closeLink .close-btn').click();
  })
  //End Mobile Menu

  //Referral copy to clip board
  // code change
    var copyTextareaBtn = document.querySelector('#copy-button');
  if(copyTextareaBtn != null) {
      copyTextareaBtn.addEventListener('click', function (event) {
          var copyTextarea = document.querySelector('#direct_link');
          copyTextarea.focus();
          copyTextarea.select();

          try {
              var successful = document.execCommand('copy');
              var msg = successful ? 'successful' : 'unsuccessful';
              console.log('Copying text command was ' + msg);
          } catch (err) {
              console.log('Oops, unable to copy');
          }
      });
  }


  //search bar
  var $window = $(window);

    function checkWidth() {
      var windowsize = $window.width();
      if (windowsize <= 991) {
        $('#sub-dropdown-search').hide();
      }

      if (windowsize >= 1585) {
        var size = (windowsize - 1585)/2;
        $('#sub-dropdown-search').css('right', size);
      } else {
        $('#sub-dropdown-search').css('right', '2px');
      }
    }

      checkWidth();
      $(window).resize(checkWidth);

  //min char length for search
  var min = 3;







  //Fix for right click paste
  $('#nav-search').bind('paste', null, function() {
    setTimeout(function () {
        $('#nav-search').keyup();
    }, 100);
  });


  var delayTimer;
  var mobileDelayTimer;

    function processMobileSearch(search) {
          clearTimeout(mobileDelayTimer);
          mobileDelayTimer = setTimeout(function() {
          if ( $('#mobileSearchMenuButton').attr('phonesearch') == 'true') {
            AjaxSearch(search, DisplayMobileSearchResults, DisplayMobileSearchError, ".mobile-loader", 'phone');
          } else {
            AjaxSearch(search, DisplayMobileSearchResults, DisplayMobileSearchError, ".mobile-loader", 'other');
          }

          }, 800);

        $(".mobile-search-results-container").show();
    }

  function processSearch(search) {
      clearTimeout(delayTimer);
      delayTimer = setTimeout(function() {
        searchAjax(search);
      }, 800);
  }

  $("#mobileSearchModal").find('.close-btn').on('click', function(e){
      $(".mobile-search-results-container").hide();
      $("#mobile-nav-search").val('');
  });

  $('#nav-search').keyup(function() {
    if ($(this).val().length >= min) {
      //show loader
      $('.loader').css('visibility', '');
      //Start the timer for the ajax call
      processSearch($(this).val());
    } else {
      clearTimeout(delayTimer);
      $('.loader').css('visibility', 'hidden');
      $('#sub-dropdown-search').fadeOut(300);
    }
  });

  /**
   * Handles loading the search results on a mobile search...
   */
  $('#mobile-nav-search').on('keyup', function() {
    if ( $(this).val().length >= min) {
        $(this).parent().find(".mobile-loader").css('visibility', '');

        //Start the timer for the ajax call
        processMobileSearch($(this).val());
    } else {
        clearTimeout(mobileDelayTimer);
        $(this).parent().find('.mobile-loader').css('visibility', 'hidden');
        $('#mosub-dropdown-search').fadeOut(300);
    }
  });

  /**
   * handle the click on the mobile search button
   */
  $("#mobileSearchMenuButton").on('click', function(e){
      e.preventDefault();

      $("#mobileSearchModal").modal('toggle');
      return false;
  });

  function AjaxSearch(strQuery, outputDisplayFunction, outputErrorFunction, loaderDiv, type)
  {
        var ajax_url = 'home/ajax_search';

        if(type == 'phone') {
          var ajax_url = 'phone/ajax_phone_search';
        }

        var search_store_only = false;
        var store_id = 0;

        if ( $("#mobile-nav-search").attr("StoreSearch") === "true") {
            ajax_url = 'home/ajax_search_store';
            search_store_only = true;
            store_id = window.store_id;
        }

        $.ajax({
          /*url: base_url + 'home/ajax_search',*/
          url: base_url + ajax_url,
          data: {search: strQuery, store: store_id},
          type: 'post',
          dataType: 'json',
          success: function(results){
              $(loaderDiv).css('visibility', 'hidden');
              outputDisplayFunction(results,  strQuery);
          },
          error: function(results) {
              outputErrorFunction(results);
              $(loaderDiv).css('visibility', 'hidden');
          }
      });
  }

  function DisplayMobileSearchResults(results, searchQuery) {
        if (!results.empty) {
            $('.mobile-search-results-container .noResults').addClass('hidden');
            $('.mobile-search-results-container .ajaxError').hide();
            $('.mobile-search-results-container .models-wrapper').show();
            $('.mobile-search-results-container .fetish-wrapper').show();
            $('.mobile-search-results-container .content-wrapper').show();
            $('.mobile-search-results-container #sub-dropdown-search').fadeIn(300);

            //check if model results

          if (results.models != 0) {
            $('.mobile-search-results-container .fetish-hr').show();
            $('.mobile-search-results-container .search-categories-model').show();
            $('.mobile-search-results-container .clone-section-models').empty();
            $('.mobile-search-results-container .models-wrapper').removeClass('hidden');

            var modelsCount = 0;
            $.each(results.models, function(i, data) {

              $('#mobile_model_master').clone().appendTo('.clone-section-models').attr('id', 'model_result_' + modelsCount).removeClass('hidden');
              var name = data.name;
              if (name.length > 48) {
                 var nameMax = name.substring(0, 48);
                nameMax += '...';
              } else {
                var nameMax = data.name;
              }

              var url = data.url;
              $('#model_result_' + modelsCount + ' .model-name').html(nameMax);
              $('#model_result_' + modelsCount + ' .model-link').attr('href', url)
              modelsCount++;

              $.fn.wrapInTag = function(opts) {

                var tag = opts.tag || 'strong'
                  , words = opts.words || []
                  , regex = RegExp(words.join('|'), 'gi') // case insensitive
                  , replacement = '<'+ tag +'>$&</'+ tag +'>';

                return this.html(function() {
                  return $(this).text().replace(regex, replacement);
                });
              };

              // Usage
              $('.model-name').wrapInTag({
                tag: 'b',
                words: [searchQuery]
              });

            });

            if ( results.model_count > 0) {
                // add the results
                $('#model-num-of-total-results').text('Showing ' + results.models.length + ' of ' + results.model_count);
            } else {
                $('#model-num-of-total-results').addClass('hidden');
            }


          } else {

            $('.mobile-search-results-container .fetish-hr').hide();
            $('.mobile-search-results-container .search-categories-model').hide();
            $('.mobile-search-results-container .models-wrapper').addClass('hidden');
          }
        if (results.categories != 0) {

            $('.mobile-search-results-container .content-hr').show();
            $('.mobile-search-results-container .search-categories-fetish').show();
            $('.mobile-search-results-container .clone-section-fetish').empty();
            $('.mobile-search-results-container .fetish-wrapper').removeClass('hidden');
            var fetishCount = 0;
            $.each(results.categories, function(i, data) {
          //loop through fetish results

              $('#mobile_fetish_master').clone().appendTo('.clone-section-fetish').attr('id', 'fetish_result_' + fetishCount).removeClass('hidden');
              var name = data.name;
              if (name.length > 48) {
                 var nameMax = name.substring(0, 48);
                nameMax += '...';
              } else {
                var nameMax = data.name;
              }
              var url = data.url;
              $('#fetish_result_' + fetishCount + ' .fetish-name').html(nameMax);
              $('#fetish_result_' + fetishCount + ' .fetish-link').attr('href', url)
              fetishCount++;

              $.fn.wrapInTag = function(opts) {

                var tag = opts.tag || 'strong'
                  , words = opts.words || []
                  , regex = RegExp(words.join('|'), 'gi') // case insensitive
                  , replacement = '<'+ tag +'>$&</'+ tag +'>';

                return this.html(function() {
                  return $(this).text().replace(regex, replacement);
                });
              };

                if ( results.category_count > 0) {
                  // add the results
                  $('#fetish-num-of-total-results').text('Showing ' + results.categories.length + ' of ' + results.category_count);
                } else {
                  $('#fetish-num-of-total-results').addClass('hidden');
                }

              // Usage
              $('.fetish-name').wrapInTag({
                tag: 'b',
                words: [searchQuery]
              });

            })
          } else {

            $('.mobile-search-results-container .content-hr').hide();
            $('.mobile-search-results-container .search-categories-fetish').hide();
            $('.mobile-search-results-container .fetish-wrapper').addClass('hidden');
          }
          if (results.content != 0) {

            $('.mobile-search-results-container .search-categories-content').show();
            $('.mobile-search-results-container .clone-section-content').empty();
            $('.mobile-search-results-container .content-wrapper').removeClass('hidden');
            var contentCount = 0;
            $.each(results.content, function(i, data) {
                //loop through content results

                $('#mobile_content_master').clone().appendTo('.clone-section-content').attr('id', 'content_result_' + contentCount).removeClass('hidden');
                var name = data.name;
               if (name.length > 48) {
                   var nameMax = name.substring(0, 48);
                  nameMax += '...';
                } else {
                  var nameMax = data.name;
                }
                var type = data.type;
                var url = data.url;
                $('#content_result_' + contentCount + ' .content-name').html(nameMax);
                $('#content_result_' + contentCount + ' .content-type').html(type);
                $('#content_result_' + contentCount + ' .content-link').attr('href', url)
                contentCount++;

                $.fn.wrapInTag = function(opts) {

                  var tag = opts.tag || 'strong'
                    , words = opts.words || []
                    , regex = RegExp(words.join('|'), 'gi') // case insensitive
                    , replacement = '<'+ tag +'>$&</'+ tag +'>';

                  return this.html(function() {
                    return $(this).text().replace(regex, replacement);
                  });
                };

                if ( results.content_count > 0) {
                  // add the results
                  $('#content-num-of-total-results').text('Showing ' + results.content.length + ' of ' + results.content_count);
                } else {
                  $('#content-num-of-total-results').addClass('hidden');
                }

                // Usage
                $('.content-name').wrapInTag({
                  tag: 'b',
                  words: [searchQuery]
                });

                if (type == "video") {
                  $('.search-name .fa').removeClass('fa-image').removeClass('fa-shopping-cart');
                  $('.search-name .fa').addClass('fa-video-camera');
                } else if (type == "image") {
                  $('.search-name .fa').removeClass('fa-video-camera').removeClass('fa-shopping-cart');
                  $('.search-name .fa').addClass('fa-image');
                } else {
                  $('.search-name .fa').removeClass('fa-video-camera').removeClass('fa-image');
                  $('.search-name .fa').addClass('fa-shopping-cart');
                }
            })
          } else {

            $('.mobile-search-results-container .search-categories-content').hide();
            $('.mobile-search-results-container .content-wrapper').addClass('hidden');
          }
        } else {
            $('.mobile-search-results-container .noResults').removeClass('hidden');
            $('.mobile-search-results-container .models-wrapper').hide();
            $('.mobile-search-results-container .fetish-wrapper').hide();
            $('.mobile-search-results-container .content-wrapper').hide();
            $('.mobile-search-results-container .search-categories-content').hide();
            $('.mobile-search-results-container .search-categories-fetish').hide();
            $('.mobile-search-results-container .search-categories-model').hide();
            $('.mobile-search-results-container .fetish-hr').hide();
            $('.mobile-search-results-container .content-hr').hide();
            $('.mobile-search-results-container #sub-dropdown-search').fadeIn(300);
        }
  }

  function DisplayMobileSearchError(data) {
      //hide loader
        $('.loader').css('visibility', 'hidden');
        $('.models-wrapper').hide();
        $('.fetish-wrapper').hide();
        $('.content-wrapper').hide();
        $('.search-categories-content').hide();
        $('.search-categories-fetish').hide();
        $('.search-categories-model').hide();
        $('.fetish-hr').hide();
        $('.content-hr').hide();
        $('#sub-dropdown-search').fadeIn(300);
        $('.ajaxError').removeClass('hidden');
  }

  /*
   * Search function for non-mobile
   * @param {type} searchQuery
   * @returns {undefined}
   */
  function searchAjax(searchQuery) {
      var ajax_url = 'home/ajax_search';
      var search_store_only = false;
      var store_id = 0;

      if ( $("#nav-search").attr("StoreSearch") === "true") {
          ajax_url = 'home/ajax_search_store';
          search_store_only = true;
          store_id = window.store_id;
      }

      if ( $("#nav-search").attr("phonesearch") === "true") {
          ajax_url = 'phone/ajax_phone_search';
      }

      $('.search-categories-model, .search-categories-fetish, .search-categories-content').find('.see_all_link').remove();

    $.ajax({
      /*url: base_url + 'home/ajax_search',*/
      url: base_url + ajax_url,
      data: {search: searchQuery, store: store_id},
      type: 'post',
      dataType: 'json',
      success: function(results){
          /**
           * @todo This building of the results should be in a seperate function
           * so that this function of handling the results...ONLY hands them off...
           */
        //hide loader
        $('.loader').css('visibility', 'hidden');
        if (!results.empty) {
           $('.noResults').addClass('hidden');
           $('.ajaxError').hide();
           $('.models-wrapper').show();
          $('.fetish-wrapper').show();
          $('.content-wrapper').show();
           $('#sub-dropdown-search').fadeIn(300);
          //check if model results

          if (results.models != 0) {
            $('.fetish-hr').show();
            $('.search-categories-model').show();
            $('.clone-section-models').empty();
            $('.models-wrapper').removeClass('hidden');

            /**
             * If the count is greater than the amount shown, show the SEE ALL link...
             */
            if ( results.model_count > results.models.length) {
                $('.search-categories-model')
                        .first()
                        .append('<a href="'+base_url+'search/more/model/'+searchQuery+'" class="see_all_link">See All</a>');
            }

            var modelsCount = 0;
            $.each(results.models, function(i, data) {

              $('#model_master').clone().appendTo('.clone-section-models').attr('id', 'model_result_' + modelsCount).removeClass('hidden');
              var name = data.name;
              if (name.length > 48) {
                 var nameMax = name.substring(0, 48);
                nameMax += '...';
              } else {
                var nameMax = data.name;
              }

              var url = data.url;
              $('#model_result_' + modelsCount + ' .model-name').html(nameMax);
              $('#model_result_' + modelsCount + ' .model-link').attr('href', url)
              modelsCount++;

              $.fn.wrapInTag = function(opts) {

                var tag = opts.tag || 'strong'
                  , words = opts.words || []
                  , regex = RegExp(words.join('|'), 'gi') // case insensitive
                  , replacement = '<'+ tag +'>$&</'+ tag +'>';

                return this.html(function() {
                  return $(this).text().replace(regex, replacement);
                });
              };

              // Usage
              $('.model-name').wrapInTag({
                tag: 'b',
                words: [searchQuery]
              });

            });

            if ( results.model_count > 0) {
                // add the results
                $('#model-num-of-total-results').text('Showing ' + results.models.length + ' of ' + results.model_count);
            } else {
                $('#model-num-of-total-results').addClass('hidden');
            }


          } else {
            $('.fetish-hr').hide();
            $('.search-categories-model').hide();
            $('.models-wrapper').addClass('hidden');
          }
        if (results.categories != 0) {
            $('.content-hr').show();
            $('.search-categories-fetish').show();
            $('.clone-section-fetish').empty();
            $('.fetish-wrapper').removeClass('hidden');

            /**
             * If the count is greater than the amount shown, show the SEE ALL link...
             */
            if ( results.category_count > results.categories.length) {
                $('.search-categories-fetish')
                        .first()
                        .append('<a href="'+base_url+'search/more/fetish/'+searchQuery+'" class="see_all_link">See All</a>');
            }
            var fetishCount = 0;
            $.each(results.categories, function(i, data) {
          //loop through fetish results

              $('#fetish_master').clone().appendTo('.clone-section-fetish').attr('id', 'fetish_result_' + fetishCount).removeClass('hidden');
              var name = data.name;
              if (name.length > 48) {
                 var nameMax = name.substring(0, 48);
                nameMax += '...';
              } else {
                var nameMax = data.name;
              }
              var url = data.url;
              $('#fetish_result_' + fetishCount + ' .fetish-name').html(nameMax);
              $('#fetish_result_' + fetishCount + ' .fetish-link').attr('href', url)
              fetishCount++;

              $.fn.wrapInTag = function(opts) {

                var tag = opts.tag || 'strong'
                  , words = opts.words || []
                  , regex = RegExp(words.join('|'), 'gi') // case insensitive
                  , replacement = '<'+ tag +'>$&</'+ tag +'>';

                return this.html(function() {
                  return $(this).text().replace(regex, replacement);
                });
              };

                if ( results.category_count > 0) {
                  // add the results
                  $('#fetish-num-of-total-results').text('Showing ' + results.categories.length + ' of ' + results.category_count);
                } else {
                  $('#fetish-num-of-total-results').addClass('hidden');
                }

              // Usage
              $('.fetish-name').wrapInTag({
                tag: 'b',
                words: [searchQuery]
              });

            })
          } else {
            $('.content-hr').hide();
            $('.search-categories-fetish').hide();
            $('.fetish-wrapper').addClass('hidden');
          }
          if (results.content != 0) {
            $('.search-categories-content').show();
            $('.clone-section-content').empty();
            $('.content-wrapper').removeClass('hidden');

            /**
             * If the count is greater than the amount shown, show the SEE ALL link...
             */
            if ( results.content_count > results.content.length) {
                $('.search-categories-content')
                        .first()
                        .append('<a href="'+base_url+'search/more/content/'+searchQuery+'" class="see_all_link">See All</a>');
            }

            var contentCount = 0;
            $.each(results.content, function(i, data) {
              //loop through content results

              $('#content_master').clone().appendTo('.clone-section-content').attr('id', 'content_result_' + contentCount).removeClass('hidden');
              var name = data.name;
             if (name.length > 48) {
                 var nameMax = name.substring(0, 48);
                nameMax += '...';
              } else {
                var nameMax = data.name;
              }
              var type = data.type;
              var url = data.url;
              $('#content_result_' + contentCount + ' .content-name').html(nameMax);
              $('#content_result_' + contentCount + ' .content-type').html(type);
              $('#content_result_' + contentCount + ' .content-link').attr('href', url);
              contentCount++;

              $.fn.wrapInTag = function(opts) {

                var tag = opts.tag || 'strong'
                  , words = opts.words || []
                  , regex = RegExp(words.join('|'), 'gi') // case insensitive
                  , replacement = '<'+ tag +'>$&</'+ tag +'>';

                return this.html(function() {
                  return $(this).text().replace(regex, replacement);
                });
              };

              if ( results.content_count > 0) {
                // add the results
                $('#content-num-of-total-results')
                        .text('Showing ' + results.content.length + ' of ' + results.content_count);

              } else {
                $('#content-num-of-total-results').addClass('hidden');
              }

              // Usage
              $('.content-name').wrapInTag({
                tag: 'b',
                words: [searchQuery]
              });

              if (type == "video") {
                $('.search-name .fa').removeClass('fa-image').removeClass('fa-shopping-cart');
                $('.search-name .fa').addClass('fa-video-camera');
              } else if (type == "image") {
                $('.search-name .fa').removeClass('fa-video-camera').removeClass('fa-shopping-cart');
                $('.search-name .fa').addClass('fa-image');
              } else if (type == "listing") {
                $('.search-name .fa').removeClass('fa-video-camera').removeClass('fa-shopping-cart');
                $('.search-name .fa').addClass('fa-phone');
              } else {
                $('.search-name .fa').removeClass('fa-video-camera').removeClass('fa-image');
                $('.search-name .fa').addClass('fa-shopping-cart');
              }
            });


          } else {
            $('.search-categories-content').hide();
            $('.content-wrapper').addClass('hidden');
          }
        } else {
          $('.noResults').removeClass('hidden');
          $('.models-wrapper').hide();
          $('.fetish-wrapper').hide();
          $('.content-wrapper').hide();
          $('.search-categories-content').hide();
          $('.search-categories-fetish').hide();
          $('.search-categories-model').hide();
          $('.fetish-hr').hide();
          $('.content-hr').hide();
          $('#sub-dropdown-search').fadeIn(300);
        }


      },
      error: function(data) {
        //hide loader
        $('.loader').css('visibility', 'hidden');
        $('.models-wrapper').hide();
        $('.fetish-wrapper').hide();
        $('.content-wrapper').hide();
        $('.search-categories-content').hide();
        $('.search-categories-fetish').hide();
        $('.search-categories-model').hide();
        $('.fetish-hr').hide();
        $('.content-hr').hide();
        $('#sub-dropdown-search').fadeIn(300);
        $('.ajaxError').removeClass('hidden');
      }
    });
  };

  // $('.navbar-form').submit(function(e) {
  //   e.preventDefault();
  // })


  $('#nav-search').click(function(e) {
    if ($(this).val().length >= min) {
      $('#sub-dropdown-search').fadeIn(300);
      e.stopPropagation();
    }
  })

  $('.nav-link').hover(function() {
    $('#sub-dropdown-search').hide();
  })


  $('#sub-dropdown-search').hover(function() {
    $('#sub-dropdown').hide();
  })

  $('html').click(function() {
    $('#sub-dropdown-search').fadeOut(300);
  })

  $('#sub-dropdown-search').click(function(e) {
    // $('#sub-dropdown-search').fadeOut();
    e.stopPropagation();
  })

  //load modal
  initModal();
  //Modal Close
  $('#modal-container').on('hidden.bs.modal', function (e) {
    $(this).html('');
  });

  //close top alert
  $(".thanksAlert").fadeTo(2000, 500).slideUp(500, function(){
    $(".thanksAlert").alert('close');
  });

  //add to cart functionality
  $('.added').hide();
  initAddToCart();

  //Mark items in cart
  $('#shopping-cart .cart-items').each(function() {
    if ($('#shopping-cart').attr('data-total') >= 1) {
      $('#shopping-cart').css('visibility', 'visible');
    } else {
      $('#shopping-cart').css('visibility', 'hidden');
    }
    $('#clip-' + $(this).val() + ' .addToCart').html('In Cart');
    $('#clip-' + $(this).val() + ' .addToCart').css('background-color', '#555555').css('color', '#fff');
    $('#clip-' + $(this).val() + ' .addToCart').addClass('disabled');
    $('#clip-' + $(this).val() + ' .addToCart').removeClass('btn-default');
  });

  $('#legal_modal').on('hidden.bs.modal', function () {
    var modals_open = $('.modal.in').length;
    if (modals_open > 0) {
      $('body').addClass('modal-open');
    }
  });
  /* 18 over splash */

   function haveBackdrop() {
    if ($('.modal-backdrop').length > 0) {
        $('.modal-backdrop').addClass('legal-modal-backdrop');
        clearTimeout(mBackdrop);
        return true;
    }
    return false;
  }
  var mBackdrop;

if(typeof bypass == "undefined") {
  if (agreed) {
    $('#legal_modal').modal({show:true});
    mBackdrop = setTimeout("haveBackdrop()", 100);
    haveBackdrop();
  }
}

  $("#enter").click(function() {
    $('.age-loader').removeClass('hidden');
    $.ajax({
      url: base_url + 'terms/agreed',
      dataType: 'json',
      type: 'post',
      success: function(result) {
        $('.age-loader').addClass('hidden');
        if (result.success) {
          $('#legal_modal').modal({show:false});
        }
      }
    });
  });

  $('#underAgeLink').click(function (e) {
    e.preventDefault();
    $('#consentFailed').css('display', 'block');
  })
});


/* end of doc ready */

//enable tooltips on header icons
$('[data-toggle="tooltip"]').tooltip();

//Hide navigation on load
var $window = $(window);
function checkWidth() {
  var windowsize = $window.width();
  if (windowsize >= 991) {
    $('.mobileScrollingLogo').addClass('hidden');
  } else {
    if ($(window).scrollTop() > $('#header-nav').height() + 50) {
      $('.mobileScrollingLogo').removeClass('hidden');
    } else {
      $('.mobileScrollingLogo').addClass('hidden');
    };
  };
};
checkWidth();
$(window).resize(checkWidth);


$(window).on('scroll', function() {
  if ($(window).scrollTop() > $('#header-nav').height() + 50) {
    if(!$('#header-subnav .navbar').hasClass('navbar-fixed-top')) {
      $('#header-subnav .navbar').css('opacity', 0).addClass('navbar-fixed-top').fadeTo(500, 1);
      $('.scrollingNav').removeClass('hidden');
      $('.nonScrollingNav').addClass('hidden');
      if ($(window).width() <= 991) {
        $('.mobileScrollingLogo').removeClass('hidden');
      } else {
        $('.mobileScrollingLogo').addClass('hidden');
      }
    }
  } else {
    $('.scrollingNav').addClass('hidden');
    $('.nonScrollingNav').removeClass('hidden');
    $('#header-subnav .navbar').removeClass('navbar-fixed-top');
    $('.mobileScrollingLogo').addClass('hidden');
  }


});

/*
 * Show member / model balance
 */
function updateBalance() {
  if (typeof member_id !== 'undefined' && member_id) {
    $.ajax({
      url: base_url + 'home/ajx_member_credits',
      data: {member_id: member_id},
      type: 'post',
      dataType: 'html',
      success: function(data) {
        $('#siteBalanceDisplay').html(data);
      },
      error: function (data) {
        // Unable to retrieve balance
      }
    });
  }
}
// Run on page load
updateBalance();

//var addToCartGA = (item) => {
function addToCartGA(item)
{
  var itemOptions = {
    "items": [
      item
    ]
  }

  //IWD-1073 sending the same data using
  dataLayer.push({
    'event': 'add_to_cart',
    'ecommerce': {
      'addItems': itemOptions
      }
  });

  // Sample Item format
  // item = {
  //   "id" : "1982022", 
  //   "name": "Beauty Salon - Part 02 - Episode 75 - HD 2560x1440", 
  //   "brand": "IWC-29438", 
  //   "category": "Foot Domination, Foot Fetish",
  //   "price" : "16.99", 
  //   "variant": "1",   
  // }

}

//Add to cart functionality
function initAddToCart() {

  $('.addToCart').unbind('click');
  $('.addToCart').click(function () {
    if($(this).hasClass('again')) {
      var buyAgain = $(this);
      buyAgain.prop('disabled', true);
      sameButton = $(this).attr('id');
      var same = $(this).attr('data-id');
      $('#modal-container').load(base_url + 'store/buy_again/' + $(this).attr('data-id'), function(result) {
        $('#modal-container #buyAgain').modal({show:true});
        buyAgain.prop('disabled', false);

      });

      return false;
      // if(answer == false) {
      //   return false;
      // }
    }
    var button = this;
    var total = $('#shopping-cart').attr('data-total');

    $(button).prop('disabled', true);
    $(button).html('<div class="loader"><div class="loader-inner ball-beat"><div></div><div></div><div></div></div></div>');

      $.ajax({
      url: base_url + 'shopping_cart/ajax_add_to_cart',
      dataType: 'json',
      data: {'vod_pop_item_id': $(button).data('id')},
      type: 'post',
      success: function(result) {

        if(result.item){
          addToCartGA(result.item);
        }

        if(result.success) {
          $('.added').alert();
          $('.shopping-cart-icon').css('visibility', 'visible');
          $(button).css('background-color', '#555555').css('color', '#fff');
          $(button).addClass('disabled');
          $(button).removeClass('btn-default');
          $(button).html('In Cart');

          $('.addToCart[data-id="' + same + '"]').css('background-color', '#555555').css('color', '#fff');
          $('.addToCart[data-id="' + same + '"]').addClass('disabled');
          $('.addToCart[data-id="' + same + '"]').removeClass('btn-default');
          $('.addToCart[data-id="' + same + '"]').html('In Cart');
          $('#shopping-cart').prepend('<input type="hidden" class="cart-items" name="item[' + $(button).data('id') + ']" value="' + $(button).data('id') + '">');
          total++;
          $('#shopping-cart').attr('data-total', total);
          $('.count').html('(' + total + ')');
          if ($('#shopping-cart').attr('data-total') >= 1) {
            $('#shopping-cart').css('visibility', 'visible');
          } else {
            $('#shopping-cart').css('visibility', 'hidden');
          }
          $('[data-toggle="popover"]').popover();
          $('.cartWrap').popover('show');
            setTimeout(function () {
                $('.cartWrap').popover('hide');
            }, 2000);
        } else if (result.blocked == 'blocked') {

          $.notify({message: 'This model\'s content is no longer available'},{type: 'danger',delay: 3000});
          $('.shopping-cart-icon').css('visibility', 'visible');
          $(button).css('background-color', '#555555').css('color', '#fff');
          $(button).addClass('disabled');
          $(button).removeClass('btn-default');
          $(button).html('Unavailable');
        }

      }
    });
    return false;
  });
}

//Ajax User Sign in
function memberSignIn(currentModal, modalUrl, modal) {
  //Remove the current sign in buttons
  $('.header-menu').empty();
  //Ajax load user menu
  $('.header-menu').load(base_url + '/login/get_member_menu/', function(result) {
    //Close current Modal
    $(currentModal).modal('hide');
    //Lauch new modal
    launchModal(modalUrl, modal);
    //Init Modal
    initModal();
  });
}

//Modal Loading
function initModal() {
  $('.modal-load').unbind('click');
  $('.modal-load').click(function(e) {
    e.preventDefault();
    if($(this).attr('data-opening') === 'true') return true;
    $(this).attr('data-opening', true);
    var source = $(this);
    //disable button during load
    source.prop('disabled', true);
    $('#modal-container').load(source.attr('href'), function(result) {
      //console.log(result);
      $('#modal-container ' + source.data('target')).modal({show:true});
      source.prop('disabled', false);
      source.attr('data-opening', false);
    });

  })
}

function launchModal(url, target) {
 // $('#modal-container').children().first().on('hidden.bs.modal', function() {
    $('#modal-container').load(url, function(result) {
      $('#modal-container ' + target).modal({
        'show': true,
        'backdrop': true
      });
    });
 // });
}



$('.preview-image-rollover').mouseover(function() {
  var preview = $(this).attr('data-preview');
  var original = $(this).attr('src');
  var parentContainer = $(this).parent().parent();
  var player = $(parentContainer).find('.play-gif');

  $(this).attr('src',preview);

  $(this).mouseout(function() {
    $(this).attr('src',original);
  });

});

//var autoCompletSearching = (searchInputClass) => {
function autoCompletSearching  (searchInputClass)
{
  paramObject = {
    searchType: $('.searchtype').val()
  };

  var storeID = $('.store-id').val();
  if(storeID){
    paramObject.storeID = storeID;
  }

  var options = {
      preventBadQueries:  true,
      showNoSuggestionNotice: true,
      noSuggestionNotice: 'No Results Found',
      deferRequestBy: 1000,
      minChars: 2,
      triggerSelectOnValidInput:  false,
      autoSelectFirst:  false,
      serviceUrl: '/search/searching',
      params: paramObject,
      //onSelect: (suggestion) => {
      onSelect: function(suggestion)
      {
        if(suggestion.url)
        {
          window.location = suggestion.url;
        }
      },
      //onSearchStart: (suggestion) => {
      onSearchStart: function(suggestion)
      {
        $('.loading-indicator').html('<i class="fa fa-spin fa-spinner"></i>');
      },
      //onSearchComplete: (suggestion) => {
      onSearchComplete: function(suggestion)
      {
          $('.loading-indicator').html("");
      },
      beforeRender: function (container, suggestions) {

        var queryValue = $('.new-search-form-input:visible').val();

        $.ajax({
          type: 'POST',
          url: '/search/getmore',
          data: {type:paramObject.searchType, query: queryValue},
          success: function(response){
            if(response.url_string){
              $(container).append('<div class="specialauto autocomplete-suggestion autocomplete-suggestion-link" data-index="999"><a href="'+response.url_string+'">See All</a></div>');
            }
          }
        });

    }
  };


  try{
    $(searchInputClass).autocomplete(options);
  }
  catch(err) {
    console.log(err);
  }
}

//var changeSearchSelectState = (inputClass) => {
function changeSearchSelectState (inputClass)
{

  var inputItem = $(inputClass);
  var switcher = $(inputItem).parent().find(".new-search-form-dropdown");
  var switcherChevron = $(switcher).find('.select-chevron i');
  var switcherType = $(switcher).find('.select-icon-type');
  var switcherList = $(switcher).find('.closed-ul');
  $(switcher).on('click', function(){

    var switcherStatus = $(switcher).attr('data-status');

    if(switcherStatus=='closed'){
      $(switcher).attr('data-status','open');
      $(switcherChevron).attr('class','fa fa-chevron-up');
      $(switcherList).show();
    } else if(switcherStatus=='open'){
      $(switcher).attr('data-status','closed');
      $(switcherChevron).attr('class','fa fa-chevron-down');
      $(switcherList).hide();
    }

    $(inputItem).focus();

  });


  $(switcherList).find('li').on('click',function(){
    $(switcherList).find('.active').removeClass('active');
    $(this).addClass('active');
    var listText = $(this).attr('data-text');
    var listValue = $(this).attr('data-value');
    var iconClass = $(this).attr('data-class');
    $('.select-icon-type').html('<i class="'+iconClass+'"></i>');
    $('.searchtype').val(listValue);
    $(inputItem).attr('placeholder','Search: ' + listText);
    autoCompletSearching(inputClass);
  });


  $('.new-search-form').on('submit',function(){
    /*
    var searchTerm = $(this).find(inputClass).val();
    var listValue = $('.searchtype').val();
    if(listValue=='all-artists'){
      listValue = 'artists';
    } else if(listValue == 'model'){
      return false;
    }


    //var locationURL = '/search/more/' + listValue + '?search=' + encodeURIComponent(searchTerm);
    window.location = locationURL;*/
    return true;
  });


  $(inputClass).focus(function(){
    var ulStatus = $('.closed-ul').attr('data-first');
    console.log(ulStatus);
    if(ulStatus=='true'){
      $('.closed-ul').show().attr('data-status','open');
      $('.closed-ul').removeAttr('data-first');
    }
  });


}

/*var searchInputClass = '.new-search-form-input';
var checkSearch = $(searchInputClass).attr('class');
if(checkSearch){
  changeSearchSelectState(searchInputClass);
  autoCompletSearching(searchInputClass);
}*/


/** 
 * video_category_filter.js
 * 
 * This file handles the client-side of the filtering process.
 */


/** 
 * Discerns the page-type (session type) to use
 * @returns {String}
 */
function GetPageType()
{
    var page_url = window.location.href;
    var page_type = 'home';
    
    if ( page_url.indexOf('/fetish/') != -1 ) {
        page_type = 'fetish';
    }
    
    if ( page_url.indexOf('/halloween') != -1 ) {
        page_type = 'fetish';
    }

    if ( page_url.indexOf('/store/') != -1 ) {
        page_type = 'store';
    }
    
    return page_type;
}

/**
 * Discerns the html element (div) to obscure/show
 * @param {String} page_type
 * @returns {String}
 */
function GetContainerDivId(page_type)
{
    switch (page_type) 
    {
        case 'home':
            return '#home-clips-container';
            break;
            
        case 'fetish':
            return '#fetish-clips-container';
            break;
            
        case 'store':
            return '#store-clips';
            break;
            
        default :
            return '#home-clips-container';
    }
}


/**
 * Abstraction for the ajax-reciever
 * @param {String} page_type
 * @returns {String}
 */
function GetAjaxUrlByPageType(page_type)
{
    return 'home/filter_handler';
}

function GetCategoryName(page_type, page_cat_value)
{
    switch (page_type)
    {
        case 'home':
            return 'Newest Category';
            break;
            
        case 'fetish':
            return page_cat_value;
            break;
            
        default:
            return page_cat_value;
    }
}

/** 
 * Calls the remote, setting the session, updating for SORTING (even though its called 'filter')
 * @param {String} sort
 * @param {String} page_type
 * @returns {void}
 */
function FilterResults(sort, page_type)
{
    var sort_by = sort;
        
    $('#select_category').val(sort_by);
    $('#filter_sort').val(sort_by);

    offset = 0;
    previousOffset = 1;
    pageNo = 1;
    var category = $('#select-category').val();
    var container_div_id = GetContainerDivId(page_type);
    var ajax_url = GetAjaxUrlByPageType(page_type);
    var category_name = $("#selected_category").val();
    var page_type = GetPageType();
    
    $(container_div_id).css('opacity', 0.3).css('pointer-events', 'none');
    
    $.ajax({
        type: 'post',
        data: {'offset': offset, 'category': category, 'category_name': category_name, 'sort_by':sort_by, 'use_filter':'true', 'session_type':page_type},
        dataType: 'json',
        url: base_url + ajax_url,
        success: function(data) {
            
            if ( data.status == 'success' && data.redirect == "true") {
                
                location.reload(true);
            }

        },
        done: function (){
            $(container_div_id).css('opacity', 1).css('pointer-events', 'auto');
        },
        error: function(data) {
          $('.anchorLinkN').prop('disabled', false);
          $('.anchorLinkN').html('Next');
        }
    });
    
}

/** 
 * Dynamic binding for the CHANGE event on the elment...
 * @param {String} param1
 * @param {String} param2
 * @param {Object} param3
 */
$(document).on('change', '#video-sort-filter',function(){

    if ( $(this).val() !== 'none') {
        FilterResults($(this).val(), GetPageType());
    }

    return true;

});

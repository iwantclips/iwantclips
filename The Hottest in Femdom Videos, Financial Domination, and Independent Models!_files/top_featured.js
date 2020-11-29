$(document).ready(function() {

	//show and hide top sections
	$('.mobileShow').click(function() {
		$(this).next('.mobileBox').toggleClass('hidden-xs');
		$(this).next('.mobileBox').toggleClass('hidden-sm');
	})

	//Top content pagination slider
	$('.top-pagination .pag-indicators li').click(function() {
		var pageNum = $(this).attr('data-page');
		var bullet = $(this).find('.pag-bullet');
		var item = $(this);
		var target = $(this).parent().attr('data-target');
		var timer = target + 'Timer';

		//Reset pagination 
		resetPagination(target);

		//restart the timer
		restartTimer(timer, target);

		//Add classes to active button
		bullet.addClass('fa-circle');
		bullet.removeClass('fa-circle-thin');
		item.addClass('active');

		//Trigger function to paginate
		switchTopPages(target, pageNum);
		$('#' . target).attr('data-cur-page', pageNum);
	});

	$('#topContent #topContentType :input').change(function() {
		var type = $(this).val();

		$('#topContentClips').fadeTo( 300, 0.01 );

		$('#topContentClips').load(base_url + 'top_lists/ajax_top_selling_content/' + type, function() {
			$('#topContent .top-pagination .pag-indicators li .pag-bullet').removeClass('fa-circle').addClass('fa-circle-thin');
			$('#topContent .top-pagination .pag-indicators li .pag-bullet').first().removeClass('fa-circle-thin').addClass('fa-circle');
			$('#topContentClips').fadeIn(300);
			var thumbs = $('#topContentClips').find('.lazy');
			if(thumbs) {
			  thumbs.lazyload({
			    event : 'csload'
			  });
			  thumbs.trigger("csload");
			}

			// Reload the popups
			bindPopover();

			$('#topContentClips').fadeTo( 300, 1 );
		});
	});

	$('#featuredCollapseBtn').click(function() {
		$('#topFeatured').slideUp(300, function() {
			$('#showFeaturedBtn').removeClass('hidden');
		});
	});

	$('#showFeaturedBtn').click(function() {
		$('#topFeatured').slideDown(300, function() {
			$('#showFeaturedBtn').addClass('hidden');
		});
	});

});

var topTimer;
var featuredTimer;

function resetPagination(target) {
	//Remove all active pagination
	var pagination = $('.pag-indicators[data-target="' + target + '"]');
	pagination.parent().find('.pag-indicators li.active').removeClass('active');
	pagination.parent().find('.pag-bullet').removeClass('fa-circle');
	pagination.parent().find('.pag-bullet').addClass('fa-circle-thin');
}

function setActivePage(target, pageNum) {
	var item = $('.pag-indicators[data-target="' + target + '"] li[data-page="' + pageNum + '"]');
	var bullet = $('.pag-indicators[data-target="' + target + '"] li[data-page="' + pageNum + '"] .pag-bullet');

	//Add classes to active button
	bullet.addClass('fa-circle');
	bullet.removeClass('fa-circle-thin');
	item.addClass('active');
}

function switchTopPages(target, pageNum) {
	var container = $('#' + target);

	//Fade out current content
	container.fadeOut(300, function() {
		showContent(target, pageNum);
		container.fadeIn(300);
	});
}

function showContent(target, pageNum) {
	var item = $('#' + target + ' .pag-item');
	var perPage = $('#' + target).attr('data-per-page');
	var minNum = (perPage * pageNum) - perPage;
	var maxNum = (perPage * pageNum) - 1;

	//Set current page
	$('#' + target).attr('data-cur-page', pageNum);

	item.each(function(i, pageItem) {
		if (i >= minNum && i <= maxNum) {
			$(pageItem).show();
			var thumbs = $(pageItem).find('.lazy');
			if(thumbs) {
			  thumbs.lazyload({
			    event : 'csload'
			  });
			  thumbs.trigger("csload");
			}
		} else {
			$(pageItem).hide();
		}
	});
}

function autoRotate(timer, target) {
	//Get current pageNum
	var curPage = $('#' + target).attr('data-cur-page');
	var maxPagenum = $('#' + target).attr('data-total-pages');

	if (curPage >= maxPagenum) {
		curPage = 1;
	} else {
		curPage++;
	}

	$('#' + target).attr('data-cur-page', curPage);
	resetPagination(target);
	setActivePage(target, curPage);
	switchTopPages(target, curPage);
	initTimer(timer, target);
}

function initTimer(timer, target) {
    window[timer] = setTimeout(autoRotate, 10000, timer, target);
}
initTimer('topContentClipsTimer', 'topContentClips');
initTimer('phoneStoresWrapperTimer', 'phoneStoresWrapper');
initTimer('featuredStoresWrapperTimer', 'featuredStoresWrapper');


function restartTimer(timer, target) {
	clearInterval(window[timer]);
	initTimer(timer, target);
}
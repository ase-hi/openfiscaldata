
// 얼럿
function customAlert(title = "", message, type) {
  return new Promise((resolve) => {
    $(".alert-popup").remove();

    const $popup = $(`
      <section class="alert-popup" role="alertdialog" style="display: block;">
        <div class="dim"></div>
        <div class="popup" role="document" tabindex="-1" aria-modal="true" aria-labelledby="alert-title" aria-describedby="alert-desc">
          ${title ? `<div class="pop-header">
            <h2 class="alert-title">${title}</h2>
            <button type="button" class="btn-close" aria-label="닫기"></button>
          </div>
          ` : ''}
          <div class="pop-body">
            
            <div class="alert-txt">
              <p id="alert-desc">${message}</p>
            </div>
          </div>
          <div class="pop-footer">
            <div class="btn-wrap">
              ${
                type === "confirm"
                ? `<button type="button" class="btn-alert btn-white btn-cancel">취소</button>
                   <button type="button" class="btn-alert btn-blue btn-yes">확인</button>`
                : `<button type="button" class="btn-alert btn-blue btn-yes">확인</button>`
              }
            </div>
          </div>
        </div>
      </section>
    `); 

    $("body").append($popup);
    $popup.find(".popup").focus();

    $popup.on("click", ".btn-close, .btn-cancel", function () {
      $popup.remove();
      resolve(false);
    });

    $popup.on("click", ".btn-yes", function () {
      $popup.remove();
      resolve(true);
    });
  });
}


function gnbMenu(){
  var $headerMenu = $('.header .header-menu');
  var $gnbItems = $('.header .gnb-menu-wrap .gnb-menu > li');
  var closeTimer = null;
  var $openLi = null;

  $headerMenu.off('.gnbMenu');
  $gnbItems.off('.gnbMenu');
  $gnbItems.children('a').off('.gnbMenu');
  $gnbItems.children('.depth-wrap').off('.gnbMenu');

  function showPanel($li, animateOpen){
    clearTimeout(closeTimer);
    var $depth = $li.children('.depth-wrap');
    if(!$depth.length) return;

    if($openLi && $openLi[0] === $li[0] && $depth.is(':visible')) return;

    // 이미 패널이 열린 채 다른 메뉴로 이동 → 슬라이드 없이 교체만
    var switching = !!( $openLi && $openLi[0] !== $li[0] );
    if(switching){
      $openLi.removeClass('is-open').children('.depth-wrap').stop(true, true).hide();
    }

    $li.addClass('is-open');
    if(!switching && animateOpen && !$depth.is(':visible')){
      $depth.stop(true, true).slideDown(200);
    } else {
      $depth.stop(true, true).show();
    }
    $openLi = $li;
  }

  function closeAll(){
    clearTimeout(closeTimer);
    closeTimer = setTimeout(function(){
      $gnbItems.removeClass('is-open');
      $gnbItems.children('.depth-wrap:visible').stop(true, true).slideUp(200);
      $openLi = null;
    }, 120);
  }

  $gnbItems.each(function(){
    var $li = $(this);
    var $link = $li.children('a').first();
    var $depth = $li.children('.depth-wrap');
    if(!$depth.length) return;

    $link.on('mouseenter.gnbMenu focus.gnbMenu', function(){
      showPanel($li, true);
    });

    $depth.on('mouseenter.gnbMenu', function(){
      clearTimeout(closeTimer);
      showPanel($li, false);
    });

    $li.on('focusout.gnbMenu', function(e){
      var next = e.relatedTarget;
      if(next && $headerMenu.length && $.contains($headerMenu[0], next)) return;
      if(next && $gnbItems.get().some(function(item){ return $.contains(item, next); })) return;
      closeAll();
    });
  });

  // GNB(헤더 메뉴 영역) 밖으로 나갈 때만 슬라이드 업
  $headerMenu.on('mouseenter.gnbMenu', function(){
    clearTimeout(closeTimer);
  });
  $headerMenu.on('mouseleave.gnbMenu', function(){
    closeAll();
  });

  $(window).off('resize.gnbMenu').on('resize.gnbMenu', function(){
    if($(window).width() <= 1024){
      clearTimeout(closeTimer);
      $gnbItems.removeClass('is-open').children('.depth-wrap').stop(true, true).hide();
      $openLi = null;
    }
  });
}

// loading
function loading(){
  const loadingHtml = `<div class="loading-bar" role="status" aria-live="polite">
    <svg class="loading2-symbol" width="46" height="44" viewBox="0 0 45.6 44" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M34.1327 20.8055C30.2889 18.2309 25.3706 19.2831 22.7904 23.1487C20.6415 26.3874 17.3879 26.7904 16.1319 26.7904C12.0157 26.7904 9.21605 23.9397 8.37616 20.992C8.37616 20.992 8.36103 20.9323 8.35346 20.9099C8.34589 20.8801 8.33833 20.8428 8.33076 20.8129C8.0054 19.5816 7.92217 18.9921 7.92217 17.6861C7.92217 10.6341 15.2617 2.78351 25.817 2.78351C36.3724 2.78351 42.8266 10.9027 44.4232 15.4175C44.3929 15.3354 44.3626 15.2534 44.3399 15.1787C41.2603 6.34313 32.7707 0 22.7753 0C10.1997 0 0 10.052 0 22.4621C0 33.5514 8.11133 43.0437 19.3628 43.0437C28.3367 43.0437 34.3672 38.0811 37.129 31.2455C38.6499 27.5068 37.5754 23.1114 34.1327 20.8055Z" fill="#003964"/>
      <path d="M44.5435 15.8986C43.2178 11.4874 36.9873 2.7958 25.8077 2.7958C15.2466 2.7958 7.9114 10.6575 7.9114 17.7330C7.9114 19.0433 7.9998 19.6548 8.3091 20.8777C8.1765 20.3536 8.0882 19.7858 8.0882 19.2617C8.0882 11.9241 15.5560 6.8140 23.2006 6.8140C33.5847 6.7704 41.9805 15.1125 41.9805 25.3326C41.9805 33.3691 37.2965 40.3135 30.4917 43.6765C39.2409 40.5319 45.5156 32.2335 45.5156 22.4937C45.5156 20.1789 45.2062 18.1698 44.5435 15.8986Z" fill="#E4032E"/>
    </svg>
    <p class="loading2-text">잠시만 기다려주세요</p>
  </div>`

  const $loading = $(loadingHtml);
  $('body').append($loading);
  $('body, html').css('overflow', 'hidden');
}


function breadcrumbMenu(){
  $(document).off('click.bc2Menu').on('click.bc2Menu', '.breadcrumb .bc-btn', function(e){
    e.preventDefault();
    var $li = $(this).parent();
    var $menu = $li.children('.bc-menu');
    if(!$menu.length || !$menu.children().length) return;

    if($li.hasClass('is-open')){
      $li.removeClass('is-open');
      $(this).attr('aria-expanded', 'false');
    }else{
      $('.breadcrumb .bc-depth > li.is-open').removeClass('is-open').children('.bc-btn').attr('aria-expanded', 'false');
      $li.addClass('is-open');
      $(this).attr('aria-expanded', 'true');
    }
  });

  $(document).off('click.bc2Outside').on('click.bc2Outside', function(e){
    if($(e.target).closest('.breadcrumb').length) return;
    $('.breadcrumb .bc-depth > li.is-open').removeClass('is-open').children('.bc-btn').attr('aria-expanded', 'false');
  });
}

function pageFeedback(){
  function updateCount($wrap){
    var len = $wrap.find('.page-feedback-textarea').val().length;
    $wrap.find('.page-feedback-count-current').text(len);
  }

  function closeFeedback($wrap){
    var $form = $wrap.find('.page-feedback-form');
    $wrap.removeClass('is-expanded').removeAttr('data-feedback-type');
    $wrap.find('.btn-feedback[data-feedback]').removeClass('is-selected');
    $form.stop(true, true).slideUp(200, function(){
      $form.prop('hidden', true).css('display', '');
      $wrap.find('.page-feedback-textarea').val('');
      updateCount($wrap);
    });
  }

  $(document).off('click.pageFeedback').on('click.pageFeedback', '.page-feedback .btn-feedback[data-feedback]', function(){
    var $wrap = $(this).closest('.page-feedback');
    var $form = $wrap.find('.page-feedback-form');
    var type = $(this).data('feedback');

    $wrap.find('.btn-feedback[data-feedback]').removeClass('is-selected');
    $(this).addClass('is-selected');
    $wrap.attr('data-feedback-type', type);

    if(!$wrap.hasClass('is-expanded')){
      $wrap.addClass('is-expanded');
      $form.prop('hidden', false).hide().stop(true, true).slideDown(200, function(){
        $(this).css('display', 'flex');
        $wrap.find('.page-feedback-textarea').trigger('focus');
      });
    }
  });

  $(document).off('click.pageFeedbackCancel').on('click.pageFeedbackCancel', '.page-feedback .btn-feedback-cancel', function(){
    closeFeedback($(this).closest('.page-feedback'));
  });

  $(document).off('input.pageFeedbackCount').on('input.pageFeedbackCount', '.page-feedback .page-feedback-textarea', function(){
    updateCount($(this).closest('.page-feedback'));
  });

}

function viewFilesToggle(){
  $(document).off('click.viewFilesToggle').on('click.viewFilesToggle', '.view-files-toggle', function(){
    var $files = $(this).closest('.view-files');
    $files.toggleClass('is-closed');
    $files.find('.view-files-list').stop(true, true).slideToggle(200);
  });
}

function fontSettingMenu(){
  var storageKey = 'fis-font-size';
  // Ctrl + 처럼 화면 전체를 확대/축소 (CSS zoom)
  var zoomMap = { sm:0.9, md:1, lg:1.1, xl:1.2, xxl:1.3 };

  function applyFontSize(size){
    var key = zoomMap[size] !== undefined ? size : 'md';
    document.documentElement.style.zoom = zoomMap[key];
    try{ localStorage.setItem(storageKey, key); }catch(e){}
    $('.font-setting-list [data-fs]').removeClass('is-active');
    $('.font-setting-list [data-fs="' + key + '"]').addClass('is-active');
    $(window).trigger('resize');
  }

  try{
    applyFontSize(localStorage.getItem(storageKey) || 'md');
  }catch(e){
    applyFontSize('md');
  }

  $(document).off('click.fontSetting').on('click.fontSetting', '.font-setting-btn', function(e){
    e.preventDefault();
    e.stopPropagation();
    var $wrap = $(this).closest('.font-setting');
    var $dropdown = $wrap.find('.font-setting-dropdown');
    var willOpen = !$wrap.hasClass('is-open');
    $('.font-setting.is-open').removeClass('is-open')
      .find('.font-setting-btn').attr('aria-expanded', 'false')
      .end().find('.font-setting-dropdown').attr('hidden', true);
    if(willOpen){
      $wrap.addClass('is-open');
      $(this).attr('aria-expanded', 'true');
      $dropdown.removeAttr('hidden');
    }
  });

  $(document).off('click.fontSettingItem').on('click.fontSettingItem', '.font-setting-dropdown [data-fs]', function(e){
    e.preventDefault();
    applyFontSize($(this).attr('data-fs'));
    var $wrap = $(this).closest('.font-setting');
    $wrap.removeClass('is-open');
    $wrap.find('.font-setting-btn').attr('aria-expanded', 'false');
    $wrap.find('.font-setting-dropdown').attr('hidden', true);
  });

  $(document).off('click.fontSettingOutside').on('click.fontSettingOutside', function(e){
    if($(e.target).closest('.font-setting').length) return;
    $('.font-setting.is-open').removeClass('is-open')
      .find('.font-setting-btn').attr('aria-expanded', 'false')
      .end().find('.font-setting-dropdown').attr('hidden', true);
  });

  // 브라우저 자체 확대/축소 초기화 단축키(Ctrl/Cmd+0)를 누르면 우리 커스텀 zoom도 같이 기본값으로 리셋
  $(document).off('keydown.fontSettingReset').on('keydown.fontSettingReset', function(e){
    if((e.ctrlKey || e.metaKey) && (e.key === '0' || e.code === 'Digit0' || e.code === 'Numpad0')){
      applyFontSize('md');
    }
  });
}

  function inputDel(obj){
    if($(obj).length <= 0) return;
    function f($self){
      let $input = $self.find('input');
      let $del = $('<button type="button" style="display:none;" class="btn-del"></button>');
      $self.append($del);

      if($input.val()) $del.show();
      $input.on('keyup', function(){
        if($input.val().length > 0) $del.show()
        else $del.hide()
      });
      $del.on('click', function(){
        $input.val('');
        $del.hide();
      });
    }
    $(obj).each(function(){
      f($(this));
    })
  }

  function tabEvt(){
    $(document).off('click.tabEvt').on('click.tabEvt', '[data-tab-id]', function(e){
      e.stopPropagation();
      var $trigger = $(this);
      var tabid = $trigger.data('tab-id');
      // <li><a data-tab-id> 구조(.tab-main)는 li에, <button data-tab-id> 구조(.tab-category)는 버튼 자체에 on을 준다
      var $active = $trigger.parent().is('li') ? $trigger.parent() : $trigger;

      $active.addClass('on').siblings().removeClass('on');

      $active.add($active.siblings()).each(function(){
        var $el = $(this);
        var id = $el.is('[data-tab-id]') ? $el.data('tab-id') : $el.find('[data-tab-id]').data('tab-id');
        if(id) $('#' + id).hide();
      });
      $('#' + tabid).show();

      if($trigger.parents('.tab-condition').length > 0){
        var $selectd = $trigger.parents('.tab-condition').find('.selected');
        $selectd.find('button').text($trigger.text());
      }
    });

  }


  function initPaginationType(nav, options){
    options = options || {};
    var totalPages = options.totalPages || 1;
    var desktopVisibleCount = options.visibleCount || 8;
    var mobileVisibleCount = options.mobileVisibleCount || 5;
    var currentPage = options.currentPage || 1;
    var onChange = options.onChange;
    var mobileQuery = window.matchMedia('(max-width: 768px)');

    var listEl = nav.querySelector('.pg-list');
    var prevBtn = nav.querySelector('.pg-prev');
    var nextBtn = nav.querySelector('.pg-next');

    function getVisibleCount(){
        return mobileQuery.matches ? mobileVisibleCount : desktopVisibleCount;
    }

    function getPageList(current, total, windowSize){
        var pages = [];
        if(total <= windowSize + 1){
            for(var i = 1; i <= total; i++){ pages.push(i); }
            return pages;
        }
        var start = current - Math.floor((windowSize - 1) / 2);
        if(start < 1){ start = 1; }
        var end = start + windowSize - 1;
        if(end > total - 1){
            end = total - 1;
            start = Math.max(1, end - windowSize + 1);
        }
        for(var j = start; j <= end; j++){ pages.push(j); }
        if(end < total - 1){ pages.push('ellipsis'); }
        if(pages[pages.length - 1] !== total){ pages.push(total); }
        return pages;
    }

    function render(){
        var visibleCount = getVisibleCount();
        var pages = getPageList(currentPage, totalPages, visibleCount);

        listEl.innerHTML = '';
        pages.forEach(function(page){
            var li = document.createElement('li');

            if(page === 'ellipsis'){
                li.className = 'pg-ellipsis';
                li.innerHTML = '<button type="button" aria-label="' + visibleCount + '페이지 이동"><span class="dots"><span></span><span></span><span></span></span></button>';
                li.querySelector('button').addEventListener('click', function(){
                    setPage(Math.min(totalPages, currentPage + visibleCount));
                });
            }else{
                if(page === currentPage){ li.className = 'on'; }
                var btn = document.createElement('button');
                btn.type = 'button';
                btn.textContent = page;
                if(page === currentPage){
                    btn.setAttribute('aria-current', 'page');
                }else{
                    btn.setAttribute('aria-label', page + '페이지');
                    btn.addEventListener('click', function(){ setPage(page); });
                }
                li.appendChild(btn);
            }
            listEl.appendChild(li);
        });

        prevBtn.disabled = currentPage <= 1;
        nextBtn.disabled = currentPage >= totalPages;
    }

    function setPage(page){
        page = Math.min(totalPages, Math.max(1, page));
        if(page === currentPage){ return; }
        currentPage = page;
        render();
        if(typeof onChange === 'function'){ onChange(currentPage); }
    }

    prevBtn.addEventListener('click', function(){ setPage(currentPage - 1); });
    nextBtn.addEventListener('click', function(){ setPage(currentPage + 1); });

    if(mobileQuery.addEventListener){
        mobileQuery.addEventListener('change', render);
    }else if(mobileQuery.addListener){
        mobileQuery.addListener(render);
    }

    render();

    return { setPage: setPage, getCurrentPage: function(){ return currentPage; } };
}




// 스크롤 방향에 따라 body에 scroll-down/scroll-up 클래스 부여
function scrollDirection(){
  var lastScrollTop = $(window).scrollTop();
  var ticking = false;

  $(window).on('scroll.scrollDirection', function(){
    if(ticking) return;
    ticking = true;

    requestAnimationFrame(function(){
      var scrollTop = $(window).scrollTop();

      if(scrollTop > lastScrollTop){
        $('body').removeClass('scroll-up').addClass('scroll-down');
      }else if(scrollTop < lastScrollTop){
        $('body').removeClass('scroll-down').addClass('scroll-up');
      }

      lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
      ticking = false;
    });
  });
}


// floating-quick이 푸터 영역 아래로 내려가지 않도록 고정 (PC, min-width:1025px)
function floatingQuickStop(){
  var mq = window.matchMedia('(min-width:1025px)');
  var baseBottom = 80; // css .floating-quick{bottom:80px;}와 동일한 값
  var footerGap = 24; // 푸터와 최소로 띄울 간격
  var sideGap = 60; // 컨텐츠 오른쪽 끝에서 띄울 간격 (기존 translateX(700px) 기준값)
  var visualGap = 16; // 상단 비주얼/배너와 최소로 띄울 간격

  function update(){
    var $floating = $('.floating-quick');
    var $footer = $('.footer');

    var content = document.querySelector('.container .contents, .container .main-contents, .main-contents');
    if(!$floating.length || !content) return;

    if(!mq.matches){
      $floating.css({bottom: '', left: ''});
      return;
    }

    var contentRight = content.getBoundingClientRect().right;
    $floating.css('left', (contentRight + sideGap) + 'px');

    if($footer.length){
      var footerTop = $footer.offset().top;
      var viewportBottom = $(window).scrollTop() + $(window).height();
      var needed = viewportBottom - footerTop + footerGap;
      $floating.css('bottom', needed > baseBottom ? needed + 'px' : '');
    }

    var $visual = $('.title-main-wrap, .main-hero').first();
    if($visual.length){
      var visualBottom = $visual[0].getBoundingClientRect().bottom;
      var menuHeight = $floating[0].offsetHeight;
      var maxBottomForVisual = $(window).height() - menuHeight - visualBottom - visualGap;
      var currentBottom = parseFloat($floating.css('bottom')) || baseBottom;
      if(maxBottomForVisual < currentBottom){
        $floating.css('bottom', Math.max(0, maxBottomForVisual) + 'px');
      }
    }
  }

  function tryInit(){
    if($('.floating-quick').length && $('.footer').length){
      update();
    }else{
      setTimeout(tryInit, 50);
    }
  }

  $(window).off('scroll.floatingQuickStop resize.floatingQuickStop')
    .on('scroll.floatingQuickStop resize.floatingQuickStop', update);

  if(mq.addEventListener){
    mq.addEventListener('change', update);
  }else if(mq.addListener){
    mq.addListener(update);
  }

  tryInit();
}






// ready
$(function(){
  function tryGnbMenu() {
    if ($('.gnb-menu-wrap').length) {
      gnbMenu();
    } else {
      setTimeout(tryGnbMenu, 50);
    }
  }
  tryGnbMenu();
  breadcrumbMenu();
  fontSettingMenu();
  viewFilesToggle();

  tabEvt();
  inputDel('.inp');
  inputDel('.input-search');
  inputDel('.main-hero-search');
  scrollDirection();
  floatingQuickStop();

  $(document).on('click', '.floating-top', function(){
    $('html, body').stop(true).animate({scrollTop: 0}, 300);
  });

  //temp
    var sampleNav = document.getElementById('pagination');
    if(sampleNav){
        initPaginationType(sampleNav, { totalPages: 99, currentPage: 1, visibleCount: 8, mobileVisibleCount: 5 });
    }
  
});
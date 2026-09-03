
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

function allMenu(){
  var $layer = $('#allMenuLayer');
  if(!$layer.length) return;

  function closeLangDropdown(){
    $layer.find('.all-menu-lang-sel-wrap').removeClass('is-open')
      .find('.all-menu-lang-sel').attr('aria-expanded', 'false')
      .end().find('.all-menu-lang-dropdown').attr('hidden', true);
  }

  function resetMobileMenu(){
    if($(window).width() > 1024) return;
    var $firstLnb = $layer.find('.all-menu-lnb li:first');
    var $firstPanel = $layer.find('.all-menu-panel[data-panel="0"]');
    $layer.find('.all-menu-lnb li').removeClass('on');
    $layer.find('.all-menu-lnb button').attr('aria-selected', 'false');
    $firstLnb.addClass('on').find('button').attr('aria-selected', 'true');
    $layer.find('.all-menu-panel').removeClass('on').attr('hidden', true);
    $firstPanel.addClass('on').removeAttr('hidden');
    $layer.find('.all-menu-group').removeClass('on');
  }

  function openMenu(){
    resetMobileMenu();
    closeLangDropdown();
    $layer.removeAttr('hidden').attr('aria-hidden', 'false').addClass('is-open');
    $('body').addClass('mo-hidden');
    $layer.find('.btn-all-menu-close').focus();
  }

  function closeMenu(){
    closeLangDropdown();
    $layer.attr('hidden', true).attr('aria-hidden', 'true').removeClass('is-open');
    $('body').removeClass('mo-hidden');
  }

  $(document).off('click.allMenuOpen').on('click.allMenuOpen', '.btn-all-menu-open', function(e){
    e.preventDefault();
    openMenu();
  });

  $layer.off('click.allMenuClose').on('click.allMenuClose', '.btn-all-menu-close, .all-menu-dim', function(e){
    e.preventDefault();
    closeMenu();
  });

  $(document).off('keydown.allMenu').on('keydown.allMenu', function(e){
    if(e.key === 'Escape' && $layer.hasClass('is-open')) closeMenu();
  });

  $layer.off('click.allMenuLnb').on('click.allMenuLnb', '.all-menu-lnb button[data-panel]', function(){
    var panelIdx = $(this).data('panel');
    $(this).closest('li').addClass('on').siblings().removeClass('on');
    $(this).attr('aria-selected', 'true').closest('li').siblings().find('button').attr('aria-selected', 'false');
    $layer.find('.all-menu-panel').removeClass('on').attr('hidden', true)
      .filter('[data-panel="' + panelIdx + '"]').addClass('on').removeAttr('hidden')
      .find('.all-menu-group').removeClass('on');
  });

  $layer.off('click.allMenuAcc').on('click.allMenuAcc', '.all-menu-group-tit:not(.is-external)', function(e){
    if($(window).width() > 1024) return;
    if($(this).is('a')) return;
    e.preventDefault();
    var $group = $(this).closest('.all-menu-group');
    if($group.hasClass('is-single') || $group.hasClass('is-link')) return;
    $group.toggleClass('on').siblings('.all-menu-group:not(.is-link):not(.is-single)').removeClass('on');
  });

  $layer.off('click.allMenuLang').on('click.allMenuLang', '.all-menu-lang-sel', function(e){
    e.preventDefault();
    e.stopPropagation();
    var $wrap = $(this).closest('.all-menu-lang-sel-wrap');
    var willOpen = !$wrap.hasClass('is-open');
    closeLangDropdown();
    if(willOpen){
      $wrap.addClass('is-open');
      $(this).attr('aria-expanded', 'true');
      $wrap.find('.all-menu-lang-dropdown').removeAttr('hidden');
    }
  });

  $layer.off('click.allMenuLangItem').on('click.allMenuLangItem', '.all-menu-lang-list button[data-lang]', function(e){
    e.preventDefault();
    e.stopPropagation();
    var label = $(this).data('label');
    var $wrap = $(this).closest('.all-menu-lang-sel-wrap');
    $wrap.find('.all-menu-lang-value').text(label);
    $wrap.find('.all-menu-lang-list li').removeClass('selected').find('button').attr('aria-selected', 'false');
    $(this).closest('li').addClass('selected');
    $(this).attr('aria-selected', 'true');
    closeLangDropdown();
  });

  $layer.off('click.allMenuLangOutside').on('click.allMenuLangOutside', function(e){
    if(!$(e.target).closest('.all-menu-lang-sel-wrap').length) closeLangDropdown();
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

// 탭 개수가 많아 넘칠 때 스와이프되는 tab-main (js/swiper10.3.1 필요)
// PC(min-width:1025px)에서만 스와이퍼 사용, 모바일에서는 일반 가로 스크롤 (css에서 처리)
function tabMainSwiper(){
  if(typeof Swiper === 'undefined') return;
  if(!$('.tab-main-swiper').length) return;

  var mq = window.matchMedia('(min-width:1025px)');

  // 현재 탭(li.on)이 영역 밖으로 숨지 않도록, 최대한 앞쪽에 보이는 시작 위치를 구함
  // (이전 탭 1개를 앞에 두어 좌측 prev 버튼에 가려지지 않게 함)
  function startIndex($swiper){
    var $slides = $swiper.find('.swiper-slide');
    var idx = $slides.index($slides.filter('.on'));
    if(idx <= 0) return 0;
    return idx - 1;
  }

  function build(){
    $('.tab-main-swiper').each(function(){
      if(this.swiper) return;

      new Swiper(this, {
        slidesPerView: 'auto',
        watchOverflow: true,
        initialSlide: startIndex($(this)),
        navigation: {
          nextEl: $(this).find('.swiper-button-next')[0],
          prevEl: $(this).find('.swiper-button-prev')[0],
        },
        on: {
          lock: function(){ this.el.classList.add('is-locked'); },
          unlock: function(){ this.el.classList.remove('is-locked'); },
        },
      });
    });
  }

  function destroy(){
    $('.tab-main-swiper').each(function(){
      if(this.swiper) this.swiper.destroy(true, true);
      this.classList.remove('is-locked');
    });
  }

  // 모바일(가로 스크롤)에서도 현재 탭이 최대한 앞쪽에 보이도록 스크롤 위치 이동
  function scrollToActive(){
    $('.tab-main-swiper').each(function(){
      var $scroller = $(this).closest('.tab-main');
      if(!$scroller.length) return;

      var $slides = $(this).find('.swiper-slide');
      var idx = startIndex($(this));
      var target = $slides.get(idx);
      if(!target) return;

      $scroller[0].scrollLeft = target.offsetLeft;
    });
  }

  function update(){
    if(mq.matches){
      build();
    }else{
      destroy();
      scrollToActive();
    }
  }

  update();

  if(mq.addEventListener) mq.addEventListener('change', update);
  else mq.addListener(update);
}

// 카드 슬라이드 (js/swiper10.3.1 필요)
function cardSlideSwiper(){
  if(typeof Swiper === 'undefined') return;
  if(!$('.card-slide-swiper').length) return;

  $('.card-slide-swiper').each(function(){
    new Swiper(this, {
      slidesPerView: 'auto',
      spaceBetween: 12,
      watchOverflow: true,
      navigation: {
        nextEl: $(this).closest('.card-slide-wrap').find('.card-slide-next')[0],
        prevEl: $(this).closest('.card-slide-wrap').find('.card-slide-prev')[0],
      },
      breakpoints: {
        768: {spaceBetween: 16},
        1025: {spaceBetween: 20},
      },
    });
  });
}

// 콘텐츠 슬라이드 (js/swiper10.3.1 필요)
function contSlideSwiper(){
  if(typeof Swiper === 'undefined') return;
  if(!$('.cont-slide-swiper').length) return;

  $('.cont-slide-swiper').each(function(){
    var $wrap = $(this).closest('.cont-slide');

    new Swiper(this, {
      slidesPerView: 1,
      spaceBetween: 0,
      watchOverflow: true,
      navigation: {
        nextEl: $wrap.find('.cont-slide-next')[0],
        prevEl: $wrap.find('.cont-slide-prev')[0],
      },
      pagination: {
        el: $wrap.find('.cont-slide-pagination')[0],
        clickable: true,
        renderBullet: function(index, className){
          return '<button type="button" class="' + className + '" aria-label="' + (index + 1) + '번째 슬라이드"></button>';
        },
      },
    });
  });
}

// 콘텐츠 동영상
function contVideoPlay(){
  if(!$('.cont-video').length) return;

  $(document).off('click.contVideoPlay').on('click.contVideoPlay', '.cont-video-play', function(){
    var $wrap = $(this).closest('.cont-video-wrap');
    var youtubeId = $wrap.data('youtube-id');

    if(youtubeId){
      var $iframe = $wrap.find('.cont-video-iframe');

      if(!$iframe.find('iframe').length){
        $iframe.html(
          '<iframe src="https://www.youtube.com/embed/' + youtubeId + '?autoplay=1&rel=0" title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>'
        );
      }

      $wrap.addClass('is-playing');
      return;
    }

    var video = $wrap.find('.cont-video-player')[0];
    if(!video) return;

    $wrap.addClass('is-playing');
    video.controls = true;
    video.play();
  });

  $(document).off('ended.contVideoPlay').on('ended.contVideoPlay', '.cont-video-player', function(){
    var $wrap = $(this).closest('.cont-video-wrap');
    $wrap.removeClass('is-playing');
    this.controls = false;
    this.currentTime = 0;
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
    let tabs = [];

    $('[data-tab-id]').on('click', function(e){
      e.stopPropagation();
      let tabid = $(this).data('tab-id');

      tabs = [];
      tabs.push(tabid);

      if($(this).is('[role="tab"]')) $(this).attr('tabindex', '0');

      let $li = $(this).parents('li').first();
      if($li.length){
        let $group = $li.siblings().addBack();
        let activeClass = $group.is('.is-active') ? 'is-active' : 'on';
        $group.removeClass(activeClass);
        $li.addClass(activeClass);
        if($(this).is('[aria-selected]')) $(this).attr('aria-selected', 'true');
        $li.siblings().find('[data-tab-id]').each(function(){
          if($(this).is('[aria-selected]')) $(this).attr('aria-selected', 'false');
          tabs.push($(this).data('tab-id'));
        });
      }else{
        let $group = $(this).siblings('[data-tab-id]').addBack();
        let activeClass = $group.is('.is-active') ? 'is-active' : 'on';
        $group.removeClass(activeClass);
        $(this).addClass(activeClass);
        if($(this).is('[aria-selected]')) $(this).attr('aria-selected', 'true');
        $(this).siblings('[data-tab-id]').each(function(){
          if($(this).is('[aria-selected]')) $(this).attr('aria-selected', 'false');
          tabs.push($(this).data('tab-id'));
        });
      }

      tabs.forEach(function(v){
        $('#'+v).hide();
      });
      $('#'+tabid).show();

      if($(this).parents('.tab-condition').length > 0){
        let $selectd = $(this).parents('.tab-condition').find('.selected');
        $selectd.find('button').text($(this).text())
      }
    })

  }

  // [data-tab-id] 탭에서 Enter로 활성화 시 해당 .tab-content 내부 첫 포커스로 이동,
  // 그 영역의 마지막 포커스에서 Tab으로 빠져나갈 때 다음 탭으로 이동(마지막 탭이면 그대로 통과)
  function tabPanelFocusFlow(){
    var focusableSel = 'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

    function getTabGroup($tab){
      var $li = $tab.parents('li').first();
      if($li.length){
        return $li.parent().children('li').find('[data-tab-id]');
      }
      return $tab.parent().children('[data-tab-id]');
    }

    // 버튼/링크에서 Enter를 누르면 브라우저는 keydown → click → keyup 순으로 이벤트를 발생시킨다.
    // keyup 시점에는 이미 click(=tabEvt의 show/hide 처리)이 끝난 뒤이므로, 마우스 클릭과 섞이지
    // 않으면서도 별도 타이밍 추정(setTimeout) 없이 안전하게 패널 내부로 포커스를 옮길 수 있다.
    $('[data-tab-id]').on('keyup', function(e){
      if(e.key !== 'Enter') return;
      var tabid = $(this).data('tab-id');
      if(!tabid) return;
      var $panel = $('#' + tabid);
      if(!$panel.length) return;

      var $target = $panel.find(focusableSel).filter(':visible').first();
      if($target.length) $target.trigger('focus');
    });

    $(document).on('keydown', '.tab-content', function(e){
      if(e.key !== 'Tab') return;
      var $panel = $(this);
      if($panel.css('display') === 'none') return;

      var $focusables = $panel.find(focusableSel).filter(':visible');
      if(!$focusables.length) return;

      var $currentTab = $('[data-tab-id="' + $panel.attr('id') + '"]');
      if(!$currentTab.length) return;
      var $tabGroup = getTabGroup($currentTab);
      var idx = $tabGroup.index($currentTab);

      if(!e.shiftKey){
        // 정방향: 패널 마지막 요소에서 Tab → 다음 탭
        if(e.target !== $focusables.last()[0]) return;
        var $nextTab = $tabGroup.eq(idx + 1);
        if(!$nextTab.length) return;

        e.preventDefault();
        // 포커스만 옮기면 패널은 그대로 이전 탭 것이라, Enter를 안 누르고 계속 Tab만 누를 경우
        // 같은 패널로 되돌아와 도돌이표가 된다. 다음 탭을 함께 활성화해 포커스 위치와 화면에
        // 보이는 패널을 항상 일치시켜 둔다(같은 탭에서 다시 Enter를 눌러도 동일 패널이 재표시될
        // 뿐이라 문제 없음).
        $nextTab.trigger('click');
        $nextTab.trigger('focus');
      } else {
        // 역방향: 패널 첫 요소에서 Shift+Tab → 이전 탭을 활성화하고 그 패널의 마지막 요소로 이동
        if(e.target !== $focusables.first()[0]) return;
        // jQuery의 .eq(-1)은 "없음"이 아니라 "마지막 요소"를 가리키므로, idx가 0일 때
        // .eq(idx-1)을 그대로 쓰면 첫 탭인데도 마지막 탭으로 잘못 순환(wrap)한다.
        if(idx <= 0) return; // 첫 탭이면 기본 동작(탭 버튼으로 이동)에 맡김
        var $prevTab = $tabGroup.eq(idx - 1);
        if(!$prevTab.length) return;

        e.preventDefault();
        $prevTab.trigger('click');
        var $prevPanel = $('#' + $prevTab.data('tab-id'));
        var $prevTarget = $prevPanel.find(focusableSel).filter(':visible').last();
        if($prevTarget.length) $prevTarget.trigger('focus');
        else $prevTab.trigger('focus');
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


function floatingQuickMobile(){
  var $quick = $('.floating-quick');
  if(!$quick.length || $quick.data('floatingMobileInit')) return;
  $quick.data('floatingMobileInit', true);

  function closeQuick(){
    $quick.removeClass('is-open');
    $quick.find('.floating-quick-toggle').attr('aria-expanded', 'false').attr('aria-label', '빠른 메뉴 열기');
    $('body').removeClass('mo-hidden');
  }

  function openQuick(){
    if($(window).width() > 1024) return;
    $quick.addClass('is-open');
    $quick.find('.floating-quick-toggle').attr('aria-expanded', 'true').attr('aria-label', '빠른 메뉴 닫기');
    $('body').addClass('mo-hidden');
  }

  $(document).off('click.floatingQuickToggle').on('click.floatingQuickToggle', '.floating-quick-toggle', function(e){
    e.preventDefault();
    if($(window).width() > 1024) return;
    if($quick.hasClass('is-open')) closeQuick();
    else openQuick();
  });

  $quick.off('click.floatingQuickDim').on('click.floatingQuickDim', '.dim', function(){
    if($(window).width() > 1024) return;
    closeQuick();
  });

  $quick.off('click.floatingQuickLink').on('click.floatingQuickLink', '.floating-quick-list a', function(){
    if($(window).width() > 1024 || !$quick.hasClass('is-open')) return;
    closeQuick();
  });

  $(document).off('keydown.floatingQuick').on('keydown.floatingQuick', function(e){
    if(e.key === 'Escape' && $quick.hasClass('is-open')) closeQuick();
  });

  $(window).off('resize.floatingQuick').on('resize.floatingQuick', function(){
    if($(window).width() > 1024 && $quick.hasClass('is-open')) closeQuick();
  });
}

function tryFloatingQuickMobile(){
  if($('.floating-quick').length){
    floatingQuickMobile();
  }else{
    setTimeout(tryFloatingQuickMobile, 50);
  }
}


// floating-quick이 푸터 영역 아래로 내려가지 않도록 고정 (PC, min-width:1025px)
function floatingQuickStop(){
  var mq = window.matchMedia('(min-width:1025px)');
  var baseBottom = 135; // css .floating-quick{bottom:135px;}와 동일한 값
  var footerGap = 79; // 푸터와 최소로 띄울 간격
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



  // DATE
  function datepicker(){
    if($(".datepicker").length <= 0) return;
    $(".datepicker").datepicker({
      showOn: 'focus', 
      dateFormat:"yy-mm-dd",
      changeYear:true,
      changeMonth:true,
      showMonthAfterYear:true,
      monthNames:['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'],
      monthNamesShort:['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'],
      dayNames:['일','월','화','수','목','금','토'],
      dayNamesShort:['일','월','화','수','목','금','토'],
      dayNamesMin:['일','월','화','수','목','금','토'],
      minDate: '',
      maxDate: '',
      // yearSuffix: '년',
      onClose: function( selectedDate ) {
        //add on event 
      }	,
      beforeShow: function(input, inst) {
        
        if($(input).data('min')) $(input).datepicker('option', 'minDate', $(input).data('min'));
        if($(input).data('max')) $(input).datepicker('option', 'maxDate', $(input).data('max'));
  
        setTimeout(function(){
          if($('.ui-datepicker-year option').text().indexOf('년') == -1) $('.ui-datepicker-year option').append('년')
        }, 10)
        },
        onChangeMonthYear: function(input, inst) {
        setTimeout(function(){
          if($('.ui-datepicker-year option').text().indexOf('년') == -1) $('.ui-datepicker-year option').append('년')
        }, 10)
        },
    });
  }



// 팝업
let lastFocusedElement = null;

function popClose(popup){
  let $popup = $(popup);
  $popup.fadeOut();
  $('body, html').css('overflow', '');
  $('body').removeClass('pop-open');
  
  // 팝업을 닫을 때 원래 포커스 위치로 복귀
  if(lastFocusedElement) {
    lastFocusedElement.focus();
    lastFocusedElement = null;
  }
}

function popOpen(popup, callback){
  let $popup = $(popup);
  scrollPosition = $(window).scrollTop();
  
  // 팝업을 연 버튼 저장
  lastFocusedElement = document.activeElement;

  $popup.removeAttr('style');
  $popup.fadeIn();
  $('body, html').css('overflow', 'hidden');
  $('body').addClass('pop-open');
  
  // 팝업이 열린 후 첫 번째 포커스 가능한 요소로 포커스 이동
  setTimeout(() => {
    const focusableElements = $popup.find(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    ).filter(':visible');
    if(focusableElements.length > 0) {
      focusableElements.first().focus();
    }
  }, 100);
  
  $popup.find('.btn-close').on('click', function(){
    popClose(popup);
  });

  // 포커스 트랩 설정
  setupFocusTrap($popup);

  if(callback) callback();
}

function setupFocusTrap($popup) {
  // 팝업 내부의 포커스 가능한 모든 요소 찾기
  const focusableElements = $popup.find(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  ).filter(':visible');
  
  if(focusableElements.length === 0) return;
  
  const firstElement = focusableElements.first()[0];
  const lastElement = focusableElements.last()[0];
  
  // 기존 이벤트 제거 (중복 방지)
  $popup.off('keydown.focustrap');
  
  // 탭 키 이벤트 처리
  $popup.on('keydown.focustrap', function(e) {
    // Tab 키가 아니면 무시
    if(e.key !== 'Tab') return;
    
    // Shift + Tab (역방향)
    if(e.shiftKey) {
      if(document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      }
    } 
    // Tab (정방향)
    else {
      if(document.activeElement === lastElement) {
        e.preventDefault();
        // 마지막 요소에서 Tab을 누르면 팝업 닫기
        popClose('#' + $popup.attr('id'));
      }
    }
  });
  
  // ESC 키로 팝업 닫기
  $popup.off('keydown.escape');
  $popup.on('keydown.escape', function(e) {
    if(e.key === 'Escape') {
      popClose('#' + $popup.attr('id'));
    }
  });
}


function financeCalendar(){
  var $popup = $('#financeCalendarPopup');
  if(!$popup.length || $popup.data('financeCalendarInit')) return;
  $popup.data('financeCalendarInit', true);

  var schedules = [];
  try{
    schedules = JSON.parse($('#financeCalendarData').text());
  }catch(e){
    schedules = [];
  }

  var scheduleMap = {};
  schedules.forEach(function(item){
    if(!scheduleMap[item.date]) scheduleMap[item.date] = [];
    scheduleMap[item.date].push(item);
  });

  var state = {
    year: 2026,
    month: 8,
    selected: '2026-09-14'
  };

  var dayNames = ['일','월','화','수','목','금','토'];

  function pad(n){ return (n < 10 ? '0' : '') + n; }
  function toDateKey(y, m, d){ return y + '-' + pad(m + 1) + '-' + pad(d); }

  function closeFinanceSelects(){
    $popup.find('.finance-calendar-select').removeClass('is-open')
      .find('.finance-calendar-select-btn').attr('aria-expanded', 'false')
      .end().find('.finance-calendar-select-list').attr('hidden', true);
  }

  function initSelectLists(){
    var $yearSelect = $popup.find('.finance-calendar-select[data-type="year"]');
    var $monthSelect = $popup.find('.finance-calendar-select[data-type="month"]');
    var i, html;

    if(!$yearSelect.find('li').length){
      html = '';
      for(i = 2020; i <= 2030; i++){
        html += '<li><button type="button" data-value="' + i + '">' + i + '년</button></li>';
      }
      $yearSelect.find('.finance-calendar-select-list').html(html);

      html = '';
      for(i = 1; i <= 12; i++){
        html += '<li><button type="button" data-value="' + (i - 1) + '">' + i + '월</button></li>';
      }
      $monthSelect.find('.finance-calendar-select-list').html(html);
    }
  }

  function updateSelectUI(){
    $popup.find('.finance-calendar-select[data-type="year"] .finance-calendar-select-value').text(state.year + '년');
    $popup.find('.finance-calendar-select[data-type="month"] .finance-calendar-select-value').text((state.month + 1) + '월');

    $popup.find('.finance-calendar-select[data-type="year"] li').removeClass('selected')
      .filter(function(){ return +$(this).find('button').data('value') === state.year; }).addClass('selected');
    $popup.find('.finance-calendar-select[data-type="month"] li').removeClass('selected')
      .filter(function(){ return +$(this).find('button').data('value') === state.month; }).addClass('selected');
  }

  function fillSelects(){
    initSelectLists();
    updateSelectUI();
  }

  function renderCalendar(){
    var firstDay = new Date(state.year, state.month, 1);
    var startWeekday = firstDay.getDay();
    var daysInMonth = new Date(state.year, state.month + 1, 0).getDate();
    var daysInPrevMonth = new Date(state.year, state.month, 0).getDate();
    var $days = $('#financeCalendarDays');
    var html = '';
    var i, dayNum, key, y, m, cls;

    for(i = 0; i < startWeekday; i++){
      dayNum = daysInPrevMonth - startWeekday + i + 1;
      y = state.month === 0 ? state.year - 1 : state.year;
      m = state.month === 0 ? 11 : state.month - 1;
      key = toDateKey(y, m, dayNum);
      html += '<button type="button" class="finance-calendar-day is-other" data-date="' + key + '"><span>' + dayNum + '</span></button>';
    }

    for(i = 1; i <= daysInMonth; i++){
      key = toDateKey(state.year, state.month, i);
      cls = 'finance-calendar-day';
      if(key === state.selected) cls += ' is-selected';
      if(scheduleMap[key]) cls += ' has-event';
      html += '<button type="button" class="' + cls + '" data-date="' + key + '"><span>' + i + '</span></button>';
    }

    i = 1;
    while((startWeekday + daysInMonth + i - 1) % 7 !== 0){
      y = state.month === 11 ? state.year + 1 : state.year;
      m = state.month === 11 ? 0 : state.month + 1;
      key = toDateKey(y, m, i);
      html += '<button type="button" class="finance-calendar-day is-other" data-date="' + key + '"><span>' + i + '</span></button>';
      i++;
    }

    $days.html(html);
  }

  function renderSchedule(){
    var parts = state.selected.split('-');
    var dateObj = new Date(+parts[0], +parts[1] - 1, +parts[2]);
    var weekday = dayNames[dateObj.getDay()];
    var events = scheduleMap[state.selected] || [];
    var $list = $('#financeCalendarList');
    var $empty = $('#financeCalendarEmpty');
    var html = '';

    $('#financeCalendarSelectedDate').text(+parts[0] + '년 ' + (+parts[1]) + '월 ' + (+parts[2]) + '일(' + weekday + ')');

    if(events.length){
      events.forEach(function(item){
        html += '<li><span class="finance-calendar-item">' + item.title + '</span></li>';
      });
      $list.html(html).removeAttr('hidden');
      $empty.attr('hidden', true);
    }else{
      $list.empty().attr('hidden', true);
      $empty.removeAttr('hidden');
    }
  }

  function setMonth(year, month){
    state.year = year;
    state.month = month;
    fillSelects();
    renderCalendar();
  }

  fillSelects();
  renderCalendar();
  renderSchedule();

  $(document).off('click.financeCalendarOpen').on('click.financeCalendarOpen', '.btn-finance-calendar-open', function(e){
    e.preventDefault();
    popOpen('#financeCalendarPopup');
  });

  $popup.off('click.financeCalendarClose').on('click.financeCalendarClose', '.dim, .btn-close', function(e){
    e.preventDefault();
    popClose('#financeCalendarPopup');
  });

  $popup.off('click.financeCalendarDay').on('click.financeCalendarDay', '.finance-calendar-day', function(){
    var date = $(this).data('date');
    var parts = date.split('-');
    state.selected = date;
    state.year = +parts[0];
    state.month = +parts[1] - 1;
    fillSelects();
    renderCalendar();
    renderSchedule();
  });

  $popup.off('click.financeCalendarNav').on('click.financeCalendarNav', '.finance-calendar-prev', function(){
    var m = state.month - 1;
    var y = state.year;
    if(m < 0){ m = 11; y--; }
    setMonth(y, m);
  });

  $popup.off('click.financeCalendarNavNext').on('click.financeCalendarNavNext', '.finance-calendar-next', function(){
    var m = state.month + 1;
    var y = state.year;
    if(m > 11){ m = 0; y++; }
    setMonth(y, m);
  });

  $popup.off('click.financeCalendarSelectBtn').on('click.financeCalendarSelectBtn', '.finance-calendar-select-btn', function(e){
    e.preventDefault();
    e.stopPropagation();
    var $select = $(this).closest('.finance-calendar-select');
    var willOpen = !$select.hasClass('is-open');
    closeFinanceSelects();
    if(willOpen){
      $select.addClass('is-open');
      $(this).attr('aria-expanded', 'true');
      $select.find('.finance-calendar-select-list').removeAttr('hidden');
    }
  });

  $popup.off('click.financeCalendarSelectItem').on('click.financeCalendarSelectItem', '.finance-calendar-select-list button', function(e){
    e.preventDefault();
    e.stopPropagation();
    var $select = $(this).closest('.finance-calendar-select');
    var value = +$(this).data('value');
    if($select.data('type') === 'year'){
      setMonth(value, state.month);
    }else{
      setMonth(state.year, value);
    }
    closeFinanceSelects();
  });

  $popup.off('click.financeCalendarSelectOutside').on('click.financeCalendarSelectOutside', function(e){
    if(!$(e.target).closest('.finance-calendar-select').length) closeFinanceSelects();
  });
}

function tryFinanceCalendar(){
  if($('#financeCalendarPopup').length && $('#financeCalendarData').length){
    financeCalendar();
  }else{
    setTimeout(tryFinanceCalendar, 50);
  }
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
  function tryAllMenu(){
    if($('#allMenuLayer').length){
      allMenu();
    }else{
      setTimeout(tryAllMenu, 50);
    }
  }
  tryAllMenu();
  tryFinanceCalendar();
  breadcrumbMenu();
  fontSettingMenu();
  viewFilesToggle();
  contSlideSwiper();
  tabEvt();
  tabMainSwiper();
  inputDel('.inp');
  inputDel('.input-search');
  inputDel('.main-hero-search');
  scrollDirection();
  floatingQuickStop();
  tryFloatingQuickMobile();

  datepicker();

  $(document).on('click', '.floating-top', function(){
    $('html, body').stop(true).animate({scrollTop: 0}, 300);
  });

  //temp
    var sampleNav = document.getElementById('pagination');
    if(sampleNav){
        initPaginationType(sampleNav, { totalPages: 99, currentPage: 1, visibleCount: 8, mobileVisibleCount: 5 });
    }
  
});
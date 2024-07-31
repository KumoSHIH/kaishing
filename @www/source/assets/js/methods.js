// 驗證
var isObject = function(obj){
    let $obj = $(obj);
    if(typeOf($obj) !== undefined && $obj.length >= 1) return false;
  }
  
//IOS 回上一頁空白修正
function appleDebug() {
  window.onpageshow = function (event) {
    if (event.persisted) {
      window.location.reload();
    }
  };
}

// 點擊開關class
// clickToggleClass(點擊目標,加上cls名稱)
function clickToggleClass(target, className) {
  $(target).off().click(function () {
    $(this).toggleClass(className);
  });
}

// 點擊切換active
// clickSwitchClass(點擊目標,加上cls名稱)
function clickSwitchClass(target, className) {
  $(target).off().click(function () {
    $(target).not(this).removeClass(className);
    $(this).addClass(className);
  });
}

//Android / iOS 判斷
function deviceDetect() {
  let u = navigator.userAgent;
  let isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
  let isiOS = u.indexOf('Mac') > -1 && 'ontouchend' in document; //ios终端
  let isMac = /macintosh|mac os x/i.test(navigator.userAgent);
  if (isAndroid) {
    return 'android'
  }
  if (isiOS) {
    return 'iOS'
  }
  if (isMac) {
    return 'Mac'
  }
}

function fixMobile100vh() {
  let vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', vh + 'px')
  $(window).on('resize', function () {
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', vh + 'px')
  })
}

function wordAnimation(target, delayStartTime, delaySpace) {
  let word = $(target).html()
  let removeBr = word.split('<br>')
  $(target).text("")
  $(removeBr).each(function () {
    let html = this.split('')
    $(html).each(function () {
      if (this.trim() == '') {
        $(target).append('<span class="letter-wrap" style="display: inline-block">&nbsp;</span>');
      } else {
        $(target).append('<span class="letter"> ' + this + ' </span>');
      }
    })
    $(target).find("span").each(function () {
      let i = $(this).index()
      let delayTime = i * delaySpace + delayStartTime + "s"
      $(this).css("transition-delay", delayTime);
    });
    $(target).append('<br>')
  })
};

function isMobile() {
  if ('ontouchstart' in document.documentElement && 'ontouchmove' in document.documentElement) return true;
  else return false;
};

function isSafari(){
  if(window.navigator.userAgent.match(/^((?!chrome|android).)*safari/i)) return true;
  else return false;
};

function checkWidth(type){
  if(type === 'pad'){
    return $(window).width() <= 1200
  }
  else if(type === 'mobile'){
    return $(window).width() <= 767
  }
};

//判斷Swiper輪播數量
function getSlidesCount(swiper) {
  const container = swiper.$el
  const slidesCount = function () {
    if (swiper.loopedSlides) {
      return swiper.slides.length - swiper.loopedSlides * 2
    }
    else {
      return swiper.slides.length
    }
  }
  if (slidesCount() <= swiper.params.slidesPerView) {
    container.addClass('swiper-no-swiping')
    $(swiper.slides[0]).css('opacity',0)
    $(swiper.slides[2]).css('opacity',0)
    $(swiper.params.navigation.nextEl).hide()
    $(swiper.params.navigation.prevEl).hide()
    $(swiper.params.pagination.el).hide()
    swiper.params.autoplay.enabled = false
    swiper.autoplay.stop()
  }
  else {
    container.removeClass('swiper-no-swiping')
    $(swiper.slides[0]).css('opacity',1)
    $(swiper.slides[2]).css('opacity',1)
    $(swiper.params.navigation.nextEl).show()
    $(swiper.params.navigation.prevEl).show()
    $(swiper.params.pagination.el).show()
    if (swiper.params.autoplay.enabled) {
      swiper.autoplay.start()
    }
  }
};

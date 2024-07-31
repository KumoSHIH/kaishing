// global 
let articleSwiper;
let propertySwiper;
let commonSwiper;

let _common = {
  //鎖住卷軸
  bodyLock() {
    if (deviceDetect() == 'iOS') {
      // bodyScroll.lock();
      $('body').addClass('lock');
    } else {
      $('body').css('overflow-y', 'hidden');
    }
  },
  //解鎖卷軸
  bodyUnlock() {
    if (deviceDetect() == 'iOS') {
      // bodyScroll.unlock();
      $('body').removeClass('lock');
    } else {
      $('body').css('overflow-y', 'auto');
    }
  },
  //Blazy基本
  blazyInit() {
    var bLazy = new Blazy({
      offset: -100,
      success: function () {}
    });
  },
  // 滾動到定位
  scrollPos(target) {
    let $target = $(target);
    let pos = $target.position().top;
    // console.log($target)
    // console.log(pos)
    $('body,html').animate({
      scrollTop: pos
    }, {
      duration: 900,
      // easing: 'easeInOutCirc'
    });
  },
  // resize
  resizeFun(fun) {
    let resize = false;
    let t;
    let doResize = fun;

    $(window).on('resize', function () {
      resize = true;
      clearTimeout(t);
      // console.log('resize')
      t = setTimeout(doResize, 500);
    });
  },
  // waypoint
  eachWaypoint: function (target, offsetValue) {
    $(target).each(function (index, element) {
      $(element).waypoint({
        handler: function () {
          $(element).addClass('show');
        },
        offset: offsetValue,
      });
    });
  },
};

//表單
let _form = {
  // 下拉
  formSelect() {
    $('.form-select .scrollbar-inner').scrollbar();
    let toggleList = vm => {
      let $select = $(vm);
      if (!$select.hasClass('active')) {
        $select.addClass('active').find('.select-content').slideDown(500);
        let all = $select.parents('.form').find('.form-select');
        all.not(vm).removeClass('active').find('.select-content').slideUp(500);
      } else {
        $select.removeClass('active').find('.select-content').slideUp(500);
      }
    }
    $('.form-select .select-content li').on('click', function () {
      let $this = $(this);
      let word = $this.text();
      let word_val = $this.data("val");
      let page = $('body').attr('data-page');
      $this.parents('.form-select').find('p.option span:last-child').text(word);
      // 已選取
      $this.parents('.form-select').addClass('isSelect');

      let select = $this.parents('.fm-row').find('select');
      select.find('option').siblings().attr('selected',false)
      select.find('option[value="' + word_val + '"]').attr('selected', true);
    });
    $('.form-select').on('click', function (e) {
      e.stopPropagation();
      e.preventDefault();
      toggleList(this);
    });
    $(document).on('click', function (e) {
      let $select = $('.form-select');
      $select.removeClass('active').find('.select-content').slideUp(500);
    });
  },
  // 日曆
  datepicker() {
    $('#datepicker2').datepicker({
      container: '.form-date',
      autoclose: true,
      orientation: 'left bottom',
      format: 'yyyy/mm/dd'
    });
  },
  // 更換檔名
  updateFiles() {
    $('.form input[type="file"]').on('change', function () {
      let vm = $(this);
      const val = vm.val();
      const strFile = val.replace(/^.+?\\([^\\]+?)(\.[^\.\\]*?)?$/gi, "$1");
      const fileExt = val.replace(/.+\./, "");
      const str = `${strFile}.${fileExt}`;
      let $fileNmae = vm.parents('.form-file').find('.file-name');
      $fileNmae.text(str);
    });
  },
  // 檔案抓取限制
  filesLimit() {
    let $file = $('.form-file');
    let limit = $file.attr('data-limit');
    $file.find('.file-name span').text(limit);
  },
  // 清除全部選項
  clear() {
    let originText = $('select option:first-child').text();
    $('input[type="reset"]').on('click', function () {
      $('.dropdown .select-head p.option span').text(originText);
    });
  },
  // 確認送出跳出燈箱
  submitCheck() {
    const container = '.form-error-alert'
    $(container).addClass('ajax_close').delay4({
      time: '100',
      add: 'show'
    })
    $(container).find('.modal-scroll-wrap').scrollbar({
      ignoreMobile: true,
    })
    $(container).find('.modal-dialog').on('click', function (e) {
      e.stopPropagation()
    })
    $('.ajax_close').on('click', function (e) {
      e.stopPropagation()
      _form.alertClose(container)
    })
    _common.bodyLock('.modal-scroll-wrap[data-scroll-content]')
  },

  alertClose(ele) {
    $(ele).removeClass('show')
    _common.bodyUnlock('.modal-scroll-wrap[data-scroll-content]')
    $(ele).on('transitionend webkitTransitionEnd oTransitionEnd', function () {
      $(ele).unbind('transitionend webkitTransitionEnd oTransitionEnd')
    })
  },
  // 必填驗證
  require() {
    let firstnameText = $('input[name="firstname"]').parents('.fm-grid').find('.notice').text(),
        lastnameText = $('input[name="lastname"]').parents('.fm-grid').find('.notice').text(),
        emailText = $('input[name="email"]').parents('.fm-grid').find('.notice').text(),
        phoneText = $('input[name="phone"]').parents('.fm-grid').find('.notice').text(),
        selectText = $('select[name="select"]').parents('.fm-grid').find('.notice').text(),
        textarea1 = $('textarea[name="textarea1"]').parents('.fm-grid').find('.notice').text(),
        textarea2 = $('textarea[name="textarea2"]').parents('.fm-grid').find('.notice').text();

    $('#form').validate({
      onkeyup: function(element, event) {
        //去除左側空白
        var value = this.elementValue(element).replace(/^\s+/g, "");
        $(element).val(value);
        },
        rules: {
          firstname: {
            required: true
          },
          lastname: {
            required: true
          },
          phone:{
            required: true,
            // minlength: 8,
            number: true
          },
          email: {
            required: true,
            email: true
          },
          select: {
            required: true,
          },
          textarea1: 'required',
          textarea2: 'required',
        },
        messages: {
          firstname: {
            required: firstnameText
          },
          lastname:{
            required: lastnameText
          },
          phone: {
            required: phoneText,
            // minlength:'',
            number:''
          },
          email: {
            required: emailText,
            email:''
          },
          select: {
            required: selectText,
          },
          textarea1: textarea1,
          textarea2: textarea2,
        },
        // invalidHandler: function(event, validator) {
        //   // console.log(validator)
        //   console.log(validator.currentElements)
        //   $('.fm-grid .notice').removeClass('alert');
        //   validator.currentElements.each(function(i,e){
        //     console.log($(this)[0])
            
        //     // $(e).parents('.fm-grid').find('.notice').addClass('alert');
        //   });
        // },
    });
  },
  // blur檢查
  blur() {
    $('input').on('blur',function(){
      let vm = $(this);
      _form.checkInput(vm);
    });
  },
  // check
  // 檢查input
  checkInput(vm) {
    const myreg = /^[^\[\]\(\)\\<>:;,@.]+[^\[\]\(\)\\<>:;,@]*@[a-z0-9A-Z]+(([.]?[a-z0-9A-Z]+)*[-]*)*[.]([a-z0-9A-Z]+[-]*)+$/g;

    if(vm.parents('.form-grid').hasClass('required')) {
      if(vm.val() === '') {
        vm.parents('.form-grid').addClass('alert')
      }
      else {
        vm.parents('.form-grid').removeClass('alert');
        // email驗證
        if(vm.attr('type') === 'email') {
          const temp = vm.val()
          if(myreg.test(temp) === false) {
            alert('請輸入有效的E_mail');
            vm.parents('.form-grid').addClass('alert')
          }
        }
      }
    }
  },
  // 檢查下拉選項
  checkDropdown(vm) {
    if(vm.parents('.form-grid').hasClass('required')) {
      if(!vm.hasClass('isSelect')) {
        vm.parents('.form-grid').addClass('alert')
      }
      else {
        vm.parents('.form-grid').removeClass('alert')
      }
    }
  },
  all() {
    _form.formSelect();
    _form.datepicker();
    _form.filesLimit();
    _form.updateFiles();
    _form.clear();
    _form.require();
  }
};

// header
let _header = {
  screen() {
    if($(window).outerWidth() > 1200) {
      $('.hd').removeClass('mobile').addClass('desktop');
      _header.showMenuBg();
    }
    else{
      $('.hd').removeClass('desktop').addClass('mobile');
      _header.mobileClick();
    }
  },
  // hover出現背景色
  showMenuBg() {
    let menu = $('.hd.desktop li.hasBg');

    menu.on('mouseenter',function(){
      $(this).addClass('active');
      $('.hd.desktop .hd-bg').fadeIn(200);
    }).on('mouseleave',function(){
      $(this).removeClass('active');
      $('.hd.desktop .hd-bg').fadeOut(200);
    });
  },
  scroll() {
    let zero = 0;
    let hd = $('.hd'),
        hdH = $('.hd').outerHeight();

    $(window).on('scroll',function(){
      let scrollAfter = $(this).scrollTop();
      // console.log(scrollAfter)
      if(scrollAfter > zero && scrollAfter > hdH) {
        // console.log('down');
        hd.addClass('down');
      }
      else if(scrollAfter === 0 && scrollAfter < hdH){
        hd.removeClass('down');
      }
      // else if(scrollAfter < zero && scrollAfter > hdH ) {
      //   // console.log('up');
      //   hd.removeClass('down').addClass('up');
      // }
      // else if(scrollAfter === 0 && scrollAfter < hdH){
      //   // console.log('top');
      //   hd.removeClass('down up');
      // }

      zero = scrollAfter;
    });
  },
  openEvent() {
    $('.hd-right-wrap').addClass('active');
    _common.bodyLock();
  },
  closeEvent() {
    $('.hd-right-wrap').removeClass('active');
    _common.bodyUnlock();
  },
  mobileClick() {
    $('.hd.mobile .hd-hum').off().on('click',function(){
      if(!$(this).hasClass('active')){
        $(this).addClass('active');
        _header.openEvent();
      }
      else{
        $(this).removeClass('active');
        _header.closeEvent();
      }
    });
    $('.hd.mobile .hd-close').off().on('click',function(){
      $('.hd.mobile .hd-hum').removeClass('active');
      _header.closeEvent();
    });
  },
  openSearch() {
    let btnSearch = $('.hd.desktop .desktop-search');
    btnSearch.on('click',function(){
      let inputVal = $(this).siblings('.sch-input').find('input').val();
      if(!$(this).hasClass('active')) {
        $(this).addClass('active');
        $(this).siblings('.sch-input').addClass('active');
      }
      else {
        if(inputVal === '') {
          $(this).removeClass('active')
          $(this).siblings('.sch-input').removeClass('active');
        }
      }
    })
  },
  inputSearchSubmit() {
    let input = $('.hd.desktop .sch-input input');
    let submit = $('.hd.desktop .desktop-search input[type="submit"]');
    input.on('keyup',function(){
      if($(this).val() !== '') {
        submit.removeClass('pointer-none');
      }
      // 空值禁止送出
      else{
        submit.addClass('pointer-none');
      }
    });
  },
  all() {
    _header.screen();
    _common.resizeFun(_header.screen);
    _header.showMenuBg();
    _header.scroll();
    _header.mobileClick();
    _header.openSearch();
    _header.inputSearchSubmit();
  }
};

// footer
let _footer = {
  hashTagSlideTo() {
    let btn = $(".footer-relative ul li");
    btn.on('click',function(){
      const HashTag = window.location.hash;
      const matchTag = HashTag.match(/#slider-(\d+)/);
      // console.log(matchTag);
      if (matchTag) {
        const index = $(this).attr('data-index');
        commonSwiper.slideTo(index, 800, true);
        _property.scrollPos(".section-swiper");
        $(".swiper-pagination-bullet:nth-child(" + index + ")").addClass(
          "swiper-pagination-bullet-active"
        );
      }
    })
  }
}

// home
let _home = {
  // swiperText() {
  //   let slide = $('.swiper-banner .swiper-slide');
  //   let len = Number(slide.length);

  //   slide.each(function(i){
  //     let index = Number(i + 1);
      
  //     // 上一則標題
  //     let prevTitle = function() {
  //       if( index - 1 > 0) {
  //         return $('.swiper-banner .swiper-slide').eq(i - 1).find('.title h6').text();
  //       }
  //       // 第一則
  //       else{
  //         return $('.swiper-banner .swiper-slide').eq(len - 1).find('.title h6').text();
  //       }
  //     }

  //     // 下一則標題
  //     let nextTitle = function() {
  //       if( index + 1 <= len) {
  //         return $('.swiper-banner .swiper-slide').eq(i + 1).find('.title h6').text();
  //       }
  //       // 最後一則
  //       else {
  //         return $('.swiper-banner .swiper-slide').eq(0).find('.title h6').text();
  //       }
  //     }

  //     $(this).find('.title').prepend(`<div class="title-prev">${prevTitle()}</div>`);
  //     $(this).find('.title').append(`<div class="title-next">${nextTitle()}</div>`);
  //   });
  // },

  // news swiper
  resize() {
    if(articleSwiper !== undefined) {
      articleSwiper.destroy();
      setTimeout(()=> {
        _swiper.article();
      },500)
    }
  }
};

// news
let _news = {
  backendCallback() {
    _common.blazyInit();
    _common.eachWaypoint('.waypoint', '90%');
  }
};

// service
let _service = {
  openList() {
    let btn = $('.service-awards .cir-btn');
    btn.on('click',function(){
      if(!$(this).hasClass('active')) {
        $(this).addClass('active');
        $(this).siblings('.bottom-block').slideDown(300);
      }
      else {
        $(this).removeClass('active');
        $(this).siblings('.bottom-block').slideUp(300);
      }
    })
  },
  backendCallback() {
    _common.blazyInit();
    _common.eachWaypoint('.waypoint', '90%');
  }
};

let _property = {
  showText() {
    let btn = $(".property-text li");
    btn.on("mouseenter", function () {
      let index = $(this).attr("data-target");
      if (!$(this).hasClass("active")) {
        $(this).siblings().removeClass("active");
        $(this).addClass("active");
        $(`[data-target-content="${index}"]`).siblings().fadeOut();
        $(`[data-target-content="${index}"]`).fadeIn(200);
        $(".property-swiper").addClass("active");
      }
      // else{
      //   $(this).removeClass("active");
      //   $(`[data-target-content="${index}"]`)
      //     .slideUp(400);
      //   $(".property-swiper").removeClass("active");
      // }
    });
  },
  resize() {
    if ($(window).outerWidth() <= 1300) {
      $(".property-swiper .swiper-container").removeClass("swiper-no-swiping");
      _swiper.property();
    } else {
      $(".property-swiper .swiper-container").addClass("swiper-no-swiping");
      if (propertySwiper !== undefined) {
        propertySwiper.destroy();
      }
    }
  },
  slideTo(index) {
    commonSwiper.slideTo(index, 800, true);
  },
  scrollPos(target) {
    let $target = $(target);
    let pos = $target.position().top;
    $("body,html").animate(
      {
        scrollTop: pos - 50,
      },
      {
        duration: 900,
      }
    );
  },
  hashTagSlideTo() {
    setTimeout(() => {
      const HashTag = window.location.hash;
      const matchTag = HashTag.match(/#slider-(\d+)/);
      if (matchTag) {
        const number = parseInt(matchTag[0]);
        const index = parseInt(matchTag[1]);
        commonSwiper.slideTo(number, 800, true);
        _property.scrollPos(".section-swiper");
        $(".swiper-pagination-bullet:nth-child(" + index + ")").addClass(
          "swiper-pagination-bullet-active"
        );
      }
    },500)
    
  }
  // <script type="text/javascript">
  //   $(function () {
  //     const HashTag = window.location.hash;
  //     const matchTag = HashTag.match(/#slider-(\d+)/);
  //     if (matchTag) {
  //       const number = parseInt(matchTag[0]);
  //       const index = parseInt(matchTag[1]);
  //       commonSwiper.slideTo(number,800,true);
  //       // $('.hd').addClass('down');
  //       _property.scrollPos(".section-swiper");
  //       $('.swiper-pagination-bullet:nth-child('+ index +')').addClass('swiper-pagination-bullet-active')
  //       }
  //     });
  // </script>
};

// swiper
let _swiper = {
  homeTitle() {
    const setting = {
      on: {
        init() {
          const swiper = $(this)[0];
          getSlidesCount(swiper);
          $(
            `.banner-photo .photo[data-photo-index="${swiper.realIndex}"]`
          ).addClass("active");
        },
        slideChangeTransitionStart() {
          const swiper = $(this)[0];
          $(`.banner-photo .photo[data-photo-index="${swiper.realIndex}"]`)
            .siblings()
            .removeClass("active");
          $(
            `.banner-photo .photo[data-photo-index="${swiper.realIndex}"]`
          ).addClass("active");
        },
      },
      autoplay: {
        delay: 3000,
        disableOnInteraction: false,
      },
      loop: true,
      speed: 1000,
      slidesPerView: 1.72,
      centeredSlides: true,
      breakpoints: {
        320: {
          slidesPerView: 1,
        },
        1201: {
          slidesPerView: 1.72,
        },
      },
      pagination: {
        el: ".swiper-title .swiper-pagination",
        clickable: true,
      },
    };
    const swiperTitle = new Swiper(".swiper-title .swiper-container", setting);
  },
  swiperNormal() {
    // 共同設定
    const normalSetting = function (swiper) {
      let ele = $("." + swiper)[0];
      let dataSpeed = Number(ele.getAttribute("data-speed"));
      let setting = {
        on: {
          init() {
            const swiper = $(this)[0];
            getSlidesCount(swiper);
          },
        },
        loop: true,
        speed: dataSpeed,
        lazy: {
          loadPrevNext: true,
        },
        pagination: {
          el: `.${swiper} .swiper-pagination`,
          clickable: true,
        },
      };
      return setting;
    };
    const swiperNormal1 = new Swiper(
      ".swiper-normal1 .swiper-container",
      normalSetting("swiper-normal1")
    );
    const swiperNormal2 = new Swiper(
      ".swiper-normal2 .swiper-container",
      normalSetting("swiper-normal2")
    );
    const swiperNormal3 = new Swiper(
      ".swiper-normal3 .swiper-container",
      normalSetting("swiper-normal3")
    );
    const swiperNormal4 = new Swiper(
      ".swiper-normal4 .swiper-container",
      normalSetting("swiper-normal4")
    );
  },
  article() {
    const setting = {
      on: {
        init() {
          const swiper = $(this)[0];
          getSlidesCount(swiper);
          // const slidesCount = function () {
          //   if (swiper.loopedSlides) {
          //     return swiper.slides.length - swiper.loopedSlides * 2
          //   }
          //   else {
          //     return swiper.slides.length
          //   }
          // }
          // if(slidesCount() <= 2) {
          //   swiper.$el.addClass('swiper-no-swiping')
          //   $(swiper.params.pagination.el).hide()
          //   swiper.params.autoplay.enabled = false
          // }
        },
      },
      speed: 1200,
      loop: true,
      // spaceBetween: 40,
      // slidesPerView: 3,
      autoplay: {
        delay: 5000,
        disableOnInteraction: false,
      },
      breakpoints: {
        320: {
          // slidesPerView: 1,
          // slidesPerColumn: 2,
          spaceBetween: 0,
        },
        767: {
          // slidesPerView: 2,
          spaceBetween: 30,
        },
        1201: {
          spaceBetween: 40,
        },
      },
      pagination: {
        el: ".swiper-article .swiper-pagination",
        clickable: true,
      },
      navigation: {
        nextEl: ".swiper-article .swiper-button-next",
        prevEl: ".swiper-article .swiper-button-prev",
      },
    };
    articleSwiper = new Swiper(".swiper-article .swiper-container", setting);
  },
  common() {
    const setting = {
      on: {
        init() {
          const swiper = $(this)[0];
          getSlidesCount(swiper);
        },
      },
      loop: true,
      speed: 800,
      hashNavigation: true,
      pagination: {
        el: ".section-swiper .swiper-pagination",
        clickable: true,
      },
      navigation: {
        nextEl: ".section-swiper .swiper-button-next",
        prevEl: ".section-swiper .swiper-button-prev",
      },
    };

    commonSwiper = new Swiper(
      ".swiper-common .swiper-container",
      setting
    );
  },
  service() {
    const setting = {
      on: {
        init() {
          const swiper = $(this)[0];
          getSlidesCount(swiper);
        },
      },
      loop: true,
      speed: 800,
      slidesPerView: 4,
      breakpoints: {
        320: {
          slidesPerView: 2,
        },
        767: {
          slidesPerView: 3,
        },
        1201: {
          slidesPerView: 4,
        },
      },
      navigation: {
        nextEl: ".swiper-service .swiper-button-next",
        prevEl: ".swiper-service .swiper-button-prev",
      },
    };
    const serviceSwiper = new Swiper(
      ".swiper-service .swiper-container",
      setting
    );
  },
  property() {
    const setting = {
      on: {
        init(){
          
        }
      },
      slidesPerView: 1.25,
      centeredSlides: true,
      loop: true,
      speed: 800,
      navigation: {
        nextEl: ".property-swiper .swiper-button-next",
        prevEl: ".property-swiper .swiper-button-prev",
      },
    };
    propertySwiper = new Swiper(
      ".property-swiper .swiper-container",
      setting
    );
  }
};

//頁面讀取完執行
const readyFunction = {
  checkFunction() {
    //擷取body的data-page
    var functionName = $("body").attr("data-page");
    //呼叫共用function
    readyFunction.common(functionName);
    //呼叫函數( 如果 data-page = home 輸出的結果為 readyFunction.home(); )
    // eval("readyFunction." + functionName + "();");
    if (functionName !== undefined) {
      window.eval("readyFunction." + functionName + "();");
    }
  },



  //呼叫共用function
  common(pagename) {
    // console.log(`Now page is ${pagename}!`);
    //判斷瀏覽器/系統
    if (deviceDetect() == "Mac") {
      $("html").addClass("isMac");
    }
    //除Mac系統 & IE瀏覽器外
    if (
      deviceDetect() != "Mac" &&
      (window.ActiveXObject || !("ActiveXObject" in window))
    ) {
      $("html").addClass("scrollbarStyle");
    }
    //iOS 回上一頁空白修正
    appleDebug();
    //iOS viewHeight 計算
    fixMobile100vh();
    // header
    _header.all();
    // footer
    _footer.hashTagSlideTo();
    //Blazy
    _common.blazyInit();
    // waypoint
    _common.eachWaypoint(".waypoint", "90%");
  },

  //呼叫各頁面function
  home() {
    _swiper.homeTitle();
    _swiper.swiperNormal();
    _swiper.article();
  },
  about() {
    _swiper.common();
    _swiper.article();
    $("[data-video]").video();
  },
  news() {
    _form.formSelect();
  },
  contact() {
    _form.formSelect();
    _form.require();
    _form.clear();
  },
  management() {
    _swiper.common();
  },
  development() {},
  development_detail() {},
  privacy() {},
  disclaimer() {},
  story() {},
  service() {
    _form.formSelect();
    _service.openList();
    _swiper.service();
  },
  property() {
    _property.resize();
    _property.showText();
    _property.hashTagSlideTo();
    _swiper.property();
    _swiper.common();
    _common.resizeFun(_property.resize);
  },
  propertyDemo() {
    _property.resize();
    _property.showText();
    _swiper.property();
    _swiper.common();
    _common.resizeFun(_property.resize);
    _property.slideTo(3,800,true);
    $('.hd').addClass('down');
  },
  detail(){}
};

$(document).ready(function () {
  readyFunction.checkFunction();
});

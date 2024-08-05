"use strict";

/**
 *  video
 *  @version: 2.5
 *  @author: Kumo
 *  Update: 2024.4.19
 *
 *  use plugin :
 *  jquery-3.6.0.js
 */

;
(function ($) {
  var $v = {};

  var video4 = function video4(el) {
    $v = $.extend({}, video4.DEFAULT);
    this.elements = getData(el);

    init();
  };

  // default setting
  video4.DEFAULT = {
    videoType: "youtube",
    playerType: "onBox",
    playerLayout: "video-player-container",
    playerLibox: "video-libox"
  };

  // get data setting
  function getData(selector) {
    var selector = selector || $v.$selector;

    $v.$selector = $(selector);
    $v.videoID = $v.$selector.attr("video-id");
    $v.videoType = $v.$selector.attr("video-type") || $v.videoType || "youtube";
    $v.playerType = $v.$selector.attr("video-player-type") || $v.playerType || "onBox";
    $v.videoImage = $v.$selector.attr("video-image");
    $v.playerID;
    $v.src = $v.$selector.attr("video-src");

    return true;
  }

  function init() {
    cover.setImage();
  }

  // 判斷使用來源
  var videoSource = function videoSource() {
    return isYoutubeAPI() ? youtubeAPI() : isYoutube() ? youtube() : isVideo() ? videojs() : undefined;
  };

  // 確定有影片封面
  var isCover = function isCover() {
    var player = $v.$selector.find('.video-player-container');

    if (player.length !== 0) return true;
  };

  // youtube
  var isYoutube = function isYoutube() {
    return $v.videoType === 'youtube' ? true : false;
  };

  // youtubeAPI
  var isYoutubeAPI = function isYoutubeAPI() {
    return $v.videoType === 'youtubeAPI' ? true : false;
  };

  // video
  var isVideo = function isVideo() {
    return $v.videoType === 'video' ? true : false;
  };

  // 在畫面上播放
  var isOnpage = function isOnpage() {
    return $v.playerType === 'onPage' ? true : false;
  };

  // 在燈箱播放
  var isOnbox = function isOnbox() {
    return $v.playerType === 'onBox' ? true : false;
  };

  // 影片燈箱是否存在
  var checkVideoBox = function checkVideoBox() {
    var libox = $('.video-libox');
    if (libox.length === 0) return true;
  };

  var cover = {};

  cover.setImage = function () {
    var t = this,
        image = t.getImage(),
        imageDiv = '<div class="' + $v.playerLayout + '">' + '  <div class="video-image">' + '    <div class="video-fake-button"></div>' + '    <img src="' + image + '" alt="" />' + '  </div>' + '</div>';

    $v.playerID = player.setPlayerID();

    $v.$selector.append(imageDiv);

    player.active();
  };

  cover.getImage = function () {
    var defaultImg = "http://img.youtube.com/vi/" + $v.videoID + "/0.jpg";

    return $v.videoImage !== "" ? $v.videoImage : defaultImg;
  };

  var player = {};

  player.active = function () {
    var t = this;
    var data = $v;

    // 點擊播放重新傳入 data，以覆蓋 loop 後的值
    $v.$selector.on('click', function () {
      $v = data;
      var thisSelector = $(this);

      if (getData(thisSelector) && isCover()) t.create();

      if (thisSelector.parents().hasClass('swiper-container')) {

        var swiper = thisSelector.parents('.swiper-container');

        swiper[0].swiper.autoplay.stop();
        swiper.addClass('video-active');
      }
    });
  };

  player.setPlayerID = function () {
    return $v.playerID = $v.videoID + "-" + Math.random().toString(36).substring(7);
  };

  player.onBox = function () {
    var t = this;
    t.openPlayer();
  };

  player.onPage = function () {
    if (isOnpage()) $v.$selector.addClass('isPlaying');
    $v.$selector.find("." + $v.playerLayout).append('<div class="iframe"><div id="' + $v.playerID + '"></div></div>');

    videoSource();

    setTimeout(function () {
      $v.$selector.find('.video-image').fadeOut();
    }, 300);
  };

  player.openPlayer = function () {
    var t = this;
    var liboxDiv = "<div class='video-libox'>" + "  <div class='video-libox-wrap'>" + "    <div class='video-libox-inner'>" + "      <div class='close-video-libox'></div>" + "    </div>" + "  </div>" + "</div>";

    var imgClone = $v.$selector.find(".video-player-container").clone();

    if (checkVideoBox()) {
      $("body").append(liboxDiv);
      $(".video-libox-inner").append(imgClone);

      $(".video-libox .video-player-container").append('<div class="iframe"><div id="' + $v.playerID + '"></div></div>');

      setTimeout(function () {
        videoSource();
        $(".video-libox").fadeIn();
        $("body").css("overflow-y", "hidden");
        $(".video-libox .video-image").fadeOut(300);
        // $(".video-libox .video-player-container").on("click", function () {
        //   $(".video-libox .video-image").fadeOut(300);
        // });
        t.closePlayer();
      }, 200);
    }
  };

  player.closePlayer = function () {
    $(".close-video-libox").on("click", function () {
      $(".video-libox").fadeOut().remove();
      $("body").css("overflow-y", "auto");

      if ($('.swiper-container').hasClass('video-active')) {

        $('.swiper-container.video-active')[0].swiper.autoplay.start();

        setTimeout(function () {
          $(".swiper-container.video-active").removeClass("video-active");
        }, 200);
      }
    });

    $(".video-libox-wrap").on("click", function () {
      $(".video-libox").fadeOut().remove();
      $("body").css("overflow-y", "auto");
    });
    $(".video-libox-inner").on('click', function (e) {
      e.stopPropagation();
    });
  };

  player.create = function () {
    var t = this;
    isOnpage() ? t.onPage() : isOnbox() ? t.onBox() : undefined;
  };

  // youtube iframe
  function youtube() {
    var $selector = $("#" + $v.playerID);
    var iframe = "\n      <iframe width=\"560\" height=\"315\" src=\"https://www.youtube.com/embed/" + $v.videoID + "?rel=0&autoplay=1&mute=0\" title=\"YouTube video player\" frameborder=\"0\" allow=\"accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture\" allowfullscreen></iframe>\n    ";

    $selector.replaceWith(iframe);
  }

  // youtubeAPI
  function youtubeAPI() {
    var data = $v;
    var player;
    // var fakeButton = data.$selector.find(".video-player-container");

    // let tag = document.createElement("script");
    // tag.src = "//www.youtube.com/iframe_api";
    // let firstScriptTag = document.getElementsByTagName("script")[0];
    // firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    function checkYoutubeAPI() {
      return typeof YT === "undefined" || typeof YT.player === "undefined" ? true : onYouTubeIframeAPIReady();
    }

    // if(checkYoutubeAPI) {


    //   // onYouTubeIframeAPIReady();
    //   playVideo();
    // }

    (function loadAPI() {
      if (checkYoutubeAPI()) {
        $.ajax({
          dataType: "script",
          catch: false,
          url: "https://www.youtube.com/iframe_api"
        }).done(function (script, status) {
          onYouTubeIframeAPIReady();
        });
      }
    })();

    // set youtube iframe
    function onYouTubeIframeAPIReady() {
      window.YT.ready(function () {
        player = new YT.Player(data.playerID, {
          videoId: data.videoID,
          width: 560,
          height: 315,
          playerVers: {
            autoplay: 1, // 在讀取時自動播放影片
            controls: 1, // 在播放器顯示暫停／播放按鈕
            modestbranding: 1, // 隱藏 YouTube Logo
            fs: 1, // 隱藏全螢幕按鈕
            iv_load_policy: 3, // 隱藏影片註解
            autohide: 0, // 當播放影片時隱藏影片控制列
            rel: 0, // 0 = 相關影片為同頻道
            loop: 1, // 讓影片循環播放
            cc_load_policty: 0, // 隱藏字幕
            showinfo: 0, // 隱藏影片標題
            playsinline: 1 // 在iOS的播放器中全屏播放，0:全屏(默認)，1:內嵌
          },
          events: {
            onReady: "onPlayerReady",
            onStateChange: "onPlayerStateChange"
          }
        });
      });
    }

    function playVideo() {

      if (!fakeButton.hasClass('playing')) {
        fakeButton.addClass('playing');
      }

      fakeButton.on('click', function () {
        if (!$(this).hasClass('playing')) {
          $(this).addClass('playing');
        }
      });
    }

    //youtube API ready 事件
    window.onYouTubeIframeAPIReady = function () {
      onYouTubeIframeAPIReady();
    };

    window.onPlayerReady = function (e) {
      // let btn = $(".video-libox .video-player-container");
      // e.target.mute();
      e.target.playVideo();

      // btn.on('click',function(){
      //   // console.log('111')
      //   e.target.playVideo();
      // })
    };

    window.onPlayerStateChange = function (e) {

      console.log(e.data);
      if (e.data === 2) {
        if (fakeButton.hasClass("playing")) {
          fakeButton.removeClass("playing");
        }
      } else if (e.data === 1) {
        if (!fakeButton.hasClass("playing")) {
          fakeButton.addClass("playing");
        }
      }
    };

    // var done = false;
    // window.onPlayerStateChange = function(e) {
    //   if (e.data == YT.PlayerState.PLAYING && !done) {
    //     setTimeout(stopVideo, 90000000);
    //     done = true;
    //   }
    // }
    // function stopVideo() {
    //   player.stopVideo();
    // }
  }

  function videojs() {
    var $selector = $("#" + $v.playerID);
    var iframe = "\n      <iframe width=\"560\" height=\"315\" src=\"" + $v.src + "\" ></iframe>\n    ";

    $selector.replaceWith(iframe);
  }

  $.fn.video = function () {
    var videos = {};
    var t = this;

    for (var i = 0; i < $(t).length; i++) {
      videos[i] = new video4($(t)[i]);
    }
  };
})(jQuery);
//# sourceMappingURL=video-dist.js.map
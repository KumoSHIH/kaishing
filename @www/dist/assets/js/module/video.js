/**
 * Video Component
 */
export default class Videos {
	constructor(el,video_i) {
		//Properties
		this.element 			= $(el);
		this.videoPlayButton 	= this.element.find('[video-click="play"]');
		this.carousel 			= false;
		this.player_i = 'players_'+(video_i+1);


		// if (this.element.attr('video-type') == "brightcove") {
		// 	this.uniqueID			= Math.random().toString(36).substr(2, 9);
		// 	this.element.find('video-js').attr('id', this.uniqueID);
		// 	// console.log('this.uniqueID ', this.uniqueID);
		// }

		if (this.element.closest('.carousel-container').length !== 0) {
			this.carousel = true;
			// console.log('this.carousel ', this.carousel);
		}

		//Methods
		this.checkVideoStatus(this.element);
		this.playVideo();
	}

	/**
	 * HTML5: Check if any video has ended
	 * @param {HTMLElement} element
	 */
	checkVideoStatus(element) {

		// console.log('checkVideoStatus');

		let $htmlVideos;
		// let $brightcoveVideos;

		if (this.carousel) {
			$htmlVideos 		= element.closest('.carousel-container').find('[video-type="html5"] video');
			// $brightcoveVideos 	= element.closest('.carousel-container').find('[video-type="brightcove"] .video-js');
		} else {
			if (this.element.attr('video-type') == 'html5') {
				$htmlVideos = this.element.find('video');
			}
		}

		if ($htmlVideos) {
			if (this.carousel) {
				$htmlVideos.on('play', function () {
					// console.log('carousel paused');
					element.trigger('carouselPause');
				});
			}

			$htmlVideos.bind('ended', function () {
				// console.log('ended');
				let $currentPlayButton = $(this).closest('.video-container').find('[video-click="play"]');

				if ($currentPlayButton.hasClass('playing')) {
					$currentPlayButton.removeClass('playing');
				}

				if ($(this).attr('controls')) {
					$(this).attr('controls', false);
				}

				$(this)[0].load();
				if ($(this).closest('.carousel-container').length !== 0) {
					// console.log('play carousel');
					element.trigger('carouselPlay');
				}

			});
		}


		// if ($brightcoveVideos) {
		// 	if (this.carousel) {
		// 		let $brightcoveVideoId;
		// 		$brightcoveVideos.each(function(index, brightcoveVideo) {
		// 			if ($(brightcoveVideo).attr('id')) {
		// 				$brightcoveVideoId = $(brightcoveVideo).attr('id');

		// 				// console.log('$brightcoveVideoId ', $brightcoveVideoId);

		// 				videojs.getPlayer($brightcoveVideoId).ready(function(){

		// 					let currentPlayer = this;

		// 					currentPlayer.on('play',function () {
		// 						// console.log('bright cove, slick paused');
		// 						element.trigger('carouselPause');
		// 					});

		// 					currentPlayer.on('ended',function () {
		// 						// console.log('bright cove, slick playing');
		// 						element.trigger('carouselPlay');
		// 					});
		// 				});
		// 			}
		// 		});
		// 	}
		// }
	}

	/**
	 * Youtube: This function creates an <iframe> (and YouTube player)
	 * @param {YoutubeVideoID} src
	 */
	initializePlayer(src, $currentID) {

		// let $currentID = 'youtube-video-player-' + src;

		window[this.player_i] = new YT.Player($currentID, {
			videoId: src,
			playerVars: {
				'modestbranding': 1,
				'rel': 0,
				'start': 0
			},
			events: {
				'onStateChange': this.onPlayerStateChange,
			},
		});
		$('#'+$currentID).css('opacity',0);

	}
	/**
	 * Youtube: This function creates an <iframe> (and YouTube player)
	 * @param {YoutubeVideoID} src
	 */
	clickEventPlayer(src, $currentID) {

		// let $currentID = 'youtube-video-player-' + src;

		window[this.player_i] = new YT.Player($currentID, {
			videoId: src,
			playerVars: {
				'modestbranding': 1,
				'rel': 0,
				'start': 0,
				'autoplay': 1
			},
			events: {
				'onReady': this.onPlayerReady,
				'onStateChange': this.onPlayerStateChange,
			},
		});

	}
	/**
	 * Youtube: The API will call this function when the video player is ready.
	 * @param {object} event
	 */
	onPlayerReady(event) {
		event.target.playVideo();
	}

	/**
	 * Youtube: This function is to stop the video.
	 */
	stopVideo() {
		event.target.stopVideo();
	}

	/**
	 * Youtube: The API calls this function when the player's state changes and video ends.
	 * @param {object} event
	 */
	onPlayerStateChange(event) {
		//console.log(event);
		//console.log(event.target.i.id);
		if(event.target.i == undefined) return;
		let $endedVideo = $('#' + event.target.i.id);
		let $isCarousel = false;
		let $carouselContainer;

		//console.log('onPlayerStateChange');

		if ($endedVideo.closest('.carousel-container').length !== 0) {

			$isCarousel = true;
			$carouselContainer	= $endedVideo.closest('.carousel-container');

			//console.log('youtube carousel check ', $carouselContainer);
		}

		if (event.data === 0) {
			let $endedVideoContainer 	= $endedVideo.closest('.youtube-video-container');
			let $endedVideoPlayButton 	= $endedVideoContainer.find('[video-click="play"]');

			if ($endedVideoPlayButton.hasClass('playing')) {
				$endedVideoPlayButton.removeClass('playing');
			}

			if ($isCarousel) {
				// console.log('carousel playing for youtube');
				$carouselContainer.trigger('carouselPlay');
			}
		}

		if ($isCarousel) {
			if (event.data == YT.PlayerState.PLAYING) {
				//console.log('carousel paused for youtube');
				$carouselContainer.trigger('carouselPause');
			}
		}
	}

	/**
	 * When user clicks play button
	 */
	playVideo() {
		
		//load all youtube video
		let $currentVideoType = this.element.attr('video-type');
		//Youtube
		if ($currentVideoType == 'youtube') {
			let $currentVideo = this.element.find('.youtube-video-player');
			let $currentVideoSrc = $currentVideo.attr('video-src');
			let $currentID = $currentVideo.children("div").attr('id');
			if(!$currentID) $currentID = $currentVideo.children("iframe").attr('id');

			if (typeof (YT) == 'undefined' || typeof (YT.Player) == 'undefined') {
				
				let tag = document.createElement('script');
				tag.src = "//www.youtube.com/iframe_api";
				let firstScriptTag = document.getElementsByTagName('script')[0];
				firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

				window.onYouTubePlayerAPIReady = () => {
					this.initializePlayer($currentVideoSrc, $currentID);
				}
			} else {
					this.initializePlayer($currentVideoSrc, $currentID);
			}
		}

		this.videoPlayButton.click((event) => {

			let $currentVideoType = $(event.currentTarget).closest('.video-container').attr('video-type');

			//console.log('click play');

			//HTML5
			if ($currentVideoType == 'html5') {
				let $currentVideo = $(event.currentTarget).closest('.video-container').find('video');

				if (!$(event.currentTarget).hasClass('playing')) {
					$(event.currentTarget).addClass('playing');
				}

				if (!$currentVideo.attr('controls')) {
					$currentVideo.attr('controls', true);
				}

				$currentVideo[0].currentTime = 0;
				$currentVideo[0].play();
			}

			//Youtube
			if ($currentVideoType == 'youtube') {
				let $currentVideoContainer = $(event.currentTarget).closest('.youtube-video-container');
				let $currentVideo = $currentVideoContainer.find('.youtube-video-player');
				let $currentVideoSrc = $currentVideo.attr('video-src');
				let $currentID = $currentVideo.children('div').attr('id');
				if(!$currentID) $currentID = $currentVideo.children("iframe").attr('id');
				
				 if (!$(event.currentTarget).hasClass('playing')) {
				 	$(event.currentTarget).addClass('playing');
					$currentVideo.addClass('active');
				 }
				 $('#'+$currentID).css('opacity',1);

				// console.log('$currentVideoSrc ', $currentVideoSrc);
				window[this.player_i].playVideo();
				
			}
		});
	}

}


    let tag = document.createElement('script');
    tag.src = "//www.youtube.com/iframe_api";
    let firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    $(function(){

    $(window).bind("load", function() {
      let elements = $('[data-component="video"]');
      $.each(elements, (i, element) => {
        new Videos(element,i);
      });
    });
    });
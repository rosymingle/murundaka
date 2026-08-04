document.addEventListener("DOMContentLoaded", () => {

	const hasSlick = document.querySelector(".slick-data, .slick-smart");

	if (!hasEACSS && !hasSlick) return;

	const isIOS = /iP(ad|hone|od)/i.test(navigator.userAgent);

	function runSlick() {
		$(".slick-smart").each(function () {
			const $el = $(this);

			if (isIOS && $el.attr("data-slick-ready") === "true") return;

			const containerWidth = $el.width();
			const lastKnownWidth = $el.data("last-container-width") || 0;
			if (Math.abs(containerWidth - lastKnownWidth) < 5) return;
			$el.data("last-container-width", containerWidth);

			let currentSlide = 0;
			if ($el.hasClass("slick-initialized")) {
				try {
					currentSlide = $el.slick("slickCurrentSlide") || 0;
				} catch {}
				$el.slick("unslick");
			}

			let userConfig = {};
			const configAttr = $el.attr("data-slick");
			try {
				if (configAttr) {
					userConfig = Function('"use strict";return (' + configAttr + ")")();
				}
			} catch (e) {
				console.warn("Invalid slick config:", configAttr);
			}

			const $slides = $el.children(".item");
			if (!$slides.length) return;

			const inner = $slides[0].querySelector(".swid");
			if (!inner) return;

			const cs = window.getComputedStyle(inner);
			const maxW = cs.getPropertyValue("max-width").trim();
			const realWidth = (maxW.endsWith("px") ? parseFloat(maxW) : 0) +
				(parseFloat(cs.marginLeft) || 0) +
				(parseFloat(cs.marginRight) || 0);

			const totalWidth = realWidth * $slides.length;
			const needsCarousel = totalWidth > containerWidth + 1;

			if (needsCarousel) {
				$el.removeClass("unslicked");

				const slidesToShow = containerWidth / realWidth;

				$el.slick({
					mobileFirst: true,
					variableWidth: true,
					swipeToSlide: true,
					infinite: false,
					arrows: false,
					dots: true,
					slidesToShow,
					...userConfig,
					responsive: [
						{
							breakpoint: containerWidth + 100,
							settings: "unslick",
						},
					],
				});

				$el.slick("slickGoTo", currentSlide, true);

				if (isIOS) {
					$el.attr("data-slick-ready", "true");
				}
			} else {
				$el.addClass("unslicked");
			}
		});

		$(".slick-data").each(function () {
			const $el = $(this);
			let userConfig = {};
			const configAttr = $el.attr("data-slick");

			try {
				if (configAttr) {
					userConfig = Function('"use strict";return (' + configAttr + ")")();
				}
			} catch (e) {
				console.warn("Invalid slick config:", configAttr);
			}

			const hasUnslick = userConfig?.responsive?.some(r => r.settings === "unslick");

			if ($el.hasClass("slick-initialized")) {
				if (!hasUnslick) return;
				try {
					$el.slick("unslick");
				} catch {}
			}

			$el.slick(userConfig);
		});
	}

	window._onSlickLoaded = () => {
		requestAnimationFrame(() => {
			setTimeout(() => {
				runSlick();
				let resizeTimer;
				window.addEventListener("resize", () => {
					clearTimeout(resizeTimer);
					resizeTimer = setTimeout(runSlick, 200);
				});
			}, 50);
		});
	};
});

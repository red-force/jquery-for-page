(function($) {
		$.fn.RFShowInfo = function(message) {
			try {
				var that = this;
				var RFShowInfo = function(message) {
					var $PageInfoContainer = that;
					var contentVerticalStyle = 'Middle'; // 'Top'
					$PageInfoContainer = 0 === $PageInfoContainer.size() ? $($('.RFShowInfoContainer').get(0)) : $PageInfoContainer;
					$PageInfoContainer = $PageInfoContainer.size() > 0 ? $PageInfoContainer : $('<div class="RFShowInfoContainer' + contentVerticalStyle + '" ></div>');
					var $PageInfoContent = $('<span class="RFShowInfoContent' + contentVerticalStyle + '" style="color:#000;position:relative;">' + '</span>');
					//$PageInfoContent = $('<code style="color:#000;">'+'</code>');
					if (!$PageInfoContainer.hasClass('RFShowInfoContainer')) {
						$PageInfoContainer.addClass('RFShowInfoContainer');
					} else {}
					if (0 === $PageInfoContainer.children().size()) {
						$PageInfoContainer.append($PageInfoContent);
					} else {
						if (0 === $PageInfoContainer.children('.RFShowInfoContent').size()) {
							$PageInfoContainer.children(':nth-child(1)').addClass('RFShowInfoContent');
						} else {}
					}
					var $PageInfoContainerOpacity = $PageInfoContainer.css('opacity');
					$PageInfoContent.text(message).attr('title', message);
					$('body').prepend($PageInfoContainer);
					$PageInfoContainer.parent().append($PageInfoContainer);
					$PageInfoContainer.hide();
					if (window.RF_showPageInfoTimeout) {
						window.clearTimeout(window.RF_showPageInfoTimeout);
					} else {}
					window.RF_showPageInfoTimeout = window.setTimeout(function() {
							if ('none' === $PageInfoContainer.css('display')) {
								$PageInfoContainer.stop().css({
										"display": ("Middle" === contentVerticalStyle ? "table" : "block")
									}).fadeTo(300, 1.0, function() {
										$PageInfoContainer.fadeTo((message.length + 1) * 690, 0.3, function() {
												$PageInfoContainer.stop().hide().css({
														opacity: $PageInfoContainerOpacity
													});
											});
									}).on('click', function() {
										$PageInfoContainer.hide().stop();
									});
							} else {}
						}, 300);
				};
				RFShowInfo(message);
			} catch (e) {}
			return this;
		};
		$.RFSubmitData = function(data, options) {
			try {
				var that = this;
				options = $.extend({
						type: 'POST',
						url: location.href + (options.methodName || '/submitData'),
						contentType: 'application/json; charset=utf-8',
						data: '{"data":"' + JSON.stringify(data).replace(/"/g, '\\\"') + '"}',
						//data: '{data:'+ JSON.stringify(data)+'}',
						//data: '{data:'+'"1"'+'}',
						dataType: 'json'
					}, options);
				var successFunc = options.success || function() {},
					errorFunc = options.error || function() {},
					failureFunc = options.failure || function() {};
				options = $.extend(options, {
						success: function(data, textStatusStr, jqHXR) {
							/**
							 * data format "{d:'{status:'',message:'',...}}'"
							 */
							var obj = data;
							if (undefined !== obj && true === $.isPlainObject(obj) && undefined !== obj.d) {
								// eval('obj.d = ' + obj.d);
								switch (obj.d.status) {
									case 'success':
										successFunc.call(that, obj.d, textStatusStr, jqHXR);
										break;
									case 'failure':
										failureFunc.call(that, obj.d, textStatusStr, jqHXR);
										break;
									default:
										$('').RFShowInfo(JSON.stringify((obj.d.status || '' + obj.d.message || '')));
										if (window.console && typeof window.console.log === 'function') {
											window.console.log('[error]' + JSON.stringify(obj.d));
										} else {}
										break;
								}
							} else {
								$('').RFShowInfo('返回数据不合法.');
								if (window.console && typeof window.console.log === 'function') {
									window.console.log('[info]the returned data is supposed to be with a property named \'d\' and with value stored in property \'d\'.');
									window.console.log('[info]' + JSON.stringify(obj) + '.');
								} else {}
							}
						},
						error: function(jqHXR, textStatusStr, errorThrownStr) {
							errorFunc.apply(that, arguments);
						}
					});
				$.ajax(options);
			} catch (e) {}
			return this;
		};
	})(jQuery);
/* vim: set si sts=4 ts=4 sw=4 fdm=indent :*/

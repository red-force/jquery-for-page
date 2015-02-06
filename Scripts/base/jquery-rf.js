(function($) {
		$.fn.RFShowInfo = function(message) {
			try {
				var that = this;
				var RFShowInfo = function(message) {
					if ('string' !== typeof message || '' === message) {
						return;
					} else {}
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
						$PageInfoContent = $PageInfoContainer.children(':nth-child(1)');
						if (!$PageInfoContent.hasClass('.RFShowInfoContent')) {
							$PageInfoContent.addClass('RFShowInfoContent');
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
			/*
			 * options:
			 *		location:
			 *			origin: location.origin
			 *			pathname: location.pathname + '/' + options.methodName
			 *		url:
			 *			location.origin + location.pathname + options.methodName
			 *			or
			 *			options.location.origin + options.location.pathname
			 */
			try {
				var that = this;
				options = $.extend({
						type: 'POST',
						url: (((options.location.origin || "") + (options.location.pathname || "")) || (location.origin + location.pathname + '/' + (options.methodName || 'submitData'))),
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
		(function() {
				/*
				 *init data for $.RFValidate
				 */
				if (!$.RFValidator) {
					$.RFValidator = {};
				}
				if (!$.RFValidator.message) {
					$.RFValidator.message = {};
				}
				if (!$.RFValidator.func) {
					$.RFValidator.func = {};
				}
				$.RFValidator.func.validate = $.RFValidator.func.validate || {
					'Required': function(val) {
						return ('' !== val.trim());
					},
					'Email': function(val) {
						var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
						return re.test(val);
					},
					'ChineseIDCode': function(val) {
						var re = /^(([0-9]{15})|([0-9]{17}[0-9X]))$/;
						return re.test(val);
					},
					'PhoneNumber': function(val) {
						var re = /((\d{11})|^((\d{7,8})|(\d{4}|\d{3})-(\d{7,8})|(\d{4}|\d{3})-(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1})|(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1}))$)/;
						return re.test(val);
					},
					'Date': function(val) {
						var newDate = (new Date(val.replace(/-/g, "/"))),
							fullYear = (newDate.getFullYear()),
							date = (newDate.getDate());
						return !isNaN(fullYear) && !val.indexOf(fullYear) && val.lastIndexOf(date) >= 7;
					}
				};
				$.RFValidator.message.validate = $.RFValidator.message.validate || {
					'Required': '请填写此项',
					'Email': '请输入有效的E-mail地址',
					'ChineseIDCode': '请输入有效的身份证号码',
					'PhoneNumber': '请输入有效的电话号码',
					'Date': '请输入有效的日期'
				};
			})();
		$.fn.RFValidate = function(validationRule, validationMessage, validationFunc) {
			validationRule = validationRule || '';
			validationMessage = validationMessage || $.RFValidator.message.validate;
			validationFunc = validationFunc || $.RFValidator.func.validate;
			validationMessage = $.extend({}, $.RFValidator.message.validate, validationMessage);
			validationFunc = $.extend({}, $.RFValidator.func.validate, validationFunc);
			/*
			 * validationRule: the name of validation rules;
			 * validationMessage: the message of validation;
			 * validationFunc: the func of validation;
			 */
			try {
				var that = this;
				/*
				 * validation
				 */
				var $tobeValidated = $(this);
				$tobeValidated.each(function() {
						var $this = $(this),
							$ValidationContainer = $this.prev('.ValidationContainer'),
							$ValidationMessage = null; // $this.prev('.ValidationMessage');
						if (0 !== $ValidationContainer.size()) {
							$ValidationMessage = $ValidationContainer.children('.ValidationMessage');
							if (0 === $ValidationMessage.size()) {
								$ValidationContainer.remove();
							} else {}
						} else {}
						if (null === $ValidationMessage) {
							$ValidationMessage = $this.prev('.ValidationMessage');
							if (0 === $ValidationMessage.size()) {
								$ValidationMessage = $('<span class="ValidationMessage" style="display:none;cursor:pointer;">' + '</span>');
							} else {}
							$ValidationContainer = $ValidationMessage.wrap('<div class="ValidationContainer">' + '</div>').parent();
							$this.before($ValidationContainer);
						} else {}
						$ValidationMessage.css({
								'bottom': $this.parent().height() - $this.height() - $this.position().top + $this.height()
							});
						$ValidationMessage.on('click', function() {
								$(this).fadeOut();
							});
						$this.on('keyup change', function() {
								$ValidationMessage.text($this.attr('title'));
								$ValidationMessage.hide();
							});
					});
				$tobeValidated.each(function() {
						var $this = $(this),
							$message = $this.prev('.ValidationContainer').children('.ValidationMessage');
						if ($message.size() === 0) {
							return;
						} else {}
						$this.on('change blur', function(e) {
								var $this = $(this),
									thisVal = $this.val(),
									message = '',
									fadeOutUnitTime = 690;
								window.setTimeout(function() {
										thisVal = $($this.get(0)).val();
										var validations = validationRule || $this.attr('validation') || '';
										if ('' !== validations) {
											validations = validations.split(' ');
											var validationsLength = validations.length;
											if ('' === thisVal.trim()) {
												if (-1 !== validations.indexOf('Required') && !validationFunc.Required(thisVal)) {
													message = validationMessage.Required || message;
												} else {}
											} else {
												while (validationsLength-- > 0) {
													var validationName = validations[validationsLength];
													if (!validationFunc[validationName](thisVal)) {
														message = validationMessage[validationName] || message;
													} else {}
												}
											}
										} else {}
										if ('' !== message) {
											if ('none' === $message.css('display')) {
												var messageOpacity = $message.css('opacity');
												$message.text(message).stop().fadeTo(300, messageOpacity, function() {
														$message.stop().fadeTo(((message.length + 1) * fadeOutUnitTime), 0.3, function() {
																$message.stop().hide().css({
																		opacity: 0.9
																	});
															});
													}).on('click', function() {
														$message.stop().hide();
													});
											} else {}
											$this.attr('title', message).addClass("ui-state-highlight");
										} else {
											$this.removeAttr("title").removeClass("ui-state-highlight");
											$message.text('√ ');
											$message.hide();
										}
									}, 100);
							});
					});
			} catch (e) {}
			return this;
		};
	})(jQuery);
/* vim: set si sts=4 ts=4 sw=4 fdm=indent :*/
